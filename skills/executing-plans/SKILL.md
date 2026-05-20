---
name: executing-plans
description: Use to execute a written implementation plan via subagents with review checkpoints
---

# Executing Plans

## Overview

Load plan, review critically, execute all tasks, report when complete.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

**Note:** Superpowers works much better with subagent support. If subagents are available (Claude Code, Codex), use `superpowers-devops:subagent-driven-development` instead — it provides two-stage review and faster iteration within the same session.

## The Process

### Step 1: Load and Review Plan

1. Read plan file
2. Review critically — identify questions or concerns
3. If concerns: raise them before starting
4. If no concerns: create TodoWrite and proceed

### Step 2: Execute Tasks

For each task:
1. Mark as in_progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed

### Step 3: Complete Development

After all tasks complete and verified:
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
- Follow plan steps exactly — do not skip, reorder, or combine steps
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
