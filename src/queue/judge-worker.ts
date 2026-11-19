/**
 * Background Judge Worker
 * CSC13114 - LeeTKOB PA#3 (Criterion 2)
 */

import { randomUUID } from 'node:crypto';
import { evaluateSubmission } from '../engine/constraint-adapter.js';
import { runSandboxCode } from '../sandbox/runner.js';
import { defaultDataStore, DataStore } from '../store/data-store.js';
import type { SandboxExecutionResult } from '../types/sandbox.types.js';
import { defaultSubmissionQueue, SubmissionQueue } from './submission-queue.js';

export class JudgeWorker {
  private isRunning = false;
  private isProcessing = false;

  constructor(
    private readonly queue: SubmissionQueue = defaultSubmissionQueue,
    private readonly dataStore: DataStore = defaultDataStore
  ) {}

  /** Stop picking up new jobs; the current job is allowed to finish. */
  stop(): void {
    this.isRunning = false;
  }

  start(): void {
    this.isRunning = true;
  }

  /** Use the same pipeline for manual draining and background polling. */
  async startAndDrain(): Promise<void> {
    this.start();
    while (await this.processNext()) {
      // Continue until stopped or the queue is empty.
    }
  }

  async processNext(): Promise<boolean> {
    if (!this.isRunning || this.isProcessing) return false;
    this.isProcessing = true;
    try {
      const job = await this.queue.dequeue();
      if (!job) return false;
      if ((await this.queue.getResults(job.submissionId)).length > 0) {
        return true;
      }

      let result: SandboxExecutionResult;
      let failed = false;
      try {
        result = await runSandboxCode({
          sourceCode: job.sourceCode,
          limits: job.limits,
          testCases: job.testCases,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        failed = true;
        result = {
          compileSuccess: false,
          compileOutput: errorMessage,
          status: 'RUNTIME_ERROR',
          passedTests: 0,
          totalTests: job.testCases.length,
          cpuTimeMs: 0,
          memoryKb: 0,
          stdout: '',
          stderr: errorMessage,
        };
      }

      const lab = this.dataStore.getLab(job.labId);
      if (lab && (result.compileSuccess || result.status === 'ACCEPTED')) {
        const verdicts = evaluateSubmission(job.sourceCode, lab.constraints);
        for (const verdict of verdicts) {
          this.dataStore.addReviewItem({
            id: randomUUID(),
            labId: job.labId,
            submissionId: job.submissionId,
            studentAnonymousId: job.studentAnonymousId,
            constraintId: verdict.constraintId,
            constraintDescription: lab.constraints.find(
              (constraint) => constraint.id === verdict.constraintId
            )!.description,
            verdict: verdict.verdict,
            suggestedDeduction: verdict.suggestedDeduction,
            evidence: verdict.evidence,
            unsureReason: verdict.unsureReason,
            status: 'pending',
            reviewedBy: null,
            reviewedAt: null,
          });
        }
      }

      // Queue-only clients may not have a corresponding DataStore submission.
      if (this.dataStore.getSubmission(job.submissionId)) {
        this.dataStore.updateSubmissionResult(job.submissionId, result);
      }
      await this.queue.storeResult(job.submissionId, result);
      if (failed) await this.queue.markFailed(job.submissionId);
      return true;
    } finally {
      this.isProcessing = false;
    }
  }
}

export const defaultJudgeWorker = new JudgeWorker();
