# HED3505 R2 — Genuine Auth Initiation Gate

Status: NON-PRODUCTION / PR MERGE HOLD

## Purpose
Prove the supported Neon Auth path from user-initiated email authentication to a genuine session/JWT before executing the RLS matrix.

## Current evidence
- Ephemeral Neon branch exists as a child of the approved sandbox branch.
- Better Auth and branch-specific Auth/JWKS are active.
- Branch-specific Neon Data API is active for schema `hed3505`.
- Directory-only `create_auth_user` does not itself initiate email verification; therefore it is not accepted as proof of authentication.

## Harness
`tests/neon/hed3505-auth-initiate.mjs` requests the supported email-OTP initiation endpoint using runtime-only environment variables.

Required runtime inputs:
- `HED3505_NEON_AUTH_URL`
- `HED3505_AUTH_TEST_EMAIL`
- optional `HED3505_STAGING_ORIGIN` (defaults to the approved staging origin)

## Security invariants
The harness MUST NOT read `neon_auth.verification`, print OTP values, modify `emailVerified`, fabricate cookies/JWTs, disable RLS, use production, or treat directory provisioning as authentication proof.

## Pass criteria
1. Auth initiation request succeeds.
2. User receives the provider-generated verification/OTP message through the supported email channel.
3. Supported sign-in completes and returns a genuine session cookie.
4. `/get-session` accepts that cookie.
5. `/token` returns a genuine JWT.
6. The JWT is accepted by the branch-specific Data API.
7. Only then may AUTH/RLS/PERSIST/TEACHER/AUDIT matrices be executed.

Until all criteria are evidenced, R2 remains BLOCKED, not failed.

Release holds remain: PR #3 merge HOLD; production HOLD; real-student HOLD; certificate HOLD.
