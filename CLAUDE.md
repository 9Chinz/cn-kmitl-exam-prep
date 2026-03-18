# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (all interfaces)
pnpm build      # tsc -b && vite build
pnpm lint       # ESLint check
pnpm preview    # Preview production build
```

No test framework is configured.

## Architecture

**Single-page app** with manual page routing via Zustand state (`"start" | "quiz" | "result" | "stats"`). No URL-based routing.

### State Management (Zustand, `src/store/`)

- **`quizStore.ts`** — core quiz lifecycle (startQuiz → answerQuestion → nextQuestion → resultPage), checkpoint/resume via localStorage per level key `cn-quiz-checkpoint-{level}`, saves completed results to historyStore
- **`historyStore.ts`** — persists completed quiz history to localStorage (`cn-quiz-history`)
- **`themeStore.ts`** — light/dark toggle, persists to localStorage, toggles `dark` class on document root

### Question Data (`src/data/`)

Six static JSON files imported at build time: `easy.json`, `normal.json`, `hard.json`, `guideline-easy.json`, `guideline-normal.json`, `guideline-hard.json`. Each level has 60 questions; questions get globally offset IDs to keep them unique (0–59, 100–159, 200–259, etc.). The `random` level builds 20 questions from each difficulty tier at runtime.

### Level Types (`src/types/quiz.ts`, `src/constants/levels.ts`)

8 quiz configurations: `easy | normal | hard | random` and `guideline-easy | guideline-normal | guideline-hard | guideline-random`. `DirectLevel` excludes the random variants; `questionsMap` is keyed by `DirectLevel` only — random levels call `buildQuestions()` instead of indexing into the map.

### Component Organization

Atomic design under `src/components/`: atoms → molecules → organisms. Page-level components live in `src/features/{start,quiz,result,stats}/`.

### Tooling Notes

- Path alias `@` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)
- Tailwind CSS v4 via Vite plugin; custom theme tokens defined with `@theme` directives in `src/index.css`
- Base path `/cn-kmitl-exam-prep/` set in `vite.config.ts` for GitHub Pages deployment
- CI: GitHub Actions on push to `main` — lint → build → deploy to GitHub Pages
