---
name: executing-plans
description: Use to execute a written implementation plan via subagents with review checkpoints
---

# Executing Plans

## Process

1. **Read the full plan** before starting any step
2. **Execute steps in order** — do not skip, reorder, or combine steps
3. **Verify each step** before moving to the next
4. **Stop and report** if any step fails — do not improvise

## Execution Rules

- Mark each step as complete only when its "Done when" condition is confirmed
- If a step fails: stop, report the failure, do not attempt the next step
- If a step's output differs from what the plan expected: stop and confirm with the user
- Never apply IaC without reviewing the plan output first
- Never skip the verification step at the end

## Subagent Dispatch

For independent steps that can run in parallel, dispatch subagents. Steps with dependencies must run sequentially.

## After Completion

Invoke `verification-before-completion` before declaring the plan done.
