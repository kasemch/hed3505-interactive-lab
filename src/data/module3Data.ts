import type { AlignmentCategoryDefinition, AlignmentScenario } from '../types';

/**
 * Category definitions for the "type of problem" a student identifies in Module 3.
 * These are conceptual mismatch categories, not tied to a single link position -
 * a student must reason about *why* a link is broken, not just *where* it is.
 */
export const alignmentCategories: AlignmentCategoryDefinition[] = [
  {
    id: 'OBJECTIVE_QUESTION',
    label: 'Objective ↔ Question',
    labelTh: 'วัตถุประสงค์ ↔ คำถามประเมิน',
    description: 'คำถามประเมินไม่ได้สะท้อนสิ่งที่วัตถุประสงค์ต้องการทราบ',
  },
  {
    id: 'QUESTION_INDICATOR',
    label: 'Question ↔ Indicator',
    labelTh: 'คำถามประเมิน ↔ ตัวชี้วัด',
    description: 'ตัวชี้วัดที่เลือกไม่ได้ตอบคำถามประเมินที่ตั้งไว้จริง',
  },
  {
    id: 'INDICATOR_DATA_SOURCE',
    label: 'Indicator ↔ Data Source',
    labelTh: 'ตัวชี้วัด ↔ แหล่งข้อมูล',
    description: 'แหล่งข้อมูลที่เลือกไม่สามารถให้ข้อมูลตามที่ตัวชี้วัดต้องการ',
  },
  {
    id: 'INDICATOR_INSTRUMENT',
    label: 'Indicator ↔ Instrument',
    labelTh: 'ตัวชี้วัด ↔ เครื่องมือ',
    description: 'เครื่องมือที่ใช้ไม่ได้วัดสิ่งเดียวกับที่ตัวชี้วัดกำหนดไว้',
  },
  {
    id: 'INSTRUMENT_CLAIM',
    label: 'Instrument ↔ Claim',
    labelTh: 'เครื่องมือ ↔ ข้อสรุป/การอ้างสิทธิ์',
    description: 'ข้อสรุปที่ได้จากการวิเคราะห์กว้างหรือแคบเกินกว่าที่เครื่องมือสามารถรองรับได้',
  },
  {
    id: 'ANALYSIS_DECISION',
    label: 'Analysis ↔ Decision Use',
    labelTh: 'การวิเคราะห์ ↔ การนำไปใช้ตัดสินใจ',
    description: 'การตัดสินใจที่เกิดขึ้นไม่ได้เป็นไปตามสิ่งที่ผลการวิเคราะห์แสดงจริง',
  },
];

const SIMULATED_LABEL = 'ข้อมูลจำลองเพื่อการเรียนรู้';

/**
 * Builds the canonical 7-node / 6-link evaluation chain shared by every scenario:
 * Objective -> Question -> Indicator -> Data Source -> Instrument -> Analysis -> Decision.
 */
function buildChain(
  scenarioId: string,
  statements: {
    objective: string;
    question: string;
    indicator: string;
    dataSource: string;
    instrument: string;
    analysis: string;
    decision: string;
  },
) {
  const nodes = [
    { id: `${scenarioId}-objective`, type: 'OBJECTIVE' as const, label: 'Objective', statement: statements.objective },
    { id: `${scenarioId}-question`, type: 'QUESTION' as const, label: 'Evaluation Question', statement: statements.question },
    { id: `${scenarioId}-indicator`, type: 'INDICATOR' as const, label: 'Indicator', statement: statements.indicator },
    { id: `${scenarioId}-data-source`, type: 'DATA_SOURCE' as const, label: 'Data Source', statement: statements.dataSource },
    { id: `${scenarioId}-instrument`, type: 'INSTRUMENT' as const, label: 'Instrument', statement: statements.instrument },
    { id: `${scenarioId}-analysis`, type: 'ANALYSIS' as const, label: 'Analysis', statement: statements.analysis },
    { id: `${scenarioId}-decision`, type: 'DECISION' as const, label: 'Decision Use', statement: statements.decision },
  ];

  const links = [
    { id: `${scenarioId}-link-oq`, fromNodeId: nodes[0].id, toNodeId: nodes[1].id, label: 'Objective → Question' },
    { id: `${scenarioId}-link-qi`, fromNodeId: nodes[1].id, toNodeId: nodes[2].id, label: 'Question → Indicator' },
    { id: `${scenarioId}-link-id`, fromNodeId: nodes[2].id, toNodeId: nodes[3].id, label: 'Indicator → Data Source' },
    { id: `${scenarioId}-link-di`, fromNodeId: nodes[3].id, toNodeId: nodes[4].id, label: 'Data Source → Instrument' },
    { id: `${scenarioId}-link-ia`, fromNodeId: nodes[4].id, toNodeId: nodes[5].id, label: 'Instrument → Analysis' },
    { id: `${scenarioId}-link-ad`, fromNodeId: nodes[5].id, toNodeId: nodes[6].id, label: 'Analysis → Decision' },
  ];

  return { nodes, links };
}

