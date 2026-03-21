# KMITL Exam Prep

Mobile-first quiz web app for KMITL exam preparation. Supports multiple subjects with independent question banks, stats, and progress tracking.

**Live:** https://9chinz.github.io/kmitl-exam-prep/

## Subjects

### Computer Networks (01076116)
- 180 multiple choice questions (60 per level: Easy / Normal / Hard)
- Guideline exam questions (3 levels)
- Covers 6 lecture topics:
  - Lec 8: Data Link Layer & Ethernet
  - Lec 9A: Network Layer & IPv4
  - Lec 9B: IPv4 Subnetting & VLSM
  - Lec 10: VLAN, DHCP & IPv6
  - Lec 11: Introduction to Routing
  - Lec 12: Transport & Application Layer

### Object-Oriented Programming (01076113)
- 360 questions across 6 levels (Easy / Normal / Hard + Practice Easy / Normal / Hard)
- Supports choice and fill-in-the-blank question types
- Covers 7 chapters (Ch 2–8): Variables, Loops, Selection, Strings, Methods, Arrays, Class & Object

### Cloud Architecture (AWS Academy)
- 120 questions across 12 modules (10 questions each)
- Module-based quiz selection (no difficulty levels)
- Supports multiple-choice questions (select multiple correct answers)
- Questions and answers in English, explanations in Thai
- Modules:
  - Module 2: Introducing Cloud Architecting
  - Module 3: Securing Access
  - Module 4: Adding Storage Layer with Amazon S3
  - Module 5: Adding a Computer Layer using Amazon EC2
  - Module 6: Adding a Database Layer
  - Module 7: Creating a Networking Environment
  - Module 8: Connecting Networks
  - Module 10: Implementing Monitoring, Elasticity
  - Module 11: Automating Your Architecture
  - Module 12: Caching Content
  - Module 13: Building Decoupled Architectures
  - Module 14: Building Serverless Architecture

## Features

- Multi-subject support with subject selection menu
- Three question types: single choice, fill-in-the-blank, and multiple-choice (checkbox)
- Answer choices shuffled every session (supports 4–7 choices per question)
- localStorage checkpoint per subject (resume on refresh)
- Per-question time tracking
- Result page with per-lecture/module breakdown, time stats, and improvement suggestions
- Per-subject quiz history and stats
- Scrollable level/module selector for subjects with many options
- Auto-deploy to GitHub Pages via CI

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- Zustand (state management)
- Radix UI (Switch, Checkbox)

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

1. Create question JSON files in `src/data/<subject-id>/`
2. Create a subject config in `src/config/subjects/<subject-id>.ts` (see `cn.ts` or `cloud-architecture.ts` for reference)
3. Register it in `src/config/subjects/index.ts`
4. Add the subject ID to the `SubjectId` type in `src/types/subject.ts`
5. Add level labels and colors to `src/constants/levels.ts`

## Question Types

| Type | Description | Answer Format |
|------|-------------|---------------|
| `choice` | Single correct answer (A/B/C/D) | `"C"` |
| `fill-blank` | Fill in code blanks | `'{"A":"String","B":"int"}'` |
| `multiple-choice` | Multiple correct answers (checkbox) | `"B,D"` (sorted, comma-joined) |

## Quiz Data

Questions are stored as JSON in `src/data/<subject-id>/`. Structure varies by subject:

- **CN/OOP**: Level-based files (`easy.json`, `normal.json`, `hard.json`, etc.)
- **Cloud Architecture**: Module-based files (`module-2.json` through `module-14.json`)
