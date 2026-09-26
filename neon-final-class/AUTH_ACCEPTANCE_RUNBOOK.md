# HED3505 — one-time human gate and two-account acceptance

**Environment:** Neon project `soft-lab-14586372` → branch `hed3505-final-class-staging`. The app is build-only and not published. Do not use real student identifiers or passwords in a chat, issue, commit or SQL fixture.

## One-time Console gate (human action)
1. Open the staging branch in Neon Console, not production.
2. Open Auth settings for the staging branch. Enable **Verify at Sign-up** and choose **Verification code**. Save.
3. Check the sign-up verification setting is ON. The connector's `update_auth_config` method cannot change this flag; approval in chat alone does not toggle it.
4. Keep the shared email sender only for limited synthetic testing; verify actual delivery. Do not turn on real-student enrollment merely because the flag is ON.

## Two distinct test accounts
- Sign in to the isolated staging app with two test email accounts that the tester controls. Do not use a real student's account.
- Check OTP arrival, expiry/replay denial, session renewal and sign-out.
- Record each actual authenticated `auth_subject` privately. Do not infer subject from email.
- The authorized DB administrator grants an instructor subject using a parameterized, privileged insert into `hed3505_final_class.instructors`; it is not granted from browser input. Add the two test student subjects to `session_invites` for a synthetic session.
- Verify uninvited user cannot enumerate sessions, student A cannot read B's participant/answer/score, and student B cannot change A's record. Instructor can see both only after allowlisting.
- Complete a seven-subject rehearsal before Round 2: 7/7 Initial Judgments, no premature document access, instructor unlock, revision preserved, rubric score visible only to the corresponding learner.

## Release criteria
Auth verified; two-user JWT RLS tested; seven-user rehearsal; approved Round 1 and Round 2 source documents inserted privately into Neon with correct reveal gate; instructor-only answer key not in public repository or student API; mobile acceptance; privacy approval; explicit production release approval. Otherwise PR remains DRAFT/HOLD.
