# HED3505 v3.5 — Verified staging trigger and public-content review

Date: 2026-09-28. Scope: read-only database inspection and public repository review. No production change, merge, deploy or student data.

## Verified database findings
- `participants_capacity_guard` is a BEFORE INSERT trigger on `hed3505_final_class.participants`, invoking `enforce_join_capacity()`.
- `enforce_join_capacity()` locks the matching `class_sessions` row using `FOR UPDATE`, requires `ROUND1_OPEN`, counts current participants, and rejects insertion at or above capacity. This provides a database-level serialization mechanism; a concurrent two-client test remains required.
- `responses_immutable`, `assessments_immutable`, `peer_feedback_immutable` and `events_immutable` reject UPDATE/DELETE via `reject_immutable_changes()`.
- `peer_feedback_response_owner_guard` validates that a referenced response belongs to the recipient in the same session.
- Function definitions and trigger attachments inspected through pg_catalog on staging. This does not establish signed-JWT authorization or full application behavior.

## Public-content review
- The repository is public, and `docs/evaluation-analysis-lab/LECTURER-ANSWER-KEY.md` is present in the repository and combined QA artifact. It contains worked answers and lecturer guidance.
- Direct Pages URL and Pages publishing-source verification were inconclusive through the available web access. Do not claim Pages exposure or confidentiality.
- Existing `docs/` must remain unchanged until publication-boundary classification is approved. Do not deploy the combined artifact as-is.

## Outstanding release gates
- Signed JWT two-user and instructor tests: PENDING.
- Real concurrent enrollment test: PENDING.
- Seven-person synthetic end-to-end: PENDING.
- Actual physical-device acceptance: PENDING.
- Instructor-only content publication boundary: PENDING.
- Release authorization: HOLD.

## Rollback and governance
This file is documentation-only. Revert this commit to undo it. No schema migration, data insertion, merge or deployment performed.
