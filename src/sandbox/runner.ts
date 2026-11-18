import type { SandboxExecutionResult, SandboxLimits } from '../types/index.js';

export interface RunSandboxCodeOptions {
  sourceCode: string;
  limits?: Partial<SandboxLimits>;
  testCases?: Array<{ id: string; input: string; expectedOutput: string }>;
}

export async function runSandboxCode(
  options: RunSandboxCodeOptions
): Promise<SandboxExecutionResult> {
  // Stub implementation for TDD (to be implemented in next step)
  void options;
  throw new Error('Sandbox runner not implemented yet (TDD Red State)');
}
