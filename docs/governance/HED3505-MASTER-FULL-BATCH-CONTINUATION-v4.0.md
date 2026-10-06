# HED3505 Master Full-Batch Continuation v4.0

Status: APPROVED / LOCKED OPERATING BASELINE
Mode: FULL-BATCH / EVIDENCE-FIRST / REVERSIBLE-FIRST / EXCEPTION-STOP

This record locks the user-approved execution baseline for the HED3505 GitHub → WordPress → Neon Learning Studio.

## Execution rule
INSPECT → VERIFY → EXECUTE → TEST → FIX → RETEST → DOCUMENT → CONTINUE.

Do not stop for minor reversible work. Stop only at a genuine Human Approval Gate.

## Locked architecture
GitHub = source of truth and QA evidence.
WordPress = primary student learning experience.
Neon Auth / Neon JS SDK → Data API → PostgreSQL RLS = identity, records, evidence, assessment, authorization.
GitHub Pages = legacy/fallback only.
Vercel = out of scope.

## Current verified baseline
- Managed Better Auth: PASS.
- Trusted staging origin: PASS.
- Neon JS SDK / WordPress plugin path: PASS.
- OTP authentication and authenticated session: PASS.
- Data API + authenticated RLS probe: PASS.
- Unmapped authenticated test identity returned zero learner rows: privacy-by-default PASS.
- Anonymous deny path: PASS.
- Synthetic fixtures: two learners, two activity attempts, one active teacher.
- RLS enabled on all six hed3505 tables.
- audit_event: RLS enabled, no client policy, deny-by-default configuration PASS.
- Full per-role authorization matrix: remaining E2E condition.

## Next execution sequence
Current-state reconstruction → Authorization Matrix Harness → Controlled Pilot Role Validation → Student A/B Isolation → Teacher Authorization → Credential Leak Audit → Security Gate Closure → Legacy Auth Cleanup → Google OAuth Defect Isolation → Persistence Sandbox → Student/Teacher Journey QA → Accessibility/Privacy QA → Production Readiness Assessment.

## Human Approval Gates
Stop before:
1. WordPress production deployment.
2. Neon production branch modification.
3. GitHub PR merge.
4. GitHub Pages redirect/delete/retirement.
5. Real-student activation or import.
6. Destructive database migration.
7. Material architecture change.
8. Security/RLS/Auth weakening.
9. Public release of assessment/student evidence.

## Protected holds
Production WordPress = HOLD.
Neon production = HOLD.
Real students = HOLD.
PR merge = HOLD.
GitHub Pages retirement = HOLD.

## Evidence rule
Never infer PASS from configuration alone when signed authenticated E2E evidence is required. Never fabricate JWTs, inject password hashes, store OTP/password/JWT/session cookies, or substitute owner SQL for client authorization evidence.
