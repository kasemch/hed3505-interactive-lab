import { IOC_THRESHOLD } from '../data/module5Data';
import type { IOCFeedback, IOCFeedbackLevel, IOCItem, IOCResult, IOCScenario, Module5Submission } from '../types';

/**
 * Deterministically calculates ΣR / N for an IOC item. Preserves the raw division result
 * internally (no premature rounding) so comparisons against the threshold stay accurate;
 * callers should round only for display. Does not multiply by 100.
 */
export function calculateIOC(item: IOCItem): IOCResult {
  const sumR = item.expertRatings.reduce((total: number, r) => total + r, 0);
  const n = item.expertRatings.length;
  const ioc = n === 0 ? 0 : sumR / n;
  return { sumR, n, ioc, meetsThreshold: ioc >= IOC_THRESHOLD };
}

/** Rounds an IOC value for display only, without mutating the underlying raw value used for comparisons. */
export function formatIOC(ioc: number): string {
  return ioc.toFixed(2);
}

const NUMERIC_TOLERANCE = 0.005;

function parseNumeric(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function isCalculationCorrect(scenario: IOCScenario, submission: Module5Submission): boolean {
  const result = calculateIOC(scenario.item);
  const enteredSumR = parseNumeric(submission.enteredSumR);
  const enteredIOC = parseNumeric(submission.enteredIOC);
  const sumRCorrect = enteredSumR !== null && enteredSumR === result.sumR;
  const iocCorrect = enteredIOC !== null && Math.abs(enteredIOC - result.ioc) <= NUMERIC_TOLERANCE;
  return sumRCorrect && iocCorrect;
}

/** Step-level feedback for the calculation stage only (ΣR and IOC = ΣR/N), before a decision is required. */
export function checkCalculation(scenario: IOCScenario, submission: Module5Submission): IOCFeedback {
  const result = calculateIOC(scenario.item);
  if (isCalculationCorrect(scenario, submission)) {
    return { level: 'CALCULATION_CORRECT', messages: ['ΣR และ IOC ที่คำนวณได้ถูกต้องตามข้อมูลคะแนนผู้เชี่ยวชาญ'] };
  }
  return {
    level: 'CALCULATION_RECHECK',
    messages: [`ลองคำนวณใหม่อีกครั้ง: ΣR = ผลรวมคะแนนผู้เชี่ยวชาญทั้งหมด แล้วหาร IOC = ΣR / N (N = ${result.n})`],
  };
}

/** Step-level feedback for the interpretation/decision stage, assuming calculation is correct. */
export function checkInterpretation(scenario: IOCScenario, submission: Module5Submission): IOCFeedback {
  const result = calculateIOC(scenario.item);
  const decisionCorrect = submission.decision === scenario.expectedDecision;
  if (decisionCorrect) {
    return {
      level: 'INTERPRETATION_CONFIRMED',
      messages: [
        `การตัดสินใจสอดคล้องกับค่า IOC = ${formatIOC(result.ioc)} เทียบกับเกณฑ์ IOC ≥ ${IOC_THRESHOLD.toFixed(2)}`,
      ],
    };
  }
  return {
    level: 'INTERPRETATION_RECHECK',
    messages: [
      `การคำนวณถูกต้อง (IOC = ${formatIOC(result.ioc)}) แต่ลองทบทวนการตัดสินใจอีกครั้งโดยเทียบกับเกณฑ์ IOC ≥ ${IOC_THRESHOLD.toFixed(
        2,
      )} และลักษณะของข้อคำถาม`,
    ],
  };
}

/**
 * Evaluates a learner's full Module 5 submission (after calculation + interpretation + reasoning),
 * returning the single overall feedback level for display after submission.
 */
export function evaluateIOCSubmission(scenario: IOCScenario, submission: Module5Submission): IOCFeedback {
  const calculation = checkCalculation(scenario, submission);
  if (calculation.level === 'CALCULATION_RECHECK') return calculation;

  const interpretation = checkInterpretation(scenario, submission);
  if (interpretation.level === 'INTERPRETATION_RECHECK') return interpretation;

  const level: IOCFeedbackLevel = 'READY_FOR_REVISION_DECISION';
  return {
    level,
    messages: [
      'การคำนวณและการตีความสอดคล้องกับหลักฐานที่มี',
      'IOC เป็นหลักฐานส่วนหนึ่งของความตรงเชิงเนื้อหา ไม่ใช่การยืนยันคุณภาพเครื่องมือทุกด้าน',
    ],
  };
}

/** Whether a Module 5 submission has every field required to submit. */
export function isModule5SubmissionComplete(submission: Module5Submission): boolean {
  return (
    submission.enteredSumR.trim().length > 0 &&
    submission.enteredIOC.trim().length > 0 &&
    submission.decision !== null &&
    submission.reasoning.trim().length > 0
  );
}
