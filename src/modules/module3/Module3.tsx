import { useMemo, useState } from 'react';
import { alignmentCategories, alignmentScenarios } from '../../data/module3Data';
import { useSession } from '../../context/SessionContext';
import { StatusBadge } from '../../components/StatusBadge';
import { evaluateAlignmentSubmission, isModule3SubmissionComplete } from '../../domain/alignmentLogic';
import type { AlignmentIssueCategory, Module3Submission } from '../../types';

function buildInitialSubmissions(): Module3Submission[] {
  return alignmentScenarios.map((s) => ({
    scenarioId: s.id,
    selectedLinkId: null,
    selectedCategory: null,
    selectedCorrectionId: null,
    justification: '',
  }));
}

const FEEDBACK_COPY: Record<string, string> = {
  ALIGNMENT_CONFIRMED:
    'จุดที่เลือก ประเภทปัญหา และข้อเสนอแก้ไขสอดคล้องกันตลอดทั้งห่วงโซ่การประเมิน ลองอธิบายเหตุผลของคุณให้ชัดเจนยิ่งขึ้นเพื่อใช้ในการอภิปรายกลุ่ม',
  PARTIAL_ALIGNMENT:
    'คุณระบุจุดที่ไม่สอดคล้องได้ถูกต้อง แต่ประเภทปัญหาหรือข้อเสนอแก้ไขบางส่วนยังไม่ตรงกับลักษณะของความไม่สอดคล้องนี้ ลองทบทวนอีกครั้ง',
  RECONSIDER_LINK:
    'จุดที่เลือกถูกต้อง แต่ลองพิจารณาใหม่ว่าปัญหานี้เป็นความไม่สอดคล้องประเภทใด และควรแก้ไขอย่างไรจึงจะรักษาเป้าหมายการประเมินเดิมไว้',
  MISALIGNMENT_DETECTED:
    'ลองตรวจสอบห่วงโซ่การประเมินอีกครั้งตั้งแต่วัตถุประสงค์ไปจนถึงการตัดสินใจ จุดที่เลือกยังไม่ใช่จุดที่มีความไม่สอดคล้องกันเชิงแนวคิด',
};

