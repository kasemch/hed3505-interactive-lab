import type { RubricDimension, RubricResult, RubricScore, RubricWeight } from '../types';
import { RUBRIC_TOTAL_WEIGHT } from '../data/module7Data';

const WEIGHT_TOLERANCE = 0.001;

/**
 * Deterministically calculates the weighted rubric total per the academic lock:
 *   Total Score = Σ[(Obtained Level / Maximum Level) × Dimension Weight]
 * Weights are treated as already expressed on a 0-100 scale (summing to 100), so the result is
 * NOT multiplied by 100 again. If total weight != 100, the score is computed for display but
 * flagged invalid so callers must not present it as an interpretable final score.
 */
export function calculateRubricResult(
  dimensions: RubricDimension[],
  weights: RubricWeight[],
  scores: RubricScore[],
): RubricResult {
  const weightById = new Map(weights.map((w) => [w.dimensionId, w.weight]));
  const scoreById = new Map(scores.map((s) => [s.dimensionId, s.obtainedLevel]));

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const totalWeightValid = Math.abs(totalWeight - RUBRIC_TOTAL_WEIGHT) <= WEIGHT_TOLERANCE;

  const perDimension = dimensions.map((dim) => {
    const weight = weightById.get(dim.id) ?? 0;
    const obtainedLevel = scoreById.get(dim.id) ?? 0;
    const normalizedProportion = dim.maxLevel === 0 ? 0 : obtainedLevel / dim.maxLevel;
    const weightedContribution = normalizedProportion * weight;
    return { dimensionId: dim.id, normalizedProportion, weightedContribution };
  });

  const totalScore = perDimension.reduce((sum, d) => sum + d.weightedContribution, 0);

  return { totalWeight, totalWeightValid, totalScore, perDimension };
}
