import { useMemo, useState } from 'react';
import { biasRisks, ethicsRisks, ethicsScenarios } from '../../data/module6Data';
import { useSession } from '../../context/SessionContext';
import { StatusBadge } from '../../components/StatusBadge';
import { evaluateEthicsSubmission, isEthicsDecisionComplete } from '../../domain/ethicsLogic';
import type { BiasType, EthicsDecision, EthicsRiskType } from '../../types';

function buildInitialSubmissions(): EthicsDecision[] {
  return ethicsScenarios.map((s) => ({
    scenarioId: s.id,
    selectedBias: null,
    selectedEthicsRisk: null,
    whyItMatters: '',
    selectedMitigationId: null,
    submitted: false,
  }));
}

export function Module6() {
  const { state, setModule6 } = useSession();
  const isInstructor = state.mode === 'instructor';

  const [submissions, setSubmissions] = useState<EthicsDecision[]>(() =>
    state.module6.submissions.length ? state.module6.submissions : buildInitialSubmissions(),
  );

  const status = state.module6.status;
  const isSubmitted = status === 'SUBMITTED' || status === 'REVIEW';

  const submissionByScenario = useMemo(() => {
    const map = new Map<string, EthicsDecision>();
    submissions.forEach((s) => map.set(s.scenarioId, s));
    return map;
  }, [submissions]);

  const canSubmit = submissions.every(isEthicsDecisionComplete) && !isSubmitted;

  function persist(next: EthicsDecision[]) {
    setSubmissions(next);
    if (!isSubmitted) setModule6('IN_PROGRESS', next);
  }

  function update(scenarioId: string, patch: Partial<EthicsDecision>) {
    if (isSubmitted) return;
    persist(submissions.map((s) => (s.scenarioId === scenarioId ? { ...s, ...patch } : s)));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const submitted = submissions.map((s) => ({ ...s, submitted: true }));
    setSubmissions(submitted);
    setModule6('REVIEW', submitted);
  }

  function handleReset() {
    const initial = buildInitialSubmissions();
    setModule6('INITIAL', initial);
    setSubmissions(initial);
  }

  return (
    <section aria-labelledby="module6-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="module6-heading" className="text-xl font-semibold text-[var(--color-navy)]">
            Module 6: Bias &amp; Ethics Simulator
          </h2>
          <p className="text-sm text-gray-500">
            ระบุอคติและความเสี่ยงเชิงจริยธรรมในแผนเก็บข้อมูล แล้วเสนอแนวทางแก้ไขที่เหมาะสม เก็บข้อมูลเท่าที่จำเป็นต่อวัตถุประสงค์การประเมิน
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <ol className="flex flex-col gap-6">
        {ethicsScenarios.map((scenario, idx) => {
          const decision = submissionByScenario.get(scenario.id);
          const feedback = isSubmitted && decision ? evaluateEthicsSubmission(scenario, decision) : null;

          return (
            <li key={scenario.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
                Scenario {idx + 1}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-[var(--color-navy)]">{scenario.title}</h3>
              <p className="mt-1 inline-block rounded bg-[var(--color-lightgray)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-darkgray)]">
                {scenario.simulatedDataLabel}
              </p>
              <p className="mt-2 text-sm text-[var(--color-darkgray)]">{scenario.context}</p>
              <div className="mt-2 rounded bg-[var(--color-lightgray)] p-2 text-xs text-[var(--color-darkgray)]">
                <strong>แผนเก็บข้อมูลเดิม:</strong> {scenario.originalPlan.description}
              </div>

              <fieldset className="mt-4" disabled={isSubmitted}>
                <legend className="text-sm font-medium text-[var(--color-darkgray)]">อคติที่อาจเกิดขึ้น</legend>
                <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Bias for scenario ${idx + 1}`}>
                  {biasRisks.map((b) => {
                    const selected = decision?.selectedBias === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update(scenario.id, { selectedBias: b.id as BiasType })}
                        title={b.description}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                          selected
                            ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white'
                            : 'border-gray-300 bg-white text-[var(--color-navy)] hover:border-[var(--color-teal)]'
                        }`}
                      >
                        {b.labelTh}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-3" disabled={isSubmitted}>
                <legend className="text-sm font-medium text-[var(--color-darkgray)]">ความเสี่ยงเชิงจริยธรรม</legend>
                <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Ethics risk for scenario ${idx + 1}`}>
                  {ethicsRisks.map((r) => {
                    const selected = decision?.selectedEthicsRisk === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update(scenario.id, { selectedEthicsRisk: r.id as EthicsRiskType })}
                        title={r.description}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                          selected
                            ? 'border-[var(--color-teal)] bg-[color-mix(in_srgb,var(--color-teal)_10%,white)] text-[var(--color-teal)]'
                            : 'border-gray-300 bg-white text-[var(--color-darkgray)] hover:border-[var(--color-teal)]'
                        }`}
                      >
                        {r.labelTh}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-3">
                <label htmlFor={`why-${scenario.id}`} className="text-sm font-medium text-[var(--color-darkgray)]">
                  เหตุใดจึงสำคัญ
                </label>
                <textarea
                  id={`why-${scenario.id}`}
                  disabled={isSubmitted}
                  value={decision?.whyItMatters ?? ''}
                  onChange={(e) => update(scenario.id, { whyItMatters: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                  placeholder="อธิบายว่าเหตุใดปัญหานี้จึงส่งผลต่อคุณภาพข้อมูลหรือจริยธรรมการวิจัย..."
                />
              </div>

              <fieldset className="mt-3" disabled={isSubmitted}>
                <legend className="text-sm font-medium text-[var(--color-darkgray)]">แนวทางแก้ไข / แผนที่ปรับปรุงแล้ว</legend>
                <div className="mt-2 flex flex-col gap-1.5" role="radiogroup" aria-label={`Mitigation for scenario ${idx + 1}`}>
                  {scenario.mitigationOptions.map((opt) => {
                    const selected = decision?.selectedMitigationId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update(scenario.id, { selectedMitigationId: opt.id })}
                        className={`rounded-md border px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                          selected
                            ? 'border-[var(--color-teal)] bg-[color-mix(in_srgb,var(--color-teal)_10%,white)]'
                            : 'border-gray-300 bg-white hover:border-[var(--color-teal)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {isSubmitted && feedback && (
                <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
                    {feedback.level.replace(/_/g, ' ')}
                  </p>
                  {feedback.messages.map((m, i) => (
                    <p key={i} className="text-[var(--color-darkgray)]">
                      {m}
                    </p>
                  ))}
                  {isInstructor && (
                    <div className="mt-2 space-y-1 rounded bg-[color-mix(in_srgb,var(--color-navy)_6%,white)] p-2 text-xs">
                      <p>
                        <strong>Intended bias:</strong> {scenario.expectedBias}
                      </p>
                      <p>
                        <strong>Intended ethical concern:</strong> {scenario.expectedEthicsRisk}
                      </p>
                      <p>
                        <strong>Expected reasoning:</strong> {scenario.expectedReasoning}
                      </p>
                      {scenario.acceptableAlternativeReasoning && (
                        <p>
                          <strong>Acceptable alternatives:</strong> {scenario.acceptableAlternativeReasoning}
                        </p>
                      )}
                      {scenario.commonMisconception && (
                        <p className="text-[#8a6d00]">
                          <strong>Common misconception:</strong> {scenario.commonMisconception}
                        </p>
                      )}
                      <p>
                        <strong>Discussion prompt:</strong> {scenario.discussionPrompt}
                      </p>
                      <p>
                        <strong>Debrief:</strong> {scenario.debriefQuestion}
                      </p>
                      <p>
                        <strong>CLO5 linkage:</strong> {scenario.clo5Linkage}
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
            Submit Analysis
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
            ระบุอคติ ความเสี่ยงเชิงจริยธรรม เหตุผล และแนวทางแก้ไขให้ครบทั้ง 3 สถานการณ์ก่อนส่ง
          </span>
        )}
      </div>
    </section>
  );
}
