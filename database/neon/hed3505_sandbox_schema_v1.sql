-- HED3505 Sandbox Schema v1
-- NON-PRODUCTION ONLY. Authoritative migration candidate for the dedicated HED3505 sandbox.
-- Source: approved SREA-01 logical entities + SREA-02N security baseline.
-- Do not apply to production. Do not load real-student data.

BEGIN;

CREATE SCHEMA IF NOT EXISTS hed3505;

CREATE TABLE IF NOT EXISTS hed3505.learner_identity (
  learner_id uuid PRIMARY KEY,
  auth_user_id text NOT NULL UNIQUE,
  external_student_ref text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hed3505.activity_attempt (
  attempt_id uuid PRIMARY KEY,
  learner_id uuid NOT NULL REFERENCES hed3505.learner_identity(learner_id) ON DELETE RESTRICT,
  activity_code text NOT NULL,
  revision_no integer NOT NULL DEFAULT 1 CHECK (revision_no >= 1),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','revised','completed')),
  submitted_at timestamptz,
  response_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  self_confidence text CHECK (self_confidence IS NULL OR self_confidence IN ('low','moderate','high')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, activity_code, revision_no)
);

CREATE TABLE IF NOT EXISTS hed3505.group_hearing (
  hearing_id uuid PRIMARY KEY,
  group_id uuid NOT NULL,
  learner_id uuid REFERENCES hed3505.learner_identity(learner_id) ON DELETE RESTRICT,
  decision_code text NOT NULL CHECK (decision_code IN ('CONTINUE','CONTINUE_WITH_MODIFICATION','COLLECT_MORE_EVIDENCE','DISCONTINUE')),
  evidence_summary text,
  interpretation_summary text,
  criterion_summary text,
  judgment_summary text,
  limitation_summary text,
  recommendation_summary text,
  action_summary text,
  confidence_level text CHECK (confidence_level IS NULL OR confidence_level IN ('low','moderate','high')),
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hed3505.assessment (
  assessment_id uuid PRIMARY KEY,
  attempt_or_hearing_ref uuid NOT NULL,
  assessor_id text NOT NULL,
  rubric_version text NOT NULL,
  rubric_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  feedback text,
  assessment_status text NOT NULL DEFAULT 'draft' CHECK (assessment_status IN ('draft','released','revised')),
  assessed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hed3505.audit_event (
  event_id uuid PRIMARY KEY,
  actor_id text,
  object_type text NOT NULL,
  object_id uuid NOT NULL,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hed3505.course_staff (
  staff_id uuid PRIMARY KEY,
  auth_user_id text NOT NULL,
  course_code text NOT NULL DEFAULT 'HED3505',
  staff_role text NOT NULL CHECK (staff_role IN ('teacher','assessor','admin')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (auth_user_id, course_code, staff_role)
);

CREATE INDEX IF NOT EXISTS idx_hed3505_learner_auth_user ON hed3505.learner_identity(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_hed3505_attempt_learner ON hed3505.activity_attempt(learner_id);
CREATE INDEX IF NOT EXISTS idx_hed3505_attempt_activity ON hed3505.activity_attempt(activity_code);
CREATE INDEX IF NOT EXISTS idx_hed3505_hearing_learner ON hed3505.group_hearing(learner_id);
CREATE INDEX IF NOT EXISTS idx_hed3505_staff_auth_course ON hed3505.course_staff(auth_user_id, course_code);
CREATE INDEX IF NOT EXISTS idx_hed3505_audit_object ON hed3505.audit_event(object_type, object_id);

ALTER TABLE hed3505.learner_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.activity_attempt ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.group_hearing ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.audit_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.course_staff ENABLE ROW LEVEL SECURITY;

-- Fail closed by default. No RLS policies are created in this migration.
-- Authenticated allow-path policies must be added only after the exact Neon Auth JWT claim contract is runtime-verified.
-- audit_event intentionally remains without client policy.

REVOKE ALL ON SCHEMA hed3505 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA hed3505 FROM PUBLIC;

-- Neon Data API needs schema visibility before table-level RLS can evaluate requests.
-- USAGE is not granted here until the runtime role contract is verified.

ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA hed3505
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM PUBLIC;

COMMIT;

-- Post-migration verification (read-only)
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled,
       count(p.policyname)::int AS policy_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_policies p ON p.schemaname = n.nspname AND p.tablename = c.relname
WHERE n.nspname = 'hed3505' AND c.relkind = 'r'
GROUP BY c.relname, c.relrowsecurity
ORDER BY c.relname;

SELECT table_name, privilege_type, grantee
FROM information_schema.role_table_grants
WHERE table_schema = 'hed3505'
ORDER BY table_name, grantee, privilege_type;
