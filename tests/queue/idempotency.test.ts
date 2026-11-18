import { describe, it, expect, beforeEach } from 'vitest';
import { SubmissionQueue } from '../../src/queue/submission-queue.js';
import { JudgeWorker } from '../../src/queue/judge-worker.js';

describe('Queue Idempotency (Criterion 2)', () => {
  let queue: SubmissionQueue;
  let worker: JudgeWorker;

  beforeEach(() => {
    queue = new SubmissionQueue();
    worker = new JudgeWorker(queue);
  });

  it('should judge exactly once when worker is stopped, job enqueued, and restarted', async () => {
    // 1. Worker đang tắt
    worker.stop();

    // 2. Nộp bài
    const jobId = 'sub-test-01';
    await queue.enqueue({
      submissionId: jobId,
      labId: 'lab-1',
      studentAnonymousId: 'anon-01',
      sourceCode:
        '#include <iostream>\nint main(){ std::cout << "OK"; return 0; }',
      testCases: [{ id: 'tc1', input: '', expectedOutput: 'OK' }],
    });

    // Trạng thái phải là queued
    expect(await queue.getStatus(jobId)).toBe('queued');

    // 3. Khởi động lại worker
    await worker.startAndDrain();

    // 4. Kiểm tra bài nộp đã được chấm đúng 1 lần
    const results = await queue.getResults(jobId);
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('ACCEPTED');
  });

  it('should preserve idempotency even if judging is triggered multiple times for the same job', async () => {
    const jobId = 'sub-test-repeat';
    const job = {
      submissionId: jobId,
      labId: 'lab-1',
      studentAnonymousId: 'anon-02',
      sourceCode:
        '#include <iostream>\nint main(){ std::cout << "OK"; return 0; }',
      testCases: [{ id: 'tc1', input: '', expectedOutput: 'OK' }],
    };

    await queue.enqueue(job);
    await worker.startAndDrain();

    // Attempt second drain/replay of the same job
    await worker.startAndDrain();

    const results = await queue.getResults(jobId);
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('ACCEPTED');
  });
});
