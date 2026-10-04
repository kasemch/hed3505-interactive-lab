# HED3505 — MASTER FULL-BATCH STUDENT EXPERIENCE IMPLEMENTATION & CONTINUATION COMMAND v6.0

## 0. AUTHORITY
Status: APPROVED EXECUTION BASELINE
Project: HED3505 Final Learning Studio
Platform baseline: GitHub → WordPress → Neon
Primary student experience: WordPress staging
GitHub: Source of Truth
Neon: learning-evidence datastore
GitHub Pages: legacy/fallback only
Vercel: OUT OF SCOPE

Execute continuously using:
INSPECT → VERIFY → EXECUTE → TEST → FIX → RETEST → DOCUMENT → CONTINUE.
Do not stop for minor/reversible work. Stop only at a protected Human Approval Gate.

## 1. APPROVED VISUAL BASELINE
Implement Hybrid Design 3 + 4 + 10:
Student Mission Dashboard + Evaluation Studio + Adaptive Student Workspace.
Approved instructor portrait is now WordPress Media attachment ID 158.
Instructor must display as:
ผู้ช่วยศาสตราจารย์ ดร.เกษม ชูรัตน์
Do not AI-regenerate or alter the instructor's face.

## 2. STUDENT HOME
Build a visual, welcoming, academically credible home with:
- Hero with course HED3505 and instructor portrait
- concise course purpose
- Continue Learning
- overall progress
- recommended next mission
- My Evidence summary
- SEE → MAP → ASK → TRUST → INTERPRET → JUDGE → ACT journey
- Case Study card
- Challenges
- Evaluation Hearing
- Exam Ready
- Student Handbook / PDF Center
Desktop navigation: Home / Lessons / Challenges / My Evidence / Exam Ready.
Mobile navigation: Home / Learn / Challenges / My Evidence.

## 3. VISUAL LEARNING SYSTEM
Use purposeful illustrations and diagrams, not text walls.
Create visual assets for:
- school-health context
- Evidence Detective
- Logic Model / Program Theory
- evaluation questions and indicators
- evidence trustworthiness
- triangulation / contradictory evidence
- judgment with criteria
- recommendation/action/re-evaluation
- Evaluation Hearing
- Exam Ready
All visuals must support comprehension and include useful alt text.
Avoid decorative overload and avoid fabricated case facts.

## 4. CASE STUDY READER — LOCKED FACTS ONLY
Case: โรงเรียนอรุณพัฒนา.
Facts:
students 1,800; staff 108;
sufficient PA 59%; insufficient 41%;
overweight/obesity 24.8%;
sugary drink ≥5d 37%;
sleep <7h 44%;
high stress 22%;
ever tried vaping 11%;
CPR knowledge pass 81%;
CPR performance pass 38%;
satisfaction 4.3/5.
Present in four clearly separated layers:
FACTS / INTERPRETATION PROMPTS / UNKNOWNS / EVIDENCE NEEDED.
Never invent school size, location, demographics, program duration, causal claims, or additional statistics.

## 5. FIRST-LOGIN / FIRST-VISIT ONBOARDING
Create an accessible dismissible popup/guided tour:
1 Welcome
2 Read the case study
3 Follow the seven-step journey
4 Complete Challenges
5 Save eligible learning evidence only after authenticated/enrolled
6 Join Evaluation Hearing
7 Review feedback and prepare for exam
Provide Skip, Next, Back, Finish, and “เปิดวิธีใช้งานอีกครั้ง”.
Remember dismissal locally without storing academic evidence.
Never request passwords/OTP in the popup.

## 6. WRITING GUIDANCE & EXAMPLES
For each writing activity provide:
- What the question asks
- recommended response structure
- short synthetic example unrelated to the live answer
- common overclaim warning
- checklist/rubric
- revise prompt
Core reasoning scaffold:
Evidence → Interpretation → Criterion → Judgment → Recommendation → Action → Re-evaluation.
Examples teach reasoning; never provide a ready-made answer to the active case.

## 7. ACTIVE LEARNING
Maintain progression:
Evaluation Detective → Build the Evaluation (C2) → Missing Evidence (C3) → Evaluation Hearing.
C1 remains practice/non-persistent.
C2/C3/Hearing persist only through approved authenticated flow.
Keep “หลักฐานยังไม่พอ / I Don't Know Yet” as academically valid.
Keep Evidence Confidence Low/Moderate/High + reason.

