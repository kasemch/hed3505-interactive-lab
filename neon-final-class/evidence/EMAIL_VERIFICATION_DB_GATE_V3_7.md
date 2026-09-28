# HED3505 v3.7 — Database email-verification gate design and hold

Date: 2026-09-29. Read-only inspection of isolated Neon staging. No SQL migration applied.

## Evidence
The actual `neon_auth."user"` table has `id uuid` and `"emailVerified" boolean NOT NULL`. The current `participants_join` RLS WITH CHECK verifies subject, invitation, `identity_verified=false` and room, but does not check `emailVerified`. The browser checks `signedIn.emailVerified`, which cannot replace server enforcement. The `current_subject()` helper uses `auth.user_id()`.

## Proposed fail-closed database gate (NOT EXECUTED)
A migration may introduce a SECURITY DEFINER function with a fixed search_path that returns true only when the current authenticated subject resolves to a Neon Auth user whose `"emailVerified" IS TRUE`, then add that predicate to `participants_join` and to any other relevant student-facing policies. Resolve the function owner's SELECT privilege on `neon_auth."user"` first. Never grant clients direct SELECT on Neon Auth users. Review whether session validity, bans, and JWT subject semantics require additional constraints. Do not use a client-supplied `emailVerified` field as authority.

## Before applying
- Check privileges and dependency impact, collect a baseline policy snapshot.
- Build two genuine signed sessions (unverified and verified) through the staging auth provider, without recording OTPs/JWTs.
- Run negative and positive data API tests, including invited/non-invited and cross-account isolation.
- Confirm migration can be rolled back without removing the original policies until the replacement is verified.
- Run final-seat concurrency, seven synthetic users, and existing CI after any policy change.

## Status
SCHEMA FACTS = VERIFIED; PROPOSED DB GATE = DESIGN ONLY; SIGNED-JWT E2E = PENDING; RELEASE = HOLD.
