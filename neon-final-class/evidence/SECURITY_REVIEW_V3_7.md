# HED3505 v3.7 — Staging RLS policy audit (2026-09-28)

Scope: read-only Neon staging branch br-sparkling-wildflower-b3bc740v. No schema/data writes, merge, deploy or production changes.

## Verified CI
Commit a2712988: Static Learning Lab run 36377804964, Neon Staging Build 36377804967, Preservation QA 36377804988 all completed/success. Preservation run passed original-file equality, restricted-content audit, excluded-key publication candidate, mobile QA, and QA-only artifact upload. Combined QA artifact 10951662849 retains the original lecturer answer key and is **not safe to publish as-is**.

## Live catalog findings
All nine hed3505_final_class ordinary tables have RLS enabled; none has FORCE RLS. Instructors has zero direct policies (ordinary RLS-bound access defaults to deny), other tables have one or two. These facts do not prove effective grants, owner/bypass behavior or signed-token isolation.

Participant INSERT policy checks auth_subject=current_subject(), identity_verified=false, invitation and room. It does not explicitly require an email-verified claim. Response/feedback INSERT policies check participant ownership and phase; assessment INSERT checks instructor allowlist and author subject. Inspected SECURITY DEFINER helpers current_subject, is_instructor, is_invited, session_has_room and has_initial use explicit search paths; current_subject uses auth.user_id(). No signed-JWT behavioral test was performed.

Neon Auth still reports require_email_verification=true alongside verify_email_on_sign_up=false and verify_email_on_sign_in=false. Verify actual unverified signed-session rejection at Data API; UI checks alone are insufficient.

## Outstanding gates
Controlled OTP/session tests for unverified, verified invited and uninvited identities; two-user signed JWT cross-account read/write denial and instructor allowlist; two-client last-seat concurrency; seven-person synthetic end-to-end; physical-device/privacy check; lecturer-only content classification; separate release approval. No raw tokens, passwords or OTPs in evidence.

Decision: CI/PRESERVATION PASS for a2712988; signed-session AUTH/RLS PENDING; E2E PENDING; publication HOLD; deploy/merge/production HOLD.
