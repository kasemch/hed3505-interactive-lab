# Contributing to HED3505 Interactive Learning Lab

Thank you for your interest in improving this open educational technology project.

## Scope

The project provides a static-first, mobile-friendly learning environment for school-health programme evaluation. Contributions should preserve the academic workflow, privacy safeguards, accessibility, and the distinction between authentic evidence and instructional/simulated data.

## Ways to contribute

- Report reproducible defects or accessibility problems.
- Improve documentation, usability, mobile behaviour, or browser compatibility.
- Propose learning-interface improvements that preserve the approved academic logic.
- Improve automated validation, testing, security checks, or maintainability.
- Suggest reusable adaptations for educational contexts without introducing unsupported factual claims.

## Development principles

1. Evidence first: do not invent school, learner, research, adoption, or impact data.
2. Privacy by design: the core static learning flow must not require student names, IDs, email addresses, health information, or grades.
3. Static first: preserve a useful no-backend path wherever practical.
4. Mobile first: changes should remain usable on smartphones as well as larger screens.
5. Human academic authority: automation may assist implementation and review, but academic meaning and assessment decisions remain subject to human review.
6. Reversible changes: prefer focused pull requests with clear rationale and limited scope.

## Local development

The core project uses HTML, CSS, and vanilla JavaScript. No mandatory backend is required for the core learner flow.

1. Clone or download the repository.
2. Serve the repository with any local static HTTP server, or use an equivalent local preview environment.
3. Open the learner interface in a modern browser.
4. Test both narrow mobile and desktop viewport widths.
5. Run or inspect the repository validation workflows before requesting merge.

## Pull requests

Keep each pull request focused. In the description, state:

- the problem being addressed;
- the files and behaviour changed;
- how the change was verified;
- whether academic content or learner-facing logic changed;
- any privacy, accessibility, security, or data implications.

Do not include real student records, credentials, secrets, or sensitive health information in issues, commits, fixtures, screenshots, or pull requests.

## Instructional and simulated data

Any IOC, reliability, school, learner, or evaluation data that are not authentic source data must be explicitly labelled as instructional or simulated data. Do not convert simulated examples into factual claims.

## AI-assisted contributions

AI tools, including coding agents, may be used for implementation, tests, documentation, refactoring, and review. Contributors remain responsible for verifying generated changes, preserving the academic and privacy constraints above, and disclosing material limitations when relevant.

## License

By contributing, you agree that your contribution may be distributed under the repository's MIT License.