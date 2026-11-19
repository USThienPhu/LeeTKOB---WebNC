import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { evaluateSubmission } from '../../src/engine/constraint-adapter.js';
import { JudgeWorker } from '../../src/queue/judge-worker.js';
import { SubmissionQueue } from '../../src/queue/submission-queue.js';
import { runSandboxCode } from '../../src/sandbox/runner.js';
import { DataStore } from '../../src/store/data-store.js';
import type { SandboxExecutionResult } from '../../src/types/sandbox.types.js';

vi.mock('../../src/sandbox/runner.js', () => ({ runSandboxCode: vi.fn() }));
vi.mock('../../src/engine/constraint-adapter.js', () => ({
  evaluateSubmission: vi.fn(),
}));

const result: SandboxExecutionResult = {
  compileSuccess: true,
  compileOutput: '',
  status: 'ACCEPTED',
  passedTests: 1,
  totalTests: 1,
  cpuTimeMs: 1,
  memoryKb: 1024,
  stdout: 'OK',
  stderr: '',
};

function setup() {
  const store = new DataStore();
  const queue = new SubmissionQueue();
  const worker = new JudgeWorker(queue, store);
  const lab = store.createLab({
    id: randomUUID(),
    classId: 'class-1',
    title: 'Worker test',
    statement: '',
    testCases: [{ id: 'tc1', input: '', expectedOutput: 'OK' }],
    constraints: [
      { id: 'C1', description: 'No sort', deduction: 3, type: 'ban-list' },
    ],
  });
  const job = {
    submissionId: randomUUID(),
    labId: lab.id,
    studentAnonymousId: 'anon-1',
    sourceCode: 'int main() {}',
    testCases: lab.testCases,
  };
  store.createSubmission(job);
  return { store, queue, worker, lab, job };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(runSandboxCode).mockResolvedValue(result);
  vi.mocked(evaluateSubmission).mockReturnValue([
    {
      constraintId: 'C1',
      verdict: 'unsure',
      suggestedDeduction: 3,
      evidence: [{ line: 1, text: 'int main() {}' }],
      unsureReason: 'model_unsure',
      decidedBy: 'llm',
    },
  ]);
});

describe('Judge worker pipeline', () => {
  it.each(['processNext', 'startAndDrain'] as const)(
    '%s persists sandbox results and pending verdicts exactly once',
    async (method) => {
      const { store, queue, worker, lab, job } = setup();
      await queue.enqueue(job);
      worker.start();
      await worker[method]();
      await queue.enqueue(job);
      await worker[method]();
      expect(runSandboxCode).toHaveBeenCalledTimes(1);
      expect(evaluateSubmission).toHaveBeenCalledTimes(1);
      expect(evaluateSubmission).toHaveBeenCalledWith(
        job.sourceCode,
        lab.constraints
      );
      expect(store.getSubmission(job.submissionId)).toMatchObject({
        status: 'completed',
        result,
      });
      expect(await queue.getResults(job.submissionId)).toEqual([result]);
      expect(store.getReviewQueue(lab.id).items).toEqual([
        {
          id: expect.any(String),
          labId: lab.id,
          submissionId: job.submissionId,
          studentAnonymousId: job.studentAnonymousId,
          constraintId: 'C1',
          constraintDescription: 'No sort',
          verdict: 'unsure',
          suggestedDeduction: 3,
          evidence: [{ line: 1, text: job.sourceCode }],
          unsureReason: 'model_unsure',
          status: 'pending',
          reviewedBy: null,
          reviewedAt: null,
        },
      ]);
    }
  );

  it('evaluates compiled submissions even when test cases fail', async () => {
    const { queue, worker, job, store } = setup();
    vi.mocked(runSandboxCode).mockResolvedValue({
      ...result,
      status: 'WRONG_ANSWER',
    });
    await queue.enqueue(job);
    await worker.startAndDrain();
    expect(evaluateSubmission).toHaveBeenCalledTimes(1);
    expect(store.getSubmission(job.submissionId)?.result?.status).toBe(
      'WRONG_ANSWER'
    );
  });

  it.each(['compile error', 'sandbox exception'])(
    'skips constraints and persists failure for %s',
    async (failure) => {
      const { store, queue, worker, lab, job } = setup();
      if (failure === 'sandbox exception') {
        vi.mocked(runSandboxCode).mockRejectedValue(
          new Error('Sandbox unavailable')
        );
      } else {
        vi.mocked(runSandboxCode).mockResolvedValue({
          ...result,
          compileSuccess: false,
          status: 'RUNTIME_ERROR',
        });
      }
      await queue.enqueue(job);
      await worker.startAndDrain();
      expect(evaluateSubmission).not.toHaveBeenCalled();
      expect(store.getReviewQueue(lab.id).items).toEqual([]);
      expect(
        store.getSubmission(job.submissionId)?.result?.compileSuccess
      ).toBe(false);
      expect(await queue.getResults(job.submissionId)).toHaveLength(1);
      expect(await queue.getStatus(job.submissionId)).toBe(
        failure === 'sandbox exception' ? 'failed' : 'completed'
      );
    }
  );

  it('does not overlap jobs and finishes the active job after stop', async () => {
    const { queue, worker, job, store } = setup();
    let finish!: (value: SandboxExecutionResult) => void;
    vi.mocked(runSandboxCode).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    await queue.enqueue(job);
    worker.start();
    const active = worker.processNext();
    await vi.waitFor(() => expect(runSandboxCode).toHaveBeenCalledTimes(1));
    expect(await worker.processNext()).toBe(false);
    worker.stop();
    finish(result);
    await active;
    expect(store.getSubmission(job.submissionId)?.result).toEqual(result);
    expect(await worker.processNext()).toBe(false);
  });
});
