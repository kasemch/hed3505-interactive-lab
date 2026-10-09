# HED3505 Teaching Release Recovery — current staging record

Status: CONTROLLED STAGING / NOT PRODUCTION

## Verified
- PR #2 remains OPEN, DRAFT, mergeable and unmerged. Its base remains `five-module-static-lab-01`; no production release is authorized by this record.
- Current staging head before this documentation reconciliation was `32dcb45bd1ecebe6e48f3d4b5f8debaa5d5e7f8c`; all three associated workflows completed successfully: Static Learning Lab validation, Neon Staging Build, and Final Class Pages Preservation QA.
- Browser journey has previously been observed through authenticated sign-in, invited-session visibility, join, and PRETEST write.
- Neon staging currently has one explicitly authorized instructor allowlist entry, two synthetic participants, three responses, zero assessments, and two case documents.
- All nine `hed3505_final_class` tables have RLS enabled and the anonymous database role has zero table grants in this schema.
- The rehearsal session `HEDTEST0929` remains `ROUND1_OPEN`, capacity 7, with zero Initial Judgment responses and no Round 2 opening timestamp. This is the correct locked state; Round 2 must not be forced open.
- Instructor UI routing/privacy hardening has removed normal rendering of the internal auth subject and removed the misleading browser RLS row-count heuristic.

## Remaining material acceptance gates
1. Runtime two-account isolation with two independent signed learner sessions is still not proven. Policy inspection and simulated claims are not substitutes for this test.
2. End-to-end instructor browser acceptance after the latest routing/privacy changes still requires an authenticated browser session.
3. Seven-participant rehearsal is incomplete. Do not fabricate learner answers or mutate the rehearsal session merely to satisfy the gate.
4. Round 2, assessment and feedback need end-to-end acceptance after legitimate gate completion. Isolated synthetic/rollback-only tests may be used for logic verification, but not as evidence that real browser sessions passed.
5. Case-document provenance is not independently established in this record. Treat the seeded Arun Pattana data as controlled teaching/staging case data unless an authoritative source is matched.
6. Real-device/mobile acceptance and final institutional privacy/release approval remain pending.

## Operating decision
Feature expansion remains frozen. Prioritize only the minimum teaching path:

Auth -> invite/join -> Round 1 evidence -> PRETEST -> INITIAL_JUDGMENT -> EVIDENCE_REGISTER -> instructor gate -> Round 2 -> revised work -> assessment/feedback.

Use automation-first/full-batch execution for all reversible staging work. Stop only for a genuine material human gate such as OTP/session access, academic authority, destructive database change, real-student activation, merge or public/production release.

No merge, production deployment or real-student release is authorized by this document.
