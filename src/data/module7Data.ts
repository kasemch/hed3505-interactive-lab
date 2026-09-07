import type { RubricDimension, RubricLevel } from '../types';

/** The 4 performance levels shared by every rubric dimension in this sandbox. */
export const rubricLevels: RubricLevel[] = [
  { level: 1, label: 'Beginning', labelTh: 'เริ่มต้น' },
  { level: 2, label: 'Developing', labelTh: 'กำลังพัฒนา' },
  { level: 3, label: 'Proficient', labelTh: 'ปฏิบัติได้ดี' },
  { level: 4, label: 'Exemplary', labelTh: 'ดีเยี่ยม' },
];

export const RUBRIC_MAX_LEVEL = 4;
export const RUBRIC_TOTAL_WEIGHT = 100;

/**
 * Rubric dimensions for a sample school-health evaluation report assessment. Default weights sum
 * to 100 but are learner-adjustable, so the sandbox can also demonstrate an invalid total.
 */
export const rubricDimensions: RubricDimension[] = [
  {
    id: 'objective-alignment',
    label: 'Objective–Question Alignment',
    labelTh: 'ความสอดคล้องวัตถุประสงค์-คำถามประเมิน',
    description: 'ความชัดเจนและความสอดคล้องระหว่างวัตถุประสงค์ คำถามประเมิน และตัวชี้วัดที่เลือกใช้',
    defaultWeight: 30,
    maxLevel: RUBRIC_MAX_LEVEL,
  },
  {
    id: 'instrument-quality',
    label: 'Instrument Quality Evidence',
    labelTh: 'หลักฐานคุณภาพเครื่องมือ',
    description: 'การนำหลักฐาน IOC และการทบทวนโดยผู้เชี่ยวชาญมาปรับปรุงเครื่องมืออย่างเหมาะสม',
    defaultWeight: 25,
    maxLevel: RUBRIC_MAX_LEVEL,
  },
  {
    id: 'ethics-data-collection',
    label: 'Ethical Data Collection Plan',
    labelTh: 'แผนเก็บข้อมูลอย่างมีจริยธรรม',
    description: 'การระบุและจัดการความเสี่ยงด้านอคติและจริยธรรมในแผนเก็บข้อมูล',
    defaultWeight: 25,
    maxLevel: RUBRIC_MAX_LEVEL,
  },
  {
    id: 'reporting-clarity',
    label: 'Reporting Clarity',
    labelTh: 'ความชัดเจนของการรายงานผล',
    description: 'ความชัดเจน ความรัดกุม และความเหมาะสมของการนำเสนอผลการประเมิน',
    defaultWeight: 20,
    maxLevel: RUBRIC_MAX_LEVEL,
  },
];
