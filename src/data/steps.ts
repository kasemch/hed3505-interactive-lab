import type { StepDefinition } from '../types';

/** 8-step progress indicator. Only Case Launch + Modules 1-2 are active in this build gate. */
export const steps: StepDefinition[] = [
  { id: 'case-launch', order: 0, label: 'Case Launch', shortLabel: 'เริ่มต้น', enabled: true },
  { id: 'module-1', order: 1, label: 'Module 1: Evidence Classification', shortLabel: 'M1', enabled: true },
  { id: 'module-2', order: 2, label: 'Module 2: CIPP–RE-AIM Simulator', shortLabel: 'M2', enabled: true },
  { id: 'module-3', order: 3, label: 'Module 3', shortLabel: 'M3', enabled: false },
  { id: 'module-4', order: 4, label: 'Module 4', shortLabel: 'M4', enabled: false },
  { id: 'module-5', order: 5, label: 'Module 5', shortLabel: 'M5', enabled: false },
  { id: 'module-6', order: 6, label: 'Module 6', shortLabel: 'M6', enabled: false },
  { id: 'module-7', order: 7, label: 'Module 7', shortLabel: 'M7', enabled: false },
  { id: 'module-8', order: 8, label: 'Module 8', shortLabel: 'M8', enabled: false },
];