export const alignmentScenarios: AlignmentScenario[] = [
  (() => {
    const scenarioId = 'align-1';
    const { nodes, links } = buildChain(scenarioId, {
      objective: 'เพิ่มความรู้ด้านโภชนาการของนักเรียน',
      question: 'นักเรียนมีความรู้ด้านโภชนาการเพิ่มขึ้นหลังเข้าร่วมโครงการหรือไม่',
      indicator: 'จำนวนนักเรียนที่เข้าร่วมกิจกรรมอบรมโภชนาการ',
      dataSource: 'บันทึกรายชื่อผู้เข้าร่วมกิจกรรม',
      instrument: 'แบบลงทะเบียนเข้าร่วมกิจกรรม',
      analysis: 'สรุปจำนวนและร้อยละของผู้เข้าร่วมกิจกรรมเทียบกับเป้าหมาย',
      decision: 'ตัดสินใจขยายจำนวนรอบการจัดอบรมในปีถัดไป',
    });
    return {
      id: scenarioId,
      title: 'สถานการณ์ที่ 1: วัดความรู้ด้วยข้อมูลการเข้าร่วม',
      simulatedDataLabel: SIMULATED_LABEL,
      context:
        'ทีมประเมินต้องการทราบว่าโครงการอบรมโภชนาการช่วยเพิ่มความรู้ของนักเรียนหรือไม่ ' +
        'จึงวางห่วงโซ่การประเมินโดยเริ่มจากวัตถุประสงค์ไปจนถึงการตัดสินใจ',
      nodes,
      links,
      issue: {
        linkId: `${scenarioId}-link-qi`,
        category: 'QUESTION_INDICATOR',
        correctionOptions: [
          { id: 'c1', label: 'เปลี่ยนตัวชี้วัดเป็น "คะแนนความรู้เฉลี่ยของนักเรียนก่อน-หลังการอบรม"' },
          { id: 'c2', label: 'เปลี่ยนคำถามประเมินเป็น "มีนักเรียนเข้าร่วมกิจกรรมกี่คน" เพื่อให้ตรงกับตัวชี้วัดเดิม' },
          { id: 'c3', label: 'เพิ่มแหล่งข้อมูลใหม่โดยไม่เปลี่ยนตัวชี้วัดเดิม' },
        ],
        correctCorrectionId: 'c1',
        expectedReasoning:
          'คำถามประเมินถามถึง "ความรู้ที่เพิ่มขึ้น" ซึ่งเป็นการเปลี่ยนแปลงระดับบุคคล แต่ตัวชี้วัดที่เลือกกลับวัด "จำนวนผู้เข้าร่วม" ' +
          'ซึ่งเป็นข้อมูลด้านการเข้าร่วม (Output) ไม่ใช่ความรู้ (Outcome) การแก้ไขที่ถูกต้องคือปรับตัวชี้วัดให้สะท้อนความรู้จริง ' +
          'เช่น คะแนนแบบทดสอบก่อน-หลัง โดยไม่ลดทอนคำถามประเมินเดิมลงเพื่อให้พอดีกับข้อมูลที่มีอยู่แล้ว',
        acceptableAlternativeReasoning:
          'อาจยอมรับคำตอบที่เสนอว่าตัวชี้วัดควรเป็นการเปลี่ยนแปลงระดับบุคคลอื่นที่เกี่ยวกับความรู้ เช่น ระดับความเข้าใจ ตราบใดที่ไม่ใช่ข้อมูลด้านการเข้าร่วม',
        commonMisconception:
          'ผู้เรียนบางส่วนเลือกแก้ปัญหาโดยการปรับคำถามประเมินให้ตรงกับข้อมูลที่มีอยู่แล้ว (ตัวเลือก c2) ' +
          'ซึ่งเป็นการลดทอนเป้าหมายการประเมินที่แท้จริงเพื่อความสะดวก แทนที่จะแก้ไขตัวชี้วัดให้ตรงกับคำถามตั้งต้น',
        facilitationPrompt:
          'ให้ผู้เรียนอภิปรายว่าทำไมการ "ปรับคำถามให้เข้ากับข้อมูล" จึงเป็นความเสี่ยงต่อความน่าเชื่อถือของการประเมินมากกว่าการปรับตัวชี้วัด',
        debriefQuestion:
          'หากทีมประเมินมีเพียงข้อมูลการเข้าร่วมกิจกรรม ควรตัดสินใจอย่างไรก่อนจะสรุปเรื่องความรู้ของนักเรียน?',
        a4Linkage:
          'เชื่อมโยงกับ A4: ความสอดคล้องระหว่างวัตถุประสงค์ คำถามประเมิน และตัวชี้วัด เป็นรากฐานของ Evaluation Matrix',
      },
    };
  })(),
  (() => {
    const scenarioId = 'align-2';
    const { nodes, links } = buildChain(scenarioId, {
      objective: 'ส่งเสริมพฤติกรรมการเลือกรับประทานอาหารเพื่อสุขภาพ',
      question: 'นักเรียนเลือกรับประทานอาหารเพื่อสุขภาพมากขึ้นหรือไม่',
      indicator: 'สัดส่วนนักเรียนที่เลือกซื้ออาหารมีฉลากสุขภาพในโรงอาหาร',
      dataSource: 'บันทึกยอดขายอาหารในโรงอาหารแยกตามประเภทเมนู',
      instrument: 'แบบสอบถามความคิดเห็นเกี่ยวกับรสชาติอาหารในโรงอาหาร',
      analysis: 'วิเคราะห์ระดับความพึงพอใจต่อรสชาติอาหารของนักเรียน',
      decision: 'ตัดสินใจปรับสูตรอาหารตามรสชาติที่นักเรียนชื่นชอบมากที่สุด',
    });
    return {
      id: scenarioId,
      title: 'สถานการณ์ที่ 2: วัดพฤติกรรมด้วยแบบสอบถามความคิดเห็น',
      simulatedDataLabel: SIMULATED_LABEL,
      context:
        'ทีมประเมินต้องการทราบว่านักเรียนเลือกรับประทานอาหารเพื่อสุขภาพมากขึ้นหรือไม่ หลังจากโรงเรียนติดฉลากอาหารเพื่อสุขภาพ',
      nodes,
      links,
      issue: {
        linkId: `${scenarioId}-link-di`,
        category: 'INDICATOR_INSTRUMENT',
        correctionOptions: [
          { id: 'c1', label: 'เปลี่ยนเครื่องมือเป็น "แบบบันทึกยอดขายอาหารมีฉลากสุขภาพเทียบกับอาหารทั่วไป"' },
          { id: 'c2', label: 'เปลี่ยนตัวชี้วัดให้เป็นระดับความพึงพอใจด้านรสชาติแทน' },
          { id: 'c3', label: 'เพิ่มคำถามเรื่องสุขภาพลงในแบบสอบถามความพึงพอใจเดิม' },
        ],
        correctCorrectionId: 'c1',
        expectedReasoning:
          'ตัวชี้วัดต้องการทราบ "สัดส่วนการเลือกซื้ออาหารมีฉลากสุขภาพ" ซึ่งเป็นพฤติกรรมการซื้อจริง ' +
          'แต่เครื่องมือที่ใช้กลับเป็นแบบสอบถามความคิดเห็นเรื่องรสชาติ ซึ่งวัดทัศนคติ ไม่ใช่พฤติกรรมการซื้อ ' +
          'การแก้ไขที่ถูกต้องคือเปลี่ยนเครื่องมือให้สอดคล้องกับข้อมูลพฤติกรรมที่มีอยู่แล้ว (ยอดขาย) แทนที่จะเปลี่ยนตัวชี้วัดหรือปะติดปะต่อคำถามใหม่เข้าไปในเครื่องมือเดิม',
        commonMisconception:
          'ผู้เรียนบางส่วนเข้าใจว่าการเพิ่มคำถามเรื่องสุขภาพลงในแบบสอบถามเดิม (ตัวเลือก c3) เป็นการแก้ไขที่เพียงพอ ' +
          'ทั้งที่แบบสอบถามความคิดเห็นยังคงวัดทัศนคติ ไม่ใช่พฤติกรรมการเลือกซื้อจริง',
        facilitationPrompt: 'ให้ผู้เรียนเปรียบเทียบว่า "ความคิดเห็นต่อรสชาติ" กับ "พฤติกรรมการเลือกซื้อจริง" ต่างกันอย่างไรในเชิงการวัด',
        debriefQuestion: 'เพราะเหตุใดข้อมูลยอดขายจึงเป็นหลักฐานพฤติกรรมที่หนักแน่นกว่าความคิดเห็นในแบบสอบถาม?',
        a4Linkage: 'เชื่อมโยงกับ A4: ตัวชี้วัดและเครื่องมือต้องวัดสิ่งเดียวกัน มิฉะนั้นข้อสรุปในภายหลังจะคลาดเคลื่อน',
      },
    };
  })(),
  (() => {
    const scenarioId = 'align-3';
    const { nodes, links } = buildChain(scenarioId, {
      objective: 'สร้างสภาพแวดล้อมของโรงเรียนที่เอื้อต่อสุขภาพอย่างยั่งยืน',
      question: 'โรงเรียนนำระบบติดฉลากอาหารไปใช้อย่างต่อเนื่องหรือไม่',
      indicator: 'การคงอยู่ของระบบติดฉลากอาหารในโรงอาหารหลังสิ้นสุดการสนับสนุนจากโครงการ',
      dataSource: 'บันทึกการตรวจเยี่ยมโรงอาหารรายภาคเรียน',
      instrument: 'แบบตรวจสอบการติดฉลากอาหาร ณ จุดขาย',
      analysis:
        'สรุปว่าสัดส่วนจุดขายที่ยังคงติดฉลากอาหารครบถ้วนลดลงจาก 100% เหลือ 40% ภายในสองภาคเรียนหลังหมดการสนับสนุน',
      decision: 'ตัดสินใจว่าโครงการประสบผลสำเร็จแล้วและยุติการติดตามผลต่อ',
    });
    return {
      id: scenarioId,
      title: 'สถานการณ์ที่ 3: สรุปผลสำเร็จโดยไม่สอดคล้องกับข้อมูล',
      simulatedDataLabel: SIMULATED_LABEL,
      context:
        'หลังโครงการสิ้นสุดการสนับสนุน ทีมประเมินต้องการทราบว่าโรงเรียนยังคงรักษาระบบติดฉลากอาหารไว้ได้อย่างยั่งยืนหรือไม่',
      nodes,
      links,
      issue: {
        linkId: `${scenarioId}-link-ad`,
        category: 'ANALYSIS_DECISION',
        correctionOptions: [
          {
            id: 'c1',
            label: 'ตัดสินใจว่าโครงการควรมีมาตรการเสริมเพื่อรักษาความต่อเนื่องของระบบติดฉลาก และติดตามผลต่อในภาคเรียนถัดไป',
          },
          { id: 'c2', label: 'เก็บข้อมูลเพิ่มเติมโดยไม่ต้องเปลี่ยนข้อสรุปเรื่องความสำเร็จเดิม' },
          { id: 'c3', label: 'ยุติโครงการทันทีโดยไม่วิเคราะห์สาเหตุของการลดลง' },
        ],
        correctCorrectionId: 'c1',
        expectedReasoning:
          'ผลการวิเคราะห์แสดงว่าสัดส่วนจุดขายที่ยังติดฉลากลดลงอย่างมีนัยสำคัญ (จาก 100% เหลือ 40%) ' +
          'ซึ่งบ่งชี้ว่าความยั่งยืนยังไม่เกิดขึ้นจริง แต่การตัดสินใจกลับสรุปว่า "ประสบผลสำเร็จ" และยุติการติดตาม ' +
          'ซึ่งขัดแย้งกับข้อมูลที่วิเคราะห์ได้ การตัดสินใจที่สอดคล้องคือวางมาตรการเสริมและติดตามผลต่อ ไม่ใช่ปิดโครงการหรือเพิกเฉยต่อผลที่พบ',
        commonMisconception:
          'ผู้เรียนบางส่วนมองว่าการมี "ข้อมูล" จำนวนมากเพียงพอที่จะสรุปความสำเร็จได้ทันที โดยไม่ตรวจสอบว่าแนวโน้มของข้อมูลนั้นสนับสนุนข้อสรุปหรือไม่',
        facilitationPrompt: 'ให้ผู้เรียนอธิบายว่าทำไมแนวโน้มขาลงของข้อมูลจึงไม่ควรถูกตีความว่าเป็นความสำเร็จที่ยั่งยืน',
        debriefQuestion: 'คำถามหลักของบทเรียนนี้ "เมื่อโครงการมีข้อมูลจำนวนมาก เราสามารถสรุปได้แล้วหรือไม่ว่าโครงการประสบผลสำเร็จ?" เกี่ยวข้องกับสถานการณ์นี้อย่างไร?',
        a4Linkage: 'เชื่อมโยงกับ A4: การตัดสินใจต้องสอดคล้องกับสิ่งที่การวิเคราะห์แสดงจริง ไม่ใช่ข้อสรุปที่ตั้งไว้ล่วงหน้า',
      },
    };
  })(),
];
