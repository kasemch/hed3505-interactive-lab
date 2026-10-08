import fs from 'node:fs';

const path = 'docs/qa/HED3505-R2-SYN-RUNTIME-EVIDENCE-MATRIX.md';
const text = fs.readFileSync(path, 'utf8');

const required = [
  'Status: EXECUTION READY / CONNECTOR BLOCKED',
  'Scope: Neon ephemeral branch only',
  'Production: FORBIDDEN',
  'Classification: SYNTHETIC / SANDBOX ONLY',
  'AUTH-01', 'RLS-01', 'RLS-02', 'RLS-03', 'RLS-04',
  'RLS-05A', 'RLS-05B', 'RLS-06',
  'TEACHER-01', 'TEACHER-02', 'AUDIT-01', 'AUDIT-02',
  'PERSIST-01', 'PERSIST-02', 'PERSIST-03', 'PERSIST-04', 'COMPLETE-01',
  'Student A and Student B must each have a valid synthetic learner_identity and at least one valid activity_attempt',
  'an invalid UUID/FK failure does not count as authorization proof',
  'Never print OTP, JWT, session cookie, password, or secret',
  'Privileged owner queries may inspect structure/fixtures but cannot be used as student/teacher RLS proof',
  'A manually fabricated JWT/session cannot be used as R2-SYN proof',
  'R2-SYN = PASS only when every applicable assertion above has runtime evidence',
  'R2-LIVE remains a separate gate',
  'PR #3 merge: HOLD',
  'Production: HOLD',
  'Real students: HOLD',
  'Certificate issuance: HOLD'
];

for (const token of required) {
  if (!text.includes(token)) {
    throw new Error(`R2-SYN evidence matrix governance regression: missing ${token}`);
  }
}

if (/R2-SYN:\s*PASS/i.test(text)) {
  throw new Error('R2-SYN must not be marked PASS without runtime evidence.');
}

console.log('PASS: R2-SYN runtime evidence matrix remains fail-closed, non-vacuous, synthetic-only, and governance-held.');
