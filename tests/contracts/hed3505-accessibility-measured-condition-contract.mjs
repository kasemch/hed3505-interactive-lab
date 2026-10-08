import fs from 'node:fs';

const path = 'docs/qa/HED3505-ACCESSIBILITY-MEASURED-CONDITION-REGISTER.md';
const text = fs.readFileSync(path, 'utf8');

const required = [
  'Status: OPEN — MEASURED RETEST REQUIRED',
  'Performance: 100',
  'Accessibility: 97',
  'Best Practices: 100',
  'color contrast',
  'structural PASS does not prove',
  'Do not claim the color-contrast condition is fixed',
  'Do not claim measured Accessibility > 97',
  'fresh measured accessibility retest',
  'PR #3 merge: HOLD',
  'Production: HOLD',
  'Real students: HOLD',
  'Certificate issuance: HOLD',
  'Vercel: FORBIDDEN'
];

for (const token of required) {
  if (!text.includes(token)) throw new Error(`Accessibility measured-evidence regression: missing ${token}`);
}

if (/Status:\s*(CLOSED|PASS|RESOLVED)/i.test(text)) {
  throw new Error('Measured accessibility condition must remain OPEN until a fresh measured retest is recorded.');
}

console.log('PASS: measured accessibility evidence boundary remains open, conservative, and H1-safe.');
