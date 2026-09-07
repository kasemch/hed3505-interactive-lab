import { useMemo, useState } from 'react';
import { module1Cards, evidenceCategories, reasoningOptions } from '../../data/module1Data';
import { useSession } from '../../context/SessionContext';
import { StatusBadge } from '../../components/StatusBadge';
import type { EvidenceCategory, Module1Submission } from '../../types';

const STUDENT_GENERIC_FEEDBACK =
  'ตรวจความสัมพันธ์ระหว่างกิจกรรมที่เกิดขึ้นกับการเปลี่ยนแปลงของกลุ่มเป้าหมายอีกครั้ง';
const STUDENT_ALIGNED_FEEDBACK =
  'แนวคิดของคุณสอดคล้องกับความสัมพันธ์เชิงเหตุผลระหว่างกิจกรรมและการเปลี่ยนแปลงที่เกิดขึ้น ลองอธิบายเหตุผลนี้ให้เพื่อนฟังดูอีกครั้ง';

function buildInitialSubmissions(): Module1Submission[] {
  return module1Cards.map((c) => ({ cardId: c.id, chosenCategory: null, chosenReasoningId: null }));
}

export function Module1() {
  const { state, setModule1 } = useSession();
  const isInstructor = state.mode === 'instructor';

  const [submissions, setSubmissions] = useState<Module1Submission[]>(() =>
    state.module1.submissions.length ? state.module1.submissions : buildInitialSubmissions(),
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  const status = state.module1.status;
  const isSubmitted = status === 'SUBMITTED' || status === 'REVIEW';

  const submissionByCard = useMemo(() => {
    const map = new Map<string, Module1Submission>();
    submissions.forEach((s) => map.set(s.cardId, s));
    return map;
  }, [submissions]);

  const unclassifiedCards = module1Cards.filter((c) => !submissionByCard.get(c.id)?.chosenCategory);

  const allClassified = submissions.every((s) => s.chosenCategory !== null);
  const allReasoned = submissions.every((s) => s.chosenReasoningId !== null);
  const canSubmit = allClassified && allReasoned && !isSubmitted;

  function persist(next: Module1Submission[]) {
    setSubmissions(next);
    if (!isSubmitted) {
      setModule1('IN_PROGRESS', next);
    }
  }

  function assignCategory(cardId: string, category: EvidenceCategory) {
    if (isSubmitted) return;
    const next = submissions.map((s) =>
      s.cardId === cardId
        ? {
            ...s,
            chosenCategory: category,
            chosenReasoningId: s.chosenCategory === category ? s.chosenReasoningId : null,
          }
        : s,
    );
    persist(next);
    setSelectedCardId(null);
  }

  function unassignCard(cardId: string) {
    if (isSubmitted) return;
    const next = submissions.map((s) =>
      s.cardId === cardId ? { ...s, chosenCategory: null, chosenReasoningId: null } : s,
    );
    persist(next);
  }

  function setReasoning(cardId: string, reasoningId: string) {
    if (isSubmitted) return;
    const next = submissions.map((s) => (s.cardId === cardId ? { ...s, chosenReasoningId: reasoningId } : s));
    persist(next);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    // Feedback is available immediately on submission, so move straight to REVIEW.
    setModule1('REVIEW', submissions);
  }

  function handleReset() {
    const initial = buildInitialSubmissions();
    setModule1('INITIAL', initial);
    setSubmissions(initial);
    setSelectedCardId(null);
  }

  return (
    <section aria-labelledby="module1-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="module1-heading" className="text-xl font-semibold text-[var(--color-navy)]">
            Module 1: Evidence Classification Lab
          </h2>
          <p className="text-sm text-gray-500">
            จำแนกหลักฐาน 12 ชิ้นเป็น Process / Output / Outcome / Impact ตามความสัมพันธ์เชิงเหตุผล ไม่ใช่ตามระยะเวลา
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Card pool */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-darkgray)]">
            หลักฐาน ({unclassifiedCards.length} เหลือให้จำแนก)
          </h3>
          <ul className="flex flex-col gap-2" aria-label="Unclassified evidence cards">
            {module1Cards.map((card) => {
              const submission = submissionByCard.get(card.id);
              const isPlaced = !!submission?.chosenCategory;
              const isSelected = selectedCardId === card.id;
              return (
                <li key={card.id}>
                  <div
                    role="button"
                    tabIndex={isSubmitted ? -1 : 0}
                    draggable={!isSubmitted}
                    aria-pressed={isSelected}
                    aria-disabled={isSubmitted}
                    onDragStart={() => setDraggedCardId(card.id)}
                    onClick={() => !isSubmitted && setSelectedCardId(isSelected ? null : card.id)}
                    onKeyDown={(e) => {
                      if (isSubmitted) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCardId(isSelected ? null : card.id);
                      }
                    }}
                    className={`rounded-lg border bg-white p-3 text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                      isPlaced ? 'border-gray-200 opacity-60' : 'border-gray-300 cursor-pointer'
                    } ${isSelected ? 'ring-2 ring-[var(--color-teal)]' : ''}`}
                  >
                    <p className="text-[var(--color-darkgray)]">{card.statement}</p>
                    <p className="mt-1 text-xs italic text-gray-400">{card.sourceLabel}</p>
                    {isPlaced && (
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="rounded bg-[var(--color-lightgray)] px-2 py-0.5 text-xs font-semibold text-[var(--color-navy)]">
                          {submission?.chosenCategory}
                        </span>
                        {!isSubmitted && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unassignCard(card.id);
                            }}
                            className="text-xs text-gray-400 underline hover:text-[var(--color-error)]"
                          >
                            ยกเลิก
                          </button>
                        )}
                      </div>
                    )}
                    {isPlaced && (
                      <div className="mt-2">
                        <label className="sr-only" htmlFor={`reason-${card.id}`}>
                          เหตุผลในการจำแนก
                        </label>
                        <select
                          id={`reason-${card.id}`}
                          disabled={isSubmitted}
                          value={submission?.chosenReasoningId ?? ''}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setReasoning(card.id, e.target.value)}
                          className="w-full rounded border border-gray-300 bg-white p-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                        >
                          <option value="" disabled>
                            เลือกเหตุผลในการจำแนก...
                          </option>
                          {reasoningOptions.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {isSubmitted && (
                      <div className="mt-3 border-t border-gray-100 pt-2 text-xs">
                        <p className="text-[var(--color-darkgray)]">
                          {submission?.chosenCategory === card.correctCategory
                            ? STUDENT_ALIGNED_FEEDBACK
                            : STUDENT_GENERIC_FEEDBACK}
                        </p>
                        {isInstructor && (
                          <div className="mt-2 space-y-1 rounded bg-[color-mix(in_srgb,var(--color-navy)_6%,white)] p-2">
                            <p>
                              <strong>Expected:</strong> {card.correctCategory}
                            </p>
                            <p>
                              <strong>Reasoning:</strong> {card.reasoningExplanation}
                            </p>
                            {card.commonMisconception && (
                              <p className="text-[#8a6d00]">
                                <strong>Misconception:</strong> {card.commonMisconception}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Category drop zones */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-darkgray)]">หมวดหมู่</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {evidenceCategories.map((cat) => {
              const count = submissions.filter((s) => s.chosenCategory === cat.id).length;
              return (
                <div
                  key={cat.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`จำแนกเป็น ${cat.label}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedCardId) assignCategory(draggedCardId, cat.id);
                    setDraggedCardId(null);
                  }}
                  onClick={() => selectedCardId && assignCategory(selectedCardId, cat.id)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && selectedCardId) {
                      e.preventDefault();
                      assignCategory(selectedCardId, cat.id);
                    }
                  }}
                  className="flex min-h-[110px] flex-col rounded-lg border-2 border-dashed border-gray-300 bg-white p-3 text-left transition hover:border-[var(--color-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--color-navy)]">{cat.label}</span>
                    <span className="rounded-full bg-[var(--color-lightgray)] px-2 py-0.5 text-xs text-[var(--color-darkgray)]">
                      {count}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{cat.labelTh}</span>
                  <p className="mt-1 text-xs text-gray-500">{cat.description}</p>
                </div>
              );
            })}
          </div>
          {selectedCardId && !isSubmitted && (
            <p className="mt-2 text-xs text-[var(--color-teal)]" role="status">
              เลือกหมวดหมู่ด้านบนเพื่อจำแนกการ์ดที่เลือก (คีย์บอร์ด: Tab ไปที่หมวดหมู่แล้วกด Enter)
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!isSubmitted ? (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]"
          >
            Submit Classification
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
        {!allClassified && !isSubmitted && (
          <span className="text-xs text-gray-500">จำแนกหลักฐานให้ครบทั้ง 12 ชิ้นและเลือกเหตุผลก่อนส่ง</span>
        )}
      </div>

      {isInstructor && isSubmitted && (
        <div className="mt-6 rounded-lg border border-[var(--color-teal)]/30 bg-white p-4">
          <h3 className="text-sm font-semibold text-[var(--color-navy)]">Debrief Prompt (Instructor Only)</h3>
          <p className="mt-1 text-sm text-[var(--color-darkgray)]">
            ให้นักศึกษาจับคู่และอธิบายว่าเหตุใดหลักฐานที่ดูเหมือน "ผลลัพธ์" บางชิ้นจึงจัดเป็น Output แทน
            โดยเน้นที่ลักษณะของการเปลี่ยนแปลง (บุคคล vs ระบบ) ไม่ใช่ระยะเวลาที่ผ่านไป
          </p>
        </div>
      )}
    </section>
  );
}
