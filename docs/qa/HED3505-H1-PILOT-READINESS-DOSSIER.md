# HED3505 — H1 Controlled Pilot Readiness Dossier

Status: NOT READY FOR H1 APPROVAL YET
Classification: CONTROLLED / NON-PRODUCTION
Architecture: GitHub → WordPress + Neon
Vercel: NOT USED

## Verified baseline
Feature branch: `hed3505-wordpress-final-learning-studio-01`

Operational source of truth: the latest completed successful `Validate Static Learning Lab` workflow for the feature branch. Fixed commit/run references below are evidence snapshots, not perpetual readiness authority.

Latest verified evidence snapshot before this documentation reconciliation:
- Head: `0a32a12078d7913c66811e65b883b57a106ce702`
- CI #549: FULL PASS
- PR #3: OPEN / DRAFT / NOT MERGED / MERGE HOLD
- Branch comparison at the snapshot: ahead 128 / behind 0

Verified static/synthetic gates include R3–R10 reversible readiness, Teacher Command Center synthetic contract, evidence-based completion/eligibility contract, accessibility structural regression contract, measured accessibility evidence-boundary contract, Final Synthetic E2E static readiness, R2-SYN runtime-evidence governance, H1 readiness governance, R2 auth/authorization source security guard, isolated R2 auth UI build, module labels, privacy boundary, preview isolation, and preview parity.

## Evidence classification
### PASS — verified
- Static learning-system validation
- Synthetic E2E static contract
- R2 source-security guard
- Completion/certificate fail-closed static contract
- Teacher Command Center synthetic contract
- Accessibility structural regression gate
- Measured accessibility evidence-boundary governance
- Privacy and preview-isolation checks

### PASS WITH OPEN MEASURED CONDITION
- Accessibility measured baseline remains 97; color-contrast condition remains OPEN until measured retest. Structural regression PASS does not prove the measured color-contrast condition is resolved and does not upgrade the measured score.

### PENDING — runtime evidence required
- R2-SYN multi-principal runtime authorization matrix
- Student A own access and A→B denial
- Student B own access and B→A denial
- Cross-learner activity_attempt isolation
- Student assessment write denial against a valid own object
- Teacher runtime authorization
- audit_event runtime isolation
- persistence initial → feedback → revision → reload
- server-authoritative certificate lock at runtime

### PENDING — separate live gate
- R2-LIVE genuine multi-user authorization evidence
- Real-student pilot activation

## Current blocker
Neon connector/tool routing currently returns `Resource not found: Neon.run_sql` after controlled rediscovery/retry. This is classified as CONNECTOR BLOCKED. It is not evidence of database failure and not evidence of RLS failure. No database mutation was performed by the failed retry.

Do not loop retries while connector state is materially unchanged. Resume with one controlled read-only retry after a meaningful connector/tool-state change.

## H1 entry criteria
H1 may be presented only after:
1. R2-SYN runtime matrix has non-vacuous runtime evidence and receives PASS.
2. Required persistence/reload behavior is proven in the ephemeral/sandbox environment.
3. Certificate eligibility remains server-authoritative and fail-closed under runtime testing.
4. No Critical security/privacy defect remains open.
5. Any remaining accessibility condition is explicitly risk-classified; measured claims are not inflated.
6. R2-LIVE requirements for the controlled pilot are either proven or explicitly resolved by the approved pilot design before real students are activated.

## Governance holds
- PR #3 merge: HOLD
- Production: HOLD
- Real students: HOLD
- Certificate issuance: HOLD
- Production Neon branch: FORBIDDEN
- Vercel: FORBIDDEN

## Human Gate
When all H1 entry criteria are satisfied, ask exactly one decision:

**APPROVE REAL-STUDENT PILOT**

Until then, continue reversible preparation automatically and keep runtime-security items PENDING rather than inferring PASS.
