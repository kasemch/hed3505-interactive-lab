# HED3505 v3.9 — Auth acceptance preparation and least-privilege gate

Date: 2026-09-28. Staging-only, read-only inspection. No test account, OTP, signed JWT, fixtures, schema/data changes, merge or deployment.

## CI
At inspection commit 754cf3d3: Static Learning Lab run 36428694808, Neon Staging Build 36428694683 and Combined Preservation QA 36428694688 all completed/success.

## Function exposure
The staging catalog shows `anonymous` can EXECUTE three trigger-returning functions (`enforce_join_capacity`, `reject_immutable_changes`, `validate_feedback_response_owner`) and `valid_rubric(jsonb,numeric)`; `authenticated` can execute all listed schema functions. Trigger-returning functions cannot ordinarily be invoked as normal SQL functions, and `valid_rubric` is a validation helper. Review explicit REVOKE of unnecessary PUBLIC/anonymous EXECUTE only after confirming trigger execution and application dependencies. No grant was changed.

## Real signed-session acceptance matrix
Use controlled test mailboxes and staging-only signed sessions. Never commit tokens, OTPs, passwords, private connection strings or subject-to-email mappings.

- U (unverified): UI workspace denied **and** direct Data API session/participant requests denied. A UI-only denial does not pass.
- A (verified, invited): can view invited session, join once and access own rows.
- B (verified, invited): can view own rows, cannot read/update A's participant, response, assessment or feedback.
- C (verified, uninvited): cannot enumerate private sessions or join.
- I (allowlisted instructor): can view required class records and invoke open_round2 only after all initial judgments.
- Non-instructor: cannot invoke open_round2. Anonymous: no table access.
- Last-seat concurrency: exactly one of two simultaneous eligible joins succeeds at capacity.
- Seven synthetic subjects: all initial judgments required; Round 2 documents hidden until instructor unlock; own scores only; immutable revisions retained.

Record HTTP status and sanitized error codes, observed row counts and pass/fail; redact all auth material. Test on a disposable staging fixture with controlled cleanup and never real student data.

## Release gate
Current results prove catalog configuration and CI, not live session behavior. Auth/RLS, email delivery, concurrency and seven-subject rehearsal remain PENDING. The combined QA artifact contains a lecturer answer key; do not publish it. Release, merge and production remain HOLD.
