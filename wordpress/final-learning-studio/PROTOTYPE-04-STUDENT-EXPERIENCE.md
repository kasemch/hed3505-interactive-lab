# HED3505 WordPress Student Experience — Prototype 04

Status: STAGING / NON-PRODUCTION
WordPress page ID: 117
Slug: hed3505-final-learning-studio
Superseding learning mode: HED3505 Independent Learning v3.2

## Implemented / approved student journey
- Master Evaluation Cycle
- Arun Pattana Evidence Board
- Self-study modules using progressive disclosure
- Mission 1 — Evidence Detective
- Mission 2 — Build & Challenge the Evaluation
  - self-audit
  - Missing Evidence Challenge
  - written Evidence Defense
- Mission 3 — Individual Evaluation Decision Challenge
  - one learner rotates through Evaluator → Evidence Auditor → Stakeholder → Decision Maker perspectives
  - Evidence → Interpretation → Limitation → Criterion → Judgment → Recommendation → Action → Re-evaluation
  - allowed decisions: CONTINUE / CONTINUE WITH MODIFICATION / COLLECT MORE EVIDENCE / DISCONTINUE
  - assessment focuses on defensibility, not one predetermined decision
- Evidence Confidence: Low / Moderate / High + Why?
- Guided Feedback → Revision
- Final Review and Exam Readiness
- Completion is evidence-based; page views alone do not count

## Historical note
The earlier classroom-dependent “School Health Evaluation Hearing” and peer-audit flow are superseded by Mission 3 v3.2 for current student-facing use. Historical architecture documents may retain those terms for traceability, but they are not the current learning-path contract.

## Content safeguards
- No causal claim is inferred from descriptive case values.
- Data, evidence, interpretation, criterion, judgment, and recommendation are explicitly separated.
- IOC is not represented as sufficient proof of total instrument quality.
- Contradictory evidence is treated as a reasoning task rather than removed.
- “Need More Evidence / COLLECT MORE EVIDENCE” remains an academically valid decision when justified.
- Teacher key remains outside student-facing content.

## Release controls
- WordPress changes remain staging-only.
- GitHub PR remains draft and unmerged.
- GitHub Pages remains unchanged as fallback.
- Production remains untouched.
- Real-student activation and real certificate issuance remain HOLD pending runtime security gates and human acceptance.

## Remaining QA
1. Accessibility contrast root-cause remediation
2. Student-path usability and responsive acceptance
3. Teacher authorization / teacher-key isolation
4. Neon authenticated RLS matrix
5. Positive evidence-persistence runtime test
6. Completion and certificate eligibility/idempotency runtime tests
7. Public verification privacy test
8. Human acceptance before production/merge/real students
