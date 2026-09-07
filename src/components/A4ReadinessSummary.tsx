import { useSession } from '../context/SessionContext';

interface ReadinessItem {
  label: string;
  done: boolean;
}

/**
 * Derived, non-persisted view summarizing draft readiness for the future A4
 * Evaluation Matrix. This is intentionally a prototype-level indicator only -
 * it never claims the matrix itself is complete or verified.
 */
export function A4ReadinessSummary() {
  const { state } = useSession();

  const module2Done = state.module2.status === 'SUBMITTED' || state.module2.status === 'REVIEW';
  const module2Justified =
    state.module2.submissions.length > 0 && state.module2.submissions.every((s) => s.justification.trim().length > 0);
  const module3Done = state.module3.status === 'SUBMITTED' || state.module3.status === 'REVIEW';
  const module4IndicatorsFilled =
    state.module4.submissions.length > 0 && state.module4.submissions.every((s) => s.indicator.trim().length > 0);
  const module4Done = state.module4.status === 'SUBMITTED' || state.module4.status === 'REVIEW';
  const module5Done = state.module5.status === 'SUBMITTED' || state.module5.status === 'REVIEW';
  const module6Done = state.module6.status === 'SUBMITTED' || state.module6.status === 'REVIEW';
  const module7Done = state.module7.status === 'SUBMITTED' || state.module7.status === 'REVIEW';

  const readyItems: ReadinessItem[] = [
    { label: 'Evaluation purpose (วัตถุประสงค์การประเมิน)', done: module2Done },
    { label: 'Framework rationale (เหตุผลการเลือกกรอบการประเมิน)', done: module2Justified },
    { label: 'Objective/question alignment (ความสอดคล้องวัตถุประสงค์-คำถามประเมิน)', done: module3Done },
    { label: 'Indicator (ตัวชี้วัด)', done: module4IndicatorsFilled },
    { label: 'Draft K/A/P item (ร่างข้อคำถาม K/A/P)', done: module4Done },
    { label: 'Quality Review (การตรวจสอบคุณภาพเครื่องมือ - IOC)', done: module5Done },
    { label: 'Bias/Ethics Review (การพิจารณาอคติและจริยธรรม)', done: module6Done },
    { label: 'Rubric Logic (ตรรกะเกณฑ์การให้คะแนนถ่วงน้ำหนัก)', done: module7Done },
  ];

  const pendingSections = [
    'Evaluation Matrix (ตารางสรุปการประเมิน)',
    'Final A4 Assembly (การประกอบร่าง A4 ฉบับสมบูรณ์)',
  ];

  return (
    <section
      aria-labelledby="a4-readiness-heading"
      className="mt-8 rounded-lg border border-gray-200 bg-white p-4"
    >
      <h2 id="a4-readiness-heading" className="text-sm font-semibold uppercase tracking-wide text-[var(--color-navy)]">
        A4 Draft Readiness — สถานะความพร้อมร่าง A4
      </h2>
      <p className="mt-1 text-xs text-gray-500">
        สรุปความคืบหน้าของงานร่างที่จะนำไปใช้ในแบบฝึกหัด A4 ในอนาคต (ยังไม่ใช่การยืนยันว่า A4 เสร็จสมบูรณ์)
      </p>

      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {readyItems.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-sm text-[var(--color-darkgray)]">
            <span
              aria-hidden="true"
              className={item.done ? 'text-[var(--color-success)]' : 'text-gray-300'}
            >
              {item.done ? '✓' : '○'}
            </span>
            <span>
              {item.label} <span className="text-xs text-gray-400">({item.done ? 'พร้อมแล้ว' : 'ยังไม่พร้อม'})</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs font-medium text-[var(--color-darkgray)]">ส่วนที่ยังรอดำเนินการในโมดูลถัดไป:</p>
      <ul className="mt-1 flex flex-wrap gap-1.5">
        {pendingSections.map((section) => (
          <li
            key={section}
            className="rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-[11px] text-gray-500"
          >
            {section}
          </li>
        ))}
      </ul>
    </section>
  );
}
