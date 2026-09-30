# HED3505 v3.8 — Verified-email migration precheck

Date: 2026-09-29. Staging only. Read-only database inspection.

## Confirmed
- Branch: hed3505-final-class-staging, not default production.
- neondb_owner has SELECT on neon_auth."user" and USAGE on neon_auth schema.
- authenticated has EXECUTE on auth.user_id(), but no direct SELECT on neon_auth."user" and no USAGE on neon_auth schema.
- At inspection time: 0 participants and 0 class_sessions.
- Migration candidate: migrations/20260929_verified_email_gate.sql; no SQL migration executed.

## Hold conditions
- Genuine signed JWT unverified/verified negative and positive tests are not yet available.
- No synthetic session/invite fixtures exist yet.
- Before applying, confirm SECURITY DEFINER function ownership and direct SQL behavior in a rollback-only transaction; ensure failure cannot leave a partially changed policy.
- Execute the reviewed migration only on staging, snapshot the previous policy and verify the new predicate. Then run signed-session E2E, cross-account, instructor and final-seat concurrency tests. Do not report authorization PASS from simulated SQL roles alone.
- The public repository still contains the lecturer answer key; exclusion from a candidate artifact does not make it confidential.

Gate: MIGRATION PRECHECK PASS; MIGRATION APPLICATION PENDING; SIGNED-JWT E2E PENDING; RELEASE HOLD.
