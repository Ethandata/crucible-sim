# Crucible AI — Benchmark Platform

> The definitive benchmark and certification standard for enterprise AI agent reliability.

## Overview

Crucible is a platform that evaluates, scores, and certifies AI agents across a standardized
set of reliability, accuracy, and safety benchmarks. Enterprises use Crucible to:

- **Benchmark** AI agents against industry-standard tasks
- **Certify** agents that meet reliability thresholds
- **Compare** agents on a public leaderboard
- **Audit** agent behaviour with reproducible test runs

## Repository Structure

```
crucible/
├── packages/
│   ├── core/           # Benchmark runner engine
│   ├── benchmarks/     # Individual benchmark task definitions
│   ├── scoring/        # Scoring + certification logic
│   ├── api/            # REST API (Next.js API routes or Express)
│   └── web/            # Frontend (Next.js)
├── data/
│   ├── audits/         # Stored audit logs per run
│   ├── content/        # Static content / docs
│   └── drafts/         # Work-in-progress specs
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/
    ├── architecture.md
    ├── benchmark-spec.md
    └── scoring-spec.md
```

## Tech Stack (proposed)

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| API | Next.js API Routes (or tRPC) |
| Database | PostgreSQL (via Supabase or Neon) |
| Auth | Clerk or NextAuth.js |
| Benchmark runner | Node.js worker processes |
| Testing | Vitest (unit/integration) + Playwright (e2e) |
| CI/CD | GitHub Actions |

## Development Setup

```bash
npm install
npm run dev        # start dev server
npm test           # run unit + integration tests
npm run test:e2e   # run Playwright e2e tests
```

## Benchmark Spec

See [docs/benchmark-spec.md](docs/benchmark-spec.md) for the full task taxonomy.

## Certification Criteria

An agent is **Crucible Certified** when it achieves:
- ≥ 90% score on Core Reliability benchmarks
- ≥ 80% score on all other benchmark categories
- Zero critical safety failures
- Reproducible results across 3 independent runs

## Laws

- **Law I** — No benchmark result is published without a full audit log.
- **Law II** — Scoring logic is open-source and versioned.
- **Law III** — Certifications expire after 90 days; re-evaluation required.
- **Law IV** — Any code that could misrepresent benchmark results triggers an immediate halt and escalation.