## 8. EVALUATION HEARING CONTRACT
Display only:
CONTINUE = ดำเนินการต่อ
CONTINUE_WITH_MODIFICATION = ดำเนินการต่อโดยปรับปรุง
COLLECT_MORE_EVIDENCE = เก็บหลักฐานเพิ่ม
DISCONTINUE = ยุติ
Remove/confine legacy vocabulary that implies an unapproved fifth decision.
Reasoning sequence:
Evidence → Interpretation → Criterion → Judgment → Limitation → Recommendation/Action.
No predetermined correct decision.

## 9. INPUT VALIDATION & UX
Preserve active staging persistence.
Validate required fields before network write.
Use Thai, clear, consistent validation messages.
Do not let authentication messages obscure missing-field validation.
C2 should capture a meaningful Final Revision rather than a generic hard-coded sentence where feasible.
Fail closed on malformed input.
RLS remains authoritative; client validation is UX only.

## 10. DATA LIFECYCLE
C1 non-persistent.
Minimize C2/C3/Hearing payloads.
No password, OTP, cookie, JWT, API credential in learning records/logs/DOM diagnostics.
Identity remains separate from response payload.
Before real students, require explicit approved retention/export/delete policy.
No destructive cleanup or production retention automation without Human Gate.

## 11. STUDENT HANDBOOK PDF SET
Prepare detailed, accessible, printable, versioned PDFs:
A. คู่มือการใช้งานระบบและเส้นทางการเรียนรู้
B. ชุดกรณีศึกษาโรงเรียนอรุณพัฒนา
C. คู่มือการเขียนคำตอบและการให้เหตุผลเชิงประเมิน
D. Rubric และคู่มือเตรียมสอบอัตนัย
Each PDF must match web terminology and the locked case.
Include contents, headings, examples, checklists, accessibility-conscious layout, version/date, instructor.
Do not publish incomplete PDFs as final.

## 12. ACCESSIBILITY
Maintain semantic headings, labels, fieldsets/legends, keyboard access, focus-visible, alt text, responsive tables, reduced text density.
Existing Accessibility status remains PASS WITH CONDITION until the exact remaining Lighthouse color-contrast node is evidenced and fixed.
Do not chase scores with speculative global CSS.
After meaningful UI changes, perform fresh mobile accessibility/performance regression.

## 13. PERFORMANCE
Preserve current strong mobile baseline.
Optimize image dimensions/loading.
Avoid unnecessary libraries and animation.
Prefer CSS/native JS and existing SDK.
Do not introduce Vercel or a new frontend framework.

## 14. SOURCE OF TRUTH
Mirror material staging code/content into branch:
hed3505-wordpress-final-learning-studio-01
Maintain docs/design, docs/qa, wordpress/final-learning-studio, activities, assessment as appropriate.
Keep PR #3 DRAFT.
Run relevant CI after commits.
Never merge without explicit Human Gate.

## 15. QA
Run:
- desktop/mobile visual inspection
- keyboard/labels/form semantics
- onboarding popup test
- case facts cross-check
- examples/no-answer-leak review
- C1 non-persistence
- C2/C3/Hearing empty + partial validation
- anonymous fail-closed
- no Teacher Key in student DOM
- no secret/token leakage
- navigation/link/PDF checks
- performance/accessibility regression
- authenticated positive persistence when a valid test session is available
Document PASS / PASS WITH CONDITION / BLOCKED precisely.

## 16. AUTHORIZATION TEST STRATEGY
Maintain approved single-identity genuine E2E + synthetic RBAC strategy.
Do not claim full multi-user live E2E.
Before real-student activation require:
Student A own evidence allowed;
Student B own evidence allowed;
cross-student denied;
student assessment writes denied;
authorized staff assessment workflow verified;
audit_event client-denied;
no credential/JWT/cookie/OTP/API credential leakage.

## 17. PROTECTED HUMAN GATES — STOP ONLY HERE
Stop before:
1 production WordPress deployment;
2 Neon production changes;
3 PR merge;
4 GitHub Pages redirect/delete/retirement;
5 real-student activation/import;
6 destructive migration;
7 material architecture replacement;
8 security weakening;
9 public release of student/assessment evidence.
Everything reversible in staging/sandbox/feature branch should proceed full-batch.

## 18. COMPLETION REPORT
At each major batch report:
- what was actually changed
- evidence/tests
- PASS / CONDITION / BLOCKED
- remaining risks
- current completion percentage
- next protected Human Gate
- next Master Continuation Command.
Never report an unverified action as complete.
