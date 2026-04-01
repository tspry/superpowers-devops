---
name: writing-plans
description: Use after brainstorming to create a detailed, step-by-step implementation plan for a DevOps task
---

# Writing Plans

## Purpose

Turn an approved design into a plan clear enough for a subagent to execute without deviation.

## Plan Structure

Each plan must include:

1. **Goal** — one sentence describing the end state
2. **Prerequisites** — what must be true before starting
3. **Steps** — ordered, atomic tasks. Each step must:
   - Do exactly one thing
   - Have a clear completion condition
   - Include the exact commands or file changes needed
   - Note any rollback procedure for destructive steps
4. **Verification** — how to confirm the full plan succeeded
5. **Rollback** — how to undo everything if something goes wrong

## Step Format

```
## Step N — <imperative title>

**What:** <one sentence>
**Commands / changes:**
  <exact commands or diffs>
**Done when:** <observable condition>
**Rollback:** <how to undo this step>
```

## DevOps-Specific Rules

- Any step that modifies production infrastructure must have an explicit rollback
- Any step that applies IaC must include the plan review step before apply
- Any step that changes DNS must note the TTL wait time
- Any step that touches secrets must not log or print them

## Save Location

Save the plan to `docs/plans/YYYY-MM-DD-<topic>-plan.md` and commit before executing.
