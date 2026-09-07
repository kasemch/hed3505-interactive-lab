import { steps } from '../data/steps';
import { useSession } from '../context/SessionContext';

export function Footer() {
  const { state } = useSession();
  const currentStep = steps.find((s) => s.id === state.currentStep);

  const progressLabel = () => {
    if (state.currentStep === 'module-1') return state.module1.status;
    if (state.currentStep === 'module-2') return state.module2.status;
    if (state.currentStep === 'module-3') return state.module3.status;
    if (state.currentStep === 'module-4') return state.module4.status;
    return '—';
  };

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Current module: <strong className="text-[var(--color-navy)]">{currentStep?.label ?? '—'}</strong>
        </span>
        <span>
          Progress: <strong>{progressLabel()}</strong>
        </span>
        <span className="rounded-full bg-[var(--color-lightgray)] px-2.5 py-1 font-semibold uppercase tracking-wide text-[var(--color-darkgray)]">
          Educational Prototype
        </span>
      </div>
    </footer>
  );
}
