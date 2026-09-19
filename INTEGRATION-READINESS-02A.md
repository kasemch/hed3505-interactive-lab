# HED3505-INTEGRATION-READINESS-02A
## Digital Activity + Portfolio Reconciliation & Integration Readiness

Date: 19 September 2026  
Environment: CONTROLLED PREVIEW / NON-PRODUCTION

## Status
PASS WITH CONTROLLED INTEGRATION BOUNDARY

## 1. Architecture finding

Two approved learning structures currently coexist:

### Existing Interactive Lab
Five-module progression:
1. Problem → Indicator
2. Indicator → Instrument
3. Content Validity → IOC → Reliability → Revision
4. Data → Interpretation → Decision
5. Integrated Evidence → Evaluation Plan

Evidence chain:
WS1 → WS2 → WS3 → WS4 → WS5

### Newly accepted Digital Activity stream
A1 Evidence Classification  
A2 Baseline Interpretation  
B1 CPR Evidence Puzzle  
B2 Claim Sorting  
B3 Present & Challenge

Evidence chain:
Activity → Evidence Preview → Markdown Evidence → Portfolio

These structures are related but not equivalent. The A1–B3 stream must not replace the existing five-module progression without a separate curriculum decision.

## 2. Integration decision

Use A1–B3 as an **Evidence Reasoning Studio** within the HED3505 learning ecosystem.

Position:
- supplementary / embedded learning activity layer
- strongest conceptual alignment with Module 4: Data → Interpretation → Decision
- may also serve as prerequisite or reinforcement before WS4

Do not renumber A1–B3 as Modules 1–5.
Do not overwrite WS1–WS5.

## 3. Single evidence contract

All new A1–B3 records should use one common contract:

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

Output:
- browser-local draft state
- Evidence Preview
- Markdown download/copy
- optional student portfolio commit later

No duplicate central record is required in the static baseline.

## 4. Course-hub route

Planned route:

RU-HEPE Learning Hub
→ HED3505
→ Interactive Learning Lab
   → Five-Module Evaluation Design Lab
   → Evidence Reasoning Studio (A1–B3)

The existing five-module route remains authoritative for WS1–WS5.

## 5. Portfolio convergence

Portfolio should preserve both evidence families:

### Design artifacts
WS1
WS2
WS3
WS4
WS5

### Evidence-reasoning artifacts
A1_evidence_classification.md
A2_baseline_interpretation.md
B1_cpr_evidence_puzzle.md
B2_claim_sorting.md
B3_present_and_challenge.md

Recommended relation:
A1–B3 support reflective/evidence reasoning around WS4 rather than replacing WS4.

## 6. Regression boundary

Before any course-hub public integration, verify:

- existing five modules still load
- WS1–WS5 workflow remains unchanged
- current static lab learner flow remains available
- controlled preview route remains isolated
- A1–B3 use no backend
- no sensitive student health data is collected
- relative paths work on GitHub Pages
- mobile interaction remains usable
- no public production link is changed without release authorization

## 7. Rollback boundary

If integration causes regression:

1. remove only the course-hub link to Evidence Reasoning Studio
2. revert only the integration commit
3. retain the accepted controlled preview files
4. leave five-module lab and WS1–WS5 unchanged
5. re-run static validation and mobile smoke test

## 8. Release boundary

This phase authorizes integration planning only.

NOT AUTHORIZED:
- production merge solely on this record
- real-student activation
- centralized response collection
- authentication
- automated grading
- replacement of the five-module lab
- modification of kasemch/kasemch.github.io

## 9. Next phase

HED3505-INTEGRATION-READINESS-02B
Controlled Integration Specification

Deliverables:
- navigation placement
- link labels
- Evidence Reasoning Studio landing specification
- WS4 cross-reference
- portfolio folder contract
- regression test script
- release/rollback checklist
