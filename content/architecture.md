# Crucible Platform — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     crucible-ai.net                     │
│                                                         │
│  ┌─────────────┐   ┌──────────────┐  ┌──────────────┐  │
│  │   Web UI    │   │   REST API   │  │  Benchmark   │  │
│  │  (Next.js)  │──▶│  (API routes)│──▶│   Runner     │  │
│  └─────────────┘   └──────────────┘  └──────────────┘  │
│                           │                  │          │
│                    ┌──────▼──────┐   ┌───────▼───────┐  │
│                    │  PostgreSQL  │   │  Task Queue   │  │
│                    │  (Supabase)  │   │  (Bull/Redis) │  │
│                    └─────────────┘   └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Benchmark Runner (`packages/core`)
- Accepts a benchmark suite + agent endpoint
- Dispatches tasks to agent, records responses
- Produces a raw results JSON with full audit trail
- Deterministic: same seed → same task ordering

### 2. Benchmark Definitions (`packages/benchmarks`)
- Each benchmark = a TypeScript module exporting `BenchmarkSuite`
- Categories: Reasoning, Tool Use, Instruction Following, Safety, Reliability
- Tasks are versioned; old versions are never modified

### 3. Scoring Engine (`packages/scoring`)
- Takes raw results → produces normalised scores per category
- Applies certification thresholds
- Emits `ScoringReport` — immutable, hash-signed

### 4. API (`packages/api`)
- `POST /api/runs` — start a new benchmark run
- `GET  /api/runs/:id` — poll run status / results
- `GET  /api/leaderboard` — public leaderboard
- `POST /api/certify` — trigger certification check
- `GET  /api/audits/:id` — full audit log for a run

### 5. Web Frontend (`packages/web`)
- Dashboard: active runs, recent results
- Leaderboard: ranked agents
- Certification badge page (public, shareable)
- Docs: benchmark specs, scoring methodology

## Data Models

### Run
```typescript
interface Run {
  id: string;
  agentId: string;
  suiteVersion: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  scores?: CategoryScores;
  certified: boolean;
  auditLogId: string;
}
```

### AuditLog
```typescript
interface AuditLog {
  id: string;
  runId: string;
  tasks: TaskResult[];
  hash: string;          // SHA-256 of full log — integrity check
  createdAt: Date;
}
```

### TaskResult
```typescript
interface TaskResult {
  taskId: string;
  taskVersion: string;
  prompt: string;
  response: string;
  expectedPattern?: string;
  score: number;          // 0–1
  latencyMs: number;
  timestamp: Date;
}
```

## Security & Integrity

- All scoring runs are append-only; no mutation after completion
- AuditLog hash prevents tampering (Law IV enforcement)
- API keys scoped to read-only or write per agent
- Certification badges fetched live (no static caching of pass/fail)

## CI/CD Pipeline

```
push → GitHub Actions
  ├── lint + typecheck
  ├── unit tests (Vitest)
  ├── integration tests
  └── e2e tests (Playwright) [on PR only]
      └── deploy preview (Vercel)
```
