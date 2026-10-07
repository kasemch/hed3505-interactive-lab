# HED3505 R2-SYN Runtime Evidence Matrix

Status: EXECUTION READY / CONNECTOR BLOCKED
Scope: Neon ephemeral branch only
Production: FORBIDDEN
Classification: SYNTHETIC / SANDBOX ONLY

## Purpose
This matrix defines the exact evidence required to issue an R2-SYN PASS. It is not itself runtime proof. Static/source/structural evidence must remain separate from runtime authorization evidence.

## Runtime assertions
| ID | Principal | Operation | Target | Expected | Evidence required |
|---|---|---|---|---|---|
| AUTH-01 | Anonymous | SELECT | learner_identity/activity_attempt | DENY / zero authorized rows | Data API result under anonymous context |
| RLS-01 | Student A | SELECT | own learner_identity | ALLOW exactly own identity | authenticated synthetic runtime result |
| RLS-02 | Student A | SELECT | Student B learner_identity | zero rows | explicit targeted cross-principal query |
| RLS-03 | Student B | SELECT | own learner_identity | ALLOW exactly own identity | authenticated synthetic runtime result |
| RLS-04 | Student B | SELECT | Student A learner_identity | zero rows | explicit targeted cross-principal query |
| RLS-05A | Student A | SELECT | Student B activity_attempt | zero rows | targeted query using B learner_id |
| RLS-05B | Student B | SELECT | Student A activity_attempt | zero rows | targeted query using A learner_id |
| RLS-06 | Student A | INSERT assessment | valid own visible activity_attempt | DENY | valid FK/object precondition + authorization denial |
| TEACHER-01 | Teacher | SELECT | course_staff self binding | ALLOW active teacher | authenticated synthetic teacher result |
| TEACHER-02 | Teacher | SELECT | learner evidence required for dashboard | ALLOW authorized course scope | authenticated synthetic teacher result |
| AUDIT-01 | Student A | SELECT | audit_event | DENY / zero rows | ordinary authenticated student context |
| AUDIT-02 | Teacher | SELECT | audit_event | DENY unless an explicit approved policy exists | ordinary authenticated teacher context |
| PERSIST-01 | Student A | save | Mission 1 initial evidence | ALLOW | persisted row/object id |
| PERSIST-02 | Student A | save | guided feedback viewed event | ALLOW | persisted event/evidence |
| PERSIST-03 | Student A | save | revised evidence | ALLOW | new revision or updated permitted revision |
| PERSIST-04 | Student A | reload | own evidence chain | ALLOW and unchanged | post-reload equality/semantic check |
| COMPLETE-01 | incomplete synthetic learner | certificate eligibility | incomplete chain | FALSE / LOCKED | server-authoritative result |

## Non-vacuous preconditions
Student A and Student B must each have a valid synthetic learner_identity and at least one valid activity_attempt before cross-attempt isolation is accepted. RLS-06 must target a real synthetic attempt visible to Student A; an invalid UUID/FK failure does not count as authorization proof.

## Evidence rules
Never print OTP, JWT, session cookie, password, or secret. Privileged owner queries may inspect structure/fixtures but cannot be used as student/teacher RLS proof. A manually fabricated JWT/session cannot be used as R2-SYN proof. If claim simulation is ever used, it must be labeled synthetic authorization simulation and kept separate from genuine authenticated-session evidence.

## Verdict rule
R2-SYN = PASS only when every applicable assertion above has runtime evidence from the ephemeral environment and no assertion is satisfied vacuously. R2-LIVE remains a separate gate and cannot inherit R2-SYN PASS.

## Current gate
R2-SYN: EXECUTION READY / CONNECTOR BLOCKED.
R2-LIVE: PENDING.
PR #3 merge: HOLD.
Production: HOLD.
Real students: HOLD.
Certificate issuance: HOLD.
