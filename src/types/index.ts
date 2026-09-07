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
// Module 3 - Evaluation Alignment Debugger
// ---------------------------------------------------------------------------

/** Canonical reasoning chain node types, in the order they should logically connect. */
export type AlignmentNodeType =
  | 'OBJECTIVE'
  | 'QUESTION'
  | 'INDICATOR'
  | 'DATA_SOURCE'
  | 'INSTRUMENT'
  | 'ANALYSIS'
  | 'DECISION';

/** A single node in the evaluation chain (e.g. the stated objective, the indicator, etc.). */
export interface AlignmentNode {
  id: string;
  type: AlignmentNodeType;
  label: string;
  statement: string;
}

/** A connection between two adjacent nodes in the chain that can be inspected for coherence. */
export interface AlignmentLink {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label: string;
}

/** The kind of conceptual mismatch a misaligned link can represent. */
export type AlignmentIssueCategory =
  | 'OBJECTIVE_QUESTION'
  | 'QUESTION_INDICATOR'
  | 'INDICATOR_DATA_SOURCE'
  | 'INDICATOR_INSTRUMENT'
  | 'INSTRUMENT_CLAIM'
  | 'ANALYSIS_DECISION';

export interface AlignmentCategoryDefinition {
  id: AlignmentIssueCategory;
  label: string;
  labelTh: string;
  description: string;
}

export interface AlignmentCorrectionOption {
  id: string;
  label: string;
}

/** The single deliberately-planted misalignment within a scenario's chain. */
export interface AlignmentIssue {
  linkId: string;
  category: AlignmentIssueCategory;
  correctionOptions: AlignmentCorrectionOption[];
  correctCorrectionId: string;
  expectedReasoning: string;
  acceptableAlternativeReasoning?: string;
  commonMisconception?: string;
  facilitationPrompt: string;
  debriefQuestion: string;
  a4Linkage: string;
}

export interface AlignmentScenario {
  id: string;
  title: string;
  simulatedDataLabel: string;
  context: string;
  nodes: AlignmentNode[];
  links: AlignmentLink[];
  issue: AlignmentIssue;
}

export interface Module3Submission {
  scenarioId: string;
  selectedLinkId: string | null;
  selectedCategory: AlignmentIssueCategory | null;
  selectedCorrectionId: string | null;
  justification: string;
}

/** Structured, non-generic feedback levels for the Alignment Debugger. */
export type AlignmentFeedbackLevel =
  | 'ALIGNMENT_CONFIRMED'
  | 'PARTIAL_ALIGNMENT'
  | 'MISALIGNMENT_DETECTED'
  | 'RECONSIDER_LINK';

export interface AlignmentEvaluation {
  linkCorrect: boolean;
  categoryCorrect: boolean;
  correctionCorrect: boolean;
  level: AlignmentFeedbackLevel;
}

// ---------------------------------------------------------------------------
// Module 4 - K-A-P Instrument Studio
// ---------------------------------------------------------------------------

export type KAPConstruct = 'KNOWLEDGE' | 'ATTITUDE' | 'PRACTICE';

export interface KAPConstructDefinition {
  id: KAPConstruct;
  label: string;
  labelTh: string;
  description: string;
  guardrail: string;
  exampleIndicator: string;
  recommendedResponseFormats: ResponseFormat[];
}

/** An example indicator statement offered as reference material for a construct (not graded). */
export interface KAPIndicator {
  construct: KAPConstruct;
  statement: string;
}

export type ResponseFormat =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SELECTED_RESPONSE'
  | 'LIKERT_AGREEMENT'
  | 'EVALUATIVE_SCALE'
  | 'FREQUENCY'
  | 'OCCURRENCE'
  | 'BEHAVIOR_SPECIFIC';

export interface ResponseFormatDefinition {
  id: ResponseFormat;
  label: string;
  labelTh: string;
}

/** An example item offered for instructor reference, illustrating strong vs. weak phrasing. */
export interface KAPItem {
  construct: KAPConstruct;
  draftItem: string;
  responseFormat: ResponseFormat;
}

/** A student's in-progress draft for one K/A/P construct workspace. */
export interface InstrumentCandidate {
  construct: KAPConstruct;
  operationalMeaning: string;
  indicator: string;
  draftItem: string;
  responseFormat: ResponseFormat | null;
  rationale: string;
}

export type Module4Submission = InstrumentCandidate;

export interface InstrumentDraft {
  items: Module4Submission[];
}

/** Deterministic, rule-based feedback levels for a K/A/P draft item. */
export type InstrumentFeedbackLevel =
  | 'CONSTRUCT_MATCH'
  | 'POSSIBLE_CONSTRUCT_MISMATCH'
  | 'INDICATOR_ITEM_MISALIGNMENT'
  | 'RESPONSE_FORMAT_CONCERN'
  | 'READY_FOR_EXPERT_REVIEW';

export interface InstrumentFeedback {
  level: InstrumentFeedbackLevel;
  messages: string[];
}

// ---------------------------------------------------------------------------
// Module 5 - IOC Quality Lab
// ---------------------------------------------------------------------------

/** A single expert's rating for an item: -1 (not congruent), 0 (unsure), 1 (congruent). */
export type IOCExpertRating = -1 | 0 | 1;

/** One simulated IOC exercise item with a fixed panel of expert ratings. */
export interface IOCItem {
  id: string;
  statement: string;
  sourceLabel: string;
  expertRatings: IOCExpertRating[];
}

