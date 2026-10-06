# HED3505 Sandbox Schema Reconciliation v1.1

Status: NON-PRODUCTION / EVIDENCE-FIRST
Target: Neon sandbox `hed3505-learning-evidence-sandbox` (`br-steep-hall-b3nm8s2p`), database `neondb`, schema `hed3505`.
Production is out of scope.

## Runtime baseline verified 2026-10-05

Six runtime tables exist: `learner_identity`, `activity_attempt`, `group_hearing`, `assessment`, `audit_event`, `course_staff`. RLS is enabled on all six. Runtime ownership is `neondb_owner`.

The previous `database/neon/hed3505_sandbox_schema_v1.sql` is retained as historical evidence but is SUPERSEDED AS A DEPLOYMENT CANDIDATE because the sandbox already contains an earlier schema with materially different columns/constraints.

## Reconciliation decisions

| Object | Runtime evidence | v3.2 / repository contract | Decision |
|---|---|---|---|
| learner_identity | `learner_id`; `auth_user_id` default `auth.user_id()`; status default `pilot`; RLS on | SDK resolves current learner by RLS before evidence writes | KEEP |
| activity_attempt | activity codes constrained to `C2`,`C3`; states `draft`,`submitted`,`revised`; RLS on | SDK `saveActivityEvidence` explicitly accepts only `C2`,`C3`; revisions are append-style | KEEP current activity codes; do not invent Mission 1 code |
| activity_attempt status | no `completed` state | v3.2 UI requires evidence-derived completion but does not establish that table row status must be `completed` | NO-CHANGE until completion engine contract is implemented |
| group_hearing | legacy table; `created_by_user_id` default `auth.user_id()`; four decision codes; reasoning columns; RLS on | SDK deliberately keeps legacy storage name while exposing individual M3 semantics | KEEP storage name and ownership model |
| group_hearing reasoning | interpretation/judgment nullable | SDK supplies interpretation and judgment on M3 submission | KEEP DB nullability for compatibility; enforce required fields at application/completion validation if needed |
| assessment | polymorphic `object_type` + `object_id`; `assessor_user_id` | supports assessment of activity_attempt/group_hearing | KEEP |
| audit_event | no authenticated grants; RLS on | audit evidence must not be client-authoritative | KEEP isolated |
| course_staff | PK `auth_user_id`; role; active flag; SELECT grant; RLS on | used as authorization registry | KEEP; no self-service mutation |
| authenticated grants | INSERT/SELECT/UPDATE on learner/activity/hearing; SELECT course_staff; no audit grant | write access still depends on RLS policies | RECONCILE policies only after exact `auth.user_id()` contract is verified |

## Canonical activity semantics

Repository inspection shows the current persistence SDK intentionally accepts only `C2` and `C3`. The approved v3.2 UI defines three pedagogical missions, but the repository does not currently establish a canonical database activity code for Mission 1. Therefore this reconciliation MUST NOT invent `C1`, `M1`, or any other database code.

Mission 3 is persisted through `saveEvaluationDecision()` to legacy table `group_hearing`. The table name is an implementation detail; group pedagogy is deprecated.

## Security decisions

1. Never disable RLS.
2. Never use `USING (true)` or equivalent broad client policy.
3. Student ownership must derive from verified `auth.user_id()` linkage, not browser-supplied learner IDs.
4. `audit_event` remains isolated from direct learner writes.
5. Students cannot mutate `course_staff` or write `assessment`.
6. Anonymous access must fail closed.
7. No production migration or real-student data is authorized.

## Migration strategy

The v1.1 reconciliation migration is deliberately narrow. It does not recreate tables, rename legacy objects, widen activity codes, add a guessed `completed` state, or create speculative write policies. It performs preflight assertions against the verified runtime shape and preserves the current RLS boundary. Authenticated write policies are deferred until the exact Neon Auth/RLS policy definitions are captured and reviewed against runtime identity behavior.

## Gates

- Schema inventory: PASS
- Runtime/repository semantic reconciliation: PASS WITH CONDITIONS
- Additive migration v1.1: PREPARED / NOT YET APPLIED
- Anonymous deny: NOT REVERIFIED AFTER RECONCILIATION
- Student A/B isolation: NOT EXECUTED
- Teacher authorization: NOT EXECUTED
- Real Student: HOLD
- Real Certificate: HOLD
- PR Merge: HOLD
- Production: HOLD
