import fs from 'node:fs';

const required = [
  ['Mission 1','Fact'], ['Mission 1','Interpretation'], ['Mission 1','Assumption'], ['Mission 1','Judgment'],
  ['Mission 2','Evaluation Question'], ['Mission 2','Indicator'], ['Mission 2','Data Source'], ['Mission 2','Criterion'],
  ['Mission 3','CONTINUE'], ['Mission 3','COLLECT MORE EVIDENCE'],
  ['Final Review','Measurement'], ['Final Review','IOC'], ['Final Review','Triangulation'],
  ['Exam Readiness','MCQ'], ['Exam Readiness','short answer'],
  ['Teacher Command Center','misconception'], ['Accessibility','keyboard']
];
const roots=['wordpress','src','docs','content','activities','tests'];
function walk(p){if(!fs.existsSync(p))return[];const s=fs.statSync(p);if(s.isFile())return[p];return fs.readdirSync(p).flatMap(x=>walk(`${p}/${x}`));}
const files=roots.flatMap(walk).filter(f=>/\.(md|html|js|mjs|json|php|txt|yml|yaml)$/i.test(f));
const corpus=files.map(f=>{try{return fs.readFileSync(f,'utf8')}catch{return ''}}).join('\n');
let failed=0;
for(const [area,needle] of required){const ok=corpus.toLowerCase().includes(needle.toLowerCase());console.log(`${area}: ${needle}: ${ok?'PRESENT':'MISSING'}`);if(!ok)failed++;}
if(failed){console.error(`R3-R10 preparation contract: ${failed} required concepts missing`);process.exit(1)}
console.log('R3-R10 reversible preparation contract: PASS');
