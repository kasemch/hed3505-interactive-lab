# HED3505 Interactive Learning Lab

An open, static-first, mobile-friendly educational technology project for **HED3505 School Health Program and Evaluation**. The lab turns evaluation-design concepts into guided interactive activities that can run without a mandatory backend and can be reused or adapted under the MIT License.

## Why this project exists

School-health evaluation requires learners to connect problems, indicators, instruments, evidence quality, interpretation, and decisions rather than treating them as isolated definitions. This repository provides a lightweight interactive workflow for practising those connections while keeping academic evidence and learner privacy explicit.

The project is maintained as open educational software. It does **not** claim a particular number of users, institutions, contributors, deployments, or measured educational outcomes unless such claims are supported by separate evidence.

## Learning architecture

1. **Module 1 — Problem → Indicator → WS1 Assessment Planning**
2. **Module 2 — Indicator → Instrument → WS2 Instrument Blueprint**
3. **Module 3 — Content Validity → IOC → Reliability → Revision → WS3 Instrument Quality Record**
4. **Module 4 — Data → Interpretation → Decision → WS4 Interpretation & Decision Matrix**
5. **Module 5 — Integrated Evidence → Evaluation Plan → WS5 Integrated Evaluation Plan**

All modules use the interaction pattern:

**Prompt → Tap → Reveal → Discuss → Decide → Save**

## Technical baseline

- HTML
- CSS
- Vanilla JavaScript
- GitHub Pages compatible
- No mandatory backend for the core learner flow
- Smartphone-first interface
- No command line required for learners

The repository also contains automated validation/security workflows and controlled technical material used during development. Legacy or experimental runtime paths should not be interpreted as requirements for the core static learner experience.

## Getting started

### Use the learner interface

The core project is a static web application. It can be served from GitHub Pages or another static web host.

### Local development

1. Clone or download this repository.
2. Serve the repository with a local static HTTP server or equivalent preview environment.
3. Open the learner interface in a modern browser.
4. Test both mobile and desktop viewport widths.
5. Review automated repository checks before proposing a merge.

No production database credentials or learner accounts are required for the core static workflow.

## Architecture principles

### Static first

The primary learning experience should remain useful without a mandatory application server or database. This reduces deployment complexity and makes reuse easier in teaching contexts.

### Mobile first

Activities are designed for smartphone access while remaining usable on larger screens.

### Evidence first

The master instructional case is **โรงเรียนอรุณพัฒนา**. Do not invent additional school facts and present them as authentic evidence.

IOC, reliability, school, learner, or evaluation data used only for practice must be clearly labelled **INSTRUCTIONAL / SIMULATED DATA** when they are not authentic source data.

### Privacy by design

The core static activity does not request student names, student IDs, email addresses, health information, or grades. Learners can export learning evidence as Markdown.

Contributions should not introduce sensitive learner-data collection or transmission without explicit architectural and privacy review.

### Human academic authority

Automation and AI-assisted development can support implementation, testing, documentation, refactoring, and review. Academic meaning, assessment decisions, evidence interpretation, and changes to learner-facing academic logic remain subject to human review.

## Legacy technical reference

The previous Supabase-dependent smoke-test interface is preserved as `legacy-live-smoke.html` for technical reference. It is not required for the core learner activity flow.

## Contributing

Contributions are welcome, particularly for:

- accessibility and mobile usability;
- browser compatibility and frontend quality;
- automated validation and testing;
- documentation and reproducibility;
- privacy and security hardening;
- reusable educational adaptations that preserve evidence integrity.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change. Please also review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and [SECURITY.md](SECURITY.md).

## AI-assisted maintainer workflow

Coding assistants and agents may be used for bounded tasks such as issue analysis, implementation, test generation, documentation maintenance, pull-request review, and release preparation. AI-generated changes must be reviewed against repository constraints before merge, especially the evidence policy, privacy rules, static-first architecture, and human academic authority.

Repository-specific agent guidance is maintained separately from the learner-facing documentation so automated tooling can work with explicit project constraints.

## Releases and change history

Formal GitHub Releases are not assumed by this README. See [CHANGELOG.md](CHANGELOG.md) for verified release-readiness notes and future change history.

## License

Software in this repository is distributed under the [MIT License](LICENSE).