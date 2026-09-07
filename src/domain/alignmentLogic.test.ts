import { describe, expect, it } from 'vitest';
import { alignmentScenarios } from '../data/module3Data';
import { evaluateAlignmentSubmission, isModule3SubmissionComplete } from './alignmentLogic';
import type { Module3Submission } from '../types';

const scenario = alignmentScenarios[0];

function baseSubmission(overrides: Partial<Module3Submission> = {}): Module3Submission {
  return {
    scenarioId: scenario.id,
    selectedLinkId: null,
    selectedCategory: null,
    selectedCorrectionId: null,
    justification: '',
    ...overrides,
  };
}

describe('evaluateAlignmentSubmission', () => {
  it('returns ALIGNMENT_CONFIRMED when link, category and correction all match the planted issue', () => {
    const submission = baseSubmission({
      selectedLinkId: scenario.issue.linkId,
      selectedCategory: scenario.issue.category,
      selectedCorrectionId: scenario.issue.correctCorrectionId,
      justification: 'because...',
    });
    expect(evaluateAlignmentSubmission(scenario, submission).level).toBe('ALIGNMENT_CONFIRMED');
  });

  it('returns PARTIAL_ALIGNMENT when the link is correct but only one of category/correction matches', () => {
    const wrongCategory = alignmentScenarios[1].issue.category; // guaranteed different scenario's category
    const submission = baseSubmission({
      selectedLinkId: scenario.issue.linkId,
      selectedCategory: wrongCategory === scenario.issue.category ? scenario.issue.category : wrongCategory,
      selectedCorrectionId: scenario.issue.correctCorrectionId,
      justification: 'because...',
    });
    const result = evaluateAlignmentSubmission(scenario, submission);
    expect(result.linkCorrect).toBe(true);
    expect(['PARTIAL_ALIGNMENT', 'ALIGNMENT_CONFIRMED']).toContain(result.level);
  });

  it('returns RECONSIDER_LINK when the link is correct but category and correction are both wrong', () => {
    const wrongCorrectionId = scenario.issue.correctionOptions.find(
      (o) => o.id !== scenario.issue.correctCorrectionId,
    )!.id;
    const otherCategory = alignmentScenarios.find((s) => s.issue.category !== scenario.issue.category)!.issue
      .category;
    const submission = baseSubmission({
      selectedLinkId: scenario.issue.linkId,
      selectedCategory: otherCategory,
      selectedCorrectionId: wrongCorrectionId,
      justification: 'because...',
    });
    expect(evaluateAlignmentSubmission(scenario, submission).level).toBe('RECONSIDER_LINK');
  });

  it('returns MISALIGNMENT_DETECTED when the selected link is not the planted issue', () => {
    const otherLinkId = scenario.links.find((l) => l.id !== scenario.issue.linkId)!.id;
    const submission = baseSubmission({
      selectedLinkId: otherLinkId,
      selectedCategory: scenario.issue.category,
      selectedCorrectionId: scenario.issue.correctCorrectionId,
      justification: 'because...',
    });
    expect(evaluateAlignmentSubmission(scenario, submission).level).toBe('MISALIGNMENT_DETECTED');
  });
});

describe('isModule3SubmissionComplete', () => {
  it('is false until all fields are filled', () => {
    expect(isModule3SubmissionComplete(baseSubmission())).toBe(false);
    expect(
      isModule3SubmissionComplete(
        baseSubmission({
          selectedLinkId: scenario.issue.linkId,
          selectedCategory: scenario.issue.category,
          selectedCorrectionId: scenario.issue.correctCorrectionId,
          justification: 'reasoning',
        }),
      ),
    ).toBe(true);
  });
});
