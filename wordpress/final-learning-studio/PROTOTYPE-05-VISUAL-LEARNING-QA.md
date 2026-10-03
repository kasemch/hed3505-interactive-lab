# HED3505 Prototype 05 — Visual & Learning Experience QA

## Gate finding
WordPress page 117 remains DRAFT. Anonymous rendering correctly returns 404; therefore public Lighthouse/visual audit cannot be treated as valid evidence yet. Do not publish merely to run QA.

## Visual system for acceptance build
- Direction: academic learning studio; calm, modern, high-information clarity.
- Hierarchy: Hero → mission → master cycle → evidence board → 7 learning cards → hearing → debrief → exam readiness → exit ticket.
- Mobile-first: single-column reading; minimum 16px body text; 44px interactive targets; tables must horizontally scroll or transform to cards.
- Progressive disclosure: self-study modules use native details/summary to reduce cognitive load.
- Navigation: three anchors at top — Review / Hearing / Exam.
- Accessibility: semantic H1→H2→H3 hierarchy; table th + scope; details/summary keyboard-native; meaningful link text; no color-only status cues.
- Student safety: teacher key excluded; no personal student data; case values carry causal-inference warning.
- Learning integrity: “Need More Evidence” remains a valid response with required justification; confidence rating must include rationale.

## QA completed from stored content
PASS — one H1 and structured section headings
PASS — table column headers include scope
PASS — internal anchors identify the three principal journeys
PASS — self-study uses keyboard-native details/summary
PASS — teacher key absent from student content
PASS — no production/student records involved
PASS — no new unsupported case values introduced
PASS — causal-claim warning retained

## Deferred until human-visible preview exists
HOLD — viewport visual inspection
HOLD — actual contrast measurement against rendered theme
HOLD — responsive Evidence Board behavior
HOLD — Lighthouse accessibility/performance
HOLD — touch-target verification

## Release rule
Do not change page status from draft, merge PR, redirect GitHub Pages, or touch production until Human Visual Acceptance.
