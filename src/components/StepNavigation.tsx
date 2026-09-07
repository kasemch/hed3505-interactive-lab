import { steps } from '../data/steps';
import { useSession } from '../context/SessionContext';
import type { SessionState, StepId } from '../types';

type NavStatus = 'completed' | 'current' | 'available' | 'locked';

function isModuleComplete(state: SessionState, step: StepId): boolean {
  switch (step) {
    case 'case-launch':
      return state.hasEnteredLab;
    case 'module-1':
      return state.module1.status === 'SUBMITTED' || state.module1.status === 'REVIEW';
    case 'module-2':
      return state.module2.status === 'SUBMITTED' || state.module2.status === 'REVIEW';
    case 'module-3':
      return state.module3.status === 'SUBMITTED' || state.module3.status === 'REVIEW';
    case 'module-4':
      return state.module4.status === 'SUBMITTED' || state.module4.status === 'REVIEW';
    case 'module-5':
      return state.module5.status === 'SUBMITTED' || state.module5.status === 'REVIEW';
    case 'module-6':
      return state.module6.status === 'SUBMITTED' || state.module6.status === 'REVIEW';
    case 'module-7':
      return state.module7.status === 'SUBMITTED' || state.module7.status === 'REVIEW';
    default:
      return false;
  }
}

function navIcon(status: NavStatus): string {
  switch (status) {
    case 'completed':
      return '✓';
    case 'current':
      return '●';
    case 'available':
      return '○';
    case 'locked':
      return '🔒';
  }
}

const NAV_STATUS_LABEL: Record<NavStatus, string> = {
  completed: 'เสร็จสิ้นแล้ว',
  current: 'กำลังทำอยู่',
  available: 'พร้อมเริ่มทำ',
  locked: 'ยังไม่เปิดให้ใช้งาน',
};

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
          const status: NavStatus = isActive
            ? 'current'
            : isDisabled
              ? 'locked'
              : isModuleComplete(state, step.id)
                ? 'completed'
                : 'available';
          return (
            <li key={step.id} className="shrink-0">
              <button
                type="button"
                disabled={isDisabled}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => handleSelect(step.id, step.enabled)}
                title={`${step.label} — ${NAV_STATUS_LABEL[status]}`}
                aria-label={`${step.label}, ${NAV_STATUS_LABEL[status]}`}
                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] ${
                  status === 'current'
                    ? 'border-white bg-[var(--color-teal)] text-white'
                    : status === 'locked'
                      ? 'cursor-not-allowed border-transparent text-white/40'
                      : status === 'completed'
                        ? 'border-white/40 text-white/90 hover:bg-white/10'
                        : 'border-dashed border-white/30 text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    status === 'current' ? 'bg-white text-[var(--color-navy)]' : 'bg-white/20'
                  }`}
                >
                  {status === 'completed' || status === 'locked' ? navIcon(status) : step.order}
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

