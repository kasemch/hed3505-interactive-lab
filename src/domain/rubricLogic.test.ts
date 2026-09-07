import { describe, expect, it } from 'vitest';
import { calculateRubricResult } from './rubricLogic';
import type { RubricDimension, RubricScore, RubricWeight } from '../types';

const dimensions: RubricDimension[] = [
  { id: 'a', label: 'A', labelTh: 'A', description: '', defaultWeight: 50, maxLevel: 4 },
  { id: 'b', label: 'B', labelTh: 'B', description: '', defaultWeight: 50, maxLevel: 4 },
];

describe('calculateRubricResult', () => {
  it('marks total weight = 100 as valid', () => {
    const weights: RubricWeight[] = [
      { dimensionId: 'a', weight: 50 },
      { dimensionId: 'b', weight: 50 },
    ];
    const scores: RubricScore[] = [
      { dimensionId: 'a', obtainedLevel: 4 },
      { dimensionId: 'b', obtainedLevel: 4 },
    ];
    const result = calculateRubricResult(dimensions, weights, scores);
    expect(result.totalWeight).toBe(100);
    expect(result.totalWeightValid).toBe(true);
  });

  it('flags total weight < 100 as invalid', () => {
    const weights: RubricWeight[] = [
      { dimensionId: 'a', weight: 30 },
      { dimensionId: 'b', weight: 50 },
    ];
    const scores: RubricScore[] = [
      { dimensionId: 'a', obtainedLevel: 4 },
      { dimensionId: 'b', obtainedLevel: 4 },
    ];
    const result = calculateRubricResult(dimensions, weights, scores);
    expect(result.totalWeight).toBe(80);
    expect(result.totalWeightValid).toBe(false);
  });

  it('flags total weight > 100 as invalid', () => {
    const weights: RubricWeight[] = [
      { dimensionId: 'a', weight: 70 },
      { dimensionId: 'b', weight: 50 },
    ];
    const scores: RubricScore[] = [
      { dimensionId: 'a', obtainedLevel: 4 },
      { dimensionId: 'b', obtainedLevel: 4 },
    ];
    const result = calculateRubricResult(dimensions, weights, scores);
    expect(result.totalWeight).toBe(120);
    expect(result.totalWeightValid).toBe(false);
  });

  it('produces the maximum score when every dimension is at its maximum level', () => {
    const weights: RubricWeight[] = [
      { dimensionId: 'a', weight: 50 },
      { dimensionId: 'b', weight: 50 },
    ];
    const scores: RubricScore[] = [
      { dimensionId: 'a', obtainedLevel: 4 },
      { dimensionId: 'b', obtainedLevel: 4 },
    ];
    const result = calculateRubricResult(dimensions, weights, scores);
    expect(result.totalScore).toBe(100);
  });

  it('computes a partial score correctly', () => {
    const weights: RubricWeight[] = [
      { dimensionId: 'a', weight: 50 },
      { dimensionId: 'b', weight: 50 },
    ];
    const scores: RubricScore[] = [
      { dimensionId: 'a', obtainedLevel: 2 },
      { dimensionId: 'b', obtainedLevel: 4 },
    ];
    const result = calculateRubricResult(dimensions, weights, scores);
    // a: (2/4)*50 = 25, b: (4/4)*50 = 50 -> total = 75
    expect(result.totalScore).toBe(75);
  });

  it('does not multiply the total score by 100 again', () => {
    const weights: RubricWeight[] = [
      { dimensionId: 'a', weight: 100 },
      { dimensionId: 'b', weight: 0 },
    ];
    const scores: RubricScore[] = [
      { dimensionId: 'a', obtainedLevel: 4 },
      { dimensionId: 'b', obtainedLevel: 0 },
    ];
    const result = calculateRubricResult(dimensions, weights, scores);
    // (4/4)*100 = 100, not 10000
    expect(result.totalScore).toBe(100);
  });

  it('sums weighted contributions across multiple dimensions', () => {
    const threeDims: RubricDimension[] = [
      ...dimensions,
      { id: 'c', label: 'C', labelTh: 'C', description: '', defaultWeight: 0, maxLevel: 4 },
    ];
    const weights: RubricWeight[] = [
      { dimensionId: 'a', weight: 30 },
      { dimensionId: 'b', weight: 30 },
      { dimensionId: 'c', weight: 40 },
    ];
    const scores: RubricScore[] = [
      { dimensionId: 'a', obtainedLevel: 4 },
      { dimensionId: 'b', obtainedLevel: 2 },
      { dimensionId: 'c', obtainedLevel: 1 },
    ];
    const result = calculateRubricResult(threeDims, weights, scores);
    // a: (4/4)*30=30, b: (2/4)*30=15, c: (1/4)*40=10 -> total=55
    expect(result.perDimension).toHaveLength(3);
    expect(result.totalScore).toBe(55);
  });
});
