/**
 * Constraint, Hard Rules & LLM Interface Contracts (Member 2 - Hard Rules & LLM)
 * CSC13114 - LeeTKOB PA#3
 */

export type ConstraintType = 'ban-list' | 'semantic';

export interface ConstraintDefinition {
  id: string;
  description: string;
  deduction: number;
  type: ConstraintType;
}

export interface EvidenceLine {
  line: number;
  text: string;
}

export type Verdict = 'pass' | 'violation' | 'unsure';

export type UnsureReason =
  | 'model_unsure'
  | 'schema_mismatch'
  | 'evidence_mismatch'
  | 'timeout'
  | 'schema_invalid'
  | 'line_mismatch'
  | 'cost_cap_exceeded'
  | null;

export interface ConstraintVerdict {
  constraintId: string;
  verdict: Verdict;
  evidence: EvidenceLine[];
  suggestedDeduction: number;
  unsureReason: UnsureReason;
  decidedBy: 'hard_rule' | 'llm';
}

export interface LLMCallMetadata {
  requestId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  costUsd: number;
}

export interface PredictionRecord {
  solution: string;
  constraint: string;
  verdict: Verdict;
  evidence: EvidenceLine[];
}
