import type {
  ActivityStatus,
  AlignmentIssueCategory,
  BiasType,
  EthicsRiskType,
  EvidenceCategory,
  FrameworkId,
  IOCDecision,
  KAPConstruct,
  Module1Submission,
  Module2Submission,
  Module3Submission,
  Module4Submission,
  Module5Submission,
  Module6Submission,
  Module7Submission,
  ResponseFormat,
  SessionState,
  StepId,
  UserMode,
} from '../types';
import { SESSION_SCHEMA_VERSION } from '../types';

const STORAGE_KEY = 'hed3505-session-state';

export const defaultSessionState: SessionState = {
  schemaVersion: SESSION_SCHEMA_VERSION,
  mode: 'student',
  currentStep: 'case-launch',
  hasEnteredLab: false,
  module1: { status: 'INITIAL', submissions: [] },
  module2: { status: 'INITIAL', submissions: [] },
  module3: { status: 'INITIAL', submissions: [] },
  module4: { status: 'INITIAL', submissions: [] },
  module5: { status: 'INITIAL', submissions: [] },
  module6: { status: 'INITIAL', submissions: [] },
  module7: { status: 'INITIAL', submissions: [] },
};

const evidenceCategories: EvidenceCategory[] = ['PROCESS', 'OUTPUT', 'OUTCOME', 'IMPACT'];
const frameworkIds: FrameworkId[] = ['CIPP', 'RE-AIM'];
const alignmentIssueCategories: AlignmentIssueCategory[] = [
  'OBJECTIVE_QUESTION',
  'QUESTION_INDICATOR',
  'INDICATOR_DATA_SOURCE',
  'INDICATOR_INSTRUMENT',
  'INSTRUMENT_CLAIM',
  'ANALYSIS_DECISION',
];
const kapConstructIds: KAPConstruct[] = ['KNOWLEDGE', 'ATTITUDE', 'PRACTICE'];
const responseFormatIds: ResponseFormat[] = [
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'SELECTED_RESPONSE',
  'LIKERT_AGREEMENT',
  'EVALUATIVE_SCALE',
  'FREQUENCY',
  'OCCURRENCE',
  'BEHAVIOR_SPECIFIC',
];
const iocDecisions: IOCDecision[] = ['KEEP', 'REVISE', 'REMOVE_RECONSIDER'];
const biasTypes: BiasType[] = ['RECALL_BIAS', 'SOCIAL_DESIRABILITY_BIAS', 'NONE_IDENTIFIED'];
const ethicsRiskTypes: EthicsRiskType[] = [
  'PRIVACY_CONFIDENTIALITY',
  'STIGMATIZATION_RISK',
  'DATA_MINIMIZATION',
  'NONE_IDENTIFIED',
];

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

function isValidModule3Submission(value: unknown): value is Module3Submission {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<Module3Submission>;
  return (
    typeof s.scenarioId === 'string' &&
    (s.selectedLinkId === null || typeof s.selectedLinkId === 'string') &&
    (s.selectedCategory === null || alignmentIssueCategories.includes(s.selectedCategory as AlignmentIssueCategory)) &&
    (s.selectedCorrectionId === null || typeof s.selectedCorrectionId === 'string') &&
    typeof s.justification === 'string'
  );
}

function isValidModule4Submission(value: unknown): value is Module4Submission {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<Module4Submission>;
  return (
    typeof s.construct === 'string' &&
    kapConstructIds.includes(s.construct as KAPConstruct) &&
    typeof s.operationalMeaning === 'string' &&
    typeof s.indicator === 'string' &&
    typeof s.draftItem === 'string' &&
    (s.responseFormat === null || responseFormatIds.includes(s.responseFormat as ResponseFormat)) &&
    typeof s.rationale === 'string'
  );
}

function isValidModule5Submission(value: unknown): value is Module5Submission {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<Module5Submission>;
  return (
    typeof s.scenarioId === 'string' &&
    typeof s.enteredSumR === 'string' &&
    typeof s.enteredIOC === 'string' &&
    (s.decision === null || iocDecisions.includes(s.decision as IOCDecision)) &&
    typeof s.reasoning === 'string'
  );
}

function isValidModule6Submission(value: unknown): value is Module6Submission {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<Module6Submission>;
  return (
    typeof s.scenarioId === 'string' &&
    (s.selectedBias === null || biasTypes.includes(s.selectedBias as BiasType)) &&
    (s.selectedEthicsRisk === null || ethicsRiskTypes.includes(s.selectedEthicsRisk as EthicsRiskType)) &&
    typeof s.whyItMatters === 'string' &&
    (s.selectedMitigationId === null || typeof s.selectedMitigationId === 'string') &&
    typeof s.submitted === 'boolean'
  );
}

function isValidRubricWeight(value: unknown): value is { dimensionId: string; weight: number } {
  if (typeof value !== 'object' || value === null) return false;
  const w = value as { dimensionId?: unknown; weight?: unknown };
  return typeof w.dimensionId === 'string' && typeof w.weight === 'number' && Number.isFinite(w.weight);
}

function isValidRubricScore(value: unknown): value is { dimensionId: string; obtainedLevel: number } {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as { dimensionId?: unknown; obtainedLevel?: unknown };
  return typeof s.dimensionId === 'string' && typeof s.obtainedLevel === 'number' && Number.isFinite(s.obtainedLevel);
}

function isValidModule7Submission(value: unknown): value is Module7Submission {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<Module7Submission>;
  return (
    Array.isArray(s.weights) &&
    s.weights.every(isValidRubricWeight) &&
    Array.isArray(s.scores) &&
    s.scores.every(isValidRubricScore)
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

/**
 * Loads persisted session state from sessionStorage, falling back to defaults.
 *
 * If the stored schema version does not match the current version, the persisted
 * state is discarded entirely rather than partially merged - this avoids silently
 * trusting a shape the app no longer understands (e.g. after adding Modules 3-4).
 */
export function loadSessionState(): SessionState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSessionState;
    const json: unknown = JSON.parse(raw);
    if (typeof json !== 'object' || json === null) return defaultSessionState;
    const parsed = json as Partial<SessionState>;

    if (parsed.schemaVersion !== SESSION_SCHEMA_VERSION) {
      return defaultSessionState;
    }

    const mode = typeof parsed.mode === 'string' && isValidMode(parsed.mode) ? parsed.mode : defaultSessionState.mode;
    const currentStep =
      typeof parsed.currentStep === 'string' && isValidStepId(parsed.currentStep)
        ? parsed.currentStep
        : defaultSessionState.currentStep;
    const hasEnteredLab =
      typeof parsed.hasEnteredLab === 'boolean' ? parsed.hasEnteredLab : defaultSessionState.hasEnteredLab;

    return {
      schemaVersion: SESSION_SCHEMA_VERSION,
      mode,
      currentStep,
      hasEnteredLab,
      module1: readModuleSection(parsed.module1, isValidModule1Submission, defaultSessionState.module1),
      module2: readModuleSection(parsed.module2, isValidModule2Submission, defaultSessionState.module2),
      module3: readModuleSection(parsed.module3, isValidModule3Submission, defaultSessionState.module3),
      module4: readModuleSection(parsed.module4, isValidModule4Submission, defaultSessionState.module4),
      module5: readModuleSection(parsed.module5, isValidModule5Submission, defaultSessionState.module5),
      module6: readModuleSection(parsed.module6, isValidModule6Submission, defaultSessionState.module6),
      module7: readModuleSection(parsed.module7, isValidModule7Submission, defaultSessionState.module7),
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
