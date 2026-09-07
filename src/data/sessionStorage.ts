import type {
  ActivityStatus,
  EvidenceCategory,
  FrameworkId,
  Module1Submission,
  Module2Submission,
  SessionState,
  StepId,
  UserMode,
} from '../types';

const STORAGE_KEY = 'hed3505-session-state';

export const defaultSessionState: SessionState = {
  mode: 'student',
  currentStep: 'case-launch',
  hasEnteredLab: false,
  module1: { status: 'INITIAL', submissions: [] },
  module2: { status: 'INITIAL', submissions: [] },
};

const evidenceCategories: EvidenceCategory[] = ['PROCESS', 'OUTPUT', 'OUTCOME', 'IMPACT'];
const frameworkIds: FrameworkId[] = ['CIPP', 'RE-AIM'];

function isValidStatus(status: unknown): status is ActivityStatus {
  return status === 'INITIAL' || status === 'IN_PROGRESS' || status === 'SUBMITTED' || status === 'REVIEW';
}

function isValidModule1Submission(value: unknown): value is Module1Submission {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<Module1Submission>;
  return (
    typeof s.cardId === 'string' &&
    (s.chosenCategory === null || evidenceCategories.includes(s.chosenCategory as EvidenceCategory)) &&
    (s.chosenReasoningId === null || typeof s.chosenReasoningId === 'string')
  );
}

function isValidModule2Submission(value: unknown): value is Module2Submission {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<Module2Submission>;
  return (
    typeof s.situationId === 'string' &&
    (s.chosenFrameworkId === null || frameworkIds.includes(s.chosenFrameworkId as FrameworkId)) &&
    typeof s.justification === 'string'
  );
}

interface ModuleSection<T> {
  status: ActivityStatus;
  submissions: T[];
}

/** Validates a persisted module section (status + submissions array), falling back to a default on any invalid data. */
function readModuleSection<T>(
  raw: unknown,
  isValidSubmission: (value: unknown) => value is T,
  fallback: ModuleSection<T>,
): ModuleSection<T> {
  if (typeof raw !== 'object' || raw === null) return fallback;
  const section = raw as Partial<ModuleSection<unknown>>;
  const status = isValidStatus(section.status) ? section.status : fallback.status;
  const submissions =
    Array.isArray(section.submissions) && section.submissions.every(isValidSubmission)
      ? (section.submissions as T[])
      : fallback.submissions;
  return { status, submissions };
}

/** Loads persisted session state from sessionStorage, falling back to defaults. */
export function loadSessionState(): SessionState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSessionState;
    const json: unknown = JSON.parse(raw);
    if (typeof json !== 'object' || json === null) return defaultSessionState;
    const parsed = json as Partial<SessionState>;

    const mode = typeof parsed.mode === 'string' && isValidMode(parsed.mode) ? parsed.mode : defaultSessionState.mode;
    const currentStep =
      typeof parsed.currentStep === 'string' && isValidStepId(parsed.currentStep)
        ? parsed.currentStep
        : defaultSessionState.currentStep;
    const hasEnteredLab =
      typeof parsed.hasEnteredLab === 'boolean' ? parsed.hasEnteredLab : defaultSessionState.hasEnteredLab;

    return {
      mode,
      currentStep,
      hasEnteredLab,
      module1: readModuleSection(parsed.module1, isValidModule1Submission, defaultSessionState.module1),
      module2: readModuleSection(parsed.module2, isValidModule2Submission, defaultSessionState.module2),
    };
  } catch {
    return defaultSessionState;
  }
}

export function saveSessionState(state: SessionState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage may be unavailable (e.g. private browsing); fail silently.
  }
}

export function isValidMode(mode: string): mode is UserMode {
  return mode === 'student' || mode === 'instructor';
}

export function isValidStepId(step: string): step is StepId {
  return [
    'case-launch',
    'module-1',
    'module-2',
    'module-3',
    'module-4',
    'module-5',
    'module-6',
    'module-7',
    'module-8',
  ].includes(step);
}