export function Module3() {
  const { state, setModule3 } = useSession();
  const isInstructor = state.mode === 'instructor';

  const [submissions, setSubmissions] = useState<Module3Submission[]>(() =>
    state.module3.submissions.length ? state.module3.submissions : buildInitialSubmissions(),
  );

  const status = state.module3.status;
  const isSubmitted = status === 'SUBMITTED' || status === 'REVIEW';

  const submissionByScenario = useMemo(() => {
    const map = new Map<string, Module3Submission>();
    submissions.forEach((s) => map.set(s.scenarioId, s));
    return map;
  }, [submissions]);

  const canSubmit = submissions.every(isModule3SubmissionComplete) && !isSubmitted;

  function persist(next: Module3Submission[]) {
    setSubmissions(next);
    if (!isSubmitted) setModule3('IN_PROGRESS', next);
  }

  function update(scenarioId: string, patch: Partial<Module3Submission>) {
    if (isSubmitted) return;
    persist(submissions.map((s) => (s.scenarioId === scenarioId ? { ...s, ...patch } : s)));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setModule3('REVIEW', submissions);
  }

  function handleReset() {
    const initial = buildInitialSubmissions();
    setModule3('INITIAL', initial);
    setSubmissions(initial);
  }

  return (
    <section aria-labelledby="module3-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="module3-heading" className="text-xl font-semibold text-[var(--color-navy)]">
            Module 3: Evaluation Alignment Debugger
          </h2>
          <p className="text-sm text-gray-500">
            ตรวจสอบห่วงโซ่การประเมิน (Objective → Question → Indicator → Data Source → Instrument → Analysis →
            Decision Use) แล้วระบุจุดที่ไม่สอดคล้องกันเชิงแนวคิด
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <ol className="flex flex-col gap-6">
        {alignmentScenarios.map((scenario, idx) => {
          const submission = submissionByScenario.get(scenario.id);
          const evaluation = submission ? evaluateAlignmentSubmission(scenario, submission) : null;

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

              {/* Chain visualization: nodes with selectable links between them */}
              <div className="mt-4 flex flex-col items-stretch gap-0" role="group" aria-label="Evaluation chain">
                {scenario.nodes.map((node, nodeIdx) => {
                  const link = scenario.links[nodeIdx]; // link leaving this node, undefined for last node
                  const linkSelected = submission?.selectedLinkId === link?.id;
                  return (
                    <div key={node.id}>
                      <div className="rounded-md border border-gray-200 bg-[var(--color-lightgray)] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-navy)]">
                          {node.label}
                        </p>
                        <p className="mt-0.5 text-sm text-[var(--color-darkgray)]">{node.statement}</p>
                      </div>
                      {link && (
                        <div className="flex justify-center py-1">
                          <button
                            type="button"
                            disabled={isSubmitted}
                            aria-pressed={linkSelected}
                            onClick={() => update(scenario.id, { selectedLinkId: link.id })}
                            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] disabled:cursor-not-allowed disabled:opacity-60 ${
                              linkSelected
                                ? 'border-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_12%,white)] text-[var(--color-error)]'
                                : 'border-gray-300 bg-white text-[var(--color-darkgray)] hover:border-[var(--color-teal)]'
                            }`}
                          >
                            <span aria-hidden="true">{linkSelected ? '🚩' : '↓'}</span>
                            {linkSelected ? `ตั้งค่าสถานะ: จุดที่สงสัย (${link.label})` : `${link.label} — เลือกจุดนี้`}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <fieldset className="mt-4" disabled={isSubmitted}>
                <legend className="text-sm font-medium text-[var(--color-darkgray)]">ประเภทของปัญหาที่พบ</legend>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2" role="radiogroup" aria-label={`Issue category for scenario ${idx + 1}`}>
                  {alignmentCategories.map((cat) => {
                    const selected = submission?.selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update(scenario.id, { selectedCategory: cat.id as AlignmentIssueCategory })}
                        className={`rounded-md border px-3 py-1.5 text-left text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                          selected
                            ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white'
                            : 'border-gray-300 bg-white text-[var(--color-navy)] hover:border-[var(--color-teal)]'
                        }`}
                      >
                        {cat.labelTh}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-4" disabled={isSubmitted}>
                <legend className="text-sm font-medium text-[var(--color-darkgray)]">แนวทางแก้ไขที่เสนอ</legend>
                <div className="mt-2 flex flex-col gap-1.5" role="radiogroup" aria-label={`Correction option for scenario ${idx + 1}`}>
                  {scenario.issue.correctionOptions.map((opt) => {
                    const selected = submission?.selectedCorrectionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update(scenario.id, { selectedCorrectionId: opt.id })}
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

              <div className="mt-3">
                <label htmlFor={`justify-m3-${scenario.id}`} className="text-sm font-medium text-[var(--color-darkgray)]">
                  เหตุผลประกอบการวิเคราะห์
                </label>
                <textarea
                  id={`justify-m3-${scenario.id}`}
                  disabled={isSubmitted}
                  value={submission?.justification ?? ''}
                  onChange={(e) => update(scenario.id, { justification: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                  placeholder="อธิบายว่าเหตุใดจุดที่เลือกจึงไม่สอดคล้องกัน..."
                />
              </div>

              {isSubmitted && evaluation && (
                <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
                    {evaluation.level.replace('_', ' ')}
                  </p>
                  <p className="text-[var(--color-darkgray)]">{FEEDBACK_COPY[evaluation.level]}</p>
                  {isInstructor && (
                    <div className="mt-2 space-y-1 rounded bg-[color-mix(in_srgb,var(--color-navy)_6%,white)] p-2 text-xs">
                      <p>
                        <strong>Intended misalignment:</strong> {scenario.issue.category}
                      </p>
                      <p>
                        <strong>Expected reasoning:</strong> {scenario.issue.expectedReasoning}
                      </p>
                      {scenario.issue.acceptableAlternativeReasoning && (
                        <p>
                          <strong>Acceptable alternative reasoning:</strong> {scenario.issue.acceptableAlternativeReasoning}
                        </p>
                      )}
                      {scenario.issue.commonMisconception && (
                        <p className="text-[#8a6d00]">
                          <strong>Common misconception:</strong> {scenario.issue.commonMisconception}
                        </p>
                      )}
                      <p>
                        <strong>Facilitation prompt:</strong> {scenario.issue.facilitationPrompt}
                      </p>
                      <p>
                        <strong>Debrief question:</strong> {scenario.issue.debriefQuestion}
                      </p>
                      <p>
                        <strong>A4 linkage:</strong> {scenario.issue.a4Linkage}
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
            เลือกจุดที่สงสัย ประเภทปัญหา แนวทางแก้ไข และระบุเหตุผลให้ครบทั้ง 3 สถานการณ์ก่อนส่ง
          </span>
        )}
      </div>
    </section>
  );
}
