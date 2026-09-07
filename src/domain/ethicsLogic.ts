import type { EthicsDecision, EthicsFeedback, EthicsScenario } from '../types';

/**
 * Deterministically evaluates a learner's bias/ethics submission against a scenario's expected
 * bias, ethics risk and set of acceptable mitigations. Ethics reasoning is nuanced, so multiple
 * mitigation options may be acceptable - this is a rule-based check on identification, not a
 * binary "correct answer" judgment on the open-ended reasoning text.
 */
export function evaluateEthicsSubmission(scenario: EthicsScenario, decision: EthicsDecision): EthicsFeedback {
  const biasCorrect = decision.selectedBias === scenario.expectedBias;
  const ethicsRiskCorrect = decision.selectedEthicsRisk === scenario.expectedEthicsRisk;
  const mitigationAcceptable =
    decision.selectedMitigationId !== null && scenario.acceptableMitigationIds.includes(decision.selectedMitigationId);

  if (!biasCorrect && !ethicsRiskCorrect) {
    return {
      level: 'RECONSIDER_DATA_COLLECTION',
      messages: [
        'ลองทบทวนสถานการณ์อีกครั้งตั้งแต่ความต้องการข้อมูล วิธีเก็บข้อมูล จนถึงความเสี่ยงที่อาจเกิดขึ้นกับผู้ตอบ',
      ],
    };
  }

  if ((biasCorrect || ethicsRiskCorrect) && !mitigationAcceptable) {
    return {
      level: 'MITIGATION_PARTIAL',
      messages: [
        'คุณระบุอคติหรือความเสี่ยงเชิงจริยธรรมได้ถูกต้องบางส่วน แต่แนวทางแก้ไขที่เลือกยังไม่สอดคล้องกับปัญหาที่ระบุ ลองทบทวนอีกครั้ง',
      ],
    };
  }

  if (biasCorrect && ethicsRiskCorrect && mitigationAcceptable) {
    return {
      level: 'PLAN_IMPROVED',
      messages: [
        'แผนเก็บข้อมูลที่ปรับปรุงแล้วสอดคล้องกับอคติและความเสี่ยงเชิงจริยธรรมที่ระบุ',
        'การเก็บข้อมูลเท่าที่จำเป็นต่อวัตถุประสงค์การประเมินยังคงเป็นหลักการสำคัญที่ควรพิจารณาต่อไป',
      ],
    };
  }

  if (biasCorrect) {
    return {
      level: 'BIAS_IDENTIFIED',
      messages: ['คุณระบุลักษณะของอคติได้ถูกต้อง ลองพิจารณาความเสี่ยงเชิงจริยธรรมที่อาจเกิดขึ้นร่วมด้วย'],
    };
  }

  return {
    level: 'ETHICAL_RISK_IDENTIFIED',
    messages: ['คุณระบุความเสี่ยงเชิงจริยธรรมได้ถูกต้อง ลองพิจารณาลักษณะของอคติในการเก็บข้อมูลที่อาจเกิดขึ้นร่วมด้วย'],
  };
}

/** Whether a Module 6 decision has every field required to submit. */
export function isEthicsDecisionComplete(decision: EthicsDecision): boolean {
  return (
    decision.selectedBias !== null &&
    decision.selectedEthicsRisk !== null &&
    decision.whyItMatters.trim().length > 0 &&
    decision.selectedMitigationId !== null
  );
}
