import fs from 'node:fs';

const configPath='wordpress/final-learning-studio/v3.2-independent-learning-config.js';
const fixturePath='tests/neon/fixtures/complete-learning-evidence-payloads.json';
const config=fs.readFileSync(configPath,'utf8');
const fixture=JSON.parse(fs.readFileSync(fixturePath,'utf8'));

const requiredEvents=[
  'mission-1-completed','mission-2-completed','mission-3-completed',
  'required-feedback-viewed','required-revision-completed',
  'final-review-completed','practice-check-completed'
];
for(const event of requiredEvents){
  if(!config.includes(event)) throw new Error(`Completion contract: config missing ${event}`);
  if(!fixture.COMPLETION?.required_events?.includes(event)) throw new Error(`Completion contract: fixture missing ${event}`);
}

// Page views must never satisfy completion. Completion requires evidence-bearing events.
for(const forbidden of ['page-view-completed','page-viewed-completed','visited-page-completed','opened-page-completed']){
  if(config.toLowerCase().includes(forbidden)) throw new Error(`Completion contract: forbidden page-view completion token ${forbidden}`);
}

if(!config.includes("eligibilitySource: 'server-authoritative'")) throw new Error('Certificate eligibility must remain server-authoritative');
if(fixture.COMPLETION?.all_requirements_met !== false) throw new Error('Runtime-unproven fixture must not claim all requirements met');
if(fixture.COMPLETION?.certificate_eligible !== false) throw new Error('Runtime-unproven fixture must remain certificate ineligible');
if(!fixture.M1?.guided_feedback || !fixture.M1?.revision) throw new Error('M1 feedback/revision evidence required');
if(!fixture.M2?.guided_feedback || !fixture.M2?.final_revision) throw new Error('M2 feedback/revision evidence required');
if(!fixture.M3_EVALUATION_DECISION?.guided_feedback || !fixture.M3_EVALUATION_DECISION?.revision) throw new Error('M3 feedback/revision evidence required');

function eligibility(events){
  const set=new Set(events);
  return requiredEvents.every(x=>set.has(x));
}
const cases=[
  ['page-view-only', [], false],
  ['missions-only', requiredEvents.slice(0,3), false],
  ['no-revision', requiredEvents.filter(x=>x!=='required-revision-completed'), false],
  ['no-final-review', requiredEvents.filter(x=>x!=='final-review-completed'), false],
  ['no-practice', requiredEvents.filter(x=>x!=='practice-check-completed'), false],
  ['complete-evidence-chain', requiredEvents, true]
];
for(const [name,events,expected] of cases){
  const actual=eligibility(events);
  if(actual!==expected) throw new Error(`Completion calculation failed: ${name}`);
}

console.log('Evidence-based progress/completion calculation contract: PASS');
console.log('Page views cannot complete learning; feedback/revision/final review/practice remain required.');
console.log('Certificate remains fail-closed and server-authoritative until runtime proof.');
