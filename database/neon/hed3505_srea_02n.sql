-- HED3505 SREA-02N security hardening
-- NON-PRODUCTION sandbox baseline. Apply only to the dedicated HED3505 schema.

ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA hed3505
REVOKE SELECT, INSERT, UPDATE ON TABLES FROM authenticated;

-- Verification queries
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled,
       count(p.policyname)::int AS policy_count
FROM pg_class c
JOIN pg_namespace n ON n.oid=c.relnamespace
LEFT JOIN pg_policies p ON p.schemaname=n.nspname AND p.tablename=c.relname
WHERE n.nspname='hed3505' AND c.relkind='r'
GROUP BY c.relname,c.relrowsecurity
ORDER BY c.relname;

SELECT table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema='hed3505' AND grantee='authenticated'
ORDER BY table_name, privilege_type;

-- Expected authenticated E2E matrix (requires a real Neon Auth JWT)
-- Student A: own learner/activity read-write PASS; Student B rows DENY.
-- Student B: reciprocal isolation PASS.
-- Teacher: course evidence read PASS; assessment insert/update own PASS.
-- Anonymous: all learning evidence DENY.
-- audit_event: client Data API DENY.
