import type { StepDefinition } from '../types';

/** 8-step progress indicator. Case Launch + Modules 1-4 are active as of Phase 3B; Modules 5-8 remain future/locked. */
export const steps: StepDefinition[] = [
  { id: 'case-launch', order: 0, label: 'Case Launch', shortLabel: 'เริ่มต้น', enabled: true },
  { id: 'module-1', order: 1, label: 'Module 1: Evidence Classification', shortLabel: 'M1', enabled: true },
  { id: 'module-2', order: 2, label: 'Module 2: CIPP–RE-AIM Simulator', shortLabel: 'M2', enabled: true },
  { id: 'module-3', order: 3, label: 'Module 3: Alignment Debugger', shortLabel: 'M3', enabled: true },
  { id: 'module-4', order: 4, label: 'Module 4: K-A-P Instrument Studio', shortLabel: 'M4', enabled: true },
  { id: 'module-5', order: 5, label: 'Module 5: IOC Quality Lab (future)', shortLabel: 'M5', enabled: false },
  { id: 'module-6', order: 6, label: 'Module 6: Bias & Ethics Simulator (future)', shortLabel: 'M6', enabled: false },
  { id: 'module-7', order: 7, label: 'Module 7: Weighted Rubric Sandbox (future)', shortLabel: 'M7', enabled: false },
  { id: 'module-8', order: 8, label: 'Module 8: Evaluation Matrix Builder (future)', shortLabel: 'M8', enabled: false },
];
