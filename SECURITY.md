# Security Policy

## Supported scope

Security reports are welcome for the current default branch and the public learner-facing implementation. Historical or legacy interfaces may be retained for reference and should not be assumed to represent the preferred runtime path.

## Reporting a vulnerability

Please do not publish exploit details, credentials, personal data, or sensitive learner information in a public issue.

If a potential vulnerability can be described safely without disclosing exploitation details or sensitive information, open a GitHub issue requesting a private maintainer follow-up. For issues that cannot be safely disclosed in public, contact the repository maintainer through an appropriate private channel associated with the maintainer's public GitHub profile.

Include, where safe:

- affected component and version or commit;
- reproduction conditions;
- expected and observed behaviour;
- likely security or privacy impact;
- suggested mitigation, if known.

## Security principles

The core learning flow is designed to minimize data collection. It should not require student names, student IDs, email addresses, health information, or grades. Contributions must not introduce collection or transmission of sensitive learner information without explicit architectural and privacy review.

Never commit secrets, API keys, access tokens, passwords, production credentials, or real sensitive records to this repository.

## Response

The maintainer will assess reproducibility, scope, severity, and an appropriate remediation path. A report may be closed if it concerns unsupported infrastructure, cannot be reproduced, or does not affect this repository. No fixed response-time or remediation-time guarantee is currently offered.