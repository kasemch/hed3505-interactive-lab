# HED3505 Student Functional Pilot — SFP-01

Status: PRE-REAL-STUDENT ENGINEERING PASS / RUNTIME GATES BLOCKED — NOT EXECUTED
Target: WordPress staging, mobile-first
Baseline: HED3505 Independent Learning v3.2
Date updated: 2026-10-05

## Current verified student contract
- Mission 1 — Evidence Detective: individual reasoning from evidence toward interpretation/judgment, followed by guided feedback and revision.
- Mission 2 — Build & Challenge: Evaluation Chain plus **Self-Audit** and Missing Evidence Challenge. Peer Audit is not part of the current student-facing baseline.
- Mission 3 — Individual Evaluation Decision Challenge: the learner rotates perspectives (Evaluator → Evidence Auditor → Stakeholder → Decision Maker) and defends one of four decisions: CONTINUE / CONTINUE WITH MODIFICATION / COLLECT MORE EVIDENCE / DISCONTINUE.
- The current reasoning chain is Evidence → Interpretation → Limitation → Criterion → Judgment → Recommendation → Action → Re-evaluation.
- There is no predetermined correct final decision; defensibility of reasoning is the target.
- Teacher Key remains separated from the student-facing experience.
- Page views alone do not count as completion.

## Current staging QA evidence
Latest controlled Lighthouse evidence:
- Performance: 100/100
- Accessibility: 97/100 — PASS WITH CONDITION
- Best Practices: 100/100
- LCP: 1.0 s
- CLS: 0
- TBT: 30 ms
- FCP: 0.9 s
- Speed Index: 2.8 s
- Field data: unavailable; laboratory data only.

Open accessibility item: one color-contrast finding remains. Do not claim it is fixed without a new rendered audit identifying and closing the actual offending element.

## Assessment and persistence contract
- Mission 1 — learning evidence may preserve first answer → guided feedback viewed → revised answer according to the approved v3.2 lifecycle.
- Mission 2 — EVIDENCE CANDIDATE: Evaluation Chain, Self-Audit, missing-evidence rationale, evidence-confidence judgment and revision demonstrate evaluation-design alignment and evaluative reasoning.
- Mission 3 — EVIDENCE CANDIDATE: individual decision reasoning and revision demonstrate defensible evaluation judgment. The former group Evaluation Hearing is superseded as current pedagogy and retained only in historical/legacy-storage traceability where necessary.
- Completion must be derived from authoritative learning records; a page view or client-side completion flag is not authoritative.

## Data minimization
Persist only what is necessary for learning evidence and authorization: activity/mission identity, authorized learner mapping, response/evidence payload, revision/version, required feedback-view state, completion state where server-authoritative, timestamps, and authorized assessment/feedback state. Do not collect unrelated personal data. Do not store passwords, OTPs, JWTs or session cookies in repository evidence.

## Runtime boundary
The code/build/documentation contract is ready for runtime verification, but the current tool surface does not expose callable Neon runtime actions. Therefore the following are **BLOCKED — NOT EXECUTED** rather than failed:
- Student A/B/Teacher authenticated RLS matrix
- positive Mission 1–3 persistence
- feedback-view and revision lifecycle persistence
- server-authoritative completion recomputation
- teacher course_staff authorization
- certificate eligibility/idempotency and VALID/REVOKED/NOT FOUND verification

Do not switch to Supabase, weaken RLS, use the Neon production branch, or infer runtime PASS from static/build CI.

## Gates
- Independent-learning student contract: PASS
- Static/code/build readiness: PASS
- Accessibility: PASS WITH CONDITION (one contrast finding)
- Runtime Auth/RLS/Persistence/Completion/Certificate E2E: BLOCKED — NOT EXECUTED
- Real-student usability/activation: HOLD
- Real certificate: HOLD
- Production: HOLD
- PR merge: HOLD
- GitHub Pages retirement/redirect: HOLD
