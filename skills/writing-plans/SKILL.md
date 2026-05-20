---
name: writing-plans
description: Use after brainstorming to create a detailed, step-by-step implementation plan for a DevOps task
---

# Writing Plans

## Purpose

Turn an approved design into a plan clear enough for a subagent to execute without deviation. Document everything needed: which files to touch, exact commands, how to verify, and how to roll back.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md` and commit before executing.

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature/Change Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-devops:subagent-driven-development (recommended) or superpowers-devops:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing the end state]

**Prerequisites:** [What must be true before starting]

**Architecture:** [2-3 sentences about approach]

---
```

## Plan Structure

Each plan must include:

1. **Goal** — one sentence describing the end state
2. **Prerequisites** — what must be true before starting
3. **Tasks** — ordered, atomic tasks with bite-sized steps
4. **Verification** — how to confirm the full plan succeeded
5. **Rollback** — how to undo everything if something goes wrong

## Bite-Sized Step Granularity

**Each step is one action (2-5 minutes):**
- "Run `terraform plan` and review output" — step
- "Apply the plan after review" — step
- "Verify the resource exists in the expected state" — step
- "Commit" — step

## Step Format

```
### Task N — <imperative title>

**What:** <one sentence>

- [ ] <exact command or file change>
- [ ] <verification step>
- [ ] Commit

**Done when:** <observable condition>
**Rollback:** <how to undo this task>
```

## DevOps-Specific Rules

- Any task that modifies production infrastructure must have an explicit rollback
- Any task that applies IaC must include the plan review step before apply
- Any task that changes DNS must note the TTL wait time
- Any task that touches secrets must not log or print them
- Any task that changes network rules must include a connectivity test

## Scope Check

If the spec covers multiple independent subsystems, suggest breaking into separate plans — one per subsystem. Each plan should produce working, testable changes on its own.
