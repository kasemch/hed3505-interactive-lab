# HED3505 Controlled Pilot Role Enrollment — CPRE-01

Status: APPROVED DESIGN / HUMAN AUTH REQUIRED

## Objective
Close the authenticated authorization matrix with real, short-lived Better Auth sessions while keeping all testing on the isolated HED3505 Neon sandbox.

## Rules
- Use only consenting test accounts that can receive OTP.
- Never collect or store OTPs, passwords, JWTs, session cookies, or university passwords.
- Never use real student academic records.
- Never weaken RLS, grants, email verification, trusted origins, or Better Auth.
- Production WordPress and the Neon production branch remain untouched.

## Pilot roles
Three authenticated identities are required:
1. Student A test identity -> mapped to existing synthetic learner A.
2. Student B test identity -> mapped to existing synthetic learner B.
3. Teacher test identity -> mapped to existing active course_staff teacher fixture.

Mapping occurs only after each account has authenticated normally and its Better Auth user ID is verified. Existing synthetic educational payloads remain synthetic.

## Automated matrix
A. Student A: own learner row visible; own activity evidence visible; Student B rows invisible.
B. Student B: own learner row visible; own activity evidence visible; Student A rows invisible.
C. Student A/B: assessment write denied.
D. Teacher: intended staff read/assessment path allowed.
E. Client roles: audit_event denied.
F. No credentials or tokens emitted to diagnostics/logs.

## Pass criteria
All A-F pass through signed authenticated requests to Neon Data API under PostgreSQL RLS.

## Failure rule
Any unexpected cross-user visibility or unauthorized write => SECURITY GATE FAIL; persistence remains disabled and real-student activation remains HOLD.

## Cleanup after PASS
Remove disabled legacy raw-auth block from WordPress staging, re-run accessibility/mobile/privacy checks, document evidence, then request the next genuine Human Gate only if production or real-student activation is proposed.
