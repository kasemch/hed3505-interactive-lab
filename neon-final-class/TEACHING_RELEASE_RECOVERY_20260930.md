# HED3505 Teaching Release Recovery — 2026-09-30

Status: CONTROLLED STAGING / NOT PRODUCTION

## Verified
- PR #2 remains DRAFT and mergeable; production/default branch is not changed by this recovery pass.
- Latest head CI has three successful workflows: static lab validation, Neon staging build, and Pages preservation QA.
- Browser journey has been observed through sign-in, invited session visibility, join, and PRETEST write.
- Neon staging contains two synthetic participants and three PRETEST response revisions.
- RLS policies exist for sessions, participants, responses, case documents, assessments, peer feedback, invites, and events.
- Round 1 and Round 2 case documents for the approved Arun Pattana master case are now seeded in the isolated staging branch. Round 2 remains hidden by the database policy until ROUND2_OPEN and Initial Judgment gate conditions are satisfied.

## Current blockers before classroom release
1. Instructor roster is empty. Instructor dashboard, Round 2 opening, and assessment workflow therefore have not been accepted end-to-end.
2. Runtime two-account RLS isolation has not yet been independently proven; policy inspection alone is not treated as a pass.
3. Seven-person rehearsal has not been completed.
4. This remains synthetic-data staging. Do not use real student identifiers or claim production readiness.

## Operating decision
Stop feature expansion. Prioritize only the minimum teaching path:
Auth -> invite/join -> Round 1 evidence -> PRETEST -> INITIAL_JUDGMENT -> EVIDENCE_REGISTER -> instructor gate -> Round 2 -> revised work -> assessment.

No merge, production deployment, or real-student release until the remaining human/security gates are explicitly cleared.
