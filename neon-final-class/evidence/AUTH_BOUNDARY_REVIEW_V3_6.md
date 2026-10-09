# HED3505 v3.6 — Authentication boundary review

Date: 2026-09-28. Read-only staging inspection; no users created, no credentials retrieved, no data writes.

## Verified configuration
- Neon Auth provider: better_auth; staging branch is separate from default production branch.
- Email/password enabled, sign-up allowed, `require_email_verification=true`, `verify_email_on_sign_up=false`, `verify_email_on_sign_in=false`; trusted origin `https://kasemch.github.io`.
- Frontend `neon-final-class/src/main.js` checks `signedIn.emailVerified === true` before showing workspace and joining, but this is a client-side condition.
- The database `participants_join` RLS policy requires matching `auth_subject`, `identity_verified=false`, invitation and available capacity. It does not explicitly test an email-verified claim. `class_sessions` visibility uses invitation and phase.
- `enforce_join_capacity` serializes insertions by locking the session row and checking count, but live concurrency tests remain outstanding.

## Security interpretation
Do not equate the browser's `emailVerified` check with database-enforced email verification. A direct authenticated API client could bypass browser UI logic if its session/token is accepted for database access. Whether Neon Auth rejects unverified sessions at the data API boundary must be tested using genuine signed sessions. This is a potential enforcement gap, not a demonstrated exploit.

## Required tests before release
1. Real unverified test identity: attempt data API session read and participant insertion; verify rejection.
2. Verified invited identity: permitted join and own-row read.
3. Verified non-invited identity: join denied.
4. Distinct verified identity: cross-account read/write denied.
5. Instructor role: explicit allowlist, teacher-only actions.
6. Two-client final-seat concurrency and seven-person synthetic rehearsal.
Do not store raw JWTs, OTPs, passwords or connection strings in evidence.

## Gate
AUTH/RLS = PENDING; PUBLICATION = HOLD; RELEASE = HOLD. No deployment, merge or production changes.
