---
name: writing-plans
description: Use after brainstorming to create a detailed, step-by-step implementation plan for a DevOps task
---

# Writing Plans

## Purpose

Turn an approved design into decisions an engineer can execute without the conversation: exact files, resource names, interfaces, pinned values, verification commands, and rollback. Assume the engineer can write idiomatic code or configuration; the plan supplies decisions, not a transcript of the implementation.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md` (user preferences override). In chat mode, provide the plan inline. Commit only when requested or authorized by the user's workflow.

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature/Change Name] Implementation Plan

> **For agentic workers:** Use superpowers-devops:subagent-driven-development or superpowers-devops:executing-plans according to the user's execution choice. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing the end state]

**Prerequisites:** [What must be true before starting]

**Architecture:** [2-3 sentences about approach]

**Spec:** [Path to the approved design, or the inline requirements when no file exists]

## Global Constraints

[The spec's project-wide requirements — version floors, dependency limits, naming rules, platform requirements — one line each, with exact values copied verbatim from the spec. Every task's requirements implicitly include this section.]

## Review Focus

[Up to five plausible failure modes not yet covered by task checks: wrong account/region/context, state drift, missing permissions, rollout failure, or rollback failure. Name the expected behavior and add the check to the owning task. If none remain, say what you checked.]

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

**Each step is one action with a checkable result:**
- "Run `terraform plan` and review output" — step
- "Apply the plan after review" — step
- "Verify the resource exists in the expected state" — step
- "Commit, if authorized" — step

## Step Format

```
### Task N — <imperative title>

**What:** <one sentence>

**Files:** <exact paths to create or modify>
**Interfaces:** <inputs/outputs, resource addresses, variable names, or contracts consumed/produced by this task>

- [ ] <exact command or file change>
- [ ] <verification step>
- [ ] Commit (only if authorized)

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
2. **Step scan:** Remove placeholders and vague instructions; each step must make the required change unambiguous without writing out routine implementation bodies.
3. **Type consistency:** Do types, method signatures, and names in later tasks match what earlier tasks defined?
4. **Review focus:** Does each listed failure mode have a check in its owning task? Distinguish offline validation from evidence requiring a live environment.
5. **Proportion:** If implementation code dominates the plan, replace routine bodies with interfaces, exact required fields/values, and assertions. Keep code only where the contract and tests leave an important algorithm undecided.

Fix issues inline. If a spec requirement has no task, add the task.

## What a Step Contains

- **Test:** Name and executable assertions, with expected values derived from requirements rather than copied from the implementation. Schema/lint checks alone do not prove rollout behavior.
- **Code/config:** Exact file, signature or resource identity, required fields/values, and approach where there is a meaningful choice. Let the implementer write the body; include exact config only when its contents are the decision.
- **Verification:** Exact command, target environment, expected exit status/output, and what it proves. Mark checks needing unavailable credentials or cluster access as unverified, not passed.
- **Cross-task reference:** Use the producing task's Interfaces block instead of duplicating its implementation.
- **Rollback:** Concrete reversal and a check that service/state recovered; note any irreversible consequences.

"TBD", "handle edge cases", "add appropriate validation", and references no task defines are missing decisions, not a plan.

## Execution Handoff

Link the saved plan for user review before execution. Preserve an execution method the user already chose. Otherwise offer:

- **Subagent-driven:** A fresh implementer and one task reviewer per task, then a whole-change review. Useful for independent, higher-risk tasks; costs more contexts.
- **Native (inline):** Implement the plan yourself in this session with progress and evidence recorded, then review the whole change. Useful for tightly related or routine work; no independent per-task gate.

Recommend one using the plan's dependencies and operational risk. Use `subagent-driven-development` or `executing-plans` after the user reviews the plan and selects the method. If delegation is unavailable or prohibited, use inline execution and report the review limitation.
