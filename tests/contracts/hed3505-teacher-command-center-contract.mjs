import fs from 'node:fs';

const qaPath='docs/qa/HED3505-SYNTHETIC-E2E-TEACHER-DASHBOARD-01.md';
const fixturePath='tests/neon/fixtures/complete-learning-evidence-payloads.json';
if(!fs.existsSync(qaPath) || !fs.existsSync(fixturePath)){
  console.error('Teacher Command Center contract: required QA/fixture file missing');
  process.exit(1);
}
const qa=fs.readFileSync(qaPath,'utf8');
const fixture=JSON.parse(fs.readFileSync(fixturePath,'utf8'));

const requiredQa=[
  'Course Pulse','Mission Funnel','roster matrix','Evidence Inspector',
  'Learners: 3','Completed: 1','Need Attention: 1','Not Started: 1','Certificate Eligible: 1',
  'SYN-X is denied and excluded','draft/non-public','teacher authorization is proven'
];
for(const needle of requiredQa){
  if(!qa.toLowerCase().includes(needle.toLowerCase())){
    console.error(`Teacher Command Center contract: ${needle} missing`);
    process.exit(1);
  }
}

if(fixture.classification !== 'SYNTHETIC / SANDBOX ONLY'){
  console.error('Teacher Command Center contract: fixture must remain synthetic-only');
  process.exit(1);
}
if(!fixture.M1?.revision || !fixture.M2?.final_revision || !fixture.M2_MISSING_EVIDENCE?.revision_after_feedback || !fixture.M3_EVALUATION_DECISION?.revision){
  console.error('Teacher Command Center contract: revision evidence is incomplete');
  process.exit(1);
}
if(fixture.COMPLETION?.certificate_eligible !== false){
  console.error('Teacher Command Center contract: current runtime-unproven fixture must remain certificate locked');
  process.exit(1);
}

const forbiddenClaims=[
  'Runtime Security/RLS: PASS',
  'Real Student Activation: PASS',
  'Production: PASS'
];
for(const claim of forbiddenClaims){
  if(qa.includes(claim)){
    console.error(`Teacher Command Center governance violation: premature claim ${claim}`);
    process.exit(1);
  }
}

console.log('Teacher Command Center synthetic aggregation + revision evidence contract: PASS');
console.log('Teacher authorization and runtime aggregation remain separate runtime gates.');
