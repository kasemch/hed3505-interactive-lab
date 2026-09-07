import { describe, expect, it } from 'vitest';
import { kapConstructs } from '../data/module4Data';
import { evaluateInstrumentCandidate, isInstrumentCandidateComplete } from './kapLogic';
import type { InstrumentCandidate } from '../types';

const knowledgeDef = kapConstructs.find((c) => c.id === 'KNOWLEDGE')!;
const attitudeDef = kapConstructs.find((c) => c.id === 'ATTITUDE')!;
const practiceDef = kapConstructs.find((c) => c.id === 'PRACTICE')!;

function candidate(construct: InstrumentCandidate['construct'], overrides: Partial<InstrumentCandidate> = {}): InstrumentCandidate {
  return {
    construct,
    operationalMeaning: 'meaning',
    indicator: 'a sufficiently long indicator statement',
    draftItem: 'a sufficiently long draft item statement',
    responseFormat: null,
    rationale: 'rationale',
    ...overrides,
  };
}

describe('evaluateInstrumentCandidate - Knowledge', () => {
  it('flags self-rating phrasing as a possible construct mismatch', () => {
    const result = evaluateInstrumentCandidate(
      candidate('KNOWLEDGE', { draftItem: 'ฉันคิดว่าฉันมีความรู้เรื่องโภชนาการมาก', responseFormat: 'MULTIPLE_CHOICE' }),
      knowledgeDef,
    );
    expect(result.level).toBe('POSSIBLE_CONSTRUCT_MISMATCH');
  });

  it('accepts a factual-recall style item with a recommended response format', () => {
    const result = evaluateInstrumentCandidate(
      candidate('KNOWLEDGE', {
        draftItem: 'สารอาหารหลัก 5 หมู่ประกอบด้วยอะไรบ้าง เลือกคำตอบที่ถูกต้อง',
        responseFormat: 'MULTIPLE_CHOICE',
      }),
      knowledgeDef,
    );
    expect(result.level).toBe('READY_FOR_EXPERT_REVIEW');
    expect(result.messages.some((m) => m.includes('ยังไม่ใช่การยืนยันคุณภาพเครื่องมือ'))).toBe(true);
  });
});

describe('evaluateInstrumentCandidate - Practice', () => {
  it('flags intention phrasing as POSSIBLE_INTENTION_BEHAVIOR mismatch', () => {
    const result = evaluateInstrumentCandidate(
      candidate('PRACTICE', { draftItem: 'ฉันตั้งใจว่าจะเลือกซื้ออาหารมีฉลากสุขภาพ', responseFormat: 'FREQUENCY' }),
      practiceDef,
    );
    expect(result.level).toBe('POSSIBLE_CONSTRUCT_MISMATCH');
    expect(result.messages.some((m) => m.includes('INTENTION'))).toBe(true);
  });

  it('accepts a behavior-report item with a recommended response format', () => {
    const result = evaluateInstrumentCandidate(
      candidate('PRACTICE', {
        draftItem: 'ในช่วง 1 สัปดาห์ที่ผ่านมา คุณเลือกซื้ออาหารมีฉลากสุขภาพกี่ครั้ง',
        responseFormat: 'FREQUENCY',
      }),
      practiceDef,
    );
    expect(result.level).toBe('READY_FOR_EXPERT_REVIEW');
  });
});

describe('evaluateInstrumentCandidate - Attitude', () => {
  it('flags factual-recall phrasing as POSSIBLE_KNOWLEDGE_ATTITUDE mismatch', () => {
    const result = evaluateInstrumentCandidate(
      candidate('ATTITUDE', { draftItem: 'สารอาหารหลัก 5 หมู่คืออะไร', responseFormat: 'LIKERT_AGREEMENT' }),
      attitudeDef,
    );
    expect(result.level).toBe('POSSIBLE_CONSTRUCT_MISMATCH');
    expect(result.messages.some((m) => m.includes('KNOWLEDGE'))).toBe(true);
  });

  it('flags a non-recommended response format as a concern, not an error', () => {
    const result = evaluateInstrumentCandidate(
      candidate('ATTITUDE', {
        draftItem: 'คุณคิดว่าการรับประทานผักผลไม้มีความสำคัญมากน้อยเพียงใด',
        responseFormat: 'TRUE_FALSE',
      }),
      attitudeDef,
    );
    expect(result.level).toBe('RESPONSE_FORMAT_CONCERN');
  });
});

describe('isInstrumentCandidateComplete', () => {
  it('is false until all required fields are filled', () => {
    expect(isInstrumentCandidateComplete(candidate('KNOWLEDGE', { indicator: '', responseFormat: 'MULTIPLE_CHOICE' }))).toBe(
      false,
    );
    expect(isInstrumentCandidateComplete(candidate('KNOWLEDGE', { responseFormat: 'MULTIPLE_CHOICE' }))).toBe(true);
  });
});
