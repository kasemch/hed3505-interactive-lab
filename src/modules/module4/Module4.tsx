import { useMemo, useState } from 'react';
import { kapConstructs, responseFormats } from '../../data/module4Data';
import { useSession } from '../../context/SessionContext';
import { StatusBadge } from '../../components/StatusBadge';
import { evaluateInstrumentCandidate, isInstrumentCandidateComplete } from '../../domain/kapLogic';
import type { KAPConstruct, Module4Submission, ResponseFormat } from '../../types';

function buildInitialSubmissions(): Module4Submission[] {
  return kapConstructs.map((c) => ({
    construct: c.id,
    operationalMeaning: '',
    indicator: '',
    draftItem: '',
    responseFormat: null,
    rationale: '',
  }));
}

const FEEDBACK_LABEL: Record<string, string> = {
  CONSTRUCT_MATCH: 'CONSTRUCT MATCH',
  POSSIBLE_CONSTRUCT_MISMATCH: 'POSSIBLE CONSTRUCT MISMATCH',
  INDICATOR_ITEM_MISALIGNMENT: 'INDICATOR–ITEM MISALIGNMENT',
  RESPONSE_FORMAT_CONCERN: 'RESPONSE FORMAT CONCERN',
  READY_FOR_EXPERT_REVIEW: 'READY FOR EXPERT REVIEW',
};

