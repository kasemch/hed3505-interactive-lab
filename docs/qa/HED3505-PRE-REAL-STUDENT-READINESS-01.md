# HED3505 — Pre-Real-Student Readiness Evidence 01

Status: NON-PRODUCTION / EVIDENCE CONSOLIDATION
Baseline: Independent Learning v3.2
Platform: GitHub Source of Truth → WordPress Student Learning Experience

## Purpose
This record consolidates the current evidence before any real-student activation. It distinguishes verified engineering evidence from runtime items that have not been executed. Absence of runtime evidence must not be interpreted as PASS or FAIL.

## Verified PASS
- Independent Learning v3.2 student contract is the current baseline.
- Mission 2 uses Self-Audit; current student-facing flow does not require Peer Audit.
- Mission 3 is an Individual Evaluation Decision Challenge rather than a synchronous/group Hearing.
- Mission 3 decision set: CONTINUE / CONTINUE WITH MODIFICATION / COLLECT MORE EVIDENCE / DISCONTINUE.
- Page views alone do not constitute completion.
- Teacher Key is excluded from rendered student content.
- OTP security contract replaces password-based CI runtime inputs; secrets/OTP/JWT/session material must not be committed.
- Current feature-branch CI at commit 1fb724f11cc04a6f4356b67f188219910afea40f completed successfully for:
  - Validate Static Learning Lab — run 37263623700
  - HED3505 WordPress Plugin Package — run 37263623814
  - HED3505 Neon SDK Build — run 37263623785
- Latest controlled staging Lighthouse evidence: Performance 100/100 and Best Practices 100/100.

## PASS WITH CONDITION
Accessibility: 97/100 in the latest controlled staging Lighthouse audit. One color-contrast finding remains open. The previous scoped reversible contrast patch did not close the finding, so no further color/theme change should be guessed without identifying the rendered offender.

## BLOCKED — NOT EXECUTED
The connected Neon plugin/runtime surface is inconsistent: plugin discovery reports Neon installed/enabled, while no callable Neon namespace/function is exposed in the current tool surface. Therefore the following gates have NOT been executed in the current runtime and must not be reported as PASS:
- Anonymous deny runtime verification.
- Student A vs Student B RLS isolation.
- Teacher course_staff authorization.
- Positive authenticated activity persistence.
- Submit → Feedback Viewed → Revision → Completed lifecycle.
- Completion eligibility recomputation from authoritative records.
- Certificate server-authoritative issuance and idempotency.
- Public verification privacy behavior for VALID / REVOKED / NOT FOUND.

This is a connector/runtime-exposure blocker, not evidence of a Neon schema failure.

## Known non-blocking/open items
- Google OAuth state-integrity defect remains open; approved OTP path remains the fallback. Do not weaken authentication.
- A disabled legacy script block using a non-executing custom MIME type remains in WordPress page content and contains obsolete password-era references. Remove only through controlled staging cleanup followed by regression testing; it is not evidence that active OTP UI uses passwords.
- Historical group_hearing storage remains a compatibility implementation detail. Do not rename/migrate it without Neon sandbox access and RLS regression tests.

## HOLD — Human/Runtime Gates
Do not proceed with any of the following until the required evidence exists and the relevant Human Gate is explicitly approved:
- Real Student activation.
- Real Certificate issuance.
- Production publication.
- PR #3 merge.
- GitHub Pages redirect, deletion, or retirement.
- Destructive or production database changes.

## Runtime execution order when Neon becomes callable
1. Confirm sandbox branch/database target; explicitly exclude production branch.
2. Re-run anonymous deny.
3. Run Student A / Student B / Teacher authorization matrix with ephemeral OTP/session inputs only.
4. Verify positive persistence and cross-user isolation.
5. Exercise Feedback/Revision lifecycle and audit timestamps.
6. Recompute completion eligibility from authoritative records; verify page views do not count.
7. Exercise synthetic certificate cases: eligible, revision-required, not-started, denied/not-enrolled.
8. Verify idempotent certificate issuance and minimal public verification for VALID / REVOKED / NOT FOUND.
9. Record evidence, repair only evidenced defects, and re-run the affected matrix.
10. Only then present the Real-Student / Real-Certificate Human Gate.

## Current decision
PRE-REAL-STUDENT ENGINEERING READINESS: PASS
ACCESSIBILITY: PASS WITH CONDITION
NEON RUNTIME SECURITY & CERTIFICATE E2E: BLOCKED — NOT EXECUTED
REAL STUDENT / REAL CERTIFICATE / PRODUCTION / PR MERGE / GITHUB PAGES RETIREMENT: HOLD
