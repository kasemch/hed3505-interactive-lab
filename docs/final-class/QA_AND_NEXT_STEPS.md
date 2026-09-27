# HED3505 Final Class — QA and integration gates

Status: controlled prototype; not production; no real student data. Existing five-module lab must remain unchanged.

## Confirmed by source inspection, not runtime testing
- `index.html` contains a first-response textarea, feedback section initially hidden, revision textarea and TXT export.
- Initial answer is locked after clicking Analyze; feedback is then revealed. The initial answer is retained in page memory, not a database.
- Three keyword checks detect mention of satisfaction, CPR skill, and evidence/limitations. These are **presence checks only**, not semantic correctness or grading.
- Revised response and original are exported together with feedback; no Neon connection or AI API call is present.

## Issues to address before a classroom pilot
1. Minimum 30 characters is not a validity test; a long irrelevant answer can pass. Never label keyword detection as an accurate academic assessment.
2. The first answer is lost on reload, tab close, or device failure until the export is completed. Add an explicit recovery design before real use.
3. A learner can submit a revised response identical to the original. Prompt reflection, but do not fabricate improvement.
4. The page is a single sample activity, not the complete 180-minute Final Class or the ten-screen product.
5. No authenticated identity, submission receipt, Neon persistence, teacher dashboard, or verified end-to-end browser/mobile tests exist in this branch.
6. Do not expose instructor-only Round 2 evidence or teacher keys before the authorized reveal.

## Academic acceptance scenarios
- Blank/short answer: no feedback and no submission.
- First valid answer: freeze exact first text, then reveal feedback; prevent overwriting it.
- Answer mentions satisfaction only: prompt distinction between satisfaction and CPR performance.
- Answer mentions 4.3/5 and 38% but reaches an unsupported conclusion: do not award a correctness judgment merely because keywords match.
- Revised answer: retain first and revised versions separately; export both, and show limitations of feedback.
- Refresh before export: demonstrate current data-loss behavior and document fallback.
- Keyboard and mobile viewport: check focus, button sizes, readable Thai text, and file download on actual devices.

## Course-specific extension
Use HED3505 v5.1 as content authority: pre-test, case reading, evidence register, initial judgment, controlled Round 2 integrity reveal, revised judgment, evaluation hearing, decision brief, post-test. Activities remain configurable; each has prompt, evidence permissions, rubric, feedback, linked lesson, reflection, revision and export. Do not insert flood/water topics into course content.

## Neon staging integration gate
Keep this static prototype disconnected until invitation-only authentication, signed JWT/RLS checks for student/instructor roles, per-session access, no anonymous grants, CORS origin, insert/read ownership, and teacher-only reveal are verified with synthetic accounts. Never place Neon database passwords or privileged credentials in GitHub Pages JavaScript. Preserve local export as fallback. Instructor controls final grade; AI/keyword hints are formative only.

Release gate: no merge to live Pages branch and no real student use until academic content review, browser/mobile acceptance, auth/RLS acceptance, and explicit instructor approval.