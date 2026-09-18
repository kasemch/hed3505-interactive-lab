# HED3505 Digital QA Defect Register

Phase: **06C — Student Pilot Simulation, Mobile QA & End-to-End Traceability**

| ID | Module | Category | Severity | Issue | Impact | Remediation | Status |
|---|---|---|---|---|---|---|---|
| D-06C-01 | All | TRACEABILITY | HIGH | Switching modules cleared prior interaction choices | Progressive evidence could be lost during review | Added per-module state object for interaction decisions | REMEDIATED |
| D-06C-02 | All | EXPORT | HIGH | Notes from one module could carry into another module export | Evidence package could contain reasoning from the wrong module | Added per-module notes state and explicit load/save on module switch | REMEDIATED |
| D-06C-03 | All | PEDAGOGY | MEDIUM | Learner could advance without making a decision | Reduced fidelity to Prompt → Tap → Reveal → Discuss → Decide → Save | Block next-step navigation until a choice/decision is recorded | REMEDIATED |
| D-06C-04 | All | ACCESSIBILITY | MEDIUM | Focus visibility and option pressed-state semantics were weak | Keyboard users could lose interaction context | Added focus-visible styling, aria-pressed, progressbar semantics and live status messaging | REMEDIATED |
| D-06C-05 | All | MOBILE | LOW | No device-lab screenshot test is stored in this repository | Visual QA currently relies on responsive CSS/code inspection and pilot simulation | Keep as non-blocking condition for first real-device pilot | OPEN / NON-BLOCKING |
| D-06C-06 | Legacy | NAVIGATION | LOW | Legacy Supabase smoke test remains linked from learner page | Could be mistaken for required workflow | Labeled as legacy technical reference; not part of core learner flow | ACCEPTED / DOCUMENTATION |

## Gate rule

No BLOCKER or HIGH defect may remain open before controlled pilot activation.
