# Crucible AI — Alerting Thresholds
**Last Updated:** 2026-04-02T16:21:07Z
**Author:** DevOps-001
**Task:** DEVOPS-004

---

## Alerting Thresholds — Official Reference

These are the operational alerting thresholds for Crucible AI infrastructure monitoring.

---

## Uptime Thresholds

| Threshold | Condition | Action | Recipient |
|-----------|-----------|--------|-----------|
| Uptime <99.5% over 7 days | Rolling 7-day uptime drops below 99.5% | Escalate immediately | CTO-001 |
| Any outage >30 minutes | Site unreachable for >30 continuous minutes | ALERT immediately | CTO-001 |
| Any outage >4 hours unresolved | Active outage not resolved within 4hr | KILL TRIGGER — ALERT | CEO-001 |

---

## Incident Response Protocol

### Detection → Response Timeline

```
T+0:00  Outage detected (automated monitor or manual check)
T+0:05  DevOps-001 sends ALERT to CTO-001
T+1:00  Incident Report filed to CTO-001 (HARD DEADLINE — no exceptions)
T+4:00  If unresolved: ALERT filed to CEO-001 (KILL TRIGGER threshold)
```

### Incident Report Format (required within 60 minutes of detection)

```
INCIDENT REPORT
---------------
- What failed:
- When detected (UTC):
- Current status:
- Root cause (if known):
- Fix applied or in progress:
- ETA to resolution:
```

---

## Survival Metric

| Metric | Target | Measurement Window | Owner |
|--------|--------|--------------------|-------|
| Site uptime | >99.5% | Rolling 7 days | DevOps-001 |
| Incident report SLA | <60 min from detection | Per incident | DevOps-001 |
| Escalation to CEO if unresolved | <4 hours from detection | Per incident | DevOps-001 |

**99.5% uptime over 7 days = maximum allowable downtime of ~50 minutes per week.**

---

## Kill Trigger Conditions

DevOps-001 is subject to termination if:
1. An outage occurs AND an incident report is NOT filed within 1 hour of detection
2. An outage exceeds 4 hours without escalation to CEO-001

---

## Monitoring Check Schedule

| Check | Frequency | Method |
|-------|-----------|--------|
| Site availability | Every 6 hours | Playwright browser check |
| CI pipeline status | On-demand / per deploy | GitHub API |
| Incident scan | Continuous (per cycle) | Inbox review |

---

## Notification Routing

| Event | Alert To | Priority |
|-------|----------|----------|
| Outage detected (any duration) | CTO-001 | ALERT / BLOCKING |
| Outage >30 min | CTO-001 | ALERT / BLOCKING |
| Outage >4hr unresolved | CEO-001 | ALERT / KILL TRIGGER |
| Uptime <99.5% 7-day rolling | CTO-001 | REPORT |
| CI pipeline failure | CTO-001 | REPORT |
| Branch protection missing | CTO-001 | REQUEST (infra change) |

---

## Current Monitoring Status

> ⚠️ **GAP:** No automated monitoring tool is currently active.
> All checks are manual (DevOps-001 browser checks every 6 hours).
> This means outage detection latency could be up to 6 hours in worst case.
> A 6-hour outage before detection = automatic kill trigger breach.
>
> **Immediate action required:** Set up UptimeRobot or equivalent to reduce
> detection latency to <5 minutes. Filed as REQUEST to CTO-001.
