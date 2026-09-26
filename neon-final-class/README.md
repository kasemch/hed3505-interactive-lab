# HED3505 Final Class — Neon staging (not production)

Neon project: `soft-lab-14586372`; branch: `hed3505-final-class-staging`; database: `neondb`; schema: `hed3505_final_class`.

This directory is an isolated Vite prototype. It is NOT linked into the published GitHub Pages branch. Do not publish or invite real students until identity verification, instructor allowlisting, security review, rubric verification, and real-device acceptance have passed.

## Setup
```sh
npm install
npm run build
```
The public HTTPS database URL is in `src/main.js`. It is not a Postgres connection string. Never commit DATABASE_URL, database password, service-role token, API key, or SMTP credentials.

## Auth gate
Managed Better Auth is enabled only on staging, trusted origin `https://kasemch.github.io`. Neon Auth currently has email verification OFF by default. Before any real student data, enable verification at sign-up, configure delivery, and verify sign-in end to end. Instructor permissions require the actual verified auth subject in `hed3505_final_class.instructors`, inserted through a privileged administrative path. No client-side email allowlist.

## Data gate
Schema has eight RLS-enabled tables, no anonymous grants, append-only responses/events. A synthetic seven-participant transaction was rolled back; no real records were imported. The Final Class scenario and rubric v5.1 must be matched to the approved source before publication. The Supabase LAB 1–5 tracker is unaffected.

## Acceptance tests remaining
1. Build and browser smoke test.
2. OTP delivery + verified identity.
3. Student self-access vs cross-user denial using two real test JWTs.
4. Instructor allowlist denial/allow and dashboard.
5. Round 1 vs Round 2 reveal and append-only behavior.
6. Synthetic end-to-end scoring with verified rubric; no real grades.
