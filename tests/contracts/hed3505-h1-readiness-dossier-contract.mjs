import fs from 'node:fs';

const path = 'docs/qa/HED3505-H1-PILOT-READINESS-DOSSIER.md';
const text = fs.readFileSync(path, 'utf8');

const required = [
  'Status: NOT READY FOR H1 APPROVAL YET',
  'Classification: CONTROLLED / NON-PRODUCTION',
  'Architecture: GitHub → WordPress + Neon',
  'Vercel: NOT USED',
  'R2-SYN multi-principal runtime authorization matrix',
  'persistence initial → feedback → revision → reload',
  'server-authoritative certificate lock at runtime',
  'R2-LIVE genuine multi-user authorization evidence',
  'Real-student pilot activation',
  'CONNECTOR BLOCKED',
  'not evidence of database failure',
  'not evidence of RLS failure',
  'PR #3 merge: HOLD',
  'Production: HOLD',
  'Real students: HOLD',
  'Certificate issuance: HOLD',
  'Production Neon branch: FORBIDDEN',
  'Vercel: FORBIDDEN',
  '**APPROVE REAL-STUDENT PILOT**',
  'continue reversible preparation automatically'
];

for (const token of required) {
  if (!text.includes(token)) {
    throw new Error(`H1 readiness dossier governance regression: missing ${token}`);
  }
}

if (/Status:\s*READY FOR H1 APPROVAL(?! YET)/i.test(text)) {
  throw new Error('H1 dossier must not become READY before runtime entry criteria are evidenced.');
}

if (/R2-SYN[^\n]*=\s*PASS/i.test(text)) {
  throw new Error('H1 dossier must not infer R2-SYN PASS without runtime evidence.');
}

console.log('PASS: H1 readiness dossier remains controlled, fail-closed, non-production, and held before real-student activation.');
