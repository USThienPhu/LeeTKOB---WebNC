import type {
  ConstraintDefinition,
  ConstraintVerdict,
} from '../types/constraint.types.js';

/** Mock adapter for TV2 to replace with hard rules and LLM evaluation. */
export function evaluateSubmission(
  sourceCode: string,
  constraints: ConstraintDefinition[]
): ConstraintVerdict[] {
  // Deterministic fixture only: the first line is not a detected violation.
  const firstLine = sourceCode.split(/\r?\n/, 1)[0];
  return constraints.map((constraint, index) => ({
    constraintId: constraint.id,
    verdict: index === 0 ? 'violation' : 'pass',
    evidence: index === 0 ? [{ line: 1, text: firstLine }] : [],
    suggestedDeduction: index === 0 ? constraint.deduction : 0,
    unsureReason: null,
    decidedBy: 'hard_rule',
  }));
}
