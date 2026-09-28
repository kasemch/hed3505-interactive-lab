# HED3505 v3.2 — Security and Release Evidence (2026-09-28)

Status: HOLD. Audit-only record; not a release authorization.

## Provenance
- Base commit: 12e78129ca166ced55202a67c45d978e3e142096. GitHub compare against staging branch: identical at inspection (0 ahead / 0 behind).
- Existing workflow: .github/workflows/hed3505-final-class-pages.yml; build, relative asset validation, sensitive-string scan, byte-for-byte docs preservation and QA-only artifact upload. No Pages deployment job in that workflow.
- Existing PR #2 remains unmerged; no merge or deployment performed by this audit.

## Live Neon read-only evidence
- Project soft-lab-14586372, non-default branch hed3505-final-class-staging (br-sparkling-wildflower-b3bc740v): ready, primary=false, default=false.
- All nine hed3505_final_class ordinary tables have relrowsecurity=true. This establishes RLS configuration, not end-to-end authorization.
- pg_policies shows authenticated-only policies for sessions, invites, participants, responses, assessments, case documents, feedback and events; policy predicates were not independently proven in this pass.
- class_sessions, participants, responses, assessments, instructors: each COUNT(*)=0 at inspection. No synthetic fixtures or student records were inserted in this pass.

## Evidence limits / required acceptance
- GitHub commit-associated workflow lookup returned no runs; combined commit status returned Vercel success only. Neither proves the GitHub Actions preservation workflow passed. Obtain the actual run ID, jobs, logs and QA artifact before marking CI/Preservation PASS.
- Verify artifact ZIP contains unchanged docs/ files (SHA-256 equality) and isolated final-class assets. Do not publish the QA artifact.
- Neon Auth settings remain contradictory in earlier evidence: require_email_verification=true versus verify_email_on_sign_up=false. Verify delivery and fail-closed behavior with two controlled signed test accounts.
- Run two distinct JWT cross-account read/write denial tests, then 7/7 synthetic invite/judgment/round-transition rehearsal with rollback or controlled cleanup.
- Run real-device mobile/accessibility/privacy QA and source-match the case documents; do not expose instructor answer key.

## Release decision
CI: UNVERIFIED; Artifact: UNVERIFIED; signed JWT: PENDING; 7-person rehearsal: PENDING; mobile: PENDING; privacy/source match: PENDING. No merge, no deploy, no production writes, no real student data. Human release authorization required after all evidence is attached.

## CI and artifact verification update (2026-09-28)
- Commit 99e9dc9984bb605dd8ac9c2233848958a84499cc: GitHub Actions runs 36374833905 (Validate Static Learning Lab), 36374833919 (Neon Staging Build), 36374833907 (Final Class Pages Preservation QA), all completed/success.
- Preservation job 108778463667: build, static/sensitive scan, preservation assembly, mobile screenshot upload, and combined QA artifact upload all completed/success.
- Downloaded and inspected artifact 10950945503: four PNG files desktop.png, iphone-small.png, iphone-large.png, tablet.png; no unsafe ZIP paths. This proves automated viewport screenshots, NOT real-device acceptance.
- Downloaded and inspected artifact 10950736815: 29 entries including existing Learning Hub root content and isolated final-class/index.html plus assets. No unsafe ZIP paths. Workflow's exact docs-preservation step passed; independent repository-to-artifact bytewise comparison remains to be performed.
- Both artifacts expire 2026-10-05. Their availability is temporary.
- IMPORTANT: combined artifact includes pre-existing evaluation-analysis-lab/LECTURER-ANSWER-KEY.md under the Learning Hub root. This is a preservation/privacy review finding; do not assume that existing public content is instructor-private. Do not deploy the combined artifact until its public/private content boundary has been reviewed.
- Signed two-account JWT authorization, 7-person synthetic end-to-end, actual physical-device testing, and release authorization remain PENDING. Release HOLD remains in force.
