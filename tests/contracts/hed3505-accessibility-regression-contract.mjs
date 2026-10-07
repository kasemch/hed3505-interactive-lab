import fs from 'node:fs';

const qaPath='docs/qa/HED3505-SYNTHETIC-E2E-TEACHER-DASHBOARD-01.md';
const htmlPaths=['index.html','docs/index.html','auth-test/index.html'];
const cssPaths=['styles.css','docs/styles.css'];
const qa=fs.readFileSync(qaPath,'utf8');

if(!qa.includes('Accessibility 97')) throw new Error('A11Y contract: verified Lighthouse Accessibility 97 baseline missing');
if(!qa.toLowerCase().includes('color contrast')) throw new Error('A11Y contract: known contrast condition must remain explicit until retested');

for(const path of htmlPaths){
  const html=fs.readFileSync(path,'utf8');
  if(!/<html[^>]+lang=/i.test(html)) throw new Error(`A11Y contract: ${path} missing document language`);
  if(!/<meta[^>]+name=["']viewport["']/i.test(html)) throw new Error(`A11Y contract: ${path} missing mobile viewport`);
}

const learnerHtml=fs.readFileSync('index.html','utf8');
if(!/<button\b/i.test(learnerHtml)) throw new Error('A11Y contract: learner UI requires native button controls');
if(!/<main\b/i.test(learnerHtml) && !/role=["']main["']/i.test(learnerHtml)) throw new Error('A11Y contract: learner UI requires main landmark');

for(const path of cssPaths){
  const css=fs.readFileSync(path,'utf8');
  if(!/:focus-visible/i.test(css) && !/:focus\b/i.test(css)) throw new Error(`A11Y contract: ${path} missing keyboard focus styling`);
}

console.log('Accessibility structural regression contract: PASS');
console.log('Known color-contrast condition remains OPEN pending measured retest; this contract does not fabricate Lighthouse improvement.');
