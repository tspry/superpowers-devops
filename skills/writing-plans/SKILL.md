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

## Global Constraints

[The spec's project-wide requirements — version floors, dependency limits, naming rules, platform requirements — one line each, with exact values copied verbatim from the spec. Every task's requirements implicitly include this section.]

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

## Task Right-Sizing

A task is the smallest unit that carries its own test cycle and is worth a fresh reviewer's gate. When drawing task boundaries: fold setup, configuration, scaffolding, and documentation steps into the task whose deliverable needs them; split only where a reviewer could meaningfully reject one task while approving its neighbor. Each task ends with an independently testable deliverable.

## Self-Review

After writing the complete plan, check the plan against the spec:
1. **Spec coverage:** Can you point to a task that implements each spec requirement? List any gaps.
2. **Placeholder scan:** Search for "TBD", "TODO", "implement later", "add appropriate error handling", "write tests for the above" (without actual test code), "similar to Task N" (repeat the code). Fix any found.
3. **Type consistency:** Do types, method signatures, and names in later tasks match what earlier tasks defined?

Fix issues inline. If a spec requirement has no task, add the task.

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — the engineer may read tasks out of order)
- Steps that describe what to do without showing how
- References to types, functions, or methods not defined in any task
