import { describe, expect, it } from 'vitest';
import { evaluateEthicsSubmission, isEthicsDecisionComplete } from './ethicsLogic';
import { ethicsScenarios } from '../data/module6Data';
import type { EthicsDecision } from '../types';

function decision(overrides: Partial<EthicsDecision>): EthicsDecision {
  return {
    scenarioId: 'ethics-1',
    selectedBias: null,
    selectedEthicsRisk: null,
    whyItMatters: '',
    selectedMitigationId: null,
    submitted: false,
    ...overrides,
  };
}

describe('evaluateEthicsSubmission (deterministic rule-based checks only)', () => {
  const scenario = ethicsScenarios[0]; // ethics-1: expectedBias=RECALL_BIAS, expectedEthicsRisk=NONE_IDENTIFIED

  it('returns RECONSIDER_DATA_COLLECTION when neither bias nor ethics risk is identified correctly', () => {
    const result = evaluateEthicsSubmission(
      scenario,
      decision({ selectedBias: 'SOCIAL_DESIRABILITY_BIAS', selectedEthicsRisk: 'STIGMATIZATION_RISK' }),
    );
    expect(result.level).toBe('RECONSIDER_DATA_COLLECTION');
  });

  it('returns MITIGATION_PARTIAL when bias is correctly identified but mitigation is not acceptable', () => {
    const result = evaluateEthicsSubmission(
      scenario,
      decision({
        selectedBias: 'RECALL_BIAS',
        selectedEthicsRisk: 'STIGMATIZATION_RISK',
        selectedMitigationId: 'add-more-questions',
      }),
    );
    expect(result.level).toBe('MITIGATION_PARTIAL');
  });

  it('returns PLAN_IMPROVED when bias, ethics risk, and mitigation are all correct/acceptable', () => {
    const result = evaluateEthicsSubmission(
      scenario,
      decision({
        selectedBias: 'RECALL_BIAS',
        selectedEthicsRisk: 'NONE_IDENTIFIED',
        selectedMitigationId: 'shorten-recall-period',
      }),
    );
    expect(result.level).toBe('PLAN_IMPROVED');
  });

  it('accepts more than one mitigation option as valid (multiple acceptable answers)', () => {
    const resultA = evaluateEthicsSubmission(
      scenario,
      decision({
        selectedBias: 'RECALL_BIAS',
        selectedEthicsRisk: 'NONE_IDENTIFIED',
        selectedMitigationId: 'shorten-recall-period',
      }),
    );
    const resultB = evaluateEthicsSubmission(
      scenario,
      decision({
        selectedBias: 'RECALL_BIAS',
        selectedEthicsRisk: 'NONE_IDENTIFIED',
        selectedMitigationId: 'use-recent-log',
      }),
    );
    expect(resultA.level).toBe('PLAN_IMPROVED');
    expect(resultB.level).toBe('PLAN_IMPROVED');
  });

  it('returns BIAS_IDENTIFIED when only the bias is correct and ethics risk is not', () => {
    const result = evaluateEthicsSubmission(
      scenario,
      decision({
        selectedBias: 'RECALL_BIAS',
        selectedEthicsRisk: 'PRIVACY_CONFIDENTIALITY',
        selectedMitigationId: 'shorten-recall-period',
      }),
    );
    expect(result.level).toBe('BIAS_IDENTIFIED');
  });

  it('returns ETHICAL_RISK_IDENTIFIED when only the ethics risk is correct and bias is not', () => {
    const stigmaScenario = ethicsScenarios.find((s) => s.id === 'ethics-3')!;
    const result = evaluateEthicsSubmission(
      stigmaScenario,
      decision({
        scenarioId: 'ethics-3',
        selectedBias: 'RECALL_BIAS',
        selectedEthicsRisk: 'STIGMATIZATION_RISK',
        selectedMitigationId: 'aggregate-small-groups',
      }),
    );
    expect(result.level).toBe('ETHICAL_RISK_IDENTIFIED');
  });
});

describe('isEthicsDecisionComplete', () => {
  it('is false when required fields are missing', () => {
    expect(isEthicsDecisionComplete(decision({}))).toBe(false);
  });

  it('is true when all required fields are filled', () => {
    expect(
      isEthicsDecisionComplete(
        decision({
          selectedBias: 'RECALL_BIAS',
          selectedEthicsRisk: 'NONE_IDENTIFIED',
          whyItMatters: 'because...',
          selectedMitigationId: 'shorten-recall-period',
        }),
      ),
    ).toBe(true);
  });
});
