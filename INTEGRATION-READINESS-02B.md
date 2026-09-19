# HED3505-INTEGRATION-READINESS-02B
## Controlled Integration Specification

Date: 19 September 2026
Environment: CONTROLLED PREVIEW / NON-PRODUCTION

## Status
SPECIFICATION COMPLETE / READY FOR CONTROLLED IMPLEMENTATION

## 1. Navigation placement

Target learner route:

HED3505
→ Interactive Learning Lab
→ Five-Module Evaluation Design Lab
→ Evidence Reasoning Studio

The Evidence Reasoning Studio must appear as a clearly separate learning path, not as a replacement for Modules 1–5.

Recommended learner-facing label:

Evidence Reasoning Studio
การคิดเชิงหลักฐานสำหรับการประเมิน

Short description:

ฝึกแยกข้อมูล การตีความ การตัดสิน และข้อเสนอแนะ
โดยไม่สรุปเกินหลักฐาน

## 2. Landing page specification

Landing page should show:

Title:
Evidence Reasoning Studio

Subtitle:
A1–B3 Digital Learning Activities

Learning purpose:
Use evidence responsibly in school health program evaluation.

Cards:
A1 Evidence Classification
A2 Baseline Interpretation
B1 CPR Evidence Puzzle
B2 Claim Sorting
B3 Present & Challenge

Each card:
- objective
- estimated time
- evidence output
- Start / Continue
- status

Visual language:
School Evaluation Studio
Educational Field Notebook
Warm cream / navy / teal / coral / mustard

## 3. Cross-reference to Module 4

Primary relationship:

Module 4
Data → Interpretation → Decision

Add an optional supporting link:

“Practice evidence reasoning before/after WS4”

Do not alter WS4 requirements.

Recommended wording:

Evidence Reasoning Studio ช่วยฝึกการแยก
Fact / Interpretation / Judgment / Recommendation
ก่อนนำไปใช้กับ WS4

## 4. Portfolio folder contract

Recommended portfolio structure:

portfolio/
  design-artifacts/
    WS1/
    WS2/
    WS3/
    WS4/
    WS5/

  evidence-reasoning/
    A1_evidence_classification.md
    A2_baseline_interpretation.md
    B1_cpr_evidence_puzzle.md
    B2_claim_sorting.md
    B3_present_and_challenge.md

  reflection/
    Exit_Ticket_1.md
    Exit_Ticket_2.md
    Final_Reflection.md

Do not mix A1–B3 files into WS1–WS5 folders.

## 5. Evidence contract

A1–B3 use one common evidence contract:

activity_id
activity_title
student_or_group
date
learning_objective
response
reasoning
evidence_used
missing_evidence
self_check
feedback
revision
reflection
completion_status

Static baseline persistence:
- localStorage draft
- Evidence Preview
- Copy
- Markdown download

No centralized storage is required.

## 6. Controlled integration route

Preferred implementation in current repository:

docs/
  evidence-reasoning/
    index.html
    app.js
    style.css

This route is separate from:
docs/index.html

Do not overwrite current five-module preview files.

## 7. Course-hub integration label

When course hub integration is eventually authorized, use:

Primary label:
Evidence Reasoning Studio

Secondary label:
A1–B3: From Data to Defensible Recommendation

Avoid:
- “New Module 1–5”
- “Replacement Lab”
- “Dashboard”
- “AI Evaluation System”

## 8. Regression test script

Before activation verify:

R01
Current five-module landing page loads.

R02
Module 1–5 navigation still works.

R03
WS1–WS5 references remain unchanged.

R04
Evidence Reasoning Studio loads independently.

R05
A1–B3 all open.

R06
Mobile layout works.

R07
localStorage state remains browser-local.

R08
No backend/network dependency introduced.

R09
No sensitive student health information collected.

R10
Course-hub route can be removed without affecting either learning path.

## 9. Accessibility acceptance

Verify:

- minimum readable mobile text
- 44px approximate touch targets
- visible focus
- semantic labels
- no color-only meaning
- no hover-only interaction
- tap fallback for sorting/select actions
- keyboard-accessible controls

## 10. Rollback checklist

If controlled integration causes regression:

1. remove Evidence Reasoning Studio link from course navigation
2. revert integration-only commit
3. retain accepted preview files
4. do not alter WS1–WS5
5. verify original five-module Pages route
6. rerun mobile smoke test
7. record regression in defect register

## 11. Release boundary

This specification authorizes only controlled implementation in isolated preview structure.

Not authorized:
- production course-hub activation
- real-student rollout
- automated grading
- authentication
- centralized student-response storage
- replacement of existing five-module architecture
- modification of kasemch/kasemch.github.io

## 12. Next phase

HED3505-INTEGRATION-READINESS-02C
Controlled Integration Build

Scope:
- implement docs/evidence-reasoning/
- reuse accepted A1–B3 controlled preview
- preserve standalone preview route
- run regression verification
- prepare release readiness report
