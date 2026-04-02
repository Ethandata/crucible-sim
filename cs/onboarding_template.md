# Crucible AI — Enterprise Customer Onboarding Checklist

**Version:** 1.0  
**Owner:** CS-001  
**Last Updated:** 2025-01-01  

---

## Overview
This checklist guides the CS team through onboarding a new enterprise customer from signed contract to first successful benchmark run. Target completion: within 5 business days of contract signature.

---

## Phase 1: Welcome & Intro Call (Day 1)

### Pre-Call Prep
- [ ] Confirm primary contact name, title, and email from Sales-001 handoff
- [ ] Review any deal notes from Sales-001 (use case, pain points, tier level)
- [ ] Prepare personalized agenda referencing their specific AI agent stack
- [ ] Confirm account is provisioned in Crucible platform

### Intro Call Agenda (30 min)
1. **Welcome & introductions** (5 min) — CS rep + customer team
2. **Their goals** (5 min) — What does success look like for them? What agents are they benchmarking?
3. **Crucible platform walkthrough** (10 min) — Dashboard orientation, how to submit an agent for evaluation
4. **D1–D9 scoring overview** (5 min) — Brief explanation of the reliability dimensions (see Section 3 below)
5. **Next steps & timeline** (5 min) — When will first benchmark run? Who is their technical lead?

### Post-Call Actions
- [ ] Send recap email with meeting notes and next steps (queue for review before sending)
- [ ] Schedule first benchmark run (target: within 48 hours of intro call)
- [ ] Create internal customer record with tier, contacts, use case, and key dates

---

## Phase 2: First Benchmark Run (Days 2–3)

### Pre-Run Checklist
- [ ] Customer has agent endpoint or submission ready
- [ ] Customer understands submission format (API call / SDK / upload)
- [ ] CS has confirmed test suite scope with customer (which D-dimensions to prioritize)

### Running the Benchmark
- [ ] Customer submits agent to Crucible evaluation pipeline
- [ ] CS monitors run for errors or timeout issues
- [ ] If errors occur → escalate to Eng-001 immediately with full error log
- [ ] Confirm run completes successfully and report is generated

---

## Phase 3: Reading the D1–D9 Report (Days 3–4)

### D1–D9 Reliability Dimensions — Quick Reference
| Dimension | What It Measures |
|-----------|-----------------|
| D1 | Task Completion Rate — Does the agent finish assigned tasks? |
| D2 | Instruction Adherence — Does it follow instructions precisely? |
| D3 | Error Recovery — How well does it handle unexpected failures? |
| D4 | Consistency — Does it produce reliable outputs across repeated runs? |
| D5 | Latency & Performance — Speed and resource efficiency |
| D6 | Safety & Guardrails — Does it avoid harmful or out-of-scope actions? |
| D7 | Tool Use Accuracy — Correct and appropriate use of external tools |
| D8 | Context Retention — Does it maintain context over long task horizons? |
| D9 | Adversarial Robustness — Performance under adversarial or edge-case inputs |

### Report Review Session (30 min call or async)
- [ ] Walk customer through their scores on each relevant dimension
- [ ] Highlight top 2–3 strengths (what their agent does well)
- [ ] Identify top 2–3 improvement areas with actionable recommendations
- [ ] Explain certification threshold (if applicable to their tier)
- [ ] Confirm customer understands how to share/export their report

---

## Phase 4: Success Confirmation & Ongoing Cadence (Day 5)

### Success Criteria (all must be met before closing onboarding)
- [ ] Customer has completed at least one full benchmark run
- [ ] Customer can read and interpret their D1–D9 report independently
- [ ] Customer knows how to submit follow-up runs after agent improvements
- [ ] Customer has CS contact info and escalation path documented
- [ ] NPS/satisfaction pulse sent (1-question: "How is your experience with Crucible so far?")

### Ongoing Cadence
- **Enterprise tier:** Monthly check-in call + immediate response to any tickets (SLA: 24hr)
- **Growth tier:** Quarterly check-in + 48hr ticket SLA
- **All tiers:** Proactive outreach after each major benchmark run

---

## Escalation Path
| Issue Type | Route To |
|------------|----------|
| Platform bug / error in benchmark run | Eng-001 |
| Complex technical question about scoring methodology | CTO-001 |
| Billing, contract, or expansion question | Sales-001 |
| Churn risk / customer dissatisfaction | Sales-001 (ALERT immediately) |
| General support question | CS-001 (handle directly) |

---

## Customer Health Signals to Watch
- No benchmark runs in 30+ days → proactive outreach
- Support ticket volume spike → flag to Sales-001
- Negative NPS response → ALERT Sales-001 immediately
- Customer asks about competitor products → ALERT Sales-001 immediately

---

*This template is a living document. Update after each onboarding with lessons learned.*
