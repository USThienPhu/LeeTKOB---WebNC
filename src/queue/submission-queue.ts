/**
 * Submission Queue with Idempotent Storage Guarantee
 * CSC13114 - LeeTKOB PA#3 (Criterion 2)
 */

import type { SandboxExecutionResult, SubmissionJob } from '../types/index.js';

export type SubmissionQueueStatus =
  'queued' | 'processing' | 'completed' | 'failed';

export class SubmissionQueue {
  private queue: SubmissionJob[] = [];
  private jobMap = new Map<string, SubmissionJob>();
  private statusMap = new Map<string, SubmissionQueueStatus>();
  private resultsMap = new Map<string, SandboxExecutionResult[]>();

  /**
   * Enqueue a submission job for judging
   */
  async enqueue(job: SubmissionJob): Promise<void> {
    if (this.statusMap.get(job.submissionId) === 'completed') {
      return; // Already completed (Idempotent)
    }

    if (this.statusMap.get(job.submissionId) === 'queued') {
      return; // Already queued
    }

    this.jobMap.set(job.submissionId, job);
    this.statusMap.set(job.submissionId, 'queued');
    this.queue.push(job);
  }

  /**
   * Dequeue the next pending job
   */
  async dequeue(): Promise<SubmissionJob | null> {
    const job = this.queue.shift();
    if (job) {
      this.statusMap.set(job.submissionId, 'processing');
      return job;
    }
    return null;
  }

  /**
   * Get the current status of a submission
   */
  async getStatus(submissionId: string): Promise<SubmissionQueueStatus | null> {
    return this.statusMap.get(submissionId) ?? null;
  }

  /**
   * Store execution result with strict idempotency (judged exactly once)
   */
  async storeResult(
    submissionId: string,
    result: SandboxExecutionResult
  ): Promise<void> {
    // Idempotency check: exactly one set of verdicts is stored
    if (!this.resultsMap.has(submissionId)) {
      this.resultsMap.set(submissionId, [result]);
      this.statusMap.set(submissionId, 'completed');
    }
  }

  /**
   * Get all stored results for a submission
   */
  async getResults(submissionId: string): Promise<SandboxExecutionResult[]> {
    return this.resultsMap.get(submissionId) ?? [];
  }

  /**
   * Clear all queue state
   */
  clear(): void {
    this.queue = [];
    this.jobMap.clear();
    this.statusMap.clear();
    this.resultsMap.clear();
  }
}
