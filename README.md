# KMITL Exam Prep

Mobile-first quiz web app for KMITL exam preparation. Supports multiple subjects with independent question banks, stats, and progress tracking.

**Live:** https://9chinz.github.io/kmitl-exam-prep/

## Subjects

### Computer Networks (01076116)
- 180 multiple choice questions (60 per level: Easy / Normal / Hard)
- Covers 6 lecture topics:
  - Lec 8: Data Link Layer & Ethernet
  - Lec 9A: Network Layer & IPv4
  - Lec 9B: IPv4 Subnetting & VLSM
  - Lec 10: VLAN, DHCP & IPv6
  - Lec 11: Introduction to Routing
  - Lec 12: Transport & Application Layer

### OOP (Coming Soon)

## Features

- Multi-subject support with subject selection menu
- Questions in Thai with English technical terms
- Answer choices shuffled every session
- localStorage checkpoint per subject (resume on refresh)
- Per-question time tracking
- Result page with per-lecture breakdown, time stats, and improvement suggestions
- Per-subject quiz history and stats
- Auto-deploy to GitHub Pages via CI

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- Zustand (state management)

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Adding a New Subject

1. Create question JSON files in `src/data/<subject-id>/` (e.g. `easy.json`, `normal.json`, `hard.json`)
2. Create a subject config in `src/config/subjects/<subject-id>.ts` (see `cn.ts` for reference)
3. Register it in `src/config/subjects/index.ts`
4. Add the subject ID to the `SubjectId` type in `src/types/subject.ts`

## Quiz Data

Questions are stored as JSON in `src/data/<subject-id>/`:
- `easy.json` - Basic recall and definitions
- `normal.json` - Conceptual understanding and comparisons
- `hard.json` - Scenarios, calculations, and multi-concept analysis

Each file has 60 questions with even answer distribution (15A/15B/15C/15D).
