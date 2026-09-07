import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  ActivityStatus,
  Module1Submission,
  Module2Submission,
  Module3Submission,
  Module4Submission,
  SessionState,
  StepId,
  UserMode,
} from '../types';
import { loadSessionState, saveSessionState } from '../data/sessionStorage';

interface SessionContextValue {
  state: SessionState;
  setMode: (mode: UserMode) => void;
  goToStep: (step: StepId) => void;
  enterLab: () => void;
  setModule1: (status: ActivityStatus, submissions: Module1Submission[]) => void;
  setModule2: (status: ActivityStatus, submissions: Module2Submission[]) => void;
  setModule3: (status: ActivityStatus, submissions: Module3Submission[]) => void;
  setModule4: (status: ActivityStatus, submissions: Module4Submission[]) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(() => loadSessionState());

  useEffect(() => {
    saveSessionState(state);
  }, [state]);

  const value = useMemo<SessionContextValue>(
    () => ({
      state,
      setMode: (mode) => setState((prev) => ({ ...prev, mode })),
      goToStep: (step) => setState((prev) => ({ ...prev, currentStep: step })),
      enterLab: () =>
        setState((prev) => ({ ...prev, hasEnteredLab: true, currentStep: 'module-1' })),
      setModule1: (status, submissions) =>
        setState((prev) => ({ ...prev, module1: { status, submissions } })),
      setModule2: (status, submissions) =>
        setState((prev) => ({ ...prev, module2: { status, submissions } })),
      setModule3: (status, submissions) =>
        setState((prev) => ({ ...prev, module3: { status, submissions } })),
      setModule4: (status, submissions) =>
        setState((prev) => ({ ...prev, module4: { status, submissions } })),
    }),
    [state],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
