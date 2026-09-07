import type { KAPConstructDefinition, ResponseFormatDefinition } from '../types';

export const responseFormats: ResponseFormatDefinition[] = [
  { id: 'MULTIPLE_CHOICE', label: 'Multiple Choice', labelTh: 'ตัวเลือกหลายข้อ' },
  { id: 'TRUE_FALSE', label: 'True / False', labelTh: 'ถูก/ผิด' },
  { id: 'SELECTED_RESPONSE', label: 'Selected Response', labelTh: 'เลือกคำตอบที่ถูกต้อง' },
  { id: 'LIKERT_AGREEMENT', label: 'Likert Agreement Scale', labelTh: 'มาตราส่วนระดับความเห็นด้วย' },
  { id: 'EVALUATIVE_SCALE', label: 'Evaluative Scale', labelTh: 'มาตราส่วนเชิงประเมินค่า' },
  { id: 'FREQUENCY', label: 'Frequency', labelTh: 'ความถี่ในการปฏิบัติ' },
  { id: 'OCCURRENCE', label: 'Occurrence (Yes/No, last period)', labelTh: 'การเกิดขึ้นจริง (ทำ/ไม่ทำ ในช่วงเวลาที่ผ่านมา)' },
  { id: 'BEHAVIOR_SPECIFIC', label: 'Behavior-Specific Response', labelTh: 'คำตอบเจาะจงพฤติกรรม' },
];

/**
 * Construct definitions for Module 4. Descriptions and guardrails follow the
 * academic locks in the course brief: Knowledge/Attitude/Practice must not be
 * conceptually collapsed into one another (e.g. intention is not behavior).
 */
export const kapConstructs: KAPConstructDefinition[] = [
  {
    id: 'KNOWLEDGE',
    label: 'Knowledge',
    labelTh: 'ความรู้ (K)',
    description: 'สิ่งที่ผู้เรียนรู้หรือเข้าใจ ตรวจสอบได้ด้วยข้อเท็จจริงหรือหลักการที่ถูกหรือผิด',
    guardrail:
      'ข้อคำถามความรู้ต้องตรวจสอบว่าผู้ตอบรู้ข้อเท็จจริง/หลักการหรือไม่ ไม่ใช่การประเมินตนเองว่า "คิดว่ารู้มากแค่ไหน"',
    exampleIndicator: 'สัดส่วนนักเรียนที่ตอบถูกเรื่องสารอาหารหลัก 5 หมู่',
    recommendedResponseFormats: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SELECTED_RESPONSE'],
  },
  {
    id: 'ATTITUDE',
    label: 'Attitude',
    labelTh: 'ทัศนคติ (A)',
    description: 'ทิศทางเชิงประเมินค่า ความเชื่อ การรับรู้ หรือแนวโน้มเชิงทัศนคติที่มีต่อสิ่งใดสิ่งหนึ่ง',
    guardrail:
      'ข้อคำถามทัศนคติต้องถามถึงความรู้สึกหรือการประเมินค่า ไม่ใช่การถามความรู้ข้อเท็จจริง (ความรู้ ≠ ทัศนคติ)',
    exampleIndicator: 'ระดับความเห็นด้วยของนักเรียนต่อความสำคัญของการรับประทานผักผลไม้',
    recommendedResponseFormats: ['LIKERT_AGREEMENT', 'EVALUATIVE_SCALE'],
  },
  {
    id: 'PRACTICE',
    label: 'Practice / Behavior',
    labelTh: 'การปฏิบัติ/พฤติกรรม (P)',
    description: 'พฤติกรรมที่ปฏิบัติจริงหรือรายงานว่าปฏิบัติจริง ไม่ใช่ความตั้งใจหรือความชอบ',
    guardrail:
      'ข้อคำถามพฤติกรรมต้องถามถึงสิ่งที่ทำจริงในอดีตหรือปัจจุบัน ไม่ใช่สิ่งที่ตั้งใจจะทำในอนาคต (ความตั้งใจ ≠ พฤติกรรม)',
    exampleIndicator: 'ความถี่ที่นักเรียนเลือกซื้ออาหารมีฉลากสุขภาพในช่วง 1 สัปดาห์ที่ผ่านมา',
    recommendedResponseFormats: ['FREQUENCY', 'OCCURRENCE', 'BEHAVIOR_SPECIFIC'],
  },
];
