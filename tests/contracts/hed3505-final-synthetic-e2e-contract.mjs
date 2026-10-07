import fs from 'node:fs';

const fixture=JSON.parse(fs.readFileSync('tests/neon/fixtures/complete-learning-evidence-payloads.json','utf8'));
const qa=fs.readFileSync('docs/qa/HED3505-SYNTHETIC-E2E-TEACHER-DASHBOARD-01.md','utf8');
const config=fs.readFileSync('wordpress/final-learning-studio/v3.2-independent-learning-config.js','utf8');

const must=(ok,msg)=>{ if(!ok) throw new Error(`Final synthetic E2E: ${msg}`); };
must(fixture.classification==='SYNTHETIC / SANDBOX ONLY','fixture classification must remain synthetic/sandbox only');
must(fixture.M1?.initial && fixture.M1?.guided_feedback && fixture.M1?.revision && fixture.M1?.reflection,'Mission 1 initial→feedback→revision→reflection chain missing');
must(fixture.M2?.self_audit && fixture.M2?.guided_feedback && fixture.M2?.final_revision,'Mission 2 audit→feedback→revision chain missing');
must(fixture.M2_MISSING_EVIDENCE?.revision_after_feedback,'Mission 2 missing-evidence revision missing');
must(fixture.M3_EVALUATION_DECISION?.initial && fixture.M3_EVALUATION_DECISION?.guided_feedback && fixture.M3_EVALUATION_DECISION?.revision,'Mission 3 initial→feedback→revision chain missing');
must(Array.isArray(fixture.M3_EVALUATION_DECISION?.perspective_rotation) && fixture.M3_EVALUATION_DECISION.perspective_rotation.length===4,'Mission 3 four-perspective rotation missing');

for(const text of ['SYN-A','SYN-B','SYN-C','SYN-X','Learners: 3','Completed: 1','Need Attention: 1','Not Started: 1','Certificate Eligible: 1']) must(qa.includes(text),`QA synthetic cohort/pulse evidence missing ${text}`);
must(/SYN-X[^\n]*(DENIED|denied)/.test(qa),'SYN-X denial/exclusion must remain explicit');
must(/SYN-B[^\n]*(REVISION REQUIRED|revision incomplete)/.test(qa),'SYN-B revision-required path must remain explicit');
must(/SYN-C[^\n]*(not started|LOCKED)/i.test(qa),'SYN-C not-started path must remain explicit');

for(const event of ['mission-1-completed','mission-2-completed','mission-3-completed','required-feedback-viewed','required-revision-completed','final-review-completed','practice-check-completed']) must(config.includes(event),`completion event missing ${event}`);
must(config.includes("eligibilitySource: 'server-authoritative'"),'certificate authority must remain server-authoritative');
must(fixture.COMPLETION?.certificate_eligible===false,'runtime-unproven fixture must remain certificate locked');
must(fixture.COMPLETION?.all_requirements_met===false,'runtime-unproven fixture must remain incomplete');

for(const forbidden of ['Runtime Security/RLS: PASS','Real Student Activation: PASS','Production: PASS']) must(!qa.includes(forbidden),`premature release claim forbidden: ${forbidden}`);
must(qa.includes('Real Student Activation: HOLD'),'real-student hold missing');
must(qa.includes('Production: HOLD'),'production hold missing');
must(qa.includes('GitHub PR merge: HOLD'),'PR merge hold missing');

console.log('Final synthetic E2E static readiness contract: PASS');
console.log('Synthetic learner paths, teacher pulse, completion/certificate lock, privacy/release holds remain coherent.');
console.log('This is static/synthetic readiness only; R2-SYN runtime and R2-LIVE remain separate gates.');
