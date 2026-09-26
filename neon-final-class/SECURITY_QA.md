# HED3505 Final Class — Staging Security & Acceptance Record

**Scope:** Neon project `soft-lab-14586372`, branch `hed3505-final-class-staging`, database `neondb`, schema `hed3505_final_class`. This document is a test record, not a production release authorization.

## Completed backend controls
- 8 RLS-enabled tables and 11 policies; no anonymous table grants. Instructor access is checked by server-side authenticated subject, never a client email string.
- A participant can read only their own participant/response rows. Case documents require session membership and publication. Round 2 additionally requires the session to have been opened by an instructor and the requesting participant to have a stored Initial Judgment.
- Initial Judgment is writable only in ROUND1_OPEN. Revised Judgment requires ROUND2_OPEN and a stored Initial Judgment.
- The `open_round2` RPC requires an instructor, at least one participant, and an Initial Judgment from every enrolled participant; it locks the session row before transition.
- Participant join uses a row-locking capacity trigger. Responses and events are append-only. Feedback response reference is constrained to the same session.
- Assessment insert requires instructor subject; five 0–2 rubric criteria must sum to the 0–10 total.

## Executed SQL checks (staging)
- Seven synthetic participants and two synthetic documents were created in a rollback-only transaction. Without a valid JWT, the authenticated role saw zero participant rows and zero case documents. Rollback left zero sessions and zero participants.
- Rubric 2+2+1+2+2=9 accepted; incorrect total 10 rejected; criterion value 3 rejected.
- Capacity test accepted seven synthetic participants and rejected an eighth; the transaction was rolled back.
- An unauthenticated attempt to call the Round 2 transition was rejected; session remained ROUND1_OPEN.
- Isolated GitHub Actions build and static-preview HTTP smoke passed. This does not verify interactive browser auth or API calls.
- No actual students, submissions, or instructor allowlist entries have been imported.

## Remaining acceptance gates — do not mark passed without evidence
1. Auth provider config: email verification is currently disabled for email/password sign-up. Verify and harden before real use; check email OTP delivery, session and Google callback.
2. Browser smoke and two distinct signed test identities. Verify A cannot read or write B's records; instructor role works only after explicit administrative allowlist. An unauthenticated SQL role test is not a substitute for two-user JWT testing.
3. End-to-end seven-participant rehearsal with real test JWTs, locked Initial Judgment, instructor Round 2 transition, and controlled evidence reveal.
4. Match case narrative and instructor answer key to approved v5.1 source; never insert a guessed case or publish the instructor key to student-facing records.
5. Grade and export QA; verify real-device mobile acceptance and institutional privacy requirements.
6. Explicit human approval for any real-student or public release. Keep this PR draft and unmerged.

## Administrative procedure
After an instructor authenticates using a verified test account, record the actual `auth_subject` returned by Neon Auth. An authorized database administrator may then insert that subject into `hed3505_final_class.instructors`. Never grant the role by a user-entered email address or by client-side code. No account is pre-authorized.

## Deployment boundary
The Vite application lives only under `neon-final-class/` on the isolated branch. GitHub Actions builds an artifact but does not deploy to Pages. Supabase LAB 1–5 remains unchanged.
