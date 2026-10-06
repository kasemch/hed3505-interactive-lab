# HED3505 Neon Synthetic Security Test — SST-01

Date: 2026-10-03
Environment: NON-PRODUCTION Neon sandbox
Real student data: NOT USED

## Verified
- Trusted Auth origin contains staging.kengkasem.com; production domain was not added.
- RLS enabled on all six HED3505 tables.
- audit_event has zero client policies (intentional deny-by-default).
- Anonymous Data API request is denied for missing bearer JWT.
- SET LOCAL ROLE authenticated without JWT returns zero visible rows for learner_identity, activity_attempt, group_hearing, assessment, and course_staff.
- Future-table authenticated default privileges were revoked; existing explicit table grants remain.

## Pending
A real Managed Better Auth JWT is still required to verify the positive allow-path and cross-user matrix:
1. Student A own SELECT/INSERT/UPDATE.
2. Student A cannot read/update Student B.
3. Student B reciprocal isolation.
4. Teacher course_staff read and course evidence read.
5. Teacher assessment INSERT/UPDATE for own assessor identity.
6. Student assessment write denied.
7. audit_event client access denied.

Direct SQL JWT simulation was rejected because pg_session_jwt requires runtime JWK configuration. This is treated as a valid test-environment boundary; no bypass was introduced.

## Gate result
Database/RLS Configuration Gate: PASS.
Authenticated E2E Gate: PENDING.
Overall Security Gate: PASS WITH CONDITION.
Production / real-student pilot / PR merge: HOLD.
