# HED3505 Interactive Challenge Prototype — AL-03

Status: STAGING IMPLEMENTED / v3.2 TRANSITION BASELINE

## Current student-facing interaction contract
### Mission 1 — Evaluation Detective
- support-level choice
- rationale field
- defensible-revision field
- self-check reasoning checklist
- Guided Feedback → Revision

### Mission 2 — Build & Challenge the Evaluation
- eight-field evaluation chain
- Self-Audit rather than peer audit
- gap-identification and revision field
- Missing Evidence Challenge
- Evidence Confidence: Low / Moderate / High + justification
- Guided Feedback → Revision

### Mission 3 — Individual Evaluation Decision Challenge
- individual perspective rotation: Evaluator → Evidence Auditor → Stakeholder → Decision Maker
- Evidence → Interpretation → Limitation → Criterion → Judgment → Recommendation → Action → Re-evaluation
- decision: CONTINUE / CONTINUE WITH MODIFICATION / COLLECT MORE EVIDENCE / DISCONTINUE
- Guided Feedback → Revision
- defensibility is assessed; no predetermined single correct decision

## Persistence transition
The original AL-03 prototype was non-persistent. The approved v3.2 architecture supersedes that limitation: required M1–M3 submissions, feedback-view events, revisions, and completion evidence are intended to persist through the authenticated Neon student-record layer.

This document does **not** claim that runtime persistence has passed. Runtime authenticated RLS/persistence testing remains BLOCKED/NOT EXECUTED until the Neon runtime capability is available.

## Privacy and security
- No password, OTP, JWT, or session cookie belongs in repository content or student evidence records.
- Teacher Key is not embedded in student-facing content.
- Students must only access their own learning evidence.
- Teacher access requires explicit course_staff authorization.
- Page views alone are not authoritative completion evidence.

## Functional gates
Already established at code/staging level:
- current v3.2 learning semantics
- OTP-oriented authentication contract
- SDK/package/static build regression checks

Still required before real students:
1. Student A/B authenticated RLS isolation
2. Teacher authorization
3. positive submission persistence
4. feedback-view and revision lifecycle
5. completion eligibility recomputation from authoritative records
6. certificate issuance/idempotency and public-verification privacy
7. mobile/accessibility acceptance

## Architecture
GitHub = source of truth.
WordPress staging = primary student UX.
Neon = authoritative learning-record target after runtime gates pass.
GitHub Pages = legacy/read-only fallback.
Vercel = out of scope.
Production, PR merge, real students, and real certificate issuance remain HOLD.
