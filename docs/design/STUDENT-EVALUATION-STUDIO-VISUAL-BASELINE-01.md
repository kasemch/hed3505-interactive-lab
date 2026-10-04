# HED3505 Student Evaluation Studio — Visual Baseline 01

Status: APPROVED VISUAL BASELINE / STAGING IMPLEMENTATION AUTHORIZED

## Direction
Hybrid Design 3 + 4 + 10: Student Mission Dashboard + Evaluation Studio + Adaptive Student Workspace.

## Hero
Course: HED3505 การประเมินโปรแกรมสุขภาพในโรงเรียน
Instructor: ผู้ช่วยศาสตราจารย์ ดร.เกษม ชูรัตน์
Use the user-approved instructor portrait; do not generate a replacement face.
Primary message: เรียนรู้ที่จะตัดสินโปรแกรมจากหลักฐาน ไม่ใช่จากความรู้สึก.

## Student home
1. Welcome/Hero with instructor.
2. Continue Learning / next recommended action.
3. Progress summary.
4. Seven-step journey: SEE → MAP → ASK → TRUST → INTERPRET → JUDGE → ACT.
5. Case Study: โรงเรียนอรุณพัฒนา.
6. Today's Missions: Evaluation Detective → Build the Evaluation → Missing Evidence.
7. My Learning Evidence: C2 / C3 / Evaluation Hearing.
8. Final Mission: School Health Evaluation Hearing.
9. Exam Ready.
10. Student Handbook / PDF center.

## Visual content
Use purposeful illustrations for the school case, evidence investigation, logic model, evidence trustworthiness, interpretation, judgment, action/re-evaluation, and exam readiness. Visuals must teach or orient; avoid decorative overload.

## First-login onboarding
Show a dismissible guided popup/tour:
1 Welcome
2 Read case study
3 Follow 7-step journey
4 Complete challenges
5 Save eligible evidence only after authenticated/enrolled
6 Join Evaluation Hearing
7 Review feedback and prepare for exam
Do not collect credentials in the popup. Provide reopen-help control.

## Case-study reader
Use only locked facts for โรงเรียนอรุณพัฒนา:
students 1,800; staff 108; sufficient PA 59%; insufficient 41%; overweight/obesity 24.8%; sugary drinks ≥5d 37%; sleep <7h 44%; high stress 22%; ever tried vaping 11%; CPR knowledge pass 81%; CPR performance pass 38%; satisfaction 4.3/5.
Explicitly separate: Facts / Interpretation prompts / Unknowns / Evidence still needed.

## Guidance and answer examples
Every writing task should offer:
- What the prompt asks
- Response structure
- short synthetic example
- common overclaim warning
- rubric/checklist
Examples must model reasoning without becoming the answer to the live case.
Core pattern: Evidence → Interpretation → Criterion → Judgment → Recommendation → Action → Re-evaluation.

## PDFs
Prepare a detailed Student Handbook set:
A System & Learning Journey Guide
B Arun Pattana Case Study Pack
C Writing & Reasoning Examples
D Assessment Rubric & Exam Readiness
PDFs must be accessible, printable, versioned, and consistent with the web content.

## Responsive navigation
Desktop: Home / Lessons / Challenges / My Evidence / Exam Ready.
Mobile: Home / Learn / Challenges / My Evidence.

## Safety / governance
C1 remains non-persistent. C2/C3/Hearing only persist under approved authenticated flow.
Teacher Key is not exposed to students.
No real-student activation, production deployment, PR merge, or GitHub Pages retirement under this design approval.
Accessibility remains PASS WITH CONDITION until the outstanding contrast node is resolved.
