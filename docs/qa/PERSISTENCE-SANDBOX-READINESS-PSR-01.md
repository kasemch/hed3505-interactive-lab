# HED3505 Persistence Sandbox Readiness — PSR-01

Status: STATIC/SYNTHETIC CONTRACT READY / RUNTIME VERIFICATION BLOCKED — NOT EXECUTED
Scope: Neon sandbox / synthetic data only
Baseline: HED3505 Independent Learning v3.2
Updated: 2026-10-05

## Verified at repository-contract level
- Synthetic learning-evidence fixtures exist and are explicitly classified SYNTHETIC / SANDBOX ONLY.
- Mission 2 target evidence is represented as Evaluation Chain + Self-Audit + revision; Peer Audit is superseded in the current student-facing baseline.
- Mission 2 Missing Evidence evidence includes evaluation question, missing evidence, data source, instrument, rationale, improved decision and confidence.
- Mission 3 target semantic payload follows the individual Evidence → Interpretation → Limitation → Criterion → Judgment → Recommendation → Action reasoning chain and includes confidence.
- Mission 3 supports the four approved decision families: CONTINUE / CONTINUE WITH MODIFICATION / COLLECT MORE EVIDENCE / DISCONTINUE.
- No real student records are authorized for this phase.

## Legacy storage boundary
The existing `group_hearing` table is a legacy storage implementation detail. Current student-facing/API semantics use Mission 3 / Individual Evaluation Decision and `saveEvaluationDecision()`; the compatibility alias/storage mapping must not be interpreted as current group pedagogy.

The legacy table can store evidence, criterion, limitation, recommendation, decision code, confidence and timestamps, but interpretation/judgment do not yet have independently verified dedicated runtime persistence fields. Do not perform a destructive migration or rename without Neon sandbox access, RLS tests and a reversible migration plan.

## Runtime evidence rule
Earlier synthetic fixtures or architecture descriptions do **not** prove current database state. Because callable Neon runtime actions are not exposed in the current tool surface, do not claim that synthetic rows currently exist, that RLS has passed for Student A/B/Teacher, or that Mission 1–3 persistence has passed.

When Neon sandbox runtime becomes callable, execute in order:
1. verify project/branch/database are the approved non-production sandbox;
2. anonymous deny;
3. Student A/B ownership isolation;
4. non-enrolled denial;
5. authorized `course_staff` teacher access;
6. positive Mission 1–3 persistence;
7. feedback-view and revision-history persistence;
8. server-authoritative completion recomputation;
9. certificate eligibility/idempotency and verification privacy tests.

Do not request or persist user passwords/OTPs/JWTs/session cookies. Do not switch to Supabase or weaken RLS.

## Gate
- Synthetic payload contract: READY
- Independent Learning v3.2 semantic alignment: PASS
- Neon runtime persistence: BLOCKED — NOT EXECUTED
- Authenticated RLS matrix: BLOCKED — NOT EXECUTED
- Real-student persistence: HOLD
- Real certificate: HOLD
- Production: HOLD
- PR merge: HOLD
