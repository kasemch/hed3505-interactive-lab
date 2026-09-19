# HED3505-EVALUATION-ANALYSIS-LAB-02
## Detailed Learning Design — LAB 2 IOC, LAB 3 Reliability, LAB 4 Statistical Data Analysis

Date: 19 September 2026
Environment: CONTROLLED PREVIEW / NON-PRODUCTION

## Status
DESIGN COMPLETE / READY FOR STATIC PROTOTYPE

---

# LAB 2 — IOC Analysis

## Learning outcomes
After completing LAB 2, students can:
1. explain the purpose of IOC in content validity review;
2. calculate IOC for each item from expert ratings -1, 0, +1;
3. interpret item-level IOC without treating the coefficient as the only evidence;
4. classify each item as RETAIN / REVIEW / REVISE / REMOVE and justify the decision.

## Core formula
IOC = ΣR / N

R = expert rating for alignment
N = number of experts

## Synthetic teaching dataset
This dataset is illustrative and is NOT a new fact about โรงเรียนอรุณพัฒนา.

Five expert ratings:

| Item | E1 | E2 | E3 | E4 | E5 | Sum | IOC |
|---|---:|---:|---:|---:|---:|---:|---:|
| Q1 | +1 | +1 | +1 | 0 | +1 | 4 | 0.80 |
| Q2 | +1 | 0 | -1 | +1 | 0 | 1 | 0.20 |
| Q3 | +1 | +1 | +1 | +1 | +1 | 5 | 1.00 |
| Q4 | 0 | +1 | 0 | +1 | +1 | 3 | 0.60 |
| Q5 | -1 | 0 | +1 | 0 | -1 | -1 | -0.20 |

## Student interaction flow
1. Read instrument objective and five item statements.
2. Inspect expert ratings.
3. Calculate ΣR.
4. Calculate IOC manually or with calculator input.
5. Enter IOC answer.
6. Press CHECK.
7. Receive process feedback, not only right/wrong.
8. Select RETAIN / REVIEW / REVISE / REMOVE.
9. Write a one-sentence justification.
10. View Evidence Preview.
11. Download/Copy IOC Analysis Sheet.

## Feedback logic
If arithmetic is incorrect:
"ตรวจผลรวมคะแนนผู้เชี่ยวชาญก่อน แล้วหารด้วยจำนวนผู้เชี่ยวชาญทั้งหมด"

If student divides by sum of scores instead of N:
"ตัวหารของ IOC คือจำนวนผู้เชี่ยวชาญ ไม่ใช่ผลรวมคะแนน"

If coefficient is correct but decision has no justification:
"ค่า IOC เป็นหลักฐานหนึ่งส่วน การตัดสินใจควรอธิบายว่าข้อคำถามสอดคล้องหรือควรปรับอย่างไร"

If student treats a threshold as an absolute rule:
"เกณฑ์ช่วยการตัดสิน แต่ควรพิจารณาความชัดเจนของข้อคำถาม เนื้อหา และข้อเสนอแนะของผู้เชี่ยวชาญร่วมด้วย"

## Evidence output
IOC_Analysis_Sheet.md

Fields:
- item
- expert ratings
- sum
- IOC
- decision
- justification
- revision note

---

# LAB 3 — Reliability Analysis

## Learning outcomes
After completing LAB 3, students can:
1. distinguish major forms of reliability by data/instrument type;
2. select an appropriate reliability approach;
3. calculate or interpret a reliability coefficient from pilot data;
4. explain what reliability does and does not establish.

## Reliability selection task

Scenario A:
Multi-item Likert scale
→ Cronbach's alpha

Scenario B:
Dichotomous 0/1 knowledge test
→ KR-20

Scenario C:
Two or more assessors scoring a performance task
→ Inter-rater reliability

Scenario D:
Same instrument administered at two time points
→ Test–retest reliability

The activity must require students to choose the method BEFORE calculation is revealed.

## Synthetic teaching dataset — Cronbach's alpha
Illustrative pilot data only; NOT master-case data.

12 respondents × 5 Likert items:

| Resp | I1 | I2 | I3 | I4 | I5 |
|---|---:|---:|---:|---:|---:|
| 1 | 4 | 4 | 5 | 3 | 4 |
| 2 | 3 | 4 | 4 | 3 | 4 |
| 3 | 5 | 5 | 4 | 5 | 4 |
| 4 | 2 | 3 | 3 | 2 | 2 |
| 5 | 4 | 4 | 3 | 4 | 5 |
| 6 | 3 | 2 | 4 | 3 | 3 |
| 7 | 5 | 4 | 5 | 4 | 4 |
| 8 | 2 | 2 | 3 | 2 | 3 |
| 9 | 4 | 5 | 4 | 3 | 4 |
| 10 | 3 | 4 | 2 | 3 | 4 |
| 11 | 5 | 4 | 5 | 4 | 5 |
| 12 | 2 | 3 | 2 | 2 | 2 |

Expected Cronbach's alpha:
approximately 0.902

## Core formula
alpha = k/(k-1) × [1 - (Σ variance of items / variance of total score)]

k = number of items

