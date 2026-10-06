# HED3505 R2 Neon Auth SDK Test Surface

NON-PRODUCTION ONLY. This directory is an isolated test surface for proving genuine branch-scoped Neon Auth before the RLS matrix.

The implementation follows Neon's current branch-auth pattern: `createAuthClient` from `@neondatabase/neon-js/auth`, configured with the branch-specific Auth URL at runtime. The Auth URL MUST NOT fall back to a production endpoint.

## Runtime contract

The hosting/staging layer must set `globalThis.HED3505_R2_AUTH_URL` to the approved ephemeral branch Auth URL before importing `src/auth.js`.

Do not commit passwords, OTPs, JWTs, session cookies, database URLs, or privileged credentials.

## Gate

This package does not itself prove R2. R2 remains blocked until a real user completes the supported sign-in/verification flow, Neon issues a genuine session/JWT, the branch-specific Data API accepts the JWT, and the AUTH/RLS/PERSIST/TEACHER/AUDIT matrix passes.

Release holds remain in force: PR #3 merge HOLD; production HOLD; real-student HOLD; certificate HOLD.
