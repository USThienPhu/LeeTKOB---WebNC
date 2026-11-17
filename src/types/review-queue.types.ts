/**
 * Review Queue & Web Interface Contracts (Member 3 - Web & Review Queue)
 * CSC13114 - LeeTKOB PA#3 (Maintains 100% backward compatibility with PA#2)
 */

import type {
  ConstraintDefinition,
  EvidenceLine,
  UnsureReason,
  Verdict,
} from './constraint.types.js';
import type { TestCase } from './sandbox.types.js';

export type { Verdict, UnsureReason };

export type ReviewItemStatus = 'pending' | 'reviewed';

export type CodeEvidence = EvidenceLine;

export interface ReviewQueueItem {
  id: string;
  submissionId: string;
  studentAnonymousId: string;
  constraintId: string;
  constraintDescription: string;
  verdict: Verdict;
  suggestedDeduction: number;
  evidence: CodeEvidence[];
  unsureReason: UnsureReason;
  status: ReviewItemStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewQueueResponse {
  items: ReviewQueueItem[];
  pagination: PaginationMetadata;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  invalidParams?: { name: string; reason: string }[];
}

export interface AuthUser {
  id: string;
  username: string;
  role: 'admin' | 'ta' | 'student';
  assignedClassIds: string[];
}

/**
 * Lab Entity Definition (Added for PA#3)
 */
export interface Lab {
  id: string;
  classId: string;
  title: string;
  statement: string;
  testCases: TestCase[];
  constraints: ConstraintDefinition[];
}

/**
 * Publish Marks Action Guard (Added for PA#3 Human Gate)
 */
export interface PublishStatus {
  canPublish: boolean;
  unreviewedCount: number;
  reasons?: string[];
}
