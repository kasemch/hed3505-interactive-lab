import fs from 'node:fs';

const required = [
  ['Mission 1','Fact'], ['Mission 1','Interpretation'], ['Mission 1','Assumption'], ['Mission 1','Judgment'],
  ['Mission 2','Objective'], ['Mission 2','Evaluation Question'], ['Mission 2','Indicator'], ['Mission 2','Data Source'],
  ['Mission 2','Instrument'], ['Mission 2','Quality Check'], ['Mission 2','Criterion'], ['Mission 2','Possible Decision'],
  ['Missing Evidence','missing_evidence'], ['Missing Evidence','confidence'],
  ['Mission 3','Evidence'], ['Mission 3','Interpretation'], ['Mission 3','Limitation'], ['Mission 3','Criterion'],
  ['Mission 3','Judgment'], ['Mission 3','Recommendation'], ['Mission 3','Action'],
  ['Mission 3','CONTINUE'], ['Mission 3','CONTINUE WITH MODIFICATION'], ['Mission 3','COLLECT MORE EVIDENCE'], ['Mission 3','DISCONTINUE'],
  ['Final Review','Measurement'], ['Final Review','Assessment'], ['Final Review','Evaluation'], ['Final Review','IOC'],
  ['Final Review','Reliability'], ['Final Review','Triangulation'], ['Final Review','Logic Model'],
  ['Exam Readiness','MCQ'], ['Exam Readiness','short answer'], ['Exam Readiness','scenario'], ['Exam Readiness','self-check'],
  ['Teacher Command Center','misconception'], ['Teacher Command Center','revision'],
  ['Accessibility','keyboard'], ['Accessibility','contrast'],
  ['Governance','synthetic'], ['Governance','certificate']
];
const roots=['wordpress','src','docs','content','activities','tests'];
function walk(p){if(!fs.existsSync(p))return[];const s=fs.statSync(p);if(s.isFile())return[p];return fs.readdirSync(p).flatMap(x=>walk(`${p}/${x}`));}
const files=roots.flatMap(walk).filter(f=>/\.(md|html|js|mjs|json|php|txt|yml|yaml)$/i.test(f));
const corpus=files.map(f=>{try{return fs.readFileSync(f,'utf8')}catch{return ''}}).join('\n');
let failed=0;
for(const [area,needle] of required){const ok=corpus.toLowerCase().includes(needle.toLowerCase());console.log(`${area}: ${needle}: ${ok?'PRESENT':'MISSING'}`);if(!ok)failed++;}
if(failed){console.error(`R3-R10 preparation contract: ${failed} required concepts missing`);process.exit(1)}

const fixturePath='tests/neon/fixtures/complete-learning-evidence-payloads.json';
if(!fs.existsSync(fixturePath)){console.error('R3-R10 fixture contract: complete learning evidence fixture missing');process.exit(1)}
const fixture=JSON.parse(fs.readFileSync(fixturePath,'utf8'));
if(fixture.classification !== 'SYNTHETIC / SANDBOX ONLY'){console.error('R3-R10 fixture contract: synthetic classification missing or changed');process.exit(1)}
const m2=fixture.M2 || {};
for(const key of ['objective','evaluation_question','indicator','data_source','instrument','quality_check','criterion','possible_decision']){
  if(!m2[key]){console.error(`R3-R10 fixture contract: M2.${key} missing`);process.exit(1)}
}
const missingEvidence=fixture.M2_MISSING_EVIDENCE || {};
for(const key of ['evaluation_question','missing_evidence','data_source','instrument','rationale','decision_improved','confidence']){
  if(!missingEvidence[key]){console.error(`R3-R10 fixture contract: M2_MISSING_EVIDENCE.${key} missing`);process.exit(1)}
}
const m3=fixture.M3_EVALUATION_DECISION || {};
for(const key of ['evidence','interpretation','limitation','criterion','judgment','recommendation','action','decision_code','confidence']){
  if(!m3[key]){console.error(`R3-R10 fixture contract: M3_EVALUATION_DECISION.${key} missing`);process.exit(1)}
}
const allowedDecisionCodes=new Set(['CONTINUE','CONTINUE_WITH_MODIFICATION','COLLECT_MORE_EVIDENCE','DISCONTINUE']);
if(!allowedDecisionCodes.has(m3.decision_code)){console.error('R3-R10 fixture contract: invalid Mission 3 decision_code');process.exit(1)}
if(!Array.isArray(m3.perspective_rotation) || m3.perspective_rotation.length !== 4){console.error('R3-R10 fixture contract: Mission 3 perspective rotation must contain four roles');process.exit(1)}
console.log('R3-R10 reversible preparation + synthetic evidence contract: PASS');
