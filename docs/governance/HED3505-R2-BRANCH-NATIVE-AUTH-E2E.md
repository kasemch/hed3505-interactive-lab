# HED3505 R2 — Branch-Native Authenticated E2E Gate

Status: BLOCKED AT AUTH SESSION ISSUANCE / NON-PRODUCTION

## Verified sandbox prerequisites
The isolated HED3505 Neon sandbox currently has at least two active learner bindings and at least one active teacher binding. Learning-evidence attempts also exist, so the data-side fixture prerequisite is present.

## Required authenticated matrix
R2 may be marked PASS only after genuine end-user sessions/JWTs prove all of the following:

- AUTH-01 anonymous access denied
- AUTH-02 Student A resolves only its learner identity
- AUTH-03 Student B resolves only its learner identity
- AUTH-04 Teacher resolves authorized staff scope
- RLS-01 Student A reads A evidence
- RLS-02 Student A cannot read B evidence
- RLS-03 Student B reads B evidence
- RLS-04 Student B cannot read A evidence
- RLS-05 student cannot perform teacher-only assessment write
- PERSIST-01 initial response persists
- PERSIST-02 revision persists
- PERSIST-03 reload retains persisted state
- PERSIST-04 progress derives from evidence
- PERSIST-05 page view alone never completes activity
- TEACHER-01 teacher sees only authorized evidence scope
- TEACHER-02 learner cannot access teacher scope
- AUDIT-01 synthetic events are traceable
- AUDIT-02 learner isolation is preserved in audit evidence

## Security invariants
- Never fabricate JWTs, sessions, OTPs, or verification state.
- Never read OTP values from database verification tables.
- Never disable/bypass RLS.
- Never use an owner/admin credential as proof of learner or teacher authorization.
- Never weaken email-verification policy merely to make CI pass.
- Never target production or use real student data.
- Temporary synthetic identities must use supported Neon Auth interfaces and must be cleaned up only through an explicitly approved safe cleanup operation.

## Current boundary
The managed Better Auth sandbox requires a supported verified-user authentication path before CI can obtain genuine end-user JWTs. Until that path is available, classify R2 as BLOCKED at Auth Session Issuance, not as RLS failure.

## Release holds
PR #3 MERGE HOLD. Production HOLD. Real Students HOLD. Real Certificates HOLD. H1 remains APPROVE REAL-STUDENT PILOT.
