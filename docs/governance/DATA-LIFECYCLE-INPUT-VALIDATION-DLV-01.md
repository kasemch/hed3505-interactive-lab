# DATA LIFECYCLE & INPUT VALIDATION — DLV-01

Status: APPROVED DESIGN / NON-PRODUCTION  
Scope: HED3505 Final Learning Studio controlled pilot

## Data minimization
- C1 remains non-persistent.
- Persist C2, C3 and Evaluation Hearing only after explicit Save.
- Do not store passwords, OTPs, session cookies, JWTs, or API credentials in learning records.
- Keep learner identity separate from response payloads.
- Do not collect real student data until the Real-Student Activation Gate passes.

## Input validation contract
C2 requires non-empty: objective, evaluation_question, indicator, data_source, instrument, quality_check, criterion, possible_decision, peer_feedback/final revision as defined by the approved activity.
C3 requires non-empty: evaluation_question, missing_evidence, data_source, instrument, rationale, decision_improved, confidence; confidence must be low/moderate/high.
Hearing requires non-empty: group_id, evidence_summary, interpretation_summary, criterion_summary, judgment_summary, limitation_summary, recommendation_summary, decision_code, confidence_level.
Hearing decision_code must be exactly one of CONTINUE, CONTINUE_WITH_MODIFICATION, COLLECT_MORE_EVIDENCE, DISCONTINUE.
Validation must fail closed before network write and must not expose secrets in error messages.

## Revision and audit
- C2/C3 retain revision semantics; unique learner/activity/revision remains authoritative.
- Client-side validation is UX protection, not authorization. PostgreSQL RLS remains authoritative.
- audit_event remains client-deny by default.
- Concurrent revision collision remains a known pilot limitation; unique constraint must fail closed.

## Retention / export / deletion
Before real-student activation, define and approve:
1. retention period for learning evidence and assessment records;
2. authorized export format and roles;
3. learner access/correction process;
4. deletion/anonymization procedure and legal/academic-record exceptions;
5. backup/restore implications;
6. audit evidence required for each lifecycle action.
Until approved, no automated deletion or production retention job may be enabled.

## Gates
CONTROLLED PILOT PREPARATION: may continue with synthetic/test identities only.
REAL STUDENT ACTIVATION: HOLD pending authenticated multi-identity authorization matrix, positive authenticated persistence, and approved retention/export/delete policy.
PRODUCTION: HOLD.