export function Module4() {
  const { state, setModule4 } = useSession();
  const isInstructor = state.mode === 'instructor';

  const [submissions, setSubmissions] = useState<Module4Submission[]>(() =>
    state.module4.submissions.length ? state.module4.submissions : buildInitialSubmissions(),
  );
  const [activeConstruct, setActiveConstruct] = useState<KAPConstruct>('KNOWLEDGE');

  const status = state.module4.status;
  const isSubmitted = status === 'SUBMITTED' || status === 'REVIEW';

  const submissionByConstruct = useMemo(() => {
    const map = new Map<KAPConstruct, Module4Submission>();
    submissions.forEach((s) => map.set(s.construct, s));
    return map;
  }, [submissions]);

  const canSubmit = submissions.every(isInstrumentCandidateComplete) && !isSubmitted;

  function persist(next: Module4Submission[]) {
    setSubmissions(next);
    if (!isSubmitted) setModule4('IN_PROGRESS', next);
  }

  function update(construct: KAPConstruct, patch: Partial<Module4Submission>) {
    if (isSubmitted) return;
    persist(submissions.map((s) => (s.construct === construct ? { ...s, ...patch } : s)));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setModule4('REVIEW', submissions);
  }

  function handleReset() {
    const initial = buildInitialSubmissions();
    setModule4('INITIAL', initial);
    setSubmissions(initial);
    setActiveConstruct('KNOWLEDGE');
  }

  const activeConstructDef = kapConstructs.find((c) => c.id === activeConstruct)!;
  const activeSubmission = submissionByConstruct.get(activeConstruct);
  const activeFeedback =
    isSubmitted && activeSubmission ? evaluateInstrumentCandidate(activeSubmission, activeConstructDef) : null;

  return (
    <section aria-labelledby="module4-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="module4-heading" className="text-xl font-semibold text-[var(--color-navy)]">
            Module 4: K-A-P Instrument Studio
          </h2>
          <p className="text-sm text-gray-500">
            สร้างข้อคำถามอย่างน้อย 1 ข้อสำหรับแต่ละองค์ประกอบ: ความรู้ (Knowledge), ทัศนคติ (Attitude) และ
            การปฏิบัติ/พฤติกรรม (Practice)
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mb-4 flex gap-2" role="tablist" aria-label="K-A-P construct workspace">
        {kapConstructs.map((c) => {
          const submission = submissionByConstruct.get(c.id);
          const complete = submission ? isInstrumentCandidateComplete(submission) : false;
          const selected = activeConstruct === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveConstruct(c.id)}
              className={`flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                selected
                  ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white'
                  : 'border-gray-300 bg-white text-[var(--color-navy)] hover:border-[var(--color-teal)]'
              }`}
            >
              {c.labelTh}
              <span aria-hidden="true">{complete ? '✓' : '○'}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-[var(--color-darkgray)]">{activeConstructDef.description}</p>
        <p className="mt-2 rounded bg-[var(--color-lightgray)] p-2 text-xs text-[var(--color-darkgray)]">
          <strong>ข้อควรระวัง:</strong> {activeConstructDef.guardrail}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          ตัวอย่างตัวชี้วัด: {activeConstructDef.exampleIndicator}
        </p>

        <fieldset className="mt-4 flex flex-col gap-3" disabled={isSubmitted}>
          <div>
            <label htmlFor="operational-meaning" className="text-sm font-medium text-[var(--color-darkgray)]">
              ความหมายเชิงปฏิบัติการ (Operational Meaning)
            </label>
            <textarea
              id="operational-meaning"
              value={activeSubmission?.operationalMeaning ?? ''}
              onChange={(e) => update(activeConstruct, { operationalMeaning: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
              placeholder="อธิบายว่าสิ่งที่ต้องการวัดหมายถึงอะไรในบริบทของโครงการนี้..."
            />
          </div>

          <div>
            <label htmlFor="indicator" className="text-sm font-medium text-[var(--color-darkgray)]">
              ตัวชี้วัด (Indicator)
            </label>
            <input
              id="indicator"
              type="text"
              value={activeSubmission?.indicator ?? ''}
              onChange={(e) => update(activeConstruct, { indicator: e.target.value })}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
              placeholder="ระบุตัวชี้วัดที่จะสะท้อนความหมายเชิงปฏิบัติการข้างต้น..."
            />
          </div>

          <div>
            <label htmlFor="draft-item" className="text-sm font-medium text-[var(--color-darkgray)]">
              ร่างข้อคำถาม (Draft Item)
            </label>
            <textarea
              id="draft-item"
              value={activeSubmission?.draftItem ?? ''}
              onChange={(e) => update(activeConstruct, { draftItem: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
              placeholder="เขียนข้อคำถามที่จะใช้วัดตัวชี้วัดข้างต้น..."
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-[var(--color-darkgray)]">รูปแบบคำตอบ (Response Format)</legend>
            <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Response format">
              {responseFormats.map((fmt) => {
                const selected = activeSubmission?.responseFormat === fmt.id;
                const recommended = activeConstructDef.recommendedResponseFormats.includes(fmt.id);
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => update(activeConstruct, { responseFormat: fmt.id as ResponseFormat })}
                    title={recommended ? 'รูปแบบที่แนะนำโดยทั่วไปสำหรับองค์ประกอบนี้' : undefined}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                      selected
                        ? 'border-[var(--color-teal)] bg-[color-mix(in_srgb,var(--color-teal)_12%,white)] text-[var(--color-teal)]'
                        : 'border-gray-300 bg-white text-[var(--color-darkgray)] hover:border-[var(--color-teal)]'
                    }`}
                  >
                    {fmt.labelTh}
                    {recommended && <span aria-hidden="true"> ★</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="rationale" className="text-sm font-medium text-[var(--color-darkgray)]">
              เหตุผลประกอบ (Rationale)
            </label>
            <textarea
              id="rationale"
              value={activeSubmission?.rationale ?? ''}
              onChange={(e) => update(activeConstruct, { rationale: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
              placeholder="อธิบายว่าเหตุใดข้อคำถามนี้จึงสะท้อนองค์ประกอบที่เลือก..."
            />
          </div>
        </fieldset>

        {isSubmitted && activeFeedback && (
          <div className="mt-4 border-t border-gray-100 pt-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
              {FEEDBACK_LABEL[activeFeedback.level]}
            </p>
            {activeFeedback.messages.map((m, i) => (
              <p key={i} className="text-[var(--color-darkgray)]">
                {m}
              </p>
            ))}
            {isInstructor && (
              <div className="mt-2 space-y-1 rounded bg-[color-mix(in_srgb,var(--color-navy)_6%,white)] p-2 text-xs">
                <p>
                  <strong>Expected construct reasoning:</strong> {activeConstructDef.guardrail}
                </p>
                <p>
                  <strong>Strong-response reference:</strong> {activeConstructDef.exampleIndicator}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isSubmitted && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--color-navy)]">เปรียบเทียบทั้ง 3 องค์ประกอบ</h3>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {kapConstructs.map((c) => {
              const s = submissionByConstruct.get(c.id);
              const feedback = s ? evaluateInstrumentCandidate(s, c) : null;
              return (
                <div key={c.id} className="rounded-md border border-gray-200 bg-white p-3 text-xs">
                  <p className="font-semibold text-[var(--color-navy)]">{c.labelTh}</p>
                  <p className="mt-1 text-[var(--color-darkgray)]">{s?.draftItem}</p>
                  {feedback && (
                    <p className="mt-1 font-medium text-[var(--color-teal)]">{FEEDBACK_LABEL[feedback.level]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!isSubmitted ? (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
          >
            Submit Draft Instrument
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
          <span className="text-xs text-gray-500">กรอกข้อมูลให้ครบทั้ง 3 องค์ประกอบ (K, A, P) ก่อนส่ง</span>
        )}
      </div>
    </section>
  );
}
