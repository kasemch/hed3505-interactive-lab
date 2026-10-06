# CONTROLLED PILOT READINESS — CPR-02

Status: PASS WITH PRE-REAL-STUDENT GATE  
Scope: HED3505 Final Learning Studio, non-production staging  
Platform baseline: GitHub → WordPress → Neon

## Evidence established
- WordPress staging persistence wiring is active for Challenge 2, Challenge 3, and Evaluation Hearing.
- Challenge 1 remains non-persistent by design.
- Neon sandbox schema, RLS, Data API, and synthetic C2/C3/Hearing persistence have passed prior controlled verification.
- Real OTP authentication previously passed the Auth → session → Data API → RLS connectivity probe for the authorized test identity.
- Runtime unauthenticated fail-closed behavior was verified for C2, C3, and Hearing: save attempts were rejected with a sign-in-required message.
- A later automated browser-profile attempt could not preserve the authenticated Better Auth session. This is recorded as a browser-profile/session-persistence limitation, not as evidence of an HED3505 authorization failure.
- No learner mapping, permission weakening, production change, or real student data was introduced.

## Readiness decision
The non-production platform is ready to proceed with controlled pilot preparation. It is NOT authorized for real-student activation.

## Required gate before real students
Before real-student activation, verify an authenticated multi-identity authorization matrix using genuine independently authenticated identities or an explicitly approved equivalent:
1. Student A can read/write only own eligible evidence.
2. Student B can read/write only own eligible evidence.
3. Cross-student access is denied.
4. Students cannot create or modify assessments.
5. Authorized staff can perform intended assessment operations.
6. audit_event remains unavailable to client identities.
7. No credential, JWT, cookie, OTP, or API credential leakage.

## Remaining conditions
- Accessibility remains PASS WITH CONDITION until the known color-contrast issue is corrected and re-audited.
- Google OAuth state-integrity defect remains separate/non-blocking while approved OTP authentication is available.
- Positive authenticated persistence from WordPress UI remains required before real-student activation.
- Retention/export/delete rules must be finalized before production.

## Protected HUMAN gates
HOLD: WordPress production deployment; Neon production changes; PR merge; GitHub Pages redirect/delete/retirement; real-student activation/import; destructive migrations; security weakening; public student evidence.

## Decision
CONTROLLED PILOT PREPARATION: APPROVED.
REAL STUDENT ACTIVATION: HOLD.
PRODUCTION: HOLD.
