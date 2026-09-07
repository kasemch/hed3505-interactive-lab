import { beforeEach, describe, expect, it } from 'vitest';
import { SESSION_SCHEMA_VERSION } from '../types';
import { defaultSessionState, loadSessionState, saveSessionState } from './sessionStorage';

const STORAGE_KEY = 'hed3505-session-state';

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

beforeEach(() => {
  (globalThis as unknown as { sessionStorage: Storage }).sessionStorage = new MemoryStorage();
});

describe('loadSessionState', () => {
  it('returns defaults when nothing is persisted', () => {
    expect(loadSessionState()).toEqual(defaultSessionState);
  });

  it('round-trips a valid, current-schema state', () => {
    const state = {
      ...defaultSessionState,
      mode: 'instructor' as const,
      currentStep: 'module-3' as const,
      hasEnteredLab: true,
      module1: { status: 'REVIEW' as const, submissions: [{ cardId: 'c1', chosenCategory: 'PROCESS' as const, chosenReasoningId: 'r1' }] },
    };
    saveSessionState(state);
    expect(loadSessionState()).toEqual(state);
  });

  it('discards persisted state from an old/mismatched schema version rather than partially trusting it', () => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: SESSION_SCHEMA_VERSION - 1, mode: 'instructor', hasEnteredLab: true }),
    );
    expect(loadSessionState()).toEqual(defaultSessionState);
  });

  it('falls back to defaults for a corrupted (non-JSON) payload', () => {
    sessionStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadSessionState()).toEqual(defaultSessionState);
  });

  it('rejects invalid module3 submissions and falls back to the default section without corrupting other modules', () => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...defaultSessionState,
        module1: { status: 'REVIEW', submissions: [{ cardId: 'c1', chosenCategory: 'PROCESS', chosenReasoningId: 'r1' }] },
        module3: { status: 'SUBMITTED', submissions: [{ scenarioId: 'align-1', selectedCategory: 'NOT_A_REAL_CATEGORY' }] },
      }),
    );
    const loaded = loadSessionState();
    expect(loaded.module3.submissions).toEqual(defaultSessionState.module3.submissions);
    expect(loaded.module1.status).toBe('REVIEW');
  });
});
