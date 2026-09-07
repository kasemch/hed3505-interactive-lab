import { caseScenario } from '../data/caseScenario';
import { useSession } from '../context/SessionContext';

export function CaseLaunch() {
  const { enterLab } = useSession();

  return (
    <section aria-labelledby="case-launch-heading" className="mx-auto max-w-3xl">
      <span className="mb-3 inline-block rounded-full bg-[color-mix(in_srgb,var(--color-teal)_12%,white)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
        {caseScenario.simulatedDataLabel}
      </span>

      <h2 id="case-launch-heading" className="text-2xl font-semibold text-[var(--color-navy)]">
        {caseScenario.title}
      </h2>

      <p className="mt-4 leading-relaxed text-[var(--color-darkgray)]">{caseScenario.context}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-[var(--color-navy)]">วัตถุประสงค์โครงการ</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-darkgray)]">
            {caseScenario.objectives.map((obj) => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-[var(--color-navy)]">กิจกรรมหลัก</h3>
          <ul className="mt-2 space-y-2 text-sm text-[var(--color-darkgray)]">
            {caseScenario.activities.map((a) => (
              <li key={a.id}>
                <strong>{a.title}</strong> — {a.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-[var(--color-navy)]">ผู้มีส่วนได้ส่วนเสีย</h3>
        <ul className="mt-2 grid gap-2 text-sm text-[var(--color-darkgray)] sm:grid-cols-2">
          {caseScenario.stakeholders.map((s) => (
            <li key={s.id}>
              <strong>{s.role}:</strong> {s.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-lg border-l-4 border-[var(--color-teal)] bg-white p-5 shadow-sm">
        <p className="text-lg font-medium text-[var(--color-navy)]">{caseScenario.coreQuestion}</p>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={enterLab}
          className="rounded-lg bg-[var(--color-navy)] px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#152941] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2"
        >
          {caseScenario.entryCallToAction}
        </button>
      </div>
    </section>
  );
}
