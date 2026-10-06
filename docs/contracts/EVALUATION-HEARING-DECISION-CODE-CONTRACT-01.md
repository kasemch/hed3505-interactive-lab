# HED3505 Evaluation Hearing Decision Code Contract — 01

Status: APPROVED / LOCKED
Scope: WordPress staging, GitHub source, Neon sandbox

## Canonical machine values
- CONTINUE
- CONTINUE_WITH_MODIFICATION
- COLLECT_MORE_EVIDENCE
- DISCONTINUE

These values MUST be used in database records, API payloads, validation logic, fixtures, and automated tests.

## Student-facing labels
The UI may render readable labels:
- CONTINUE → CONTINUE
- CONTINUE_WITH_MODIFICATION → CONTINUE WITH MODIFICATION
- COLLECT_MORE_EVIDENCE → COLLECT MORE EVIDENCE
- DISCONTINUE → DISCONTINUE

Display labels MUST NOT be written directly to decision_code unless mapped to the canonical machine value first.

## Evidence
During the synthetic Hearing persistence test, the display string COLLECT MORE EVIDENCE correctly failed the database check constraint. The canonical value COLLECT_MORE_EVIDENCE then persisted successfully.

## Guardrail
Keep the database constraint as a fail-closed integrity control. Do not weaken it to accept arbitrary strings.

Production and real-student activation remain HOLD.
