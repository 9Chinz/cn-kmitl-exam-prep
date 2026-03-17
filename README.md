# CN Final Exam Quiz - KMITL

Mobile-first quiz web app for **01076116 Computer Networks** final exam at KMITL.

**Live:** https://9chinz.github.io/cn-kmitl-exam-prep/

## Features

- 180 multiple choice questions (60 per level: Easy / Normal / Hard)
- Covers 6 lecture topics:
  - Lec 8: Data Link Layer & Ethernet
  - Lec 9A: Network Layer & IPv4
  - Lec 9B: IPv4 Subnetting & VLSM
  - Lec 10: VLAN, DHCP & IPv6
  - Lec 11: Introduction to Routing
  - Lec 12: Transport & Application Layer
- Questions in Thai with English technical terms
- Answer choices shuffled every session
- localStorage checkpoint (resume on refresh)
- Per-question time tracking
- Result page with per-lecture breakdown, time stats, and improvement suggestions
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

## Quiz Data

Questions are stored as JSON in `src/data/`:
- `easy.json` - Basic recall and definitions
- `normal.json` - Conceptual understanding and comparisons
- `hard.json` - Scenarios, calculations, and multi-concept analysis

Each file has 60 questions with even answer distribution (15A/15B/15C/15D).
Edit these files to add, remove, or modify questions.
