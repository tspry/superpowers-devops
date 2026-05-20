---
name: dispatching-parallel-agents
description: Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies
---

# Dispatching Parallel Agents

## Overview

Delegate independent tasks to specialized agents with isolated context. By precisely crafting their instructions and context, you ensure they stay focused and succeed. They should never inherit your session's context — you construct exactly what they need. This also preserves your own context for coordination work.

When you have multiple unrelated failures (different infra components, different services, different bugs), investigating them sequentially wastes time. Each investigation is independent and can happen in parallel.

**Core principle:** Dispatch one agent per independent problem domain. Let them work concurrently.

## When to Use

**Use when:**
- 3+ failing checks across different services or subsystems
- Multiple independent infra components broken
- Each problem can be understood without context from others
- No shared state between investigations (no shared state files, no same resource being modified)

**Don't use when:**
- Failures are related (fix one might fix others)
- Need to understand full system state first
- Agents would interfere with each other (editing same files, modifying same resources)
- Exploratory debugging — you don't know what's broken yet

## The Pattern

### 1. Identify Independent Domains

Group failures by what's broken:
- Service A: health check failure (network/config issue)
- Service B: deploy failure (image build issue)
- Service C: alert firing (threshold misconfiguration)

Each domain is independent — fixing the network config doesn't affect the image build.

### 2. Create Focused Agent Tasks

Each agent gets:
- **Specific scope:** One service, component, or subsystem
- **Clear goal:** Diagnose and fix this specific issue
- **Constraints:** Don't touch other components
- **Expected output:** Summary of root cause and what was changed

### 3. Dispatch in Parallel

Use the Task tool with all independent agents at once:
```
Task("Investigate health check failures for service A")
Task("Fix image build failure for service B")
Task("Correct alert threshold for service C")
// All three run concurrently
```

### 4. Review and Integrate

When agents return:
- Read each summary
- Verify fixes don't conflict (especially shared config files)
- Run full verification
- Integrate all changes

## Agent Prompt Structure

Good agent prompts are:
1. **Focused** — one clear problem domain
2. **Self-contained** — all context needed to understand the problem
3. **Specific about output** — what should the agent return?

```markdown
Investigate the health check failures for service A in the staging environment.

Symptoms:
- /healthz returns 502 since last deploy (2025-05-18 14:30 UTC)
- Upstream logs show "connection refused" on port 8080

Your task:
1. Check the service's container logs and recent config changes
2. Identify root cause — is it the port binding, a crash loop, or network policy?
3. Fix the issue or provide a clear diagnosis with reproduction steps

Do NOT modify other services or shared infrastructure.

Return: Root cause, what you changed (if anything), and how to verify the fix.
```

## Common Mistakes

**Too broad:** "Fix all the failing services" — agent gets lost.
**Specific:** "Fix service A health checks" — focused scope.

**No context:** "Fix the 502" — agent doesn't know where.
**With context:** Paste the error messages and recent change timeline.

**No constraints:** Agent might refactor shared config.
**With constraints:** "Do NOT change shared network policies."

**Vague output:** "Fix it" — you don't know what changed.
**Specific:** "Return summary of root cause and changes made."

## When NOT to Use

**Related failures:** Fixing one might fix others — investigate together first.
**Need full context:** Understanding requires seeing entire system state.
**Exploratory:** You don't know what's broken yet — use `systematic-debugging` first.
**Shared state:** Agents would interfere (editing same Terraform state, same config map).

## Verification

After agents return:
1. **Review each summary** — understand what changed
2. **Check for conflicts** — did agents edit the same files or resources?
3. **Run full verification** — invoke `verification-before-completion`
4. **Spot check** — agents can make systematic errors

## Key Benefits

1. **Parallelization** — multiple investigations happen simultaneously
2. **Focus** — each agent has narrow scope, less context to track
3. **Independence** — agents don't interfere with each other
4. **Speed** — 3 problems solved in time of 1
