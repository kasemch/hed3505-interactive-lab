# HED3505 Platform Decision Record — PDR-01

**Status:** APPROVED BASELINE  
**Decision:** GitHub → WordPress  
**Effective phase:** HED3505 WordPress Final Learning Studio prototype and subsequent release work

## Approved architecture

### GitHub — Source of Truth
GitHub is the controlled source for:
- learning-content source
- activity specifications
- assessment specifications
- evidence/QA records
- WordPress integration artifacts
- version history and change review

### WordPress — Primary Student Learning Experience
WordPress is the primary presentation and learning-experience layer for:
- student learning pages
- self-study modules
- active-learning instructions
- evidence reasoning activities
- exam readiness
- future approved student-facing interactions

Development and acceptance occur on WordPress staging before any production publication.

### GitHub Pages — Legacy / Fallback Only
The existing GitHub Pages implementation is preserved as a read-only fallback during migration.
Do not delete, redirect, retire, or materially modify it until WordPress passes all release gates and human acceptance.

### Vercel — Out of Scope
Vercel is not part of the approved HED3505 delivery architecture.
Do not introduce a Vercel deployment, preview dependency, routing layer, or hosting requirement for this project unless a future explicit platform decision supersedes this record.

## Release gates
Before WordPress becomes the production student experience:
1. Content parity
2. Mobile/responsive QA
3. Accessibility QA
4. Link integrity
5. Student journey
6. Teacher journey / Teacher-Key isolation
7. Privacy/security
8. Human acceptance

## Current controls
- WordPress staging may be used for controlled visual/functional acceptance.
- Production WordPress remains HOLD.
- GitHub PR merge remains HOLD.
- GitHub Pages retirement/redirect remains HOLD.
- Teacher-only materials must not be exposed in student-facing payloads.

## Architecture invariant
**GitHub → WordPress**
No Vercel intermediary is required or approved.
