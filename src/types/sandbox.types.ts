/**
 * Sandbox & Queue Interface Contracts (Member 1 - Sandbox & Queue)
 * CSC13114 - LeeTKOB PA#3
 */

export interface SandboxLimits {
  cpuTimeLimitMs: number;
  wallClockLimitMs: number;
  memoryLimitMb: number;
  outputLimitKb: number;
  pidsLimit: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface SubmissionJob {
  submissionId: string;
  labId: string;
  studentAnonymousId: string;
  sourceCode: string;
  testCases: TestCase[];
  limits?: SandboxLimits;
}

export type ExecutionStatus =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'OUTPUT_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'SECURITY_VIOLATION';

export interface SandboxExecutionResult {
  compileSuccess: boolean;
  compileOutput: string;
  status: ExecutionStatus;
  passedTests: number;
  totalTests: number;
  cpuTimeMs: number;
  memoryKb: number;
  stdout: string;
  stderr: string;
}
