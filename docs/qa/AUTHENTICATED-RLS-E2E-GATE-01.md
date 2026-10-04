# HED3505 Authenticated RLS E2E Gate — 01

Status: PENDING AUTHENTICATED SESSION
Scope: STAGING / Neon sandbox only

## Preconditions already verified

- Neon Managed Better Auth provisioned on the sandbox branch.
- Google OAuth configured.
- staging.kengkasem.com is a trusted domain.
- Neon Data API exposes only schema hed3505.
- RLS is enabled on all HED3505 application tables.
- Anonymous/deny path passed.
- Synthetic fixture readiness passed: two learners, two activity attempts, one active teacher.
- Official SDK/Auth integration path is locked in NAI-01.

## Required E2E evidence

Do not mark this gate PASS until a genuine Neon Auth session and JWT prove all of the following through the Data API:

1. anonymous learning-evidence access is denied;
2. Student A can read only Student A learner identity/evidence;
3. Student B can read only Student B learner identity/evidence;
4. the two learner identities remain isolated;
5. a student cannot write an assessment;
6. an authorized teacher resolves to active course_staff and receives only intended staff access;
7. audit_event is not exposed to ordinary clients;
8. no password, OTP, session cookie, JWT, or API credential is emitted to repository logs or the student UI.

## Prohibited shortcuts

- No fabricated JWTs.
- No direct password-hash injection.
- No weakening RLS, grants, email verification, or trusted-origin controls.
- No use of owner SQL as a substitute for authenticated E2E evidence.
- No real student records during this gate.

## Release holds

Until this gate passes:

- Real-student access: HOLD
- Production WordPress: HOLD
- Neon production branch: HOLD
- GitHub PR merge: HOLD
- GitHub Pages retirement/redirect: HOLD

The existing password-based CI harness is non-authoritative until supported test credentials are available through Neon Auth.
