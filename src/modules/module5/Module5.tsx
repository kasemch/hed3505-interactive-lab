import { useMemo, useState } from 'react';
import { iocScenarios, IOC_THRESHOLD } from '../../data/module5Data';
import { useSession } from '../../context/SessionContext';
import { StatusBadge } from '../../components/StatusBadge';
import {
  calculateIOC,
  checkCalculation,
  checkInterpretation,
  evaluateIOCSubmission,
  formatIOC,
  isModule5SubmissionComplete,
} from '../../domain/iocLogic';
import type { IOCDecision, Module5Submission } from '../../types';

function buildInitialSubmissions(): Module5Submission[] {
  return iocScenarios.map((s) => ({
    scenarioId: s.id,
    enteredSumR: '',
    enteredIOC: '',
    decision: null,
    reasoning: '',
  }));
}

const DECISION_OPTIONS: { id: IOCDecision; labelTh: string }[] = [
  { id: 'KEEP', labelTh: 'คงไว้ (KEEP)' },
  { id: 'REVISE', labelTh: 'ปรับปรุง (REVISE)' },
  { id: 'REMOVE_RECONSIDER', labelTh: 'ตัดทิ้ง / ทบทวนใหม่ (REMOVE / RECONSIDER)' },
];

export function Module5() {
  const { state, setModule5 } = useSession();
  const isInstructor = state.mode === 'instructor';

  const [submissions, setSubmissions] = useState<Module5Submission[]>(() =>
    state.module5.submissions.length ? state.module5.submissions : buildInitialSubmissions(),
  );

  const status = state.module5.status;
  const isSubmitted = status === 'SUBMITTED' || status === 'REVIEW';

  const submissionByScenario = useMemo(() => {
    const map = new Map<string, Module5Submission>();
    submissions.forEach((s) => map.set(s.scenarioId, s));
    return map;
  }, [submissions]);

  const canSubmit = submissions.every(isModule5SubmissionComplete) && !isSubmitted;

  function persist(next: Module5Submission[]) {
    setSubmissions(next);
    if (!isSubmitted) setModule5('IN_PROGRESS', next);
  }

  function update(scenarioId: string, patch: Partial<Module5Submission>) {
    if (isSubmitted) return;
    persist(submissions.map((s) => (s.scenarioId === scenarioId ? { ...s, ...patch } : s)));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setModule5('REVIEW', submissions);
  }

  function handleReset() {
    const initial = buildInitialSubmissions();
    setModule5('INITIAL', initial);
    setSubmissions(initial);
  }

  return (
    <section aria-labelledby="module5-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="module5-heading" className="text-xl font-semibold text-[var(--color-navy)]">
            Module 5: IOC Quality Lab
          </h2>
          <p className="text-sm text-gray-500">
            คำนวณและตีความ IOC (Index of Item-Objective Congruence) จากคะแนนผู้เชี่ยวชาญ แล้วตัดสินใจว่าจะคงไว้ ปรับปรุง
            หรือตัดทิ้งข้อคำถาม
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-[var(--color-lightgray)] p-3 text-sm text-[var(--color-darkgray)]">
        <p className="font-semibold text-[var(--color-navy)]">สูตรที่ใช้: IOC = ΣR / N</p>
        <p className="mt-1">
          เกณฑ์ขั้นต่ำระดับข้อคำถาม: IOC ≥ {IOC_THRESHOLD.toFixed(2)} · IOC เป็นหลักฐานส่วนหนึ่งของความตรงเชิงเนื้อหา
          ไม่ใช่ความเที่ยง (Reliability) และไม่ใช่การยืนยันคุณภาพเครื่องมือทุกด้าน
        </p>
      </div>

      <ol className="flex flex-col gap-6">
        {iocScenarios.map((scenario, idx) => {
          const submission = submissionByScenario.get(scenario.id);
          const result = calculateIOC(scenario.item);
          const calcFeedback = submission ? checkCalculation(scenario, submission) : null;
          const interpFeedback =
            submission && calcFeedback?.level === 'CALCULATION_CORRECT'
              ? checkInterpretation(scenario, submission)
              : null;
          const finalFeedback = isSubmitted && submission ? evaluateIOCSubmission(scenario, submission) : null;

          return (
            <li key={scenario.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
                Exercise {idx + 1}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-[var(--color-navy)]">{scenario.title}</h3>
              <p className="mt-1 inline-block rounded bg-[var(--color-lightgray)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-darkgray)]">
                {scenario.simulatedDataLabel}
              </p>
              <p className="mt-2 text-sm text-[var(--color-darkgray)]">{scenario.context}</p>

              <div className="mt-3 rounded-md border border-gray-200 bg-[var(--color-lightgray)] p-3">
                <p className="text-sm text-[var(--color-darkgray)]">
                  <strong>ข้อคำถาม:</strong> {scenario.item.statement}
                </p>
                <p className="mt-1 text-xs text-gray-500">{scenario.item.sourceLabel}</p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Expert ratings">
                  {scenario.item.expertRatings.map((rating, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-[var(--color-darkgray)]"
                    >
                      ผู้เชี่ยวชาญ {i + 1}: {rating > 0 ? `+${rating}` : rating}
                    </span>
                  ))}
                </div>
              </div>

              <fieldset className="mt-4 grid gap-3 sm:grid-cols-2" disabled={isSubmitted}>
                <div>
                  <label htmlFor={`sumr-${scenario.id}`} className="text-sm font-medium text-[var(--color-darkgray)]">
                    ΣR (ผลรวมคะแนนผู้เชี่ยวชาญ)
                  </label>
                  <input
                    id={`sumr-${scenario.id}`}
                    type="text"
                    inputMode="numeric"
                    value={submission?.enteredSumR ?? ''}
                    onChange={(e) => update(scenario.id, { enteredSumR: e.target.value })}
                    className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                    placeholder={`ผลรวมของคะแนน ${scenario.item.expertRatings.length} ท่าน`}
                  />
                </div>
                <div>
                  <label htmlFor={`ioc-${scenario.id}`} className="text-sm font-medium text-[var(--color-darkgray)]">
                    IOC = ΣR / N
                  </label>
                  <input
                    id={`ioc-${scenario.id}`}
                    type="text"
                    inputMode="decimal"
                    value={submission?.enteredIOC ?? ''}
                    onChange={(e) => update(scenario.id, { enteredIOC: e.target.value })}
                    className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                    placeholder={`N = ${result.n}`}
                  />
                </div>
              </fieldset>

              {calcFeedback && !isSubmitted && (
                <p
                  className={`mt-2 text-xs ${
                    calcFeedback.level === 'CALCULATION_CORRECT' ? 'text-[var(--color-success)]' : 'text-gray-500'
                  }`}
                >
                  {calcFeedback.messages[0]}
                </p>
              )}

              <fieldset className="mt-4" disabled={isSubmitted}>
                <legend className="text-sm font-medium text-[var(--color-darkgray)]">การตัดสินใจ</legend>
                <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Decision for exercise ${idx + 1}`}>
                  {DECISION_OPTIONS.map((opt) => {
                    const selected = submission?.decision === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update(scenario.id, { decision: opt.id })}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                          selected
                            ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white'
                            : 'border-gray-300 bg-white text-[var(--color-navy)] hover:border-[var(--color-teal)]'
                        }`}
                      >
                        {opt.labelTh}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {interpFeedback && !isSubmitted && (
                <p
                  className={`mt-2 text-xs ${
                    interpFeedback.level === 'INTERPRETATION_CONFIRMED' ? 'text-[var(--color-success)]' : 'text-gray-500'
                  }`}
                >
                  {interpFeedback.messages[0]}
                </p>
              )}

              <div className="mt-3">
                <label htmlFor={`reasoning-${scenario.id}`} className="text-sm font-medium text-[var(--color-darkgray)]">
                  เหตุผลประกอบการตัดสินใจ
                </label>
                <textarea
                  id={`reasoning-${scenario.id}`}
                  disabled={isSubmitted}
                  value={submission?.reasoning ?? ''}
                  onChange={(e) => update(scenario.id, { reasoning: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                  placeholder="อธิบายว่าเหตุใดจึงเลือกการตัดสินใจนี้..."
                />
              </div>

              {isSubmitted && finalFeedback && (
                <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
                    {finalFeedback.level.replace(/_/g, ' ')}
                  </p>
                  {finalFeedback.messages.map((m, i) => (
                    <p key={i} className="text-[var(--color-darkgray)]">
                      {m}
                    </p>
                  ))}
                  {isInstructor && (
                    <div className="mt-2 space-y-1 rounded bg-[color-mix(in_srgb,var(--color-navy)_6%,white)] p-2 text-xs">
                      <p>
                        <strong>Expected calculation:</strong> ΣR = {result.sumR}, IOC = {formatIOC(result.ioc)}
                      </p>
                      <p>
                        <strong>Expected decision:</strong> {scenario.expectedDecision}
                      </p>
                      <p>
                        <strong>Expected reasoning:</strong> {scenario.expectedReasoning}
                      </p>
                      {scenario.commonMisconception && (
                        <p className="text-[#8a6d00]">
                          <strong>Common misconception:</strong> {scenario.commonMisconception}
                        </p>
                      )}
                      <p>
                        <strong>Teaching prompt:</strong> {scenario.teachingPrompt}
                      </p>
                      <p>
                        <strong>Connection to Module 4:</strong> {scenario.item.sourceLabel} — รอการตรวจโดยผู้เชี่ยวชาญ
                      </p>
                      <p>
                        <strong>A4 linkage:</strong> {scenario.a4Linkage}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!isSubmitted ? (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
          >
            Submit IOC Analysis
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
        {!canSubmit && !isSubmitted && (
          <span className="text-xs text-gray-500">
            คำนวณ ΣR, IOC, เลือกการตัดสินใจ และระบุเหตุผลให้ครบทั้ง 3 แบบฝึกก่อนส่ง
          </span>
        )}
      </div>
    </section>
  );
}
