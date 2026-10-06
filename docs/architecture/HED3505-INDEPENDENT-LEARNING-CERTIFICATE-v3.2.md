# HED3505 Independent Learning System v3.2

Status: NON-PRODUCTION IMPLEMENTATION BASELINE

## Purpose
Replace the final classroom-dependent session with an asynchronous independent learning path. WordPress controls sequence, activities, feedback, progress and certificate UX. Neon is authoritative for student learning records. Downloadable DOCX/PDF remain reading and activity resources. GitHub remains source of truth.

## Student path
START HERE → Orientation → Read/Review → Mission 1 → Submit → Guided Feedback → Revise → Read/Review → Mission 2 → Submit → Guided Feedback → Revise → Read/Review → Mission 3 → Submit → Guided Feedback → Revise → Final Review → Key Terms → Practice Exam → Answers/Explanations → Final Self-check → Completion → Certificate.

No peer, synchronous meeting, or instructor presence is required.

## Mission 1 — Evidence Detective
Individual sequence: read the complete assigned case → classify Fact / Interpretation / Assumption / Judgment → explain uncertainty → submit → unlock guided answer → revise → reflect.

## Mission 2 — Build & Challenge the Evaluation
Individual sequence: Purpose/Decision use → Evaluation Question → Indicator → Data Source → Instrument → Quality Evidence → Criterion → Possible Decision → self-audit → Missing Evidence Challenge → written Evidence Defense → submit → feedback → revise.

## Mission 3 — Individual Evaluation Decision Challenge
Replaces group Evaluation Hearing. One learner rotates through Evaluator → Evidence Auditor → Stakeholder → Decision Maker. Required chain: Evidence → Interpretation → Limitation → Criterion → Judgment → Recommendation → Action → Re-evaluation. Allowed final decisions: CONTINUE / CONTINUE WITH MODIFICATION / COLLECT MORE EVIDENCE / DISCONTINUE. Assessment is based on defensibility, not a predetermined decision.

## Required activity contract
Every required activity contains: full prerequisite reading; full case/scenario; purpose; estimated time; step-by-step participation instructions; response fields; writing scaffold; submit action; post-submit answer/guided feedback; academic rationale; common errors; revision; reflection; completion rule.

Master Case facts must remain locked. Synthetic cases must be labeled as educational simulations.

## Final Review & Exam Readiness
Student area must contain a comprehensive pre-final review, key terminology and distinctions, misconception checks, one-page evidence reasoning canvas, student practice questions, answers/explanations revealed after attempt, essay blueprints, examples of answer quality, rubric, and final self-assessment.

Instructor-only exam resources are separate and must never be exposed in Student View: blueprint/table of specifications, sample instructor items, answer key, scoring guide, analytic rubric and item-to-outcome mapping.

## Student record model
Authoritative event chain:
learner_identity → activity_attempt → submission → feedback_viewed → revision → completion → certificate_eligibility → certificate_issue → certificate_verification.

Minimum activity record: learner id; course/module id; mission/activity id; attempt number; submitted_at; response payload; status; assessment status/score where applicable; feedback_viewed_at; revised_at; completed_at; version.

C1-style practice may remain nonpersistent. Required M1–M3 evidence is persistent only for authenticated and eligible learners under RLS.

## Completion policy
Certificate eligibility requires ALL of the following:
1. Mission 1 completed.
2. Mission 2 completed.
3. Mission 3 completed.
4. Required submissions exist.
5. Required guided feedback has been viewed.
6. Required revision/reflection has been completed.
7. Final Review completed.
8. Practice Check attempted/completed according to the approved assessment rule.

Page views alone never count as completion.

## Certificate
Name: HED3505 Independent Learning — Certificate of Completion / ใบรับรองการสำเร็จกิจกรรมการเรียนรู้.

Fields: learner display name; course HED3505; completion title; completion date; instructor ผู้ช่วยศาสตราจารย์ ดร.เกษม ชูรัตน์; opaque certificate ID; verification QR/URL; version.

Certificate must not expose student answers or scores. Certificate issuance is server-authoritative and idempotent. Repeated requests must return the same valid certificate for the same learner/completion/version unless an authorized revocation/reissue process exists.

## Certificate verification
Public verification uses only an opaque certificate identifier. It returns the minimum public result: VALID / REVOKED / NOT FOUND, certificate title, learner display name as approved for public display, completion date, course, issuer/instructor, certificate version. Never return email, auth id, raw learner id, scores, answers, attempt history or internal database identifiers.

QR points only to the verification route. Do not encode PII or scores in QR payload.

## Teacher dashboard
Roster matrix: learner | M1 | M2 | M3 | Final Review | Practice | Completion | Certificate.
Learner drill-down: activity timeline → first submission → feedback viewed → revision → assessment/status. Export is teacher-authorized only.

## Security & privacy
Neon RLS remains authoritative. Students can read/write only their own eligible records. Teacher access requires explicit course_staff authorization. Public certificate verification must use a deliberately public, minimal projection/function and must not open student tables to anonymous access. No JWT, OTP or password is stored in WordPress/localStorage. UI progress is derived from authoritative records, not trusted client flags.

## Release gates
Before real students: authenticated Student A / Student B / Teacher isolation matrix; positive persistence UI test; completion-state test; duplicate-submit/idempotency test; certificate eligibility negative/positive tests; certificate issue idempotency; public verification privacy test; invalid/revoked/not-found tests; mobile/accessibility QA; retention/export/delete policy; human acceptance.

## Protected HOLDs
WordPress production, Neon production, PR merge, GitHub Pages retirement/redirect/delete, real-student activation/import, destructive migration, security weakening and public student evidence remain HOLD until explicit approval.