## Student interaction flow
1. Identify instrument type.
2. Choose reliability method.
3. Inspect pilot data.
4. Calculate item variances and total-score variance OR use guided calculation cells.
5. Calculate alpha.
6. Compare with system calculation.
7. Interpret the coefficient.
8. Answer:
   - What does this coefficient support?
   - What does it NOT establish?
9. Decide next action:
   RETAIN / REVIEW ITEMS / COLLECT MORE PILOT DATA / REVISE INSTRUMENT
10. Generate Reliability Report.

## Essential misconception check
Display:
"High reliability ≠ high validity"

Question:
"ถ้า alpha สูง สามารถสรุปได้หรือไม่ว่าเครื่องมือวัดสิ่งที่ต้องการวัดได้ถูกต้อง?"

Expected reasoning:
No. Internal consistency is evidence about consistency, not sufficient evidence of validity.

## Evidence output
Reliability_Report.md

Fields:
- instrument type
- selected reliability method
- coefficient
- interpretation
- limitation
- next action
- reasoning

---

# LAB 4 — Statistical Data Analysis

## Learning outcomes
After completing LAB 4, students can:
1. inspect and summarize a raw dataset;
2. compute frequency, percentage, mean, and standard deviation;
3. select an appropriate table/chart;
4. distinguish statistical result from interpretation;
5. write an evidence-bounded conclusion.

## Synthetic teaching dataset
This is a synthetic teaching dataset and must not be presented as actual data from โรงเรียนอรุณพัฒนา.

Example: CPR knowledge scores out of 10, 12 synthetic learners.

| Learner | Pre | Post |
|---|---:|---:|
| 1 | 6 | 8 |
| 2 | 7 | 9 |
| 3 | 5 | 7 |
| 4 | 8 | 9 |
| 5 | 6 | 8 |
| 6 | 7 | 8 |
| 7 | 4 | 7 |
| 8 | 5 | 7 |
| 9 | 6 | 8 |
| 10 | 7 | 9 |
| 11 | 5 | 7 |
| 12 | 6 | 8 |

Expected descriptive results:

Pre:
Mean = 6.00
SD ≈ 1.13

Post:
Mean ≈ 7.92
SD ≈ 0.79

Mean change:
≈ +1.92

SD of change:
≈ 0.51

Optional advanced extension:
Paired t-test
t(11) ≈ 12.89
p < .001

The paired t-test must be labeled ADVANCED / OPTIONAL unless explicitly included in the approved course scope.

## Student interaction flow
1. Inspect raw data.
2. Identify variable type.
3. Choose descriptive statistics.
4. Calculate frequency/percentage when categorical data are used.
5. Calculate mean.
6. Calculate SD.
7. Create/select chart.
8. Compare pre/post descriptively.
9. Write:
   RESULT
   INTERPRETATION
   LIMITATION
10. Optional:
   choose whether an inferential test is justified.
11. Generate Statistical Analysis Sheet.

## Feedback logic
If student reports only mean:
"ค่าเฉลี่ยบอกระดับโดยรวม แต่ควรดูการกระจายของข้อมูลด้วย"

If student claims causation:
"ข้อมูล pre/post แสดงการเปลี่ยนแปลง แต่การสรุปว่าโปรแกรมเป็นสาเหตุจำเป็นต้องพิจารณาการออกแบบการประเมินและปัจจัยอื่น"

If p-value extension is used:
"Statistical significance ไม่เท่ากับ practical importance และไม่แทนการพิจารณาบริบท"

## Evidence output
Statistical_Analysis_Sheet.md

Fields:
- dataset label
- variables
- statistic selected
- calculations
- table/chart
- result
- interpretation
- limitation
- optional inference

---

# Shared Mobile UI Pattern

Each lab follows:

INTRO
→ WHY THIS MATTERS
→ DATA / EVIDENCE
→ CALCULATE
→ CHECK
→ INTERPRET
→ DECIDE
→ EVIDENCE PREVIEW
→ COPY / DOWNLOAD

Mobile requirements:
- one main task per screen/section
- large numeric input controls
- formula always available in expandable help
- no spreadsheet-width table required to complete the task
- horizontal tables must have responsive card alternative
- tap-first, keyboard accessible
- autosave in localStorage
- reset requires confirmation

---

# Assessment Logic

Assessment should prioritize reasoning, not only numeric accuracy.

For each lab evaluate:
1. calculation accuracy
2. method selection
3. interpretation quality
4. evidence boundary awareness
5. defensibility of decision

Do not award full success for a correct number with unsupported interpretation.

---

# Acceptance Criteria

LAB 2 passes if the learner can:
- calculate item IOC correctly
- explain the denominator
- make and justify an item decision

LAB 3 passes if the learner can:
- choose a suitable reliability method
- interpret the coefficient
- explain that reliability does not equal validity

LAB 4 passes if the learner can:
- compute/interpret mean and SD
- distinguish result from causal conclusion
- produce an evidence-bounded statistical summary

---

# Next Phase

HED3505-EVALUATION-ANALYSIS-LAB-03
Static Prototype Build

Build priority:
1. LAB 2 IOC
2. LAB 3 Reliability
3. LAB 4 Statistics
4. shared evidence export
5. mobile verification
6. answer-key / lecturer mode
