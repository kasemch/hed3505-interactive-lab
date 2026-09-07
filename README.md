# hed3505-interactive-lab

Interactive Learning System for HED3505 Evaluation Design Lab — Frontend Prototype.

This is a **Phase 3A build gate**: Application Shell, Case Launch, and Modules 1–2
(Evidence Classification Lab, CIPP–RE-AIM Framework Simulator) only. Modules 3–8,
backend, auth, database, external APIs, AI grading, and production deployment are
out of scope for this build.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (v4, via `@tailwindcss/vite`)
- Mock data only; session state persisted to `sessionStorage`

## Project structure

```
src/
  data/        # Domain data: case scenario, module 1/2 content, steps, session storage helpers
  modules/     # Case Launch + Module 1 + Module 2 screens
  components/  # Shared shell components (Header, Navigation, Footer, Badge)
  context/     # SessionContext (mode + progress + module state)
  types/       # Shared TypeScript domain interfaces
```

## Getting started

```bash
npm install
npm run dev      # start local dev server
npm run build     # type-check + production build
npm run lint      # oxlint
```

## Modes

Use the Student / Instructor toggle in the header to switch modes. Instructor mode
reveals expected classifications, reasoning explanations, common misconceptions, and
debrief prompts — none of which are visible to students. The mode and module progress
are stored in `sessionStorage` only; there is no authentication or backend.
