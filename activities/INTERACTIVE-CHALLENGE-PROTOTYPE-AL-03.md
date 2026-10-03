# HED3505 Interactive Challenge Prototype — AL-03

Status: STAGING IMPLEMENTED / NON-PERSISTENT

## Implemented
Challenge 1 Evaluation Detective
- support-level radio choice
- rationale field
- defensible-revision field
- self-check reasoning checklist

Challenge 2 Build the Evaluation
- eight-field evaluation chain
- peer-audit choice
- peer-feedback field

Challenge 3 Missing Evidence
- evaluation question
- one missing-evidence selection description
- data source and instrument
- rationale and decision-use fields
- Low / Moderate / High confidence plus justification

## Privacy and persistence
No response is submitted to or persisted in a database in this prototype.
No student identifier is requested.
Teacher Key is not embedded.

## Functional gate
Rendered controls and labels verified on WordPress staging.
Next gate should test student completion flow on phone and decide whether persistence is pedagogically necessary before adding any database/API integration.

## Architecture
GitHub → WordPress.
Vercel out of scope.
Production and PR merge remain on hold.
