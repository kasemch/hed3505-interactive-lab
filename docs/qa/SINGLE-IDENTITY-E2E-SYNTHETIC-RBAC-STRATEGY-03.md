# HED3505 Single-Identity E2E + Synthetic RBAC Strategy — 03

Status: APPROVED / ACTIVE NON-PRODUCTION TEST STRATEGY
Scope: WordPress staging + Neon sandbox only

## Constraint
Only one test email capable of receiving OTP is currently available. Do not fabricate additional inboxes, OTPs, passwords, JWTs, or sessions merely to satisfy a three-identity test.

## Evidence layers

### Layer 1 — Genuine E2E transport and privacy
A genuine OTP-authenticated test identity has already demonstrated:
WordPress staging → official Neon JS SDK → Better Auth session → Neon Data API → PostgreSQL RLS.

Observed result: the authenticated but unmapped identity returned zero learner rows.

Status:
- Auth/session transport: PASS
- Data API authenticated connectivity: PASS
- Privacy-by-default for unmapped authenticated identity: PASS

### Layer 2 — Synthetic authorization verification
Use the existing sandbox-only synthetic Student A, Student B, Teacher fixtures and deterministic authorization matrix fixture set to verify policy structure and controlled authorization logic.

This layer MUST be labelled SYNTHETIC / CONTROLLED and MUST NOT be represented as three-user live E2E.

## Release interpretation
This strategy permits continued reversible staging/sandbox engineering and QA toward CONTROLLED PILOT READY.

It does NOT authorize:
- real students,
- production WordPress,
- Neon production changes,
- PR merge,
- GitHub Pages retirement.

Before real-student activation, perform multi-user validation with genuine independently authenticated identities or another approved equivalent test mechanism that preserves Better Auth and RLS security.

## Persistence rule
C1 remains non-persistent.
C2/C3/Hearing persistence may be engineered and tested on staging/sandbox using synthetic records only.
Do not enable real-student persistence until the real-student authorization gate is explicitly approved and validated.

## No-shortcut rule
Do not weaken RLS, email verification, trusted origins, Better Auth, or grants.
Do not use owner SQL results as evidence of live client E2E authorization.
