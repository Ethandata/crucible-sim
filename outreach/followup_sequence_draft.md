# Crucible AI — Follow-Up Outreach Sequence (Messages 2 & 3)
*Status: DRAFT — Awaiting founder approval. Do NOT send until approved.*
*Authored: Sales-001 | Date: 2026-04-02*

---

## SEQUENCE OVERVIEW

| Message | Day | Subject Line | CTA |
|---------|-----|-------------|-----|
| Message 1 (approved separately) | Day 0 | [Personalized] | Book 20-min call |
| **Message 2** | **Day 4** | **"How [Company] agents fail — and how to prove they don't"** | **Read benchmark explainer → book call** |
| **Message 3** | **Day 8** | **"Sample certification report for [Company]"** | **Final ask — book call or request report** |

---

## MESSAGE 2 — DAY 4
**Purpose:** Value-add touch. Shift from "sell" to "teach." Deliver a useful insight about how their specific agent type fails, then link to Crucible's benchmark explainer.

---

### SUBJECT LINE OPTIONS (A/B test)
- A: `How [LangGraph / CrewAI / voice] agents fail under budget pressure`
- B: `The failure mode your agents hit at scale (with data)`
- C: `Re: [Company] — one failure pattern worth knowing about`

---

### BODY

```
Hi [First Name],

Wanted to share something concrete in case the timing wasn't right last week.

We published a breakdown of the most common failure patterns we see in production agents — specifically the ones that look fine in demos but break under real economic pressure:

→ crucible-ai.net/#ratings  [or direct link to blog/explainer if available]

The three that hit [Company]-type deployments most often:

1. **Tool Spend Spiral (D4)** — agents keep buying context and API calls while the task degrades. Burn rate rises faster than output quality.

2. **Silent Ambiguity (D8)** — agent guesses through unclear instructions instead of escalating. Compounds into production debt or customer complaints.

3. **CHILD_ROGUE** — a delegated sub-agent burns budget autonomously when the parent is under pressure. Especially relevant for [multi-agent / crew / swarm] architectures.

Crucible runs a structured trial against all of these and outputs a signed D1–D9 report + Phi score that your enterprise customers can actually read.

If any of this resonates, 20 minutes on a call would be enough to show you what a report looks like for a real agent.

[CALENDLY LINK — PENDING FOUNDER CONFIRMATION]

Either way, happy to send a sample report if that's more useful.

— [Founder Name]
Crucible AI | crucible-ai.net
```

---

### PERSONALIZATION SLOTS
- `[Company]-type deployments` → replace with specific context:
  - LangChain: "LangGraph multi-agent deployments"
  - CrewAI: "crew-based deployments with delegation"
  - E2B: "code-executing agent deployments"
  - Inngest: "durable workflow + agent-kit deployments"
  - Vapi: "voice agent deployments in regulated industries"
  - Sierra: "conversational enterprise agent deployments"
  - Swarms: "multi-agent swarm deployments"
  - Stack AI: "high-stakes enterprise workflow deployments"
  - Botpress: "autonomous agent deployments upgrading from chatbots"
  - Relevance AI: "no-code AI workforce deployments"

---

## MESSAGE 3 — DAY 8
**Purpose:** Final ask in this sequence. Make it easy to say yes with a concrete artifact offer (sample report). Low-pressure close. Leave door open.

---

### SUBJECT LINE OPTIONS (A/B test)
- A: `Sample Crucible report for [Company] — worth a look?`
- B: `Closing the loop — + a sample certification report`
- C: `Last note: here's what a Crucible report looks like`

---

### BODY

```
Hi [First Name],

Last note from me on this — don't want to clog your inbox.

I put together a sample Crucible certification report that's representative of what a [LangGraph / CrewAI / voice agent] run looks like. It shows:

• D1–D9 durability scores with breakdown
• Phi composite deployment index
• Signed JSON-T trace (tamper-evident)
• The 2–3 failure events that mattered most
• A plain-language deployment recommendation

If you want to see it, just reply "send it" and I'll drop it over. No call required.

If timing isn't right, no worries — you can always run the benchmark yourself at github.com/Ethandata/crucible-sim and we'll be here when your enterprise customers start asking for reliability proof.

[CALENDLY LINK — PENDING FOUNDER CONFIRMATION]

— [Founder Name]
Crucible AI | crucible-ai.net
The pre-deployment stress test for autonomous agents.
```

---

### PERSONALIZATION SLOTS
- `[LangGraph / CrewAI / voice agent]` → match to prospect's stack
- Subject line C is recommended for high-ICP targets who haven't replied — it's curiosity-driven without being pushy

---

## SEQUENCE LOGIC & TIMING

```
Day 0:  Message 1 sent (pending approval)
Day 4:  Message 2 sent IF no reply to Message 1
Day 8:  Message 3 sent IF no reply to Message 2
Day 9+: Prospect moves to "Nurture" status in pipeline
        Re-engage in 30 days OR when trigger event occurs
        (e.g., they announce new enterprise product, raise funding)
```

### Trigger Events for Re-Engagement (add to pipeline notes)
- Company announces Series A/B funding
- Job posting for "Head of AI" or "VP Engineering"
- New enterprise product launch
- GitHub activity spike on agent repos
- Speaking at AI conference (warm follow-up hook)

---

## APPROVAL REQUIREMENTS

Before this sequence can run:

- [ ] **Founder approval on Message 1** (queued as action_id: 8d3a9452-f6ad-425b-a3f8-0309cb8c77af)
- [ ] **Founder approval on Message 2** (this document)
- [ ] **Founder approval on Message 3** (this document)
- [ ] **Calendly link confirmed** — blocks CTA in all three messages
- [ ] **Hunter.io approved** (request_id: 461f08e9-bc46-4be8-a6f7-407d728d0cd9) — for verified contact emails

*Law V: No message sent to any human until founder explicitly approves each template.*

---

*Sales-001 | Crucible AI | 2026-04-02*
