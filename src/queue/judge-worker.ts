/**
 * Background Judge Worker
 * CSC13114 - LeeTKOB PA#3 (Criterion 2)
 */

import { runSandboxCode } from '../sandbox/runner.js';
import { defaultSubmissionQueue, SubmissionQueue } from './submission-queue.js';

export class JudgeWorker {
  private queue: SubmissionQueue;
  private isRunning = false;

  constructor(queue: SubmissionQueue = defaultSubmissionQueue) {
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

      try {
        // Execute code in sandbox
        const result = await runSandboxCode({
          sourceCode: job.sourceCode,
          limits: job.limits,
          testCases: job.testCases,
        });

        // Store result exactly once
        await this.queue.storeResult(job.submissionId, result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        await this.queue.storeResult(job.submissionId, {
          compileSuccess: false,
          compileOutput: errorMessage,
          status: 'RUNTIME_ERROR',
          passedTests: 0,
          totalTests: job.testCases.length,
          cpuTimeMs: 0,
          memoryKb: 0,
          stdout: '',
          stderr: errorMessage,
        });
        await this.queue.markFailed(job.submissionId);
      }
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

    try {
      const result = await runSandboxCode({
        sourceCode: job.sourceCode,
        limits: job.limits,
        testCases: job.testCases,
      });

      await this.queue.storeResult(job.submissionId, result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.queue.storeResult(job.submissionId, {
        compileSuccess: false,
        compileOutput: errorMessage,
        status: 'RUNTIME_ERROR',
        passedTests: 0,
        totalTests: job.testCases.length,
        cpuTimeMs: 0,
        memoryKb: 0,
        stdout: '',
        stderr: errorMessage,
      });
      await this.queue.markFailed(job.submissionId);
    }
    return true;
  }
}

/**
 * Shared default singleton worker instance
 */
export const defaultJudgeWorker = new JudgeWorker(defaultSubmissionQueue);
