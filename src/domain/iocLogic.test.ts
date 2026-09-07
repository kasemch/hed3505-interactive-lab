import { describe, expect, it } from 'vitest';
import { calculateIOC, checkCalculation, checkInterpretation, evaluateIOCSubmission, formatIOC } from './iocLogic';
import { IOC_THRESHOLD, iocScenarios } from '../data/module5Data';
import type { IOCItem, Module5Submission } from '../types';

function submission(overrides: Partial<Module5Submission>): Module5Submission {
  return {
    scenarioId: 'ioc-1',
    enteredSumR: '',
    enteredIOC: '',
    decision: null,
    reasoning: '',
    ...overrides,
  };
}

describe('calculateIOC', () => {
  it('calculates a positive case correctly (all raters agree)', () => {
    const item: IOCItem = { id: 'x', statement: 's', sourceLabel: 'l', expertRatings: [1, 1, 1] };
    const result = calculateIOC(item);
    expect(result.sumR).toBe(3);
    expect(result.n).toBe(3);
    expect(result.ioc).toBe(1);
    expect(result.meetsThreshold).toBe(true);
  });

  it('handles a zero-sum case (mixed positive/negative ratings)', () => {
    const item: IOCItem = { id: 'x', statement: 's', sourceLabel: 'l', expertRatings: [-1, 0, 1] };
    const result = calculateIOC(item);
    expect(result.sumR).toBe(0);
    expect(result.ioc).toBe(0);
    expect(result.meetsThreshold).toBe(false);
  });

  it('handles negative values correctly', () => {
    const item: IOCItem = { id: 'x', statement: 's', sourceLabel: 'l', expertRatings: [-1, -1, 0] };
    const result = calculateIOC(item);
    expect(result.sumR).toBe(-2);
    expect(result.ioc).toBeCloseTo(-0.6667, 4);
    expect(result.meetsThreshold).toBe(false);
  });

  it('does not multiply the result by 100', () => {
    const item: IOCItem = { id: 'x', statement: 's', sourceLabel: 'l', expertRatings: [1, 1, 1] };
    expect(calculateIOC(item).ioc).toBe(1);
  });

  it('supports decimal IOC values without floating-point display confusion', () => {
    const item: IOCItem = { id: 'x', statement: 's', sourceLabel: 'l', expertRatings: [1, 0, 1] };
    const result = calculateIOC(item);
    expect(result.ioc).toBeCloseTo(2 / 3, 10);
    expect(formatIOC(result.ioc)).toBe('0.67');
  });

  it('is exactly at the 0.50 threshold boundary (meets threshold)', () => {
    const item: IOCItem = { id: 'x', statement: 's', sourceLabel: 'l', expertRatings: [1, -1, 1, -1] };
    // sumR = 0, n = 4 -> ioc = 0, below threshold; construct a true boundary case instead:
    const boundaryItem: IOCItem = { id: 'y', statement: 's', sourceLabel: 'l', expertRatings: [1, -1] };
    // sumR=0, n=2 -> ioc=0 (below). Use ratings that yield exactly 0.5.
    const halfItem: IOCItem = { id: 'z', statement: 's', sourceLabel: 'l', expertRatings: [1, 0] };
    const half = calculateIOC(halfItem);
    expect(half.ioc).toBe(0.5);
    expect(half.ioc >= IOC_THRESHOLD).toBe(true);
    expect(half.meetsThreshold).toBe(true);
    expect(calculateIOC(item).meetsThreshold).toBe(false);
    expect(calculateIOC(boundaryItem).meetsThreshold).toBe(false);
  });

  it('flags values just below the threshold as not meeting it', () => {
    const item: IOCItem = { id: 'x', statement: 's', sourceLabel: 'l', expertRatings: [1, 0, -1, 0] };
    const result = calculateIOC(item);
    expect(result.ioc).toBe(0);
    expect(result.meetsThreshold).toBe(false);
  });
});

describe('checkCalculation / checkInterpretation / evaluateIOCSubmission', () => {
  const scenario = iocScenarios[0]; // ioc-1: all +1, ΣR=3, IOC=1.00, expectedDecision KEEP

  it('returns CALCULATION_CORRECT when ΣR and IOC are entered correctly', () => {
    const feedback = checkCalculation(scenario, submission({ enteredSumR: '3', enteredIOC: '1' }));
    expect(feedback.level).toBe('CALCULATION_CORRECT');
  });

  it('returns CALCULATION_RECHECK when values are wrong', () => {
    const feedback = checkCalculation(scenario, submission({ enteredSumR: '2', enteredIOC: '0.5' }));
    expect(feedback.level).toBe('CALCULATION_RECHECK');
  });

  it('returns INTERPRETATION_CONFIRMED when the decision matches the expected decision', () => {
    const feedback = checkInterpretation(scenario, submission({ decision: 'KEEP' }));
    expect(feedback.level).toBe('INTERPRETATION_CONFIRMED');
  });

  it('returns INTERPRETATION_RECHECK when the decision does not match', () => {
    const feedback = checkInterpretation(scenario, submission({ decision: 'REMOVE_RECONSIDER' }));
    expect(feedback.level).toBe('INTERPRETATION_RECHECK');
  });

  it('returns READY_FOR_REVISION_DECISION with the IOC-is-not-complete-quality disclaimer when both correct', () => {
    const feedback = evaluateIOCSubmission(
      scenario,
      submission({ enteredSumR: '3', enteredIOC: '1', decision: 'KEEP', reasoning: 'ok' }),
    );
    expect(feedback.level).toBe('READY_FOR_REVISION_DECISION');
    expect(feedback.messages.join(' ')).toContain('ไม่ใช่การยืนยันคุณภาพเครื่องมือทุกด้าน');
  });
});
