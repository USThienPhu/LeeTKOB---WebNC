export type Verdict = 'violation' | 'unsure' | 'pass';

export type UnsureReason =
  | 'model_unsure'
  | 'schema_invalid'
  | 'line_mismatch'
  | 'timeout'
  | 'cost_cap_exceeded';

export type ReviewItemStatus = 'pending' | 'reviewed';

export interface CodeEvidence {
  line: number;
  text: string;
}

export interface ReviewQueueItem {
  id: string;
  submissionId: string;
  studentAnonymousId: string;
  constraintId: string;
  constraintDescription: string;
  verdict: Verdict;
  suggestedDeduction: number;
  evidence: CodeEvidence[];
  unsureReason: UnsureReason | null;
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
