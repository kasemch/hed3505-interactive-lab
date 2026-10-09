# HED3505 v4.0 — Authentication E2E execution gate

Date: 2026-09-29. Verified current staging Auth configuration. No user created, no migration executed.

## Live staging configuration
- Neon Auth: better_auth, staging branch `br-sparkling-wildflower-b3bc740v`.
- Email/password and sign-up enabled; email verification required using OTP; automatic sign-in after verification.
- Shared Google OAuth enabled; trusted origin `https://kasemch.github.io`; localhost permitted.
- The available administrative create-user operation does not deliver an OTP or create a genuinely signed browser/Data API session. Do not manufacture a JWT or treat SQL role simulation as equivalent.

## Next executable human-controlled test
Use at least two authorized, distinct test mailboxes under tester control, ideally plus an instructor identity. Register on staging, retain one account unverified long enough to test direct Data API denial, verify the other with its actual OTP, and test invited/non-invited and cross-account boundaries. Keep OTP, passwords, session cookies and JWTs out of commits, screenshots and logs. Record sanitized status, expected vs actual, request time and policy snapshot.

## Migration sequencing
The SQL candidate `20260929_verified_email_gate.sql` remains unapplied. If baseline direct API allows unverified joining, mark a confirmed defect and apply the reviewed migration on staging in a controlled transaction before repeating signed-session tests. If baseline denies, still test database defense in depth and document the actual enforcement layer. After migration verify function ownership, grants, RLS predicate and rollback; no production operation.

## Independent release blocks
- Lecturer answer key still exists in the public source repository; candidate artifact exclusion does not undo source/history visibility.
- Signed JWT negative and positive tests, concurrency, seven synthetic users and physical-device acceptance remain pending.

STATUS: AUTH E2E BLOCKED ON CONTROLLED TEST SESSIONS; MIGRATION NOT APPLIED; RELEASE HOLD.
