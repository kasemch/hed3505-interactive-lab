// Domain type definitions for the HED3505 Interactive Learning System.
// Keep these interfaces framework-agnostic so data and logic can be
// reused across components without coupling to the UI layer.

/** Application-wide user mode. Local only, no authentication. */
export type UserMode = 'student' | 'instructor';

/** The 8 steps of the learning journey. Only Case Launch + Modules 1-2 are active in this build. */
export type StepId =
  | 'case-launch'
  | 'module-1'
  | 'module-2'
  | 'module-3'
  | 'module-4'
  | 'module-5'
  | 'module-6'
  | 'module-7'
  | 'module-8';

export interface StepDefinition {
  id: StepId;
  order: number;
  label: string;
  shortLabel: string;
  enabled: boolean;
}

/** Generic lifecycle used to drive feedback UI across modules. */
export type ActivityStatus = 'INITIAL' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEW';

// ---------------------------------------------------------------------------
// Case Scenario (Phase C / G)
// ---------------------------------------------------------------------------

export interface Stakeholder {
  id: string;
  role: string;
  description: string;
}

export interface CaseActivity {
  id: string;
  title: string;
  description: string;
}

export interface CaseScenario {
  title: string;
  simulatedDataLabel: string;
  context: string;
  objectives: string[];
  activities: CaseActivity[];
  stakeholders: Stakeholder[];
  coreQuestion: string;
  entryCallToAction: string;
}

// ---------------------------------------------------------------------------
// Module 1 - Evidence Classification Lab (Phase D / G)
// ---------------------------------------------------------------------------

export type EvidenceCategory = 'PROCESS' | 'OUTPUT' | 'OUTCOME' | 'IMPACT';

export interface ReasoningOption {
  id: string;
  label: string;
}

export interface EvidenceCard {
  id: string;
  statement: string;
  sourceLabel: string;
  correctCategory: EvidenceCategory;
  expectedReasoningId: string;
  reasoningExplanation: string;
  commonMisconception?: string;
}

export interface EvidenceCategoryDefinition {
  id: EvidenceCategory;
  label: string;
  labelTh: string;
  description: string;
}

export interface Module1Submission {
  cardId: string;
  chosenCategory: EvidenceCategory | null;
  chosenReasoningId: string | null;
}

// ---------------------------------------------------------------------------
// Module 2 - CIPP-RE-AIM Framework Simulator (Phase E / G)
// ---------------------------------------------------------------------------

export type FrameworkId = 'CIPP' | 'RE-AIM';

export interface FrameworkComponent {
  code: string;
  label: string;
  description: string;
}

export interface FrameworkDefinition {
  id: FrameworkId;
  name: string;
  fullName: string;
  components: FrameworkComponent[];
  guardrail: string;
}

export interface EvaluationSituation {
  id: string;
  scenario: string;
  evalQuestion: string;
  correctFrameworkId: FrameworkId;
  expectedReasoning: string;
  commonMisconception?: string;
  debriefPrompt: string;
}

export interface Module2Submission {
  situationId: string;
  chosenFrameworkId: FrameworkId | null;
  justification: string;
}

// ---------------------------------------------------------------------------
// Session state persisted to storage
// ---------------------------------------------------------------------------

export interface SessionState {
  mode: UserMode;
  currentStep: StepId;
  hasEnteredLab: boolean;
  module1: {
    status: ActivityStatus;
    submissions: Module1Submission[];
  };
  module2: {
    status: ActivityStatus;
    submissions: Module2Submission[];
  };
}
