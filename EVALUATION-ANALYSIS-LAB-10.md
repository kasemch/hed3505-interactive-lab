# HED3505-EVALUATION-ANALYSIS-LAB-10
## Student Progress Tracker + Instructor Dashboard

Date: 21 September 2026
Status: IMPLEMENTED / AUTH REDIRECT HUMAN CHECK PENDING

## Architecture
GitHub Pages student LAB
→ browser-local learning state
→ constrained progress RPC
→ isolated hed3505_progress schema in HEPE Supabase Sandbox
→ authenticated instructor dashboard

## Stored centrally
- student ID
- display name
- first check-in
- last active
- LAB 1–5 status
- completed count
- completion timestamp
- certificate ID

## Not stored centrally
- individual answers
- reasoning text
- Evidence Portfolio content
- passwords
- grades

## Security
- raw progress tables are isolated in custom schema
- direct anon/authenticated table access revoked
- student writes go through constrained RPC
- browser receives a random local session token; database stores only SHA-256 hash
- a student ID already claimed by another browser token cannot be overwritten
- instructor dashboard RPC requires authenticated user and explicit instructor allowlist
- anonymous dashboard access revoked

## Instructor Dashboard
Route:
evaluation-analysis-lab/instructor-dashboard.html

Metrics:
- checked in
- working
- completed 5/5
- active in past 24 hours

## Remaining human check
Google OAuth redirect must be accepted for the GitHub Pages instructor-dashboard URL.
If the existing HEPE Supabase Auth redirect allowlist does not include this route, add it before instructor use.
