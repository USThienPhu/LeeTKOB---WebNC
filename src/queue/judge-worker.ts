/**
 * Background Judge Worker
 * CSC13114 - LeeTKOB PA#3 (Criterion 2)
 */

import { runSandboxCode } from '../sandbox/runner.js';
import type { SubmissionQueue } from './submission-queue.js';

export class JudgeWorker {
  private queue: SubmissionQueue;
  private isRunning = false;

  constructor(queue: SubmissionQueue) {
    this.queue = queue;
  }

  /**
   * Stop worker from picking up new jobs
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Start worker
   */
  start(): void {
    this.isRunning = true;
  }

  /**
   * Start worker and process all pending jobs in queue until empty
   */
  async startAndDrain(): Promise<void> {
    this.isRunning = true;

    while (this.isRunning) {
      const job = await this.queue.dequeue();
      if (!job) {
        break; // Queue is empty
      }

      // Check if job was already judged (Idempotent guarantee)
      const existingResults = await this.queue.getResults(job.submissionId);
      if (existingResults.length > 0) {
        continue;
      }

      // Execute code in sandbox
      const result = await runSandboxCode({
        sourceCode: job.sourceCode,
        limits: job.limits,
        testCases: job.testCases,
      });

      // Store result exactly once
      await this.queue.storeResult(job.submissionId, result);
    }
  }

  /**
   * Process a single job if available
   */
  async processNext(): Promise<boolean> {
    if (!this.isRunning) {
      return false;
    }

    const job = await this.queue.dequeue();
    if (!job) {
      return false;
    }

    const existingResults = await this.queue.getResults(job.submissionId);
    if (existingResults.length > 0) {
      return true;
    }

    const result = await runSandboxCode({
      sourceCode: job.sourceCode,
      limits: job.limits,
      testCases: job.testCases,
    });

    await this.queue.storeResult(job.submissionId, result);
    return true;
  }
}
