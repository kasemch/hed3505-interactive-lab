import type { AlignmentEvaluation, AlignmentScenario, Module3Submission } from '../types';

/**
 * Deterministically evaluates a student's Module 3 submission against the scenario's
 * single planted misalignment. Pure function, no AI - the reasoning is transparent
 * and reproducible.
 */
export function evaluateAlignmentSubmission(
  scenario: AlignmentScenario,
  submission: Module3Submission,
): AlignmentEvaluation {
  const linkCorrect = submission.selectedLinkId === scenario.issue.linkId;
  const categoryCorrect = submission.selectedCategory === scenario.issue.category;
  const correctionCorrect = submission.selectedCorrectionId === scenario.issue.correctCorrectionId;

  let level: AlignmentEvaluation['level'];
  if (linkCorrect && categoryCorrect && correctionCorrect) {
    level = 'ALIGNMENT_CONFIRMED';
  } else if (linkCorrect && (categoryCorrect || correctionCorrect)) {
    level = 'PARTIAL_ALIGNMENT';
  } else if (linkCorrect) {
    level = 'RECONSIDER_LINK';
  } else {
    level = 'MISALIGNMENT_DETECTED';
  }

  return { linkCorrect, categoryCorrect, correctionCorrect, level };
}

/** Whether a Module 3 submission has every field required to submit. */
export function isModule3SubmissionComplete(submission: Module3Submission): boolean {
  return (
    submission.selectedLinkId !== null &&
    submission.selectedCategory !== null &&
    submission.selectedCorrectionId !== null &&
    submission.justification.trim().length > 0
  );
}
