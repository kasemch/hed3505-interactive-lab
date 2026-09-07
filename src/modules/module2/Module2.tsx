import { useMemo, useState } from 'react';
import { evaluationSituations, frameworks } from '../../data/module2Data';
import { useSession } from '../../context/SessionContext';
import { StatusBadge } from '../../components/StatusBadge';
import type { FrameworkId, Module2Submission } from '../../types';

function buildInitialSubmissions(): Module2Submission[] {
  return evaluationSituations.map((s) => ({ situationId: s.id, chosenFrameworkId: null, justification: '' }));
}

export function Module2() {
  const { state, setModule2 } = useSession();
  const isInstructor = state.mode === 'instructor';

  const [submissions, setSubmissions] = useState<Module2Submission[]>(() =>
    state.module2.submissions.length ? state.module2.submissions : buildInitialSubmissions(),
  );

  const status = state.module2.status;
  const isSubmitted = status === 'SUBMITTED' || status === 'REVIEW';

  const submissionBySituation = useMemo(() => {
    const map = new Map<string, Module2Submission>();
    submissions.forEach((s) => map.set(s.situationId, s));
    return map;
  }, [submissions]);

  const allChosen = submissions.every((s) => s.chosenFrameworkId !== null);
  const allJustified = submissions.every((s) => s.justification.trim().length > 0);
  const canSubmit = allChosen && allJustified && !isSubmitted;

  function persist(next: Module2Submission[]) {
    setSubmissions(next);
    if (!isSubmitted) setModule2('IN_PROGRESS', next);
  }

  function chooseFramework(situationId: string, frameworkId: FrameworkId) {
    if (isSubmitted) return;
    persist(
      submissions.map((s) => (s.situationId === situationId ? { ...s, chosenFrameworkId: frameworkId } : s)),
    );
  }

  function setJustification(situationId: string, value: string) {
    if (isSubmitted) return;
    persist(submissions.map((s) => (s.situationId === situationId ? { ...s, justification: value } : s)));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    // Feedback is available immediately on submission, so move straight to REVIEW.
    setModule2('REVIEW', submissions);
  }

  function handleReset() {
    const initial = buildInitialSubmissions();
    setModule2('INITIAL', initial);
    setSubmissions(initial);
  }

  return (
    <section aria-labelledby="module2-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="module2-heading" className="text-xl font-semibold text-[var(--color-navy)]">
            Module 2: CIPP–RE-AIM Framework Simulator
          </h2>
          <p className="text-sm text-gray-500">
            เลือกกรอบการประเมินที่เหมาะสมกับคำถามเชิงประเมินของแต่ละสถานการณ์ ไม่มีกรอบใดดีกว่ากรอบหนึ่งเสมอไป
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {frameworks.map((fw) => (
          <div key={fw.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-[var(--color-navy)]">
              {fw.name} <span className="font-normal text-gray-500">— {fw.fullName}</span>
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-[var(--color-darkgray)]">
              {fw.components.map((c) => (
                <li key={c.label}>
                  <strong>{c.code} · {c.label}:</strong> {c.description}
                </li>
              ))}
            </ul>
            <p className="mt-2 rounded bg-[var(--color-lightgray)] p-2 text-xs text-[var(--color-darkgray)]">
              {fw.guardrail}
            </p>
          </div>
        ))}
      </div>

      <ol className="flex flex-col gap-5">
        {evaluationSituations.map((situation, idx) => {
          const submission = submissionBySituation.get(situation.id);
          const isCorrect = submission?.chosenFrameworkId === situation.correctFrameworkId;
          return (
            <li key={situation.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
                Situation {idx + 1}
              </p>
              <p className="mt-1 text-sm text-[var(--color-darkgray)]">{situation.scenario}</p>

              <div className="mt-3 rounded bg-[var(--color-lightgray)] p-2 text-sm">
                <strong>คำถามเชิงประเมิน:</strong> {situation.evalQuestion}
              </div>

              <fieldset className="mt-3" disabled={isSubmitted}>
                <legend className="text-sm font-medium text-[var(--color-darkgray)]">
                  เลือกกรอบการประเมินที่เหมาะสม
                </legend>
                <div className="mt-2 flex gap-2" role="radiogroup" aria-label={`Framework choice for situation ${idx + 1}`}>
                  {frameworks.map((fw) => {
                    const selected = submission?.chosenFrameworkId === fw.id;
                    return (
                      <button
                        key={fw.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => chooseFramework(situation.id, fw.id)}
                        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                          selected
                            ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white'
                            : 'border-gray-300 bg-white text-[var(--color-navy)] hover:border-[var(--color-teal)]'
                        }`}
                      >
                        {fw.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-3">
                <label htmlFor={`justify-${situation.id}`} className="text-sm font-medium text-[var(--color-darkgray)]">
                  เหตุผลประกอบการเลือก
                </label>
                <textarea
                  id={`justify-${situation.id}`}
                  disabled={isSubmitted}
                  value={submission?.justification ?? ''}
                  onChange={(e) => setJustification(situation.id, e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                  placeholder="อธิบายว่าคำถามเชิงประเมินนี้เชื่อมโยงกับองค์ประกอบใดของกรอบที่เลือก..."
                />
              </div>

              {isSubmitted && (
                <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
                  <p className="text-[var(--color-darkgray)]">
                    {isCorrect
                      ? 'เหตุผลของคุณสอดคล้องกับองค์ประกอบของกรอบที่เลือก ลองอธิบายให้ชัดเจนขึ้นอีกเล็กน้อย'
                      : 'ลองพิจารณาใหม่ว่าคำถามเชิงประเมินนี้ถามถึงระดับองค์กร ความครอบคลุม หรือบริบท/ทรัพยากรของโครงการ'}
                  </p>
                  {isInstructor && (
                    <div className="mt-2 space-y-1 rounded bg-[color-mix(in_srgb,var(--color-navy)_6%,white)] p-2 text-xs">
                      <p>
                        <strong>Expected framework:</strong> {situation.correctFrameworkId}
                      </p>
                      <p>
                        <strong>Reasoning:</strong> {situation.expectedReasoning}
                      </p>
                      {situation.commonMisconception && (
                        <p className="text-[#8a6d00]">
                          <strong>Misconception:</strong> {situation.commonMisconception}
                        </p>
                      )}
                      <p>
                        <strong>Debrief prompt:</strong> {situation.debriefPrompt}
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
            Submit Responses
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
          <span className="text-xs text-gray-500">เลือกกรอบและระบุเหตุผลให้ครบทั้ง 3 สถานการณ์ก่อนส่ง</span>
        )}
      </div>
    </section>
  );
}
