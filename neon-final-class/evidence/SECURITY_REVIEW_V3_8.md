# HED3505 v3.8 — Staging effective grants and RPC review

Date: 2026-09-28. Read-only inspection of Neon staging branch br-sparkling-wildflower-b3bc740v; no production or data writes.

## Verified roles and grants
The Data API database role is named `anonymous` (not `anon`). `anonymous`, `authenticated`, and `authenticator` do not have BYPASSRLS; `neondb_owner` has BYPASSRLS and owns the nine ordinary tables. RLS is enabled but FORCE RLS is false for all nine tables.

`anonymous` has no SELECT/INSERT/UPDATE/DELETE table privileges on any of the nine tables. `authenticated` has no UPDATE/DELETE on any; it has SELECT on eight tables excluding instructors, and INSERT only on assessments, participants, peer_feedback, responses. The instructors allowlist has no direct authenticated table privileges and no direct policies. Effective application isolation still requires signed-JWT Data API tests.

## RPC / function grants
`open_round2(uuid)` is SECURITY DEFINER and executable by authenticated, not anonymous. Its inspected body checks `is_instructor()`, locks session row, requires ROUND1_OPEN, exactly capacity participants, and one INITIAL_JUDGMENT per participant before changing phase. It is not a generic authenticated bypass by its inspected logic, but must be exercised with real signed identities.

Three trigger functions (`enforce_join_capacity`, `reject_immutable_changes`, `validate_feedback_response_owner`) and `valid_rubric` have EXECUTE privilege for anonymous due to grants. PostgreSQL trigger-returning functions cannot ordinarily be invoked as useful direct RPCs, but unnecessary grants merit a least-privilege review; no grants changed in this audit.

## Gate and limitations
No controlled mailbox/session/JWT was available in this pass, so actual email verification, cross-account access, last-seat concurrency and seven-person E2E remain PENDING. Do not substitute catalog or simulated claims tests for signed-session evidence. Combined preservation QA artifact retains lecturer answer key; only an excluded-key publication candidate was validated, not deployed.

CI baseline a75a3457: static run 36428286645 and Neon build 36428286568 success; Preservation run 36428277920 success, later duplicate 36428286920 was in progress at inspection. No merge/deploy/production writes.
