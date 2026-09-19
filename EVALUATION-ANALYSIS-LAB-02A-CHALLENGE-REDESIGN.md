# HED3505-EVALUATION-ANALYSIS-LAB-02A
## Challenge-Based Redesign for IOC, Reliability, and Statistics

Date: 19 September 2026
Status: APPROVED / DESIGN BASELINE

## Design principle

Increase cognitive challenge, not arithmetic burden.

Core rule:
- reduce unnecessary manual formula substitution;
- increase interpretation, evidence comparison, uncertainty handling, and defensible decision-making.

Target learning pattern:
Choose → Predict → Inspect → Detect → Compare Evidence → Decide → Defend → Revise Decision

---

# LAB 2 — IOC Challenge Layer

Maintain calculation of IOC because the arithmetic is accessible.

Add challenge elements:
1. Expert disagreement case
2. Same IOC, different wording-quality case
3. High IOC but construct-coverage gap
4. Decision must use IOC + expert comment + item purpose
5. Student must justify RETAIN / REVIEW / REVISE / REMOVE

Key misconception:
A single cutoff must not be treated as an automatic decision rule.

---

# LAB 3 — Reliability Investigation Lab

## Goal
Students do not manually substitute the full Cronbach's alpha formula.

They must:
1. select the reliability approach;
2. predict likely reliability quality;
3. read software/system output;
4. inspect item-level diagnostics;
5. identify a suspicious item;
6. compare reliability evidence with validity evidence;
7. decide and defend the next action;
8. revise the decision when new evidence appears.

## Challenge sequence

### Stage 1 — Choose the Method
- Likert scale → Cronbach's alpha
- dichotomous 0/1 test → KR-20
- multiple raters → inter-rater reliability
- repeated administration → test–retest

### Stage 2 — Predict
Before seeing the coefficient, learner predicts:
HIGH / MODERATE / LOW / NOT ENOUGH INFORMATION
and gives one reason.

### Stage 3 — Read the Output
System displays:
Cronbach's alpha = .90

Learner states:
- what this supports;
- what this does not establish.

### Stage 4 — Investigate Items

Synthetic diagnostic table:

| Item | Corrected item-total correlation | Alpha if item deleted |
|---|---:|---:|
| I1 | .62 | .88 |
| I2 | .58 | .89 |
| I3 | .14 | .94 |
| I4 | .66 | .87 |
| I5 | .61 | .88 |

Learner identifies the item requiring investigation and explains why.

### Stage 5 — Detect the Trap

Candidate hypotheses for I3:
- ambiguous wording
- reverse-coded item not recoded
- measures a different dimension
- response-pattern anomaly
- genuinely important construct content that behaves differently

Students must choose which hypotheses require more evidence.

### Stage 6 — Compare Contradictory Evidence

Reveal:
IOC for I3 = 1.00

Prompt:
Should I3 be deleted immediately?

Expected reasoning:
No automatic deletion. High content-alignment evidence and weak internal-consistency evidence point to different aspects of instrument quality.

### Stage 7 — Reliability Mystery Case

Claim:
"Alpha = .91, therefore the instrument is valid and ready for use."

Response options:
AGREE / DISAGREE / NOT ENOUGH EVIDENCE

Learner must justify the response.

### Stage 8 — Final Evaluation-Team Challenge

Evidence cards:
- IOC = .86
- Alpha = .90
- I3 corrected item-total correlation = .14
- Alpha if I3 deleted = .94
- Expert comment: I3 represents an important dimension of the construct

Required output:
Decision
Evidence 1
Evidence 2
Risk / Uncertainty
Next Action

Evidence artifact:
Reliability_Investigation_Report.md

---

# LAB 4 — Statistical Reasoning Challenge Layer

Retain mean, SD, frequency, and percentage calculations.

Add challenge elements:
1. Predict the pattern before calculating
2. Compare mean and variability
3. Identify a misleading conclusion
4. Detect causal overclaim
5. Contradictory evidence card
6. Decide what additional analysis/evidence is needed

Example misleading claim:
"The post-test mean is higher, therefore the program caused improvement."

Learner must classify the claim as:
SUPPORTED / OVERSTATED / NOT ENOUGH EVIDENCE
and justify the response.

---

# Shared assessment emphasis

Prioritize:
1. method selection
2. correct use of evidence
3. interpretation
4. uncertainty recognition
5. decision defensibility
6. revision after new evidence

Do not reward a correct number alone with full credit.

## Next implementation action
Update the controlled static prototype so LAB 3 follows the Reliability Investigation workflow and LAB 2/LAB 4 include at least one challenge layer each.
