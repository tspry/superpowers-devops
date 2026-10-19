---
name: executing-plans
description: Use when executing a written implementation plan yourself in the current session, by user choice or when delegation is unavailable
---

# Executing Plans

## Overview

Execute the plan yourself, task by task, keeping progress and verification evidence. This is native (inline) execution, not a dispatcher for subagents.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

Honor the user's execution choice. Use `subagent-driven-development` when they chose delegated implementation; tool availability alone is not a reason to switch methods. Inline execution has no independent per-task review gate — report that limitation accurately.

## The Process

### Step 1: Load and Review Plan

1. Read the plan and its referenced design, Global Constraints, and Review Focus
2. Review critically — identify questions or concerns
3. If concerns: raise them before starting
4. Confirm the intended workspace and target environment; use `using-git-worktrees` when isolation is needed. In chat mode, keep the plan and evidence inline rather than assuming file access.
5. If no concerns: create todos for the plan items and record the starting commit (when present) for whole-change review

### Step 2: Execute Tasks

For each task:
1. Mark as in_progress
2. Read the affected code/config and follow the task's decisions and interfaces; use relevant domain skills
3. Run the specified checks, including the owning task's Review Focus checks. Review IaC plan/diff output before any authorized apply; never substitute a live apply for offline validation
4. Record changed paths, commands, results, deviations, and any unverified live-environment behavior. Self-review against requirements and operational risk
5. Mark complete only after required checks pass. After context loss, read the plan and evidence record, inspect current state, and resume the earliest unfinished task — do not repeat completed infrastructure actions

Keep the record in the plan's checkboxes or existing project tracking; no separate orchestration framework is needed. If a requirement must change, resolve it with the user and update the plan before implementation.

### Step 3: Complete Development

After all tasks:
- Review the complete change against the design, Global Constraints, and Review Focus, not just the last task. Use `requesting-code-review` if an independent reviewer is available and permitted; otherwise do the review inline and label it as self-review
- Fix blocking findings and re-run affected checks. Use `verification-before-completion` to run the project's required final verification and report failures or unavailable checks, including pre-existing failures
- Summarize completed work, evidence, remaining limitations, and rollback before integration

Once the work is verified and ready for integration:
- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use `superpowers-devops:finishing-a-development-branch`
- Follow that skill to verify, present options, execute choice

## When to Stop and Ask for Help

**STOP immediately when:**
- Hit a blocker (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing progress
- You don't understand an instruction
- Verification fails repeatedly
- About to apply IaC without reviewing plan output first

**Ask for clarification rather than guessing.**

## Remember

- Review plan critically first
- Preserve plan decisions and dependencies; ask about material deviations rather than silently changing scope
- Don't skip verifications
- Reference skills when plan says to
- Stop when blocked, don't improvise
- Never start on main/master branch without explicit user consent

## Integration

**Required workflow skills:**
- **superpowers-devops:using-git-worktrees** — Isolated workspace
- **superpowers-devops:writing-plans** — Creates the plan this skill executes
- **superpowers-devops:finishing-a-development-branch** — Complete development after all tasks
- **superpowers-devops:verification-before-completion** — Before declaring the plan done
