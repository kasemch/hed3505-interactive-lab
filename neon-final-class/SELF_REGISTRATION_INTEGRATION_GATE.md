# HED3505 self-registration integration gate — 2026-09-27

Status: code audit and implementation checklist, NOT acceptance PASS. Pilot / non-production; no real student data.

## Verified in current source
- `src/main.js` initializes Neon Auth and Data API over HTTPS, uses `emailOtp.verifyEmail` for sign-up verification, `sendVerificationOtp` and `signIn.emailOtp` for OTP sign-in, and blocks workspace rendering when `emailVerified !== true`.
- Existing sign-up requires an email AND password and hard-codes the name `HED3505 Synthetic Tester`. This does NOT meet approved simple self-registration. `joinForm` separately collects student ID, display name and session code AFTER authentication.
- Existing `participants` insert sets `identity_verified:false`; existing instructor view lists participants and response counts, but does not yet expose a separately verified email state or a distinct roster-review state.
- Existing `AUTH_ACCEPTANCE_RUNBOOK.md` explicitly requires session invites and instructor allowlist for tests. Do not remove the invite requirement solely in client JavaScript: the server-side enrollment policy must be redesigned and tested for self-registration.

## Required change sequence
1. Confirm Neon Auth's actual staging sign-up and verification settings by controlled synthetic sign-up. Do not assume an SDK method or dashboard toggle is functioning from code inspection.
2. Implement the approved name, student ID, email registration journey; use supported provider-backed email OTP and an authenticated subject. Do not put an SMTP secret or privileged token in GitHub Pages.
3. Implement a server-enforced course-scoped enrollment path that accepts a verified subject without preloaded roster, while restricting enrollment to the intended class. Define duplicate email/student-ID and re-entry behavior. Preserve separate `email_verified` and `roster_verified` states. Email verification alone does not validate student ID.
4. Bind all answers and revisions to immutable subject/participant IDs. Retain first answer and revisions separately; no autonomous final grades.
5. Add instructor-only roster, email/roster statuses, activity progress and first-versus-revised answers. Enforce access in database RLS, not merely by hiding UI controls.
6. Test with two synthetic student accounts plus instructor: OTP delivery, expiry, replay, resend, sign-out/session renewal, duplicate registration, cross-user read/write denial, instructor access, and Round 2 reveal. Then rehearse seven synthetic learners and mobile devices.
7. Release only after documented PASS and explicit human approval. Keep original five-module lab and draft student guide unchanged; final screenshot-based PDF guide follows accepted screens.

## Current HOLD
No claim of actual OTP delivery, successful end-to-end login, server-side open self-enrollment, browser/mobile acceptance, or public deployment. Existing `registration-preview.html` is a synthetic UI only.
