# HED3505 Controlled Preview — release gate

Status: PREPARED, NOT DEPLOYED. The build artifact is not a live website. Never invent a preview URL.

## Isolation
- Source: `kasemch/hed3505-interactive-lab`, branch `hed3505-final-class-neon-staging-01`, root directory `neon-final-class`.
- Target: a **new, separate Vercel project** for this module, not any existing AWOS/BMO/LMS project and not the published GitHub Pages site.
- Framework: Vite. Build: `npm run build`. Output: `dist`.
- `vercel.json` disables automatic Git deployments; an authorized operator must explicitly deploy a Preview build after protection is verified. Never promote to Production.
- Enable Vercel Authentication for all Preview deployments before sharing any URL. Do not create a public bypass link. Confirm a signed-out browser receives a protection challenge, not the app. If the plan or project cannot enforce protection, STOP.
- Keep the default production domain and any custom domains unused. `X-Robots-Tag: noindex` is defense in depth, not access control.

## Auth origin gate
- Current staging Neon trusted domain: `https://kasemch.github.io` only. A new Vercel hostname is **not** authorized yet.
- After the exact immutable preview URL and protection have been verified, add only its exact HTTPS origin to the **staging** Neon Auth trusted domains. Do not wildcard Vercel and do not change production Auth.
- Test browser CORS, sign-up, email verification code, unverified sign-in denial, OTP sign-in, logout and callback with controlled mailboxes. The Console/API verification flags differ; only actual behavior closes this gate.
- No OTP/password or JWT in GitHub issues, logs, screenshots, chat or public files. Do not use real student accounts.

## Acceptance
1. CI build, SDK contract, static HTTP, mobile viewport smoke (375, 430, 768, 1280 px); screenshots contain only an unauthenticated synthetic page.
2. Vercel protection verified in a signed-out browser; exact preview URL recorded.
3. Neon staging origin allowlisted, browser auth tested with two controlled mailboxes; do not infer verification from UI only.
4. Signed JWT RLS test: invited A/B each see only own work and grades; uninvited C sees no session; instructor only after privileged allowlist. Simulated-claims SQL tests are supporting evidence, not a replacement.
5. Seven-person synthetic rehearsal; source-matched case documents, instructor key private, rubric, mobile and privacy sign-off.
6. Separate explicit human release authorization before real-student data, public access, merge or production deployment.

## Current limitation
The available Vercel connector can inspect existing projects and deploy the **current local project**, but does not expose a targeted create-project/import-from-GitHub action for this repository and subdirectory. Do not invoke a generic deploy that could target an unrelated project. The operator must establish the isolated Vercel project/protection via a supported deployment workflow; only then can the exact URL and Neon trusted origin be registered.
