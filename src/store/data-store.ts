import type { SubmissionQueueStatus } from '../queue/submission-queue.js';
import type {
  AuthUser,
  Lab,
  PublishStatus,
  ReviewItemStatus,
  ReviewQueueItem,
  ReviewQueueResponse,
  Verdict,
} from '../types/review-queue.types.js';
import type {
  SandboxExecutionResult,
  SubmissionJob,
} from '../types/sandbox.types.js';

export interface StoredSubmission extends SubmissionJob {
  status: SubmissionQueueStatus;
  result: SandboxExecutionResult | null;
}

// Extend the shared contract without changing the existing route's mock data.
export interface StoredReviewQueueItem extends ReviewQueueItem {
  labId: string;
  reviewDecision?: ReviewDecision;
}

export type ReviewDecision =
  | { decision: 'confirm' }
  | { decision: 'override'; newVerdict: Verdict; reason?: string };

export interface StoredLab extends Lab {
  status?: 'published';
}

export interface ReviewQueueFilters {
  status?: ReviewItemStatus | 'all';
  verdict?: Verdict | 'all';
  page?: number;
  limit?: number;
}

export interface StoredReviewQueueResponse extends ReviewQueueResponse {
  items: StoredReviewQueueItem[];
}

/** In-memory storage. Each instance owns its state; callers receive snapshots. */
export class DataStore {
  private readonly accounts = new Map<string, AuthUser>();
  private readonly labs = new Map<string, StoredLab>();
  private readonly submissions = new Map<string, StoredSubmission>();
  private readonly reviewItems = new Map<string, StoredReviewQueueItem>();

  getAccountCount(): number {
    return this.accounts.size;
  }

  createAccount(token: string, user: AuthUser): boolean {
    if (this.accounts.has(token)) return false;
    this.accounts.set(token, structuredClone(user));
    return true;
  }

  getAccountByToken(token: string): AuthUser | null {
    return structuredClone(this.accounts.get(token) ?? null);
  }

  createLab(lab: Lab): Lab {
    if (this.labs.has(lab.id)) {
      throw new Error(`Lab '${lab.id}' already exists.`);
    }
    this.labs.set(lab.id, structuredClone(lab));
    return structuredClone(lab);
  }

  getLab(labId: string): StoredLab | null {
    return structuredClone(this.labs.get(labId) ?? null);
  }

  getLabsByClassId(classId: string): Lab[] {
    return structuredClone(
      [...this.labs.values()].filter((lab) => lab.classId === classId)
    );
  }

  createSubmission(job: SubmissionJob): string {
    if (this.submissions.has(job.submissionId)) {
      throw new Error(`Submission '${job.submissionId}' already exists.`);
    }
    this.submissions.set(job.submissionId, {
      ...structuredClone(job),
      status: 'queued',
      result: null,
    });
    return job.submissionId;
  }

  getSubmission(submissionId: string): StoredSubmission | null {
    return structuredClone(this.submissions.get(submissionId) ?? null);
  }

  updateSubmissionResult(
    submissionId: string,
    result: SandboxExecutionResult
  ): void {
    const submission = this.submissions.get(submissionId);
    if (!submission) {
      throw new Error(`Submission '${submissionId}' not found.`);
    }
    submission.result = structuredClone(result);
    submission.status = 'completed';
  }

  addReviewItem(item: StoredReviewQueueItem): void {
    if (this.reviewItems.has(item.id)) {
      throw new Error(`Review item '${item.id}' already exists.`);
    }
    this.reviewItems.set(item.id, structuredClone(item));
  }

  getReviewItem(itemId: string): StoredReviewQueueItem | null {
    return structuredClone(this.reviewItems.get(itemId) ?? null);
  }

  getReviewQueue(
    labId: string,
    filters: ReviewQueueFilters = {}
  ): StoredReviewQueueResponse {
    const {
      status = 'pending',
      verdict = 'all',
      page = 1,
      limit = 20,
    } = filters;
    if (!Number.isInteger(page) || page < 1) {
      throw new RangeError(
        'page must be an integer greater than or equal to 1.'
      );
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('limit must be an integer between 1 and 100.');
    }
    const filtered = [...this.reviewItems.values()].filter(
      (item) =>
        item.labId === labId &&
        (status === 'all' || item.status === status) &&
        (verdict === 'all' || item.verdict === verdict)
    );
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    return {
      items: structuredClone(filtered.slice(startIndex, startIndex + limit)),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1 && totalPages > 0,
      },
    };
  }

  // Authentication and class ownership are checked by the calling route.
  reviewItem(
    itemId: string,
    reviewedBy: AuthUser['id'],
    decision?: ReviewDecision
  ): StoredReviewQueueItem {
    const item = this.reviewItems.get(itemId);
    if (!item) {
      throw new Error(`Review item '${itemId}' not found.`);
    }
    if (item.status === 'reviewed') {
      throw new Error(`Review item '${itemId}' is already reviewed.`);
    }
    if (decision?.decision === 'override') {
      item.verdict = decision.newVerdict;
      item.unsureReason =
        decision.newVerdict === 'unsure'
          ? (item.unsureReason ?? 'model_unsure')
          : null;
      if (decision.newVerdict === 'pass') item.evidence = [];
    }
    if (decision) item.reviewDecision = structuredClone(decision);
    item.status = 'reviewed';
    item.reviewedBy = reviewedBy;
    item.reviewedAt = new Date().toISOString();
    return structuredClone(item);
  }

  /** Reports readiness only; this method does not publish marks. */
  getPublishStatus(labId: string): PublishStatus {
    const unreviewedCount = [...this.reviewItems.values()].filter(
      (item) => item.labId === labId && item.status === 'pending'
    ).length;
    return { canPublish: unreviewedCount === 0, unreviewedCount };
  }

  /** Called only after an explicit, authorized publish request. */
  publishLab(labId: string): StoredLab {
    const lab = this.labs.get(labId);
    if (!lab) throw new Error(`Lab '${labId}' not found.`);
    if (!this.getPublishStatus(labId).canPublish) {
      throw new Error(`Lab '${labId}' still has unreviewed items.`);
    }
    lab.status = 'published';
    return structuredClone(lab);
  }
}

export const defaultDataStore = new DataStore();
