# HED3505 Evaluation Analysis Lab — Controlled Device Verification

Date: 19 September 2026
Target: iPhone first, then Android/tablet/laptop as available

## Route
https://kasemch.github.io/hed3505-interactive-lab/evaluation-analysis-lab/

## Verification sequence

### V01 — Page load
Expected:
- page opens without 404
- title and three LAB tabs render
- no horizontal overflow on initial view

### V02 — LAB 2 IOC
Actions:
- enter at least one correct and one incorrect IOC
- select a decision
- enter reasoning
- press Check

Expected:
- feedback appears
- numeric fields remain readable on mobile
- no accidental zoom/layout break
- reasoning field usable with on-screen keyboard

### V03 — LAB 3 Reliability
Actions:
- choose reliability method for all four scenarios
- enter alpha ≈ 0.902
- type meaning and limitation

Expected:
- method feedback appears
- alpha interpretation feedback appears
- "High reliability ≠ high validity" remains visible/readable

### V04 — LAB 4 Statistics
Actions:
- enter means and SDs
- enter result / interpretation / limitation
- press Check

Expected:
- feedback distinguishes descriptive result from causal conclusion
- no field is hidden behind mobile browser controls

### V05 — Evidence
Actions:
- open Evidence tab
- generate preview
- copy
- download Markdown

Expected:
- preview reflects entered values
- Copy works or falls back gracefully
- .md download is offered by browser

### V06 — Persistence
Actions:
- refresh page
- switch tabs
- close and reopen page

Expected:
- browser-local answers remain where autosave is implemented

### V07 — Orientation
Actions:
- rotate portrait ↔ landscape

Expected:
- content remains readable
- tables scroll or reflow without clipping critical controls

### V08 — Existing lab regression
Open:
https://kasemch.github.io/hed3505-interactive-lab/

Expected:
- existing five-module lab still loads
- no route regression introduced

## Acceptance result

PASS:
all core tasks complete with no blocker

PASS WITH CONDITIONS:
minor visual/usability defects only

HOLD:
calculation, navigation, persistence, or evidence export has a blocking defect

## Human report format

Reply with one of:
PASS
PASS WITH CONDITIONS
HOLD

If not PASS, attach a screenshot or state:
IOC / Reliability / Statistics / Evidence / Persistence / Layout
