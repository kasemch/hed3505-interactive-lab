# HED3505 — Controlled local preview and signed-session test handoff v4.1

Date: 2026-09-29. No public deployment, production change, migration or credential collection.

## Verified starting point
Preservation QA run 36517603091 passed, including excluded-key candidate verification and artifact upload. Artifact 11011776148 is the controlled preview candidate, not a live URL; expires 2026-10-06. The candidate excludes `evaluation-analysis-lab/LECTURER-ANSWER-KEY.md`; the original public repository and its history still require a separate content governance decision.

## Local-only preview
Download the controlled preview candidate artifact from the GitHub Actions run using an authorized GitHub account. Extract into a dedicated temporary directory. From that directory, run a local static server bound to loopback only, for example `python3 -m http.server 8765 --bind 127.0.0.1`, then open `http://127.0.0.1:8765/final-class/`. Do not open index.html directly as a file. Do not expose the local server to a network, publish a tunnel, upload the artifact to Pages or log tokens. Confirm that the browser connects only to the configured staging Neon Auth and Data API endpoints. The configured Auth permits localhost, but the exact origin/port and browser behavior must be verified in the live test.

## Identity handoff
Two authorized test identities exist in staging Auth, both unverified and with zero sessions at last check. Do not create duplicate users through the sign-up form. First test the unverified account against the direct Data API using its genuine session if Neon Auth issues one; record an actual denial or defect. Then complete OTP verification through the controlled interface using an inbox under the tester's control. Never paste OTPs, JWTs, passwords or cookies into chat, repository, screenshots or logs.

## Expected evidence
Record only test case ID, sanitized HTTP status/error class, expected vs actual, timestamp, whether verified, whether invited, and subject aliases A/B. Use distinct browser profiles for A/B. Test negative and positive RLS, cross-account isolation, instructor allowlist, and concurrent final-seat enrollment. No claim of PASS until genuine signed sessions and fixture-backed requests exist.

## Gate
LOCAL PREVIEW HANDOFF READY; LIVE AUTH E2E PENDING; MIGRATION UNAPPLIED; RELEASE HOLD.
