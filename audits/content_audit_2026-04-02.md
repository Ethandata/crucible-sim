# Crucible AI — Content Audit
**Date:** 2026-04-02  
**Audited by:** CMO-001  
**Source:** https://www.crucible-ai.net/

---

## Website Structure
- **Homepage** — Full product overview, live failure trace demo, D1-D9 scoring, framework guides, leaderboard, enterprise CTA
- **Live Trial** — Interactive benchmark runner (nav item)
- **D1-D9** — Durability dimension detail pages (nav item)
- **Replay** — Trace replay tool (nav item)
- **Frameworks** — LangGraph, OpenAI Responses, OpenClaw, CrewAI guides (nav item)
- **Leaderboard** — Public runs leaderboard ("No runs yet — be the first to submit")
- **Enterprise** — Enterprise access request page (nav item)
- **Blog** — EXISTS in nav but NO POSTS published yet

---

## Messaging & Positioning (as found)
- **Tagline:** "The pre-deployment stress test for autonomous agents"
- **Core promise:** Measure survival, steerability, manipulation resistance, and cost discipline before giving an agent budget, tools, or autonomy
- **Scoring system:** D1–D9 durability dimensions + Phi (weighted harmonic deployment index)
- **Trace standard:** JSON-T (signed traces)
- **Key differentiator:** Hidden eval sets prevent overfitting; replay reports make failures legible; signed reports for deployment gating

## Key Product Concepts
| Concept | Description |
|---|---|
| D1 Survival | Agent solvency under sustained pressure |
| D4 Cost Discipline | Avoids retrieval/token/tool-spend spirals |
| D5 Control Integrity | Stays steerable and policy-compliant under pressure |
| D8 User Trust | Escalates before failure instead of guessing |
| D9 Manipulation Resistance | Actions don't diverge from stated intent; no dark patterns |
| Phi | Weighted harmonic deployment readiness index |
| JSON-T | Signed trace format for certified reports |

## Failure Mode Taxonomy (on homepage)
- **Tool Spend Spiral** (D4 collapse)
- **Silent Ambiguity** (D8 failure)
- **Reward Hacking** (D9 disqualification)

## Framework Integrations Documented
- LangGraph
- OpenAI Responses
- OpenClaw
- CrewAI

---

## Content Gaps Identified

### Critical Gaps
1. **Blog — zero posts.** Nav item exists, no content. This is the highest-priority gap.
2. **No "Why we built this" narrative.** Founder story / origin absent from site.
3. **No case studies or customer proof.** Leaderboard is empty; no social proof anywhere.
4. **No benchmark methodology post.** D1-D9 scoring explained briefly on homepage but no deep technical writeup.

### Secondary Gaps
5. **No comparison content.** No "Crucible vs. DIY evals" or "Crucible vs. LangSmith" positioning.
6. **No content around JSON-T standard.** It's named but not explained in depth anywhere public.
7. **No failure mode library / incident content.** The failure taxonomy (D4/D8/D9) is powerful — no blog posts expanding on these.
8. **Social media presence unconfirmed.** LinkedIn page status pending founder verification.
9. **No email capture / newsletter.** No way to build an audience list from site traffic.

---

## Content Priority Queue (Next 4 Weeks)

| Priority | Title | Format | Goal |
|---|---|---|---|
| 1 | Why We Built Crucible on Autonomous Agents | Blog post | Brand story, top of funnel |
| 2 | The D1-D9 Framework: How We Score Agent Durability | Blog post | Technical credibility, SEO |
| 3 | The Tool Spend Spiral: How Good Agents Burn Budgets | Blog post | Failure mode deep dive, shareable |
| 4 | What JSON-T Is and Why Signed Traces Matter | Blog post | Technical standard positioning |
| 5 | Crucible vs. DIY Evals: What You're Missing | Blog post | Competitive positioning |

---

## Competitor Landscape (preliminary)
- **LangSmith** — observability/tracing, not deployment gating
- **Braintrust** — eval tooling, developer-focused, not enterprise certification
- **Inspect (UK AISI)** — gov-adjacent, not commercial SaaS
- **Custom internal evals** — most enterprise teams' current reality
- **Crucible's white space:** Pre-deployment certification with signed reports, hidden evals, economic stress testing — no direct competitor owns this positioning

---

## Notes
- Homepage is well-built and technically credible. Tone matches Crucible brand guidelines.
- Primary content need is blog — every nav click to Blog returns empty.
- Leaderboard being empty is a social proof gap; seeding runs (even internal/demo) should be explored.
