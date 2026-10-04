# HED3505 Authenticated RLS E2E Gate — 01

Status: PASS WITH ONE AUTHORIZATION-MATRIX CONDITION
Scope: STAGING / Neon sandbox only

## Verified evidence

- Neon Managed Better Auth is provisioned on the sandbox branch.
- staging.kengkasem.com is a trusted origin.
- Neon Data API exposes only schema hed3505.
- RLS is enabled on all six HED3505 application tables.
- Anonymous/deny path: PASS.
- Synthetic fixtures: PASS — two pilot learners, two submitted activity attempts, one active teacher.
- Genuine WordPress staging OTP authentication -> Neon JS SDK -> authenticated session -> Data API -> RLS probe: PASS.
- The authenticated Kasem test identity has no learner mapping and returned 0 learner rows: PASS privacy-by-default.
- audit_event has RLS enabled and zero client policies: deny-by-default configuration PASS.
- No real student data, password, OTP, JWT, or session cookie was added to the repository.

## Remaining condition

The following assertions still require genuine signed Student A, Student B, and Teacher sessions and MUST NOT be inferred from owner SQL or synthetic fixtures alone:

1. Student A can read only Student A learner/evidence rows.
2. Student B can read only Student B learner/evidence rows.
3. Student A and Student B cannot read each other's rows.
4. A student cannot create or modify assessment records through the Data API.
5. An active teacher can perform the intended assessment workflow through the Data API.

Automation harness: tests/neon/hed3505-authorization-matrix.mjs
Pilot enrollment design: docs/qa/CONTROLLED-PILOT-ROLE-ENROLLMENT-CPRE-01.md

## Prohibited shortcuts

- No fabricated JWTs or session cookies.
- No direct password-hash injection.
- No weakening RLS, grants, email verification, trusted origins, or Better Auth.
- No owner SQL as a substitute for authenticated E2E evidence.
- No real student academic records during this gate.

## Release holds

Until the remaining authenticated role matrix passes:
- Real-student access: HOLD
- Production WordPress: HOLD
- Neon production branch: HOLD
- GitHub PR merge: HOLD
- GitHub Pages retirement/redirect: HOLD
