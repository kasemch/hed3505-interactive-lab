# CURRENT STATE — HED3505 COPILOT PILOT

**Overall status:** CONTROLLED PILOT / BRANCH ONLY  
**Runtime workstream:** R2 IN PROGRESS — synthetic Auth/RLS/persistence evidence pending  
**Runtime branch:** `hed3505-r2-runtime-runner-main-01`  
**Pilot:** KENG Copilot Token-Efficient OS v1.0

## Verified repository context

The repository contains controlled-preview, release-preparation, QA defect, traceability, Pages checkpoint, and Human Gate records, alongside static learning-lab files and GitHub workflows.

## R2 work completed in this branch

- Replaced the OTP-secret test design with a sandbox-only synthetic email/password Auth/RLS E2E harness.
- Pinned the workflow to the verified HED3505 sandbox endpoints and requires explicit sandbox plus exact branch confirmation.
- Added Student A, Student B, and Teacher session/JWT checks, cross-learner isolation, marked synthetic evidence persistence/read-back, teacher assessment persistence, student assessment-write denial, and audit-event isolation.
- Local validation passed for JavaScript syntax, workflow YAML, embedded Bash syntax, and rejection of a non-approved endpoint.
- Read-only Neon inspection confirmed the sandbox branch is ready, email/password Auth is enabled, email verification is required by its current configuration, and relevant sandbox RLS policies/columns exist.

## Pending

- No authenticated runtime workflow has been run.
- Three pre-existing, normally verified synthetic accounts must be mapped to the sandbox Student A, Student B, and Teacher fixtures.
- Six account values must be added directly as GitHub Actions Secrets; passwords must not be sent in chat or committed.
- Runtime output must be reviewed for sanitized PASS evidence before R2 can close.

## Human gates

No merge, Pages/public deployment, real-learner activation, learner-data exposure, Production Auth/Database changes, or status promotion across existing Human Gate records without explicit approval.

## Next action

After the sandbox-only synthetic account secrets are configured, run the `authenticated-rls` workflow on `hed3505-r2-runtime-runner-main-01` with `HED3505-SANDBOX` and the exact sandbox branch ID. Do not change email-verification settings or use Production.
