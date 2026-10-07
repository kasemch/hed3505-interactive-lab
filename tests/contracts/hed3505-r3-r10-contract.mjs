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
const m1=fixture.M1 || {};
for(const key of ['initial','guided_feedback','revision','reflection']){
  if(!m1[key]){console.error(`R3-R10 fixture contract: M1.${key} missing`);process.exit(1)}
}
for(const stage of ['initial','revision']){
  for(const key of ['fact','interpretation','assumption','judgment']){
    if(!m1[stage]?.[key]){console.error(`R3-R10 fixture contract: M1.${stage}.${key} missing`);process.exit(1)}
  }
}
const m2=fixture.M2 || {};
for(const key of ['objective','evaluation_question','indicator','data_source','instrument','quality_check','criterion','possible_decision','self_audit','guided_feedback','final_revision']){
  if(!m2[key]){console.error(`R3-R10 fixture contract: M2.${key} missing`);process.exit(1)}
}
const missingEvidence=fixture.M2_MISSING_EVIDENCE || {};
for(const key of ['evaluation_question','missing_evidence','data_source','instrument','rationale','decision_improved','confidence','revision_after_feedback']){
  if(!missingEvidence[key]){console.error(`R3-R10 fixture contract: M2_MISSING_EVIDENCE.${key} missing`);process.exit(1)}
}
const m3=fixture.M3_EVALUATION_DECISION || {};
for(const key of ['initial','guided_feedback','revision','evidence','interpretation','limitation','criterion','judgment','recommendation','action','decision_code','confidence']){
  if(!m3[key]){console.error(`R3-R10 fixture contract: M3_EVALUATION_DECISION.${key} missing`);process.exit(1)}
}
for(const stage of ['initial','revision']){
  for(const key of ['evidence','interpretation','limitation','criterion','judgment','recommendation','action','decision_code','confidence']){
    if(!m3[stage]?.[key]){console.error(`R3-R10 fixture contract: M3_EVALUATION_DECISION.${stage}.${key} missing`);process.exit(1)}
  }
}
const allowedDecisionCodes=new Set(['CONTINUE','CONTINUE_WITH_MODIFICATION','COLLECT_MORE_EVIDENCE','DISCONTINUE']);
if(!allowedDecisionCodes.has(m3.decision_code) || !allowedDecisionCodes.has(m3.initial.decision_code) || !allowedDecisionCodes.has(m3.revision.decision_code)){
  console.error('R3-R10 fixture contract: invalid Mission 3 decision_code');process.exit(1);
}
if(!Array.isArray(m3.perspective_rotation) || m3.perspective_rotation.length !== 4){console.error('R3-R10 fixture contract: Mission 3 perspective rotation must contain four roles');process.exit(1)}
const completion=fixture.COMPLETION || {};
const requiredCompletion=['mission-1-completed','mission-2-completed','mission-3-completed','required-feedback-viewed','required-revision-completed','final-review-completed','practice-check-completed'];
if(!Array.isArray(completion.required_events) || requiredCompletion.some(x=>!completion.required_events.includes(x))){
  console.error('R3-R10 completion fixture: required completion events are incomplete');process.exit(1);
}
if(completion.certificate_eligible !== false || completion.all_requirements_met !== false){
  console.error('R3-R10 certificate lock: synthetic fixture must remain ineligible until runtime completion is proven');process.exit(1);
}

const configPath='wordpress/final-learning-studio/v3.2-independent-learning-config.js';
if(!fs.existsSync(configPath)){console.error('R3-R10 lifecycle contract: v3.2 independent-learning config missing');process.exit(1)}
const configText=fs.readFileSync(configPath,'utf8');
const lifecycleNeedles=[
  'mission-1','classify-evidence','view-guided-feedback','revise','reflect',
  'mission-2','build-evaluation-chain','self-audit','missing-evidence','written-defense',
  'mission-3','audit-evidence','identify-unknowns','set-criterion','write-defense','view-defensible-answer',
  'mission-1-completed','mission-2-completed','mission-3-completed',
  'required-feedback-viewed','required-revision-completed','final-review-completed','practice-check-completed'
];
for(const needle of lifecycleNeedles){
  if(!configText.includes(needle)){console.error(`R3-R10 lifecycle contract: ${needle} missing from v3.2 config`);process.exit(1)}
}
for(const decision of ['CONTINUE','CONTINUE WITH MODIFICATION','COLLECT MORE EVIDENCE','DISCONTINUE']){
  if(!configText.includes(decision)){console.error(`R3-R10 lifecycle contract: canonical decision ${decision} missing`);process.exit(1)}
}
for(const role of ['Evaluator','Evidence Auditor','Stakeholder','Decision Maker']){
  if(!configText.includes(role)){console.error(`R3-R10 lifecycle contract: Mission 3 role ${role} missing`);process.exit(1)}
}
if(!configText.includes("eligibilitySource: 'server-authoritative'")){
  console.error('R3-R10 certificate contract: eligibility must remain server-authoritative');process.exit(1);
}
if(!configText.includes("verification: 'opaque-certificate-id-only'")){
  console.error('R3-R10 certificate contract: public verification must use opaque certificate id only');process.exit(1);
}
for(const forbidden of ['email','auth_id','learner_id','score','answers','attempt_history','internal_ids']){
  if(!configText.includes(`'${forbidden}'`)){console.error(`R3-R10 certificate privacy contract: forbidden public field ${forbidden} missing`);process.exit(1)}
}
console.log('R3-R10 synthetic initial→feedback→revision contract: PASS');
console.log('R3-R10 lifecycle + completion + certificate authority contract: PASS');
console.log('R3-R10 reversible preparation + synthetic evidence contract: PASS');
