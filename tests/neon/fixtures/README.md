# HED3505 Synthetic Test Fixture

Status: NON-PRODUCTION / SANDBOX ONLY

This fixture supports automated verification of HED3505 learning evidence without real student data.

## Personas
- Student A: synthetic active learner
- Student B: synthetic active learner
- Teacher: synthetic active course staff

## Safety invariants
- Never target the production branch.
- Never store passwords, OTPs, JWTs, session cookies, database credentials, or response bodies in Git.
- Never insert directly into `neon_auth.*`.
- Never disable or bypass RLS.
- Authenticated learning-evidence writes must occur through the Data API under the synthetic persona JWT so the policy itself is tested.
- Fixture setup is fail-closed when two active learners and one active teacher binding are not present.

## Test matrix
AUTH-01 anonymous deny
AUTH-02 Student A identity
AUTH-03 Student B identity
AUTH-04 Teacher identity
RLS-01 A reads A
RLS-02 A cannot read B
RLS-03 B reads B
RLS-04 B cannot read A
RLS-05 student teacher-only write deny
PERSIST-01 initial response persists
PERSIST-02 revision persists
PERSIST-03 reload retains state
PERSIST-04 progress derives from evidence
PERSIST-05 no page-view completion
TEACHER-01 authorized evidence access
TEACHER-02 student teacher-scope deny
AUDIT-01 synthetic events traceable
AUDIT-02 learner isolation preserved

The current Better Auth runtime still requires a supported method for obtaining ephemeral authenticated sessions. The fixture does not fabricate or persist OTPs.
