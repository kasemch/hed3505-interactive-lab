import type { EvidenceCard, EvidenceCategoryDefinition, ReasoningOption } from '../types';

/**
 * Category definitions for Module 1. Classification follows logical
 * hierarchy and nature of effects, NOT elapsed time.
 */
export const evidenceCategories: EvidenceCategoryDefinition[] = [
  {
    id: 'PROCESS',
    label: 'Process',
    labelTh: 'กระบวนการ',
    description: 'สิ่งที่โครงการ "ทำ" — กิจกรรมและขั้นตอนการดำเนินงาน',
  },
  {
    id: 'OUTPUT',
    label: 'Output',
    labelTh: 'ผลผลิต',
    description: 'ผลผลิตที่จับต้องได้หรือการเข้าร่วมโดยตรงจากกิจกรรม',
  },
  {
    id: 'OUTCOME',
    label: 'Outcome',
    labelTh: 'ผลลัพธ์',
    description: 'การเปลี่ยนแปลงระดับบุคคล เช่น ความรู้ ทัศนคติ หรือพฤติกรรม',
  },
  {
    id: 'IMPACT',
    label: 'Impact',
    labelTh: 'ผลกระทบ',
    description: 'การเปลี่ยนแปลงที่ยั่งยืนหรือกว้างขึ้นในระดับประชากร/ระยะยาว',
  },
];

/** Shared reasoning choices students select before submitting a classification. */
export const reasoningOptions: ReasoningOption[] = [
  { id: 'r-activity', label: 'เป็นสิ่งที่ผู้จัดโครงการลงมือทำหรือดำเนินการ' },
  { id: 'r-tangible', label: 'เป็นผลผลิตที่จับต้องได้หรือจำนวนผู้เข้าร่วมโดยตรง' },
  { id: 'r-individual-change', label: 'เป็นการเปลี่ยนแปลงที่เกิดขึ้นกับตัวบุคคล (ความรู้/ทัศนคติ/พฤติกรรม)' },
  { id: 'r-broad-sustained', label: 'เป็นการเปลี่ยนแปลงที่กว้างขึ้นหรือยั่งยืนในระดับกลุ่ม/ประชากร' },
];

