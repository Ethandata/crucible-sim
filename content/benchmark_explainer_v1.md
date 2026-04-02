# What is a Crucible Benchmark? How Are AI Agents Scored?
**Asset type:** One-page content explainer (web page or PDF)  
**Status:** QUEUED FOR FOUNDER REVIEW  
**Intended use:** Sales-001 follow-up sequence (Message 2 link), website resource  
**Date drafted:** 2026-04-02

---

## HEADLINE:
**What is a Crucible Benchmark?**  
*How enterprise AI agents are scored for production reliability.*

---

## THE PROBLEM IT SOLVES

Most AI agent evaluations answer the wrong question.

They test: *Can this agent complete the task in a clean demo environment?*

Crucible tests: *Does this agent survive and stay trustworthy when things go wrong?*

Production environments are not clean. Budgets run out. Instructions conflict. Delegated sub-agents go rogue. Users try to manipulate outputs. Ambiguous inputs arrive without warning.

A Crucible benchmark is designed to surface exactly these failure modes — before they reach your customers.

---

## HOW A BENCHMARK WORKS

A Crucible benchmark runs your agent through a structured trial environment with:

- **Scarcity pressure** — the agent operates under a finite credit budget that depletes with every tool call, retrieval, and inference step
- **Hidden evaluation sets** — agents are tested against scenario suites they haven't been trained on, preventing overfitting
- **Adversarial inputs** — manipulation attempts, conflicting instructions, and reward-hacking opportunities are introduced mid-run
- **Delegation chains** — multi-agent scenarios test whether child agents stay aligned under budget pressure
- **Ambiguity checkpoints** — the agent must decide when to escalate vs. guess, with trust consequences for guessing wrong

Every action is recorded in a **JSON-T trace** — a signed, tamper-evident log that proves exactly what the agent did, when, and why.

---

## THE SCORING SYSTEM: D1–D9 + PHI

Crucible scores agents across **nine durability dimensions**:

| Dimension | What It Measures |
|-----------|-----------------|
| **D1 — Survival** | How long the agent stays solvent under sustained pressure |
| **D2 — Efficiency** | Whether the agent completes tasks without unnecessary resource consumption |
| **D3 — Adaptability** | How well the agent adjusts strategy when initial approaches fail |
| **D4 — Cost Discipline** | Whether it avoids retrieval, token, and tool-spend spirals |
| **D5 — Control Integrity** | Whether it stays steerable and policy-compliant under pressure |
| **D6 — Delegation Quality** | Whether sub-agents are managed without budget blowouts |
| **D7 — Recovery** | Whether the agent can self-correct after partial failures |
| **D8 — User Trust** | Whether it escalates before failure instead of guessing through ambiguity |
| **D9 — Manipulation Resistance** | Whether actions diverge from stated intent or exploit dark patterns |

**Phi (Φ)** is the weighted harmonic deployment index — a single composite score that reflects overall production readiness. It's deliberately conservative: a single D9 failure (manipulation/misalignment) can significantly drag the Phi score even if other dimensions are strong.

---

## WHAT A CERTIFIED REPORT PROVES

After a benchmark run, Crucible generates a **Certified Report** containing:

- ✓ Trace integrity and cryptographic signature validation
- ✓ Full event log with timestamped failure signals
- ✓ D1–D9 dimension scores with explanatory annotations
- ✓ Phi deployment index
- ✓ Hidden eval suite alignment results
- ✓ D8 trust escalation record and D9 manipulation resistance evidence

This report is designed to be **shareable with stakeholders** — engineering leads, security teams, compliance officers, and executives — as a defensible, auditable record of agent behavior before deployment.

---

## WHO USES CRUCIBLE

**Engineering teams** use Crucible to catch failure modes before they reach production — the same way load testing catches infrastructure failures before launch.

**AI platform teams** use Crucible to establish an internal deployment gate: agents don't get production access until they pass the trial.

**Enterprise procurement and governance teams** use Crucible certified reports to answer: *"What evidence do we have that this agent behaves safely?"*

---

## HOW TO RUN A BENCHMARK

```bash
# Install and run locally (open source)
pip install crucible-sim
crucible run --agent your_agent.py --scenario solo-operator

# Generate a certified report
crucible replay --trace traces/your_agent_run.json --report
```

Full documentation and framework guides (LangGraph, OpenAI, CrewAI) available at **crucible-ai.net/frameworks**

---

## GET STARTED

**→ Run the open-source benchmark:** github.com/Ethandata/crucible-sim  
**→ Request enterprise access (private runs + signed reports):** crucible-ai.net/pro  
**→ Questions:** ethanklyce11@gmail.com

---

*Crucible — The reliability standard for enterprise AI agents.*  
*© 2026 Crucible*
