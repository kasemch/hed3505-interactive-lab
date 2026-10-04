# HED3505 Persistence Sandbox Readiness — PSR-01

Status: PASS WITH PAYLOAD-COMPLETENESS CONDITION
Scope: Neon sandbox / synthetic data only

## Verified
- C2 synthetic activity_attempt exists and is submitted.
- C3 synthetic activity_attempt exists and is submitted.
- Both payloads are explicitly marked synthetic.
- group_hearing persistence table exists with constrained decision, evidence, criterion, limitation, recommendation, confidence, and timestamps.
- No real student records are authorized for this phase.

## Observed condition
The existing C2/C3 fixtures are deliberately minimal smoke-test payloads and do not yet contain every approved pedagogical field. Do not misrepresent them as complete learning evidence.

Approved C2 target payload:
objective; evaluation_question; indicator; data_source; instrument; quality_check; criterion; possible_decision; peer_feedback; final_revision.

Approved C3 target payload:
evaluation_question; missing_evidence; data_source; instrument; rationale; decision_improved; confidence.

Approved Hearing semantic payload:
evidence; interpretation; criterion; judgment; limitation; recommendation/action; confidence.

The current group_hearing schema stores evidence, criterion, limitation, recommendation, decision_code, and confidence but does not separately persist interpretation and judgment beyond the decision field. Treat schema expansion as a design item; do not perform destructive migration.

## Gate
Synthetic persistence architecture = READY.
Complete payload fixture test = PENDING.
Real-student persistence = HOLD.
Production = HOLD.