/** The learner-facing decision after interpreting an item's IOC value. */
export type IOCDecision = 'KEEP' | 'REVISE' | 'REMOVE_RECONSIDER';

/** Deterministic result of applying the IOC formula to an item's expert ratings. */
export interface IOCResult {
  sumR: number;
  n: number;
  ioc: number;
  meetsThreshold: boolean;
}

export interface IOCScenario {
  id: string;
  title: string;
  simulatedDataLabel: string;
  context: string;
  item: IOCItem;
  expectedSumR: number;
  expectedIOC: number;
  expectedDecision: IOCDecision;
  expectedReasoning: string;
  commonMisconception?: string;
  teachingPrompt: string;
  a4Linkage: string;
}

/** A learner's in-progress work on one IOC scenario. */
export interface Module5Submission {
  scenarioId: string;
  enteredSumR: string;
  enteredIOC: string;
  decision: IOCDecision | null;
  reasoning: string;
}

/** Structured feedback levels distinguishing calculation accuracy from interpretation. */
export type IOCFeedbackLevel =
  | 'CALCULATION_CORRECT'
  | 'CALCULATION_RECHECK'
  | 'INTERPRETATION_CONFIRMED'
  | 'INTERPRETATION_RECHECK'
  | 'READY_FOR_REVISION_DECISION';

export interface IOCFeedback {
  level: IOCFeedbackLevel;
  messages: string[];
}

// ---------------------------------------------------------------------------
// Module 6 - Bias & Ethics Simulator
// ---------------------------------------------------------------------------

export type BiasType = 'RECALL_BIAS' | 'SOCIAL_DESIRABILITY_BIAS' | 'NONE_IDENTIFIED';

export interface BiasRisk {
  id: BiasType;
  label: string;
  labelTh: string;
  description: string;
}

export type EthicsRiskType =
  | 'PRIVACY_CONFIDENTIALITY'
  | 'STIGMATIZATION_RISK'
  | 'DATA_MINIMIZATION'
  | 'NONE_IDENTIFIED';

export interface EthicsRisk {
  id: EthicsRiskType;
  label: string;
  labelTh: string;
  description: string;
}

export interface MitigationAction {
  id: string;
  label: string;
}

export interface DataCollectionPlan {
  description: string;
}

export interface EthicsScenario {
  id: string;
  title: string;
  simulatedDataLabel: string;
  context: string;
  originalPlan: DataCollectionPlan;
  expectedBias: BiasType;
  expectedEthicsRisk: EthicsRiskType;
  acceptableMitigationIds: string[];
  mitigationOptions: MitigationAction[];
  expectedReasoning: string;
  acceptableAlternativeReasoning?: string;
  commonMisconception?: string;
  discussionPrompt: string;
  debriefQuestion: string;
  clo5Linkage: string;
  a4Linkage: string;
}

/** The learner's reasoning + choices about one bias/ethics scenario. */
export interface EthicsDecision {
  scenarioId: string;
  selectedBias: BiasType | null;
  selectedEthicsRisk: EthicsRiskType | null;
  whyItMatters: string;
  selectedMitigationId: string | null;
  submitted: boolean;
}

export type Module6Submission = EthicsDecision;

/** Structured, non-binary feedback levels for the Bias & Ethics Simulator. */
export type EthicsFeedbackLevel =
  | 'BIAS_IDENTIFIED'
  | 'ETHICAL_RISK_IDENTIFIED'
  | 'MITIGATION_PARTIAL'
  | 'PLAN_IMPROVED'
  | 'RECONSIDER_DATA_COLLECTION';

export interface EthicsFeedback {
  level: EthicsFeedbackLevel;
  messages: string[];
}

// ---------------------------------------------------------------------------
// Module 7 - Weighted Rubric Sandbox
// ---------------------------------------------------------------------------

export interface RubricLevel {
  level: number;
  label: string;
  labelTh: string;
}

export interface RubricDimension {
  id: string;
  label: string;
  labelTh: string;
  description: string;
  defaultWeight: number;
  maxLevel: number;
}

/** A learner-adjustable weight assignment for one rubric dimension. */
export interface RubricWeight {
  dimensionId: string;
  weight: number;
}

/** A learner-selected obtained level for one rubric dimension. */
export interface RubricScore {
  dimensionId: string;
  obtainedLevel: number;
}

/** Deterministic per-dimension and total calculation result for the rubric sandbox. */
export interface RubricResult {
  totalWeight: number;
  totalWeightValid: boolean;
  totalScore: number;
  perDimension: {
    dimensionId: string;
    normalizedProportion: number;
    weightedContribution: number;
  }[];
}

/** A learner's in-progress rubric sandbox state: weights + obtained levels per dimension. */
export interface Module7Submission {
  weights: RubricWeight[];
  scores: RubricScore[];
}

// ---------------------------------------------------------------------------
// Session state persisted to storage
// ---------------------------------------------------------------------------

/** Bump when the shape of SessionState changes in a way that requires migration. */
export const SESSION_SCHEMA_VERSION = 3;

export interface SessionState {
  schemaVersion: number;
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
  module3: {
    status: ActivityStatus;
    submissions: Module3Submission[];
  };
  module4: {
    status: ActivityStatus;
    submissions: Module4Submission[];
  };
  module5: {
    status: ActivityStatus;
    submissions: Module5Submission[];
  };
  module6: {
    status: ActivityStatus;
    submissions: Module6Submission[];
  };
  module7: {
    status: ActivityStatus;
    submissions: Module7Submission[];
  };
}
