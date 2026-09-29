-- HED3505 staging migration candidate. NOT automatically applied.
-- Run only on branch hed3505-final-class-staging after genuine signed-session tests.
-- Existing policies remain unchanged until replacement transaction commits.
BEGIN;
CREATE OR REPLACE FUNCTION hed3505_final_class.has_verified_email()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'pg_catalog', 'neon_auth'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM neon_auth."user" u
    WHERE u.id::text = auth.user_id()::text
      AND u."emailVerified" IS TRUE
      AND COALESCE(u.banned, false) IS FALSE
  );
$$;
REVOKE ALL ON FUNCTION hed3505_final_class.has_verified_email() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION hed3505_final_class.has_verified_email() TO authenticated;
ALTER POLICY participants_join ON hed3505_final_class.participants
WITH CHECK (
  auth_subject = hed3505_final_class.current_subject()
  AND identity_verified = false
  AND hed3505_final_class.has_verified_email()
  AND hed3505_final_class.is_invited(session_id)
  AND hed3505_final_class.session_has_room(session_id)
);
COMMIT;
-- Rollback (separate reviewed transaction):
-- BEGIN;
-- ALTER POLICY participants_join ON hed3505_final_class.participants
-- WITH CHECK (
--   auth_subject = hed3505_final_class.current_subject()
--   AND identity_verified = false
--   AND hed3505_final_class.is_invited(session_id)
--   AND hed3505_final_class.session_has_room(session_id)
-- );
-- DROP FUNCTION hed3505_final_class.has_verified_email();
-- COMMIT;