export const module1Cards: EvidenceCard[] = [
  {
    id: 'ev-01',
    statement: 'ทีมงานจัดอบรมเชิงปฏิบัติการเรื่องโภชนาการทั้งหมด 4 ครั้งตามแผนที่วางไว้',
    sourceLabel: 'บันทึกการดำเนินกิจกรรม',
    correctCategory: 'PROCESS',
    expectedReasoningId: 'r-activity',
    reasoningExplanation:
      'ข้อความนี้อธิบายสิ่งที่ทีมงานลงมือทำ (การจัดอบรม) ซึ่งเป็นขั้นตอนการดำเนินงาน ไม่ใช่ผลลัพธ์ที่เกิดกับผู้เข้าร่วม',
    commonMisconception:
      'ผู้เรียนมักเข้าใจผิดว่า "จำนวนครั้งที่จัดกิจกรรม" คือผลผลิต (Output) ทั้งที่จริงคือกระบวนการดำเนินงาน',
  },
  {
    id: 'ev-02',
    statement: 'มีนักเรียนเข้าร่วมการอบรมโภชนาการรวม 320 คน จากทั้งหมด 350 คน',
    sourceLabel: 'สรุปยอดผู้เข้าร่วมกิจกรรม',
    correctCategory: 'OUTPUT',
    expectedReasoningId: 'r-tangible',
    reasoningExplanation:
      'จำนวนผู้เข้าร่วมเป็นผลผลิตที่จับต้องได้โดยตรงจากการจัดกิจกรรม แต่ยังไม่บอกว่านักเรียนเปลี่ยนแปลงอย่างไร',
  },
  {
    id: 'ev-03',
    statement: 'โรงอาหารปรับสูตรเมนูอาหารกลางวันให้มีผักเพิ่มขึ้นและลดปริมาณน้ำตาลในทุกเมนู',
    sourceLabel: 'รายงานทีมโรงอาหาร',
    correctCategory: 'PROCESS',
    expectedReasoningId: 'r-activity',
    reasoningExplanation:
      'การปรับสูตรเมนูคือการดำเนินการของโครงการ เป็นส่วนหนึ่งของกิจกรรม ไม่ใช่การเปลี่ยนแปลงที่เกิดกับนักเรียน',
  },
  {
    id: 'ev-04',
    statement: 'มีการติดฉลากอาหารเพื่อสุขภาพครบทุกจุดขายในโรงอาหาร รวม 6 จุด',
    sourceLabel: 'รายงานการติดตั้งฉลาก',
    correctCategory: 'OUTPUT',
    expectedReasoningId: 'r-tangible',
    reasoningExplanation:
      'จำนวนจุดขายที่ติดฉลากสำเร็จเป็นผลผลิตที่จับต้องได้จากการดำเนินกิจกรรม',
  },
  {
    id: 'ev-05',
    statement: 'คะแนนแบบทดสอบความรู้โภชนาการของนักเรียนเพิ่มขึ้นเฉลี่ย 18% หลังจบการอบรม',
    sourceLabel: 'ผลการทดสอบก่อน-หลัง',
    correctCategory: 'OUTCOME',
    expectedReasoningId: 'r-individual-change',
    reasoningExplanation:
      'คะแนนความรู้ที่เปลี่ยนแปลงเป็นการเปลี่ยนแปลงระดับบุคคลอันเป็นผลจากกิจกรรม จึงจัดเป็นผลลัพธ์ (Outcome)',
  },
  {
    id: 'ev-06',
    statement: 'นักเรียนรายงานว่ามีทัศนคติเชิงบวกต่อการเลือกรับประทานผักและผลไม้มากขึ้น',
    sourceLabel: 'แบบสอบถามทัศนคติ',
    correctCategory: 'OUTCOME',
    expectedReasoningId: 'r-individual-change',
    reasoningExplanation: 'ทัศนคติที่เปลี่ยนแปลงเป็นการเปลี่ยนแปลงเชิงบุคคล จัดอยู่ในกลุ่มผลลัพธ์ (Outcome)',
  },
  {
    id: 'ev-07',
    statement: 'สัดส่วนนักเรียนที่เลือกซื้ออาหารมีฉลากสุขภาพในโรงอาหารเพิ่มขึ้นจาก 22% เป็น 41% ภายในภาคเรียนเดียวกัน',
    sourceLabel: 'บันทึกยอดขายโรงอาหาร',
    correctCategory: 'OUTCOME',
    expectedReasoningId: 'r-individual-change',
    reasoningExplanation:
      'แม้จะยังอยู่ในภาคเรียนเดียวกัน (ระยะเวลาสั้น) แต่นี่คือการเปลี่ยนแปลงพฤติกรรมของนักเรียนแต่ละคน จึงจัดเป็นผลลัพธ์ (Outcome) ไม่ใช่ผลกระทบ (Impact) เพราะการจำแนก Outcome/Impact ไม่ได้ขึ้นกับเวลาที่ผ่านไป แต่ขึ้นกับลักษณะและขอบเขตของการเปลี่ยนแปลง',
    commonMisconception:
      'ผู้เรียนมักคิดว่าถ้าเปลี่ยนแปลง "เร็ว" คือ Outcome และถ้า "นาน" คือ Impact ทั้งที่ตัวชี้วัดที่แท้จริงคือ ระดับบุคคล vs ระดับกว้าง/ยั่งยืน',
  },
  {
    id: 'ev-08',
    statement: 'อัตราภาวะน้ำหนักเกินของนักเรียนทั้งโรงเรียนลดลงอย่างต่อเนื่องตลอด 3 ปีการศึกษาหลังเริ่มโครงการ',
    sourceLabel: 'ข้อมูลสุขภาพนักเรียนระยะยาว',
    correctCategory: 'IMPACT',
    expectedReasoningId: 'r-broad-sustained',
    reasoningExplanation:
      'การเปลี่ยนแปลงนี้เกิดในระดับประชากร (นักเรียนทั้งโรงเรียน) และคงอยู่ต่อเนื่องในระยะยาว จึงจัดเป็นผลกระทบ (Impact)',
  },
  {
    id: 'ev-09',
    statement: 'โรงเรียนกำหนดนโยบายเมนูอาหารเพื่อสุขภาพเป็นส่วนหนึ่งของแนวปฏิบัติถาวรของโรงอาหาร',
    sourceLabel: 'ประกาศนโยบายโรงเรียน',
    correctCategory: 'IMPACT',
    expectedReasoningId: 'r-broad-sustained',
    reasoningExplanation:
      'การเปลี่ยนแปลงเชิงระบบ/นโยบายที่ยั่งยืนในระดับสถาบันสะท้อนผลกระทบที่กว้างกว่าการเปลี่ยนแปลงรายบุคคล',
  },
  {
    id: 'ev-10',
    statement: 'ครูผู้สอนให้ความเห็นว่านักเรียนดูกระตือรือร้นและมีส่วนร่วมในกิจกรรมอบรมเป็นอย่างดี',
    sourceLabel: 'ความคิดเห็นครูผู้สอน',
    correctCategory: 'OUTPUT',
    expectedReasoningId: 'r-tangible',
    reasoningExplanation:
      'ความคิดเห็นเชิงสังเกตเกี่ยวกับการมีส่วนร่วมในกิจกรรม สะท้อนลักษณะการเข้าร่วม (Output) ไม่ใช่การเปลี่ยนแปลงที่วัดได้ในตัวนักเรียน',
    commonMisconception:
      'ผู้เรียนอาจสับสนว่าความคิดเห็นเชิงบวกจากครูคือ "ผลลัพธ์" ทั้งที่ยังไม่ได้วัดการเปลี่ยนแปลงของนักเรียนโดยตรง',
  },
  {
    id: 'ev-11',
    statement: 'ทีมงานจัดทำสื่อประชาสัมพันธ์และแจกแผ่นพับความรู้โภชนาการให้นักเรียนทุกคน',
    sourceLabel: 'บันทึกการดำเนินกิจกรรม',
    correctCategory: 'PROCESS',
    expectedReasoningId: 'r-activity',
    reasoningExplanation: 'การจัดทำและแจกจ่ายสื่อเป็นขั้นตอนการดำเนินงานของทีมโครงการ',
  },
  {
    id: 'ev-12',
    statement: 'ชุมชนรอบโรงเรียนเริ่มมีร้านค้าที่จำหน่ายอาหารเพื่อสุขภาพเพิ่มขึ้น หลังโรงเรียนดำเนินโครงการต่อเนื่องหลายปี',
    sourceLabel: 'ข้อมูลสำรวจชุมชนโดยรอบ',
    correctCategory: 'IMPACT',
    expectedReasoningId: 'r-broad-sustained',
    reasoningExplanation:
      'การเปลี่ยนแปลงในระดับชุมชนที่กว้างกว่าตัวนักเรียนและเกิดขึ้นอย่างต่อเนื่อง สะท้อนผลกระทบระยะยาวของโครงการ',
  },
];
