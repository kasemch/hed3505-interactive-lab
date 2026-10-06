# HED3505 R2 Synthetic Auth Runtime Test — Decision & Status

Date: 2026-10-06
Status: R2 IN PROGRESS — branch-only; authenticated runtime evidence pending
Branch: `hed3505-r2-runtime-runner-main-01`
Environment: HED3505 Neon sandbox only

## Scope

Replace the OTP-secret-based CI harness with a controlled email/password sign-in test for three synthetic identities: Student A, Student B, and Teacher. The harness exercises genuine Neon Auth sessions and JWT exchange, Data API access, RLS isolation, and marked synthetic persistence.

## Security boundary

- The harness targets only the approved sandbox Auth and Data API endpoints and rejects any endpoint that differs.
- The workflow requires explicit sandbox and exact sandbox-branch confirmation.
- The harness signs in to pre-existing synthetic accounts; it does not create accounts or alter Auth configuration.
- Email verification remains governed by the existing sandbox configuration. No verification setting is changed or bypassed.
- Passwords are read only from GitHub Actions Secrets at runtime. They are never committed, printed, or included in test reports.
- No JWTs or session cookies are fabricated or printed; tokens remain in process memory.
- Student work and identities are synthetic. No production database, real learner data, merge, deployment, or student activation is in scope.
- Synthetic activity and assessment rows are tagged with `SYNTHETIC_E2E` and a workflow run identifier. They are retained in the sandbox for auditability; this harness does not delete records.

## Implemented

- Replaced OTP credential variables with six synthetic email/password secret references.
- Added strict sandbox endpoint validation and exact branch confirmation.
- Added real sign-in, session verification, and Neon Auth token exchange.
- Added anonymous-deny, A/B identity isolation, synthetic activity persistence/read-back, teacher staff/evidence access, teacher assessment persistence, student assessment-write denial, and audit-event isolation checks.
- Added idempotent lookups for run-tagged synthetic activity and assessment records.
- JavaScript syntax, workflow YAML parsing, all embedded Bash syntax, and wrong-endpoint rejection checks pass locally.

## Pending evidence / gate

The authenticated workflow has not been run. It requires pre-existing, normally verified sandbox test accounts mapped to the synthetic Student A, Student B, and Teacher fixtures, with their six values configured as repository Actions Secrets. Those credentials are not available to this run and must not be sent in chat.

Until the authenticated workflow completes successfully with sanitized evidence, R2 remains **IN PROGRESS**. Do not claim Auth/RLS/persistence PASS, and keep production, merge, real-student access, and deployment on HOLD.
