-- HED3505 SYNTHETIC TEST FIXTURE v1.0
-- NON-PRODUCTION / SANDBOX ONLY
-- Target: Neon sandbox branch br-steep-hall-b3nm8s2p / neondb
-- Purpose: deterministic learning-evidence fixtures for RLS/persistence testing.
-- This file intentionally does NOT create Auth users, passwords, OTPs, sessions, or JWTs.
-- Auth identities must be provisioned by the supported Neon Auth interface.

BEGIN;

-- Fail closed unless the expected synthetic Auth bindings already exist.
DO $$
DECLARE
  a_count integer;
  b_count integer;
  t_count integer;
BEGIN
  SELECT count(*) INTO a_count FROM hed3505.learner_identity WHERE status = 'active';
  SELECT count(*) INTO b_count FROM hed3505.learner_identity WHERE status = 'active';
  SELECT count(*) INTO t_count FROM hed3505.course_staff WHERE staff_role = 'teacher' AND active = true;
  IF a_count < 2 THEN
    RAISE EXCEPTION 'Synthetic fixture requires at least two active learner identities';
  END IF;
  IF t_count < 1 THEN
    RAISE EXCEPTION 'Synthetic fixture requires at least one active teacher binding';
  END IF;
END $$;

-- Deliberately no INSERT against neon_auth.* and no credential material.
-- Learning-evidence rows are created by authenticated synthetic E2E tests so that
-- RLS itself is exercised rather than bypassed by owner/admin SQL.

COMMIT;
