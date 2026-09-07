import { useMemo, useState } from 'react';
import { rubricDimensions, rubricLevels, RUBRIC_TOTAL_WEIGHT } from '../../data/module7Data';
import { useSession } from '../../context/SessionContext';
import { StatusBadge } from '../../components/StatusBadge';
import { calculateRubricResult } from '../../domain/rubricLogic';
import type { Module7Submission, RubricScore, RubricWeight } from '../../types';

function buildInitial(): Module7Submission {
  return {
    weights: rubricDimensions.map((d) => ({ dimensionId: d.id, weight: d.defaultWeight })),
    scores: rubricDimensions.map((d) => ({ dimensionId: d.id, obtainedLevel: 1 })),
  };
}

export function Module7() {
  const { state, setModule7 } = useSession();
  const isInstructor = state.mode === 'instructor';

  const [submission, setSubmission] = useState<Module7Submission>(
    () => state.module7.submissions[0] ?? buildInitial(),
  );

  const status = state.module7.status;
  const isSubmitted = status === 'SUBMITTED' || status === 'REVIEW';

  const result = useMemo(
    () => calculateRubricResult(rubricDimensions, submission.weights, submission.scores),
    [submission],
  );

  const weightById = useMemo(() => new Map(submission.weights.map((w) => [w.dimensionId, w.weight])), [submission]);
  const scoreById = useMemo(() => new Map(submission.scores.map((s) => [s.dimensionId, s.obtainedLevel])), [submission]);
  const resultById = useMemo(() => new Map(result.perDimension.map((d) => [d.dimensionId, d])), [result]);

  function updateWeight(dimensionId: string, weight: number) {
    if (isSubmitted) return;
    const nextWeights: RubricWeight[] = submission.weights.map((w) =>
      w.dimensionId === dimensionId ? { ...w, weight } : w,
    );
    const next = { ...submission, weights: nextWeights };
    setSubmission(next);
    setModule7('IN_PROGRESS', [next]);
  }

  function updateLevel(dimensionId: string, obtainedLevel: number) {
    if (isSubmitted) return;
    const nextScores: RubricScore[] = submission.scores.map((s) =>
      s.dimensionId === dimensionId ? { ...s, obtainedLevel } : s,
    );
    const next = { ...submission, scores: nextScores };
    setSubmission(next);
    setModule7('IN_PROGRESS', [next]);
  }

  function handleSubmit() {
    setModule7('REVIEW', [submission]);
  }

  function handleReset() {
    const initial = buildInitial();
    setSubmission(initial);
    setModule7('INITIAL', [initial]);
  }

  const maxContribution = Math.max(1, ...result.perDimension.map((d) => d.weightedContribution));

  return (
    <section aria-labelledby="module7-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="module7-heading" className="text-xl font-semibold text-[var(--color-navy)]">
            Module 7: Weighted Rubric Sandbox
          </h2>
          <p className="text-sm text-gray-500">
            ปรับน้ำหนักมิติการประเมินและเลือกระดับที่ได้รับ เพื่อทำความเข้าใจว่าคะแนนรวมถ่วงน้ำหนักคำนวณอย่างไร
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-[var(--color-lightgray)] p-3 text-sm text-[var(--color-darkgray)]">
        <p className="font-semibold text-[var(--color-navy)]">
          สูตรที่ใช้: Total Score = Σ[(Obtained Level / Maximum Level) × Dimension Weight]
        </p>
        <p className="mt-1">น้ำหนักรวมของทุกมิติต้องเท่ากับ {RUBRIC_TOTAL_WEIGHT} และห้ามคูณผลรวมด้วย 100 ซ้ำอีกครั้ง</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--color-lightgray)] text-xs uppercase tracking-wide text-[var(--color-darkgray)]">
            <tr>
              <th scope="col" className="px-3 py-2">
                Dimension
              </th>
              <th scope="col" className="px-3 py-2">
                Weight
              </th>
              <th scope="col" className="px-3 py-2">
                Obtained Level
              </th>
              <th scope="col" className="px-3 py-2">
                Max Level
              </th>
              <th scope="col" className="px-3 py-2">
                Normalized Proportion
              </th>
              <th scope="col" className="px-3 py-2">
                Weighted Contribution
              </th>
            </tr>
          </thead>
          <tbody>
            {rubricDimensions.map((dim) => {
              const dimResult = resultById.get(dim.id);
              return (
                <tr key={dim.id} className="border-t border-gray-100">
                  <td className="px-3 py-2 align-top">
                    <p className="font-medium text-[var(--color-navy)]">{dim.labelTh}</p>
                    <p className="text-xs text-gray-500">{dim.description}</p>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <label className="sr-only" htmlFor={`weight-${dim.id}`}>
                      Weight for {dim.labelTh}
                    </label>
                    <input
                      id={`weight-${dim.id}`}
                      type="number"
                      min={0}
                      max={100}
                      disabled={isSubmitted}
                      value={weightById.get(dim.id) ?? 0}
                      onChange={(e) => updateWeight(dim.id, Number(e.target.value))}
                      className="w-20 rounded border border-gray-300 p-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <label className="sr-only" htmlFor={`level-${dim.id}`}>
                      Obtained level for {dim.labelTh}
                    </label>
                    <select
                      id={`level-${dim.id}`}
                      disabled={isSubmitted}
                      value={scoreById.get(dim.id) ?? 1}
                      onChange={(e) => updateLevel(dim.id, Number(e.target.value))}
                      className="rounded border border-gray-300 p-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                    >
                      {rubricLevels.map((lvl) => (
                        <option key={lvl.level} value={lvl.level}>
                          {lvl.level} — {lvl.labelTh}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 align-top">{dim.maxLevel}</td>
                  <td className="px-3 py-2 align-top">{((dimResult?.normalizedProportion ?? 0) * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-right font-medium">
                        {(dimResult?.weightedContribution ?? 0).toFixed(2)}
                      </span>
                      <div
                        className="h-2 flex-1 rounded-full bg-[var(--color-lightgray)]"
                        role="img"
                        aria-label={`Weighted contribution ${(dimResult?.weightedContribution ?? 0).toFixed(2)} for ${dim.labelTh}`}
                      >
                        <div
                          className="h-2 rounded-full bg-[var(--color-teal)]"
                          style={{
                            width: `${((dimResult?.weightedContribution ?? 0) / maxContribution) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p>
          <span className="text-xs uppercase tracking-wide text-gray-500">Total Weight</span>
          <br />
          <strong className={result.totalWeightValid ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}>
            {result.totalWeight}
          </strong>
        </p>
        <p>
          <span className="text-xs uppercase tracking-wide text-gray-500">Total Score</span>
          <br />
          <strong className="text-[var(--color-navy)]">
            {result.totalWeightValid ? result.totalScore.toFixed(2) : '—'}
          </strong>
        </p>
        {!result.totalWeightValid && (
          <p role="status" className="text-sm font-medium text-[var(--color-error)]">
            กรุณาปรับน้ำหนักรวมให้เท่ากับ 100 ก่อนตีความคะแนนรวม
          </p>
        )}
      </div>

      {isSubmitted && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
            {result.totalWeightValid ? 'RUBRIC_RESULT_VALID' : 'RUBRIC_WEIGHT_INVALID'}
          </p>
          <p className="text-[var(--color-darkgray)]">
            {result.totalWeightValid
              ? 'น้ำหนักรวมถูกต้อง คะแนนรวมถ่วงน้ำหนักด้านบนสามารถนำไปตีความได้ แต่คะแนนรูบริกนี้ยังไม่ใช่หลักฐานยืนยันความตรงของเครื่องมือทั้งหมด'
              : 'น้ำหนักรวมยังไม่เท่ากับ 100 คะแนนที่แสดงจึงยังไม่สามารถตีความเป็นคะแนนรวมที่สมบูรณ์ได้ กรุณาปรับน้ำหนักก่อน'}
          </p>
          {isInstructor && (
            <div className="mt-2 space-y-1 rounded bg-[color-mix(in_srgb,var(--color-navy)_6%,white)] p-2 text-xs">
              <p>
                <strong>Common errors to watch for:</strong> การคูณคะแนนรวมด้วย 100 ซ้ำ, น้ำหนักรวมไม่เท่ากับ 100,
                การสับสนระหว่างคะแนนระดับกับน้ำหนักมิติ, สมมติว่าทุกมิติต้องมีน้ำหนักเท่ากัน
              </p>
              <p>
                <strong>Facilitation note:</strong> ให้ผู้เรียนลองปรับน้ำหนักให้ไม่เท่ากับ 100 เพื่อสังเกตข้อความเตือน
                แล้วปรับกลับมาให้ถูกต้อง
              </p>
              <p>
                <strong>Debrief:</strong> คะแนนรูบริกรวมสูงหมายความว่าอย่างไร และไม่ได้หมายความว่าอย่างไรเกี่ยวกับคุณภาพเครื่องมือ?
              </p>
              <p>
                <strong>A4 linkage:</strong> ผลคะแนนรูบริกนี้จะเชื่อมโยงกับการประเมินคุณภาพผลงานใน Evaluation Matrix ในอนาคต
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!isSubmitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
          >
            Submit Rubric
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-[var(--color-navy)] shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
          >
            Reset &amp; Try Again
          </button>
        )}
      </div>
    </section>
  );
}
