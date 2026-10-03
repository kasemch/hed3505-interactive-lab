# HED3505 Student Records & Learning Evidence Architecture — SREA-01

Status: DESIGN APPROVED FOR PILOT READINESS / DATABASE NOT AUTHORIZED
Platform invariant: GitHub → WordPress. Vercel out of scope.

## Evidence policy
Challenge 1: formative practice; no persistence by default.
Challenge 2: individual learning-evidence candidate.
Challenge 3: individual learning-evidence candidate.
Evaluation Hearing: group performance-evidence candidate.
Do not persist every keystroke or unrelated personal information.

## Logical entities
### learner_identity
Kept separate from learning evidence.
- learner_id: UUID/internal authorized identity
- external_student_ref: optional institutional reference, never required in public prototype
- status
No academic response payload belongs here.

### activity_attempt
- attempt_id UUID
- learner_id
- activity_code (C2, C3)
- revision_no
- status (draft/submitted/revised)
- submitted_at
- response_payload JSONB
- self_confidence optional
- created_at / updated_at

### group_hearing
- hearing_id UUID
- group_id
- decision_code
- evidence_summary
- criterion_summary
- limitation_summary
- recommendation_summary
- confidence_level
- submitted_at

### assessment
- assessment_id UUID
- attempt_or_hearing_ref
- assessor_id
- rubric_version
- rubric_payload JSONB
- feedback
- assessment_status
- assessed_at

### audit_event
Minimal academic traceability only:
- event_id
- actor_id
- object_type/object_id
- event_type
- occurred_at
Do not log response text redundantly.

## Minimum response payloads
C2: objective, evaluation_question, indicator, data_source, instrument, quality_check, criterion, possible_decision, peer_feedback, final_revision.
C3: evaluation_question, missing_evidence, data_source, instrument, rationale, decision_improved, confidence_level, confidence_reason.
Hearing: evidence, interpretation, criterion, judgment/decision, limitation, recommendation/action, confidence.

## Access model
Student: create/read/update own draft and own submitted/revision records.
Teacher/assessor: read assigned course evidence and create assessment/feedback.
Anonymous visitor: no learning-evidence access.
Admin/service credentials: server-side only.
Authorization roles must not rely on user-editable user_metadata.

## Supabase security baseline if authorized
- Enable RLS on every exposed table.
- Revoke unnecessary anon/authenticated grants; grant least privilege.
- Ownership policies use authenticated identity plus row ownership/membership.
- UPDATE requires SELECT plus USING and WITH CHECK.
- Never expose service_role/secret key in WordPress/browser.
- Prefer publishable key in frontend only with RLS.
- Test allow + deny paths before student use.
- Views, if needed, use security_invoker where supported.
- Index RLS filter columns.

## Retention / privacy
- Data minimization.
- No response persistence for C1 by default.
- Separate identity from evidence.
- Define retention/export/delete policy before production.
- Synthetic fixtures only until authorization.

## Human gates
G1 choose/create dedicated HED3505 backend or explicitly approve reuse of a named project.
G2 approve authentication/identity method.
G3 approve schema + RLS implementation on non-production.
G4 pass synthetic security tests.
G5 approve real-student pilot.
