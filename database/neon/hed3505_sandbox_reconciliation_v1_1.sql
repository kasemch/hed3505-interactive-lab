-- HED3505 Sandbox Reconciliation v1.1
-- NON-PRODUCTION ONLY.
-- Purpose: fail-closed reconciliation against the verified existing sandbox schema.
-- This migration intentionally performs NO destructive DDL and creates NO speculative RLS allow policies.
-- Target: project winter-sun-55259147 / branch br-steep-hall-b3nm8s2p / database neondb.

BEGIN;

DO $reconcile$
DECLARE
  missing_tables text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'hed3505') THEN
    RAISE EXCEPTION 'HED3505_RECONCILIATION_ABORT: expected schema hed3505 is missing';
  END IF;

  SELECT string_agg(expected.name, ', ' ORDER BY expected.name)
  INTO missing_tables
  FROM (VALUES
    ('learner_identity'),
    ('activity_attempt'),
    ('group_hearing'),
    ('assessment'),
    ('audit_event'),
    ('course_staff')
  ) AS expected(name)
  WHERE to_regclass('hed3505.' || expected.name) IS NULL;

  IF missing_tables IS NOT NULL THEN
    RAISE EXCEPTION 'HED3505_RECONCILIATION_ABORT: missing expected tables: %', missing_tables;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='hed3505' AND table_name='learner_identity'
      AND column_name='auth_user_id'
  ) THEN
    RAISE EXCEPTION 'HED3505_RECONCILIATION_ABORT: learner_identity.auth_user_id missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='hed3505' AND table_name='activity_attempt'
      AND column_name='learner_id'
  ) THEN
    RAISE EXCEPTION 'HED3505_RECONCILIATION_ABORT: activity_attempt.learner_id missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='hed3505' AND table_name='group_hearing'
      AND column_name='created_by_user_id'
  ) THEN
    RAISE EXCEPTION 'HED3505_RECONCILIATION_ABORT: group_hearing.created_by_user_id missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='hed3505' AND table_name='assessment'
      AND column_name='object_type'
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='hed3505' AND table_name='assessment'
      AND column_name='object_id'
  ) THEN
    RAISE EXCEPTION 'HED3505_RECONCILIATION_ABORT: assessment polymorphic object columns missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='hed3505' AND table_name='course_staff'
      AND column_name='auth_user_id'
  ) THEN
    RAISE EXCEPTION 'HED3505_RECONCILIATION_ABORT: course_staff.auth_user_id missing';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='hed3505'
      AND c.relname IN ('learner_identity','activity_attempt','group_hearing','assessment','audit_event','course_staff')
      AND c.relkind='r'
      AND NOT c.relrowsecurity
  ) THEN
    RAISE EXCEPTION 'HED3505_RECONCILIATION_ABORT: RLS is not enabled on every expected table';
  END IF;
END
$reconcile$;

-- Preserve the verified security boundary explicitly.
ALTER TABLE hed3505.learner_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.activity_attempt ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.group_hearing ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.audit_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE hed3505.course_staff ENABLE ROW LEVEL SECURITY;

-- Keep PUBLIC closed. Existing authenticated grants/policies are not widened here.
REVOKE ALL ON SCHEMA hed3505 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA hed3505 FROM PUBLIC;

COMMIT;

-- Read-only verification. Expected: six rows, rls_enabled=true for all.
SELECT c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced,
       count(p.policyname)::int AS policy_count
FROM pg_class c
JOIN pg_namespace n ON n.oid=c.relnamespace
LEFT JOIN pg_policies p ON p.schemaname=n.nspname AND p.tablename=c.relname
WHERE n.nspname='hed3505'
  AND c.relkind='r'
  AND c.relname IN ('learner_identity','activity_attempt','group_hearing','assessment','audit_event','course_staff')
GROUP BY c.relname,c.relrowsecurity,c.relforcerowsecurity
ORDER BY c.relname;

SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema='hed3505'
  AND table_name IN ('learner_identity','activity_attempt','group_hearing','assessment','audit_event','course_staff')
ORDER BY table_name,grantee,privilege_type;
