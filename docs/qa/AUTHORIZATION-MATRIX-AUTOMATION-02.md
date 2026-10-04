# HED3505 Authorization Matrix Automation — Gate 02

Status: READY / AUTH SESSIONS REQUIRED

## Purpose
Automate evidence collection for authenticated row-level authorization without weakening RLS or fabricating JWTs.

## Required matrix
1. Anonymous access denied.
2. Student A can read only Student A learner/evidence rows.
3. Student B can read only Student B learner/evidence rows.
4. Student A and B cannot read each other's rows.
5. Student role cannot create or modify assessment records.
6. Active course staff can perform the intended assessment workflow.
7. audit_event remains unavailable to client roles.
8. No password, OTP, JWT, cookie, or API credential is written to repository, logs, page diagnostics, or browser storage.

## Evidence already established
- WordPress staging -> Neon JS SDK -> OTP authentication -> authenticated session -> Data API -> RLS probe: PASS.
- Authenticated test account with no learner mapping returned 0 learner rows: PASS privacy-by-default.
- All six hed3505 tables have RLS enabled.
- Sandbox contains two learner fixtures, two activity attempts, one active staff fixture, zero assessments, and zero audit events.

## Automation rule
The automated harness must fail closed when authenticated Student A, Student B, and Teacher sessions are unavailable. It must never manufacture or bypass Better Auth sessions. OTP/password/JWT values must never be committed.

## Gate
FULL AUTHORIZATION MATRIX = PENDING until signed authenticated role sessions execute the matrix through the Data API.

Protected holds remain: real students, production WordPress, Neon production branch, PR merge, and GitHub Pages retirement.
