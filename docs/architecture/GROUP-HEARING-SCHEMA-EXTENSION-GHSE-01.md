# HED3505 Group Hearing Schema Extension — GHSE-01

Status: DESIGN VERIFIED / SANDBOX MIGRATION PENDING
Target: existing Neon sandbox branch only

## Need
The approved Evaluation Hearing evidence chain is:
Evidence → Interpretation → Criterion → Judgment → Limitation → Recommendation/Action → Confidence.

The existing group_hearing table already stores evidence_summary, criterion_summary, limitation_summary, recommendation_summary, decision_code, and confidence_level, but does not separately store interpretation and judgment.

## Proposed additive change
Add two nullable text columns:
- interpretation_summary
- judgment_summary

No existing column is dropped, renamed, or rewritten. Existing synthetic records remain compatible.

## Migration SQL
ALTER TABLE hed3505.group_hearing
  ADD COLUMN interpretation_summary text,
  ADD COLUMN judgment_summary text;

## Important execution note
An attempted generic temporary-branch migration could not locate schema hed3505 because that migration workflow branches from the project default/production lineage, whereas the HED3505 schema exists on the isolated sandbox branch. No schema change was applied.

Therefore do not apply this migration to the project default/production branch. Apply only to hed3505-learning-evidence-sandbox after explicit authorization for the sandbox schema change, then verify columns and run the synthetic Hearing persistence test.

Production remains HOLD.
