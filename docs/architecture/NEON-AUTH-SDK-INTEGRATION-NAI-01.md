# HED3505 Neon Auth SDK Integration — NAI-01

Status: APPROVED IMPLEMENTATION BASELINE (STAGING)
Scope: HED3505 Final Learning Studio
Production: HOLD

## Decision

Use the official Neon SDK/Auth path for authentication and Data API authorization.

Target flow:

WordPress Learning Studio
→ official Neon Auth client / Neon JS
→ Managed Better Auth session
→ JWT managed/exchanged through the supported SDK flow
→ Neon Data API
→ PostgreSQL RLS

## Evidence basis

Neon's current Managed Better Auth documentation states that:
- authentication data and sessions live in the branch-scoped `neon_auth` schema;
- the frontend should communicate with Managed Better Auth through Neon SDKs;
- session cookies are HTTP-only and managed by the Neon Auth server;
- NeonJS manages JWT use for Data API integration;
- Data API validates Neon Auth JWTs for RLS;
- Neon Auth is not a drop-in self-hosted Better Auth server and does not support custom server-side handlers as a substitute for the managed layer.

## Superseded experimental paths

Do not continue:
- TinyFish as the authentication mechanism;
- custom PHP reverse proxy for Better Auth;
- manually fabricated JWT/session;
- direct password-hash injection;
- weakening email verification, RLS, grants, or trusted-origin controls.

The existing WPCode health-check endpoint remains only a WordPress execution diagnostic. It is not a Neon Auth proxy.

## Staging implementation rules

1. Use only the sandbox Neon branch.
2. Keep `https://staging.kengkasem.com` as the staging trusted origin.
3. No real student records.
4. No token/password/OTP in repository, DOM diagnostics, logs, or browser storage.
5. C1 remains non-persistent.
6. C2/C3 and Hearing persistence remain gated until authenticated RLS E2E passes.
7. Production WordPress, Neon production branch, GitHub PR merge, and GitHub Pages retirement remain HOLD.

## Acceptance gate

Authenticated Security Gate passes only after a genuine authenticated session proves:

1. anonymous learning-evidence access denied;
2. Student A sees only Student A identity/evidence;
3. Student B sees only Student B identity/evidence;
4. student assessment write denied;
5. authorized teacher resolves to active course staff and receives intended staff access;
6. audit_event remains unavailable to ordinary clients;
7. no credential/JWT leakage.

Configuration checks or direct owner SQL are not substitutes for this E2E test.

## CI note

The existing password-based CI test is retained as a test harness but is not authoritative until valid test credentials can be provisioned through a supported Neon Auth flow. Do not manufacture credentials to make CI pass.
