# HED3505 v3.9 — Signed-session acceptance matrix and execution gate

Date: 2026-09-29. Staging-only preflight; no identities or fixtures created, no migration applied.

## Observed preflight
- With no signed session, `auth.user_id()` returned NULL and the proposed verified-user predicate returned false.
- Zero users with addresses ending in `example.invalid` were found at inspection. This does not establish that no other synthetic users exist.
- This is a SQL expression test under database owner context, not a signed-JWT/Data API test.

## Controlled execution sequence
1. Obtain authorized test mailboxes under tester control, create synthetic accounts via staging Neon Auth only, and establish genuinely signed sessions without storing passwords, OTPs, or JWTs in evidence.
2. Baseline negative test: unverified account should not be able to join through the app. Test the direct authenticated Data API separately; record whether it currently permits join. If it does, treat as confirmed defect, not a release pass.
3. Snapshot policy/function definitions and fixture counts. Apply the reviewed migration in one transaction on the staging branch only. Verify function owner, grants, policy predicate and direct table privilege restrictions.
4. Repeat direct API tests after migration: anonymous/unverified/banned/non-invited/cross-account requests denied; verified invited own-row join/read allowed; instructor-only actions allowed only for instructor.
5. Run two genuinely concurrent joins for the final available seat; exactly one should commit. Run seven-user synthetic flow, mobile/accessibility and CI preservation checks.
6. Record sanitized status codes, request IDs, counts and timestamps only; never log credentials, bearer tokens or personally identifying test records. Roll back if unexpected access or valid access regression occurs.

## Test matrix
| Actor | Operation | Expected |
|---|---|---|
| Anonymous | join/read private session | DENY |
| Unverified invited | direct participant insert | DENY after migration |
| Verified non-invited | session/join | DENY |
| Verified invited | join and own-row read | ALLOW |
| Verified invited A | read/write B's rows | DENY |
| Verified invited | instructor action | DENY |
| Allowlisted instructor | instructor action | ALLOW |
| Banned identity | join | DENY |
| Two invited identities | concurrent final seat | exactly one INSERT |

## Gate
SIGNED SESSION TEST = NOT EXECUTED; MIGRATION = NOT APPLIED; RELEASE = HOLD. Existing public answer-key repository exposure remains a separate publication issue.
