# HED3505 Final Class — Staging Security & Acceptance Record

**Scope:** Neon project `soft-lab-14586372`, branch `hed3505-final-class-staging`, database `neondb`, schema `hed3505_final_class`. This document is a test record, not a production release authorization.

## Completed backend controls
- 9 RLS-enabled tables; no anonymous table grants. Instructor access is checked by server-side authenticated subject, never a client email string.
- Sessions are invitation-only via the server-side session_invites roster, keyed by actual auth subject. Uninvited authenticated users cannot enumerate session codes or join. A participant can read only their own participant/response rows. Case documents require session membership and publication. Round 2 additionally requires the session to have been opened by an instructor and the requesting participant to have a stored Initial Judgment.
- Initial Judgment is writable only in ROUND1_OPEN. Revised Judgment requires ROUND2_OPEN and a stored Initial Judgment.
- The `open_round2` RPC requires an instructor, enrollment equal to session capacity (7/7 in the approved rehearsal), and an Initial Judgment from every enrolled participant; it locks the session row before transition.
- Participant join uses a row-locking capacity trigger. Responses and events are append-only. Feedback response reference is constrained to the same session.
- Peer feedback with a response reference must target a response authored by the feedback recipient in the same session. A SECURITY DEFINER trigger checks this without exposing the recipient's response to the feedback author. Assessments and peer feedback are now immutable under UPDATE/DELETE triggers.
- Assessment insert requires instructor subject; five 0–2 rubric criteria must sum to the 0–10 total. Instructor UI can review individual Revised Judgment/Decision Brief and append rubric assessment; learner UI reads only its own score/feedback through RLS.

## Executed SQL checks (staging)
- A synthetic invitation-only session was tested without a JWT: zero sessions and zero invitations were visible; the transaction was rolled back.
- A rollback-only simulated-claims RLS test used three synthetic subjects A/B/C under the `authenticated` database role. A saw exactly one own participant, response and assessment; B saw exactly one own set; uninvited C saw zero sessions, participants, responses and assessments. The fixture was rolled back to zero. This validates policy behavior with injected claims, NOT cryptographically signed JWTs or a browser Auth session.
- Seven synthetic participants and two synthetic documents were created in a rollback-only transaction. Without a valid JWT, the authenticated role saw zero participant rows and zero case documents. Rollback left zero sessions and zero participants.
- Rubric 2+2+1+2+2=9 accepted; incorrect total 10 rejected; criterion value 3 rejected.
- Capacity test accepted seven synthetic participants and rejected an eighth; the transaction was rolled back.
- An unauthenticated attempt to call the Round 2 transition was rejected; session remained ROUND1_OPEN.
- Isolated GitHub Actions build and static-preview HTTP smoke passed. This does not verify interactive browser auth or API calls.
- A rollback-only feedback test rejected a response belonging to a different recipient, accepted the matching recipient, and left zero records after rollback. Migration recorded in `migrations/002_feedback_integrity.sql`.
- A rollback-only grading test verified that an authenticated role without a valid instructor JWT could not insert a grade, while the privileged fixture accepted a valid 9/10 rubric record; all synthetic rows were rolled back.
- No actual students, submissions, or instructor allowlist entries have been imported.

## Remaining acceptance gates — do not mark passed without evidence
1. Auth provider config: Console screenshot shows Verify at Sign-up ON with Verification code, while API reports `require_email_verification=true` and `verify_email_on_sign_up=false`. Actual signup, OTP delivery, unverified-account rejection, session and Google callback are untested. Do not treat UI-only `emailVerified` check as a substitute for server enforcement.
2. Browser smoke and two distinct signed test identities. Verify A cannot read or write B's records; instructor role works only after explicit administrative allowlist. An unauthenticated SQL role test is not a substitute for two-user JWT testing.
3. Invite seven verified test subjects using a privileged path; end-to-end seven-participant rehearsal with real test JWTs, locked Initial Judgment, instructor Round 2 transition, and controlled evidence reveal.
4. Match case narrative and instructor answer key to approved v5.1 source; never insert a guessed case or publish the instructor key to student-facing records.
5. Grading UI and learner score/feedback require real test-JWT end-to-end QA; export QA, real-device mobile acceptance and institutional privacy requirements remain.
6. Explicit human approval for any real-student or public release. Keep this PR draft and unmerged.

## Administrative procedure
After an instructor authenticates using a verified test account, record the actual `auth_subject` returned by Neon Auth. An authorized database administrator may then insert that subject into `hed3505_final_class.instructors`. Never grant the role by a user-entered email address or by client-side code. No account is pre-authorized.

## Deployment boundary
The Vite application lives only under `neon-final-class/` on the isolated branch. GitHub Actions builds an artifact but does not deploy to Pages. Supabase LAB 1–5 remains unchanged.
