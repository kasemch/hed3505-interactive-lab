# HED3505 Student Records & Learning Evidence — SREA-02N

Status: INTEGRATION READINESS / NON-PRODUCTION
Backend baseline: Neon Lakebase Postgres
Frontend baseline: WordPress staging
Source of truth: GitHub
Production / real students / PR merge: HOLD

## Isolation
Neon project: winter-sun-55259147
Sandbox branch: hed3505-learning-evidence-sandbox (br-steep-hall-b3nm8s2p)
Database: neondb
Schema exposed through Data API: hed3505 only.
Trusted Auth origin: staging.kengkasem.com only.

## Entities
learner_identity, activity_attempt, group_hearing, assessment, audit_event, course_staff.

## Security baseline
RLS is enabled on every HED3505 table. Anonymous access has no learning-evidence privileges. audit_event has no client RLS policy and remains deny-by-default. Existing authenticated table grants are explicit. Automatic default privileges for future tables were revoked so future tables require deliberate grants and RLS review.

## Verification status
Anonymous Data API deny: PASS.
Authenticated role without JWT sees zero rows across learner_identity, activity_attempt, group_hearing, assessment, and course_staff: PASS.
Real JWT allow-path and cross-user isolation: PENDING integration test.
No security control may be weakened to force a passing test.

## Gates
Database/RLS configuration: PASS.
Authenticated E2E: PENDING.
Real-student pilot: HOLD.
Production: HOLD.
