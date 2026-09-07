import { useSession } from '../context/SessionContext';

export function Header() {
  const { state, setMode } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
            HED3505 · Week 10
          </p>
          <h1 className="text-lg font-semibold text-[var(--color-navy)] sm:text-xl">
            Evaluation Design for School Health Programs
          </h1>
        </div>

        <div className="flex items-center gap-2" role="group" aria-label="Mode selector">
          <span className="text-sm text-gray-500">Mode:</span>
          <div className="inline-flex rounded-lg border border-gray-300 bg-gray-100 p-0.5">
            <button
              type="button"
              onClick={() => setMode('student')}
              aria-pressed={state.mode === 'student'}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                state.mode === 'student'
                  ? 'bg-[var(--color-navy)] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[var(--color-navy)]'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setMode('instructor')}
              aria-pressed={state.mode === 'instructor'}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                state.mode === 'instructor'
                  ? 'bg-[var(--color-navy)] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[var(--color-navy)]'
              }`}
            >
              Instructor
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
