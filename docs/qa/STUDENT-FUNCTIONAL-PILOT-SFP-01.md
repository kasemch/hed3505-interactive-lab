# HED3505 Student Functional Pilot — SFP-01

Status: TECHNICAL PILOT PASS / HUMAN STUDENT PILOT PENDING
Target: WordPress staging, mobile-first
Date: 2026-10-03

## Verified
- Challenge 1 renders radio controls, two reasoning text areas, and self-check checklist.
- Challenge 2 renders the eight-step Evaluation Chain, peer-audit controls, and peer feedback.
- Challenge 3 renders missing-evidence planning, confidence controls, and rationale.
- All text inputs/textareas have explicit labels.
- Radio groups use fieldset/legend.
- Challenge progression links forward to Evaluation Hearing.
- No student identifier is requested.
- No form action/database persistence is present.
- Teacher Key remains absent from student DOM.

## Mobile audit
Performance 100/100
Best Practices 100/100
Accessibility 90/100
LCP 1.1 s
CLS 0
TBT 0 ms
FCP 0.9 s
Speed Index 2.7 s
Field data unavailable; laboratory data only.

Open issue: one color-contrast finding from rendered theme styling.

## Assessment/persistence recommendation
Challenge 1 — PRACTICE / formative; do not score by default. Preserve revision thinking only if portfolio evidence is later desired.
Challenge 2 — EVIDENCE CANDIDATE; the Final Evaluation Chain is suitable for portfolio/assessment because it directly demonstrates evaluation-design alignment.
Challenge 3 — EVIDENCE CANDIDATE; missing-evidence rationale and confidence justification demonstrate evidence prioritization and evaluative reasoning.
Evaluation Hearing — GROUP PERFORMANCE EVIDENCE candidate; use rubric rather than a single predetermined answer.

## Data-minimization rule for future persistence
If persistence is approved later, store only what is needed for learning evidence: activity ID, pseudonymous/authorized learner identifier, response payload, revision/version, timestamp, rubric/feedback state. Do not collect unrelated personal data.

## Gates
Technical student flow: PASS
Privacy/non-persistence: PASS
Accessibility: PASS WITH CONDITION (theme contrast)
Real-student usability: PENDING
Database/persistence: NOT AUTHORIZED
Production: HOLD
PR merge: HOLD
