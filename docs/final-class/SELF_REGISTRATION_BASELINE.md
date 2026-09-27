# HED3505 Final Class — Approved self-registration baseline

Status: APPROVED DESIGN BASELINE; PILOT / NON-PRODUCTION. No real-student launch or Neon production activation is authorized by this document.

## Learner journey
1. Student self-enters name, student ID, and working email. No preloaded roster required.
2. Verify email ownership using a short-lived one-time code through a configured, tested authentication provider. Do not implement an OTP generator or email credentials in GitHub Pages JavaScript.
3. After verified authentication, create or retrieve an internal immutable user ID and an enrollment record for this specific class, then grant access to the learning flow. Avoid requiring instructor roster confirmation before learning.
4. Keep `email_verified` distinct from `roster_verified` (initially pending). Email verification does not prove student-ID ownership.
5. Link initial answers, feedback, revisions, timestamps and instructor-reviewed results to the internal user ID and activity ID. Preserve answer versions; never overwrite the initial answer.

## Instructor view
Roster of self-registered students, verified-email state, roster-check state, activity progress, initial/revised answers, feedback and instructor review. Allow controlled correction of profile fields with an audit trail; never re-key historical answers by mutable email, name or student ID.

## Security and acceptance gates
- Static GitHub Pages frontend; Neon Auth/Data API only through supported authenticated HTTPS integration. No database passwords, privileged tokens, service-role keys, or SMTP secrets in client code.
- Validate signed authentication tokens server-side and enforce row-level authorization for each student and instructor; students can only read/write their own permitted records, instructors only their assigned class.
- Test OTP delivery, expiry, resend/rate limits, duplicate registrations, session expiration, unauthorized cross-user reads/writes, and instructor-only access using synthetic accounts.
- Keep identity data separate from research/learning records, minimize collection, and avoid exposing personal information in public GitHub or browser logs.
- Do not launch or collect real student data until email delivery and authorization tests pass and the instructor approves the public pilot gate.

## Current implementation status
The existing `docs/final-class/index.html` is a local-only feedback demonstration, not this registration/authentication implementation. The original five-module learning hub remains untouched. Next work: implement isolated registration and instructor prototypes with synthetic data, inspect Neon staging schema and auth configuration, then run acceptance tests before any deployment.
