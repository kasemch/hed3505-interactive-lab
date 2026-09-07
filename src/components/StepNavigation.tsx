import { steps } from '../data/steps';
import { useSession } from '../context/SessionContext';
import type { StepId } from '../types';

export function StepNavigation() {
  const { state, goToStep } = useSession();

  const handleSelect = (id: StepId, enabled: boolean) => {
    if (!enabled) return;
    if (id !== 'case-launch' && !state.hasEnteredLab) return;
    goToStep(id);
  };

  return (
    <nav aria-label="Module progress" className="border-b border-gray-200 bg-[var(--color-navy)]">
      <ol className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-2 sm:px-4">
        {steps.map((step) => {
          const isActive = state.currentStep === step.id;
          const isDisabled = !step.enabled || (step.id !== 'case-launch' && !state.hasEnteredLab);
          return (
            <li key={step.id} className="shrink-0">
              <button
                type="button"
                disabled={isDisabled}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => handleSelect(step.id, step.enabled)}
                title={step.label}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                  isActive
                    ? 'bg-[var(--color-teal)] text-white'
                    : isDisabled
                      ? 'cursor-not-allowed text-white/40'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    isActive ? 'bg-white text-[var(--color-navy)]' : 'bg-white/20'
                  }`}
                >
                  {step.order}
                </span>
                {step.shortLabel}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
