import type { InstrumentCandidate, InstrumentFeedback, KAPConstructDefinition } from '../types';

// Rule-based, transparent pattern checks (no generative AI grading).
// Each regex targets a specific conceptual collapse called out in the course brief.

/** Self-rating phrasing ("ฉันคิดว่าฉันมีความรู้...") measures perceived confidence, not actual knowledge. */
const SELF_RATING_KNOWLEDGE_PATTERN = /ฉัน(คิดว่า|รู้สึกว่า|มั่นใจว่า|เชื่อว่า).{0,20}(ความรู้|รู้เรื่อง|เข้าใจ)/;

/** Intention/plan phrasing ("ฉันตั้งใจจะ...") measures intention, not performed behavior. */
const INTENTION_PATTERN = /(ตั้งใจ(จะ)?|วางแผนจะ|มีแผนจะ|อยาก(จะ)?|คาดว่าจะ)/;

/** Factual-recall phrasing in an item meant to measure attitude signals a knowledge question instead. */
const FACTUAL_RECALL_PATTERN = /(คืออะไร|หมายถึง|ข้อใดถูกต้อง|ข้อใดคือ|ข้อใดไม่ใช่)/;

const MIN_MEANINGFUL_LENGTH = 8;

/**
 * Runs deterministic, rule-based checks on a K/A/P draft item and returns a
 * transparent feedback level + messages. Intentionally avoids any AI-based
 * grading or claims of psychometric validity.
 */
export function evaluateInstrumentCandidate(
  candidate: InstrumentCandidate,
  constructDef: KAPConstructDefinition,
): InstrumentFeedback {
  const draftItem = candidate.draftItem.trim();
  const indicator = candidate.indicator.trim();

  const messages: string[] = [];

  if (constructDef.id === 'KNOWLEDGE' && SELF_RATING_KNOWLEDGE_PATTERN.test(draftItem)) {
    messages.push(
      'ข้อคำถามนี้ให้ผู้ตอบประเมินความมั่นใจของตนเอง ("คิดว่ารู้มากแค่ไหน") ซึ่งวัดการรับรู้ตนเอง ไม่ใช่ความรู้ที่แท้จริง ' +
        'ลองทบทวนว่าจะออกแบบข้อคำถามที่ตรวจสอบข้อเท็จจริงหรือหลักการได้อย่างไร',
    );
    return { level: 'POSSIBLE_CONSTRUCT_MISMATCH', messages };
  }

  if (constructDef.id === 'PRACTICE' && INTENTION_PATTERN.test(draftItem)) {
    messages.push(
      'POSSIBLE INTENTION–BEHAVIOR MISMATCH: ข้อคำถามนี้ถามถึงความตั้งใจหรือแผนการในอนาคต ' +
        'ซึ่งไม่เท่ากับพฤติกรรมที่ปฏิบัติจริง ลองปรับให้ถามถึงสิ่งที่ทำจริงในช่วงเวลาที่ผ่านมาแทน',
    );
    return { level: 'POSSIBLE_CONSTRUCT_MISMATCH', messages };
  }

  if (constructDef.id === 'ATTITUDE' && FACTUAL_RECALL_PATTERN.test(draftItem)) {
    messages.push(
      'POSSIBLE KNOWLEDGE–ATTITUDE MISMATCH: ข้อคำถามนี้ถามถึงข้อเท็จจริงที่มีคำตอบถูก/ผิด ซึ่งเป็นลักษณะของข้อคำถามความรู้ ' +
        'ลองปรับให้ถามถึงความรู้สึก ความเชื่อ หรือการประเมินค่าแทน',
    );
    return { level: 'POSSIBLE_CONSTRUCT_MISMATCH', messages };
  }

  if (indicator.length < MIN_MEANINGFUL_LENGTH || draftItem.length < MIN_MEANINGFUL_LENGTH) {
    messages.push(
      'ตัวชี้วัดหรือข้อคำถามยังสั้นหรือกว้างเกินไปที่จะตรวจสอบความสอดคล้องกันได้ ลองระบุให้ชัดเจนขึ้นว่าต้องการวัดอะไรและอย่างไร',
    );
    return { level: 'INDICATOR_ITEM_MISALIGNMENT', messages };
  }

  if (candidate.responseFormat && !constructDef.recommendedResponseFormats.includes(candidate.responseFormat)) {
    messages.push(
      `รูปแบบคำตอบที่เลือกไม่ใช่รูปแบบที่แนะนำสำหรับ ${constructDef.labelTh} โดยทั่วไป ` +
        'ลองพิจารณาว่ารูปแบบคำตอบนี้เหมาะกับสิ่งที่ต้องการวัดจริงหรือไม่ (ไม่ได้หมายความว่าใช้ไม่ได้เสมอไป)',
    );
    return { level: 'RESPONSE_FORMAT_CONCERN', messages };
  }

  messages.push(
    'ข้อคำถามนี้สอดคล้องกับนิยามของ ' + constructDef.labelTh + ' ในเบื้องต้น พร้อมสำหรับการทบทวนโดยผู้เชี่ยวชาญ',
  );
  messages.push('ยังไม่ใช่การยืนยันคุณภาพเครื่องมือ');
  return { level: 'READY_FOR_EXPERT_REVIEW', messages };
}

/** Whether a Module 4 candidate has every field required to compute feedback. */
export function isInstrumentCandidateComplete(candidate: InstrumentCandidate): boolean {
  return (
    candidate.operationalMeaning.trim().length > 0 &&
    candidate.indicator.trim().length > 0 &&
    candidate.draftItem.trim().length > 0 &&
    candidate.responseFormat !== null &&
    candidate.rationale.trim().length > 0
  );
}
