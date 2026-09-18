# HED3505 Digital QA Defect Register

Phase: **06C — Student Pilot Simulation, Mobile QA & End-to-End Traceability**

| ID | Module | Category | Severity | Issue | Impact | Remediation | Status |
|---|---|---|---|---|---|---|---|
| D-06C-01 | All | TRACEABILITY | HIGH | Switching modules cleared prior interaction choices | Progressive evidence could be lost during review | Added per-module state object for interaction decisions | REMEDIATED |
| D-06C-02 | All | EXPORT | HIGH | Notes from one module could carry into another module export | Evidence package could contain reasoning from the wrong module | Added per-module notes state and explicit load/save on module switch | REMEDIATED |
| D-06C-03 | All | PEDAGOGY | MEDIUM | Learner could advance without making a decision | Reduced fidelity to Prompt → Tap → Reveal → Discuss → Decide → Save | Block next-step navigation until a choice/decision is recorded | REMEDIATED |
| D-06C-04 | All | ACCESSIBILITY | MEDIUM | Focus visibility and option pressed-state semantics were weak | Keyboard users could lose interaction context | Added focus-visible styling, aria-pressed, progressbar semantics and live status messaging | REMEDIATED |
| D-06C-05 | All | MOBILE | LOW | Real-device/browser visual walkthrough was previously missing | iPhone screenshot of the live GitHub Pages preview confirms responsive mobile rendering, readable hierarchy, usable module controls, and no visible horizontal overflow | Real-device mobile visual acceptance recorded on 18 Sep 2026 | CLOSED |
| D-06C-06 | Preview | NAVIGATION | LOW | Legacy Supabase smoke test could be exposed from learner preview | Could be mistaken for required workflow | Controlled `/docs` preview removes the legacy link and deploys only static learner assets | CLOSED |

## Gate rule

No BLOCKER or HIGH defect may remain open before controlled pilot activation.


## Phase 06D update

- CI: SUCCESS
- PR #1: mergeable / draft
- No BLOCKER or HIGH defect remains open.
- Exact GitHub Pages URL has now been supplied: `https://kasemch.github.io/hed3505-interactive-lab/`.
- `/docs` source inspection confirms learner-only static preview structure and no legacy Supabase link.
- Real-device evidence has now been supplied via iPhone screenshot of the live GitHub Pages preview.
- D-06C-05 is CLOSED for mobile visual acceptance.
- Public deployment and real-student activation remain HOLD until the human preview gate is cleared.
