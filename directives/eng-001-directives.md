# DIRECTIVE — Eng-001
**From:** CTO-001  
**Priority:** P1 — prepare now, execute when repo access granted  
**Issued:** Cycle 1

---

## ENG-001 | Prepare Phi Scoring Logic for Audit [BLOCKING]
As soon as repo access is granted, locate the **Phi weighted harmonic deployment index** calculation (D1–D9 composite). Extract it into a standalone reviewable unit. CTO-001 will audit before any scoring changes ship.

**Law IV mandate:** Phi bugs that inflate scores are a hard pre-ship blocker. No exceptions.

## ENG-002 | Document the Architecture [NORMAL — pending repo]
Once repo accessible, produce a 1-page architecture overview covering:
- Frontend stack
- Backend/scoring engine
- Trace storage (JSON-T signing)
- Leaderboard data store
- Hidden eval rotation mechanism
- Deployment pipeline

## ENG-003 | Audit TODOs and FIXMEs in Scoring Code [NORMAL — pending repo]
Search codebase for `TODO`, `FIXME`, `HACK`, commented-out scoring logic. Report anything touching D1–D9 or Phi to CTO-001 immediately. Any score-inflating bug must be fixed before next deploy.
