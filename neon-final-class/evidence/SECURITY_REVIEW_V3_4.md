# HED3505 v3.4 — Staging authorization review

Date: 2026-09-28. Read-only inspection; no data inserted.

- Repository is public. `docs/evaluation-analysis-lab/LECTURER-ANSWER-KEY.md` contains worked answers and lecturer notes. Treat it as public-repository content; Pages URL reachability not independently established. Existing file remains unchanged.
- Neon staging policies were inspected with `pg_policies`: participant/response/assessment read policies constrain access using authenticated subject or instructor status; invitations and session phases control visibility.
- Function definitions inspected: `current_subject`, `has_initial`, `is_instructor`, `is_invited`, `open_round2`, `session_has_room`. `open_round2` checks instructor, full capacity, and each participant's initial judgment before opening Round 2.
- Function ACLs: explicit authenticated EXECUTE grants for the six above. Other helper functions have default ACL; assess callable surface and triggers before release.
- `session_has_room` uses a count comparison; concurrent joins require a separate capacity race test and verification of `enforce_join_capacity` trigger behavior. Do not infer concurrency safety from RLS alone.
- Live two-user signed JWT tests, seven-person synthetic rehearsal, and physical-device acceptance remain outstanding.

RELEASE HOLD: No merge, Pages deploy, production writes, or real student records authorized.
