---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute a plan by dispatching a fresh subagent per task, with two-stage review after each: spec compliance first, then code quality.

**Why subagents:** You delegate tasks to specialized agents with isolated context. By precisely crafting their instructions and context, you ensure they stay focused. They should never inherit your session's history — you construct exactly what they need. This preserves your own context for coordination work.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration.

**Continuous execution:** Do not pause to check in between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are: BLOCKED status you cannot resolve, ambiguity that genuinely prevents progress, or all tasks complete.

## When to Use

**Use when:**
- You have a written implementation plan
- Tasks are mostly independent
- Staying in this session (vs. parallel session)

**vs. Executing Plans (parallel session):**
- Same session (no context switch)
- Fresh subagent per task (no context pollution)
- Two-stage review after each task: spec compliance first, then code quality
- Faster iteration (no human-in-loop between tasks)

## The Process

**Setup:** Read plan, extract all tasks with full text, note context, create TodoWrite.

**Per task:**
1. Dispatch implementer subagent with full task text + context
2. Answer any questions the implementer asks before work begins
3. Implementer implements, verifies, self-reviews, commits
4. Dispatch spec compliance reviewer — confirm code matches spec
5. If spec gaps: implementer fixes → spec reviewer re-reviews
6. Dispatch code quality reviewer
7. If quality issues: implementer fixes → quality reviewer re-reviews
8. Mark task complete

**After all tasks:**
- Dispatch final code reviewer for entire implementation
- Use `superpowers-devops:finishing-a-development-branch`

## Model Selection

- **Mechanical tasks** (isolated functions, clear specs, 1-2 files): cheap/fast model
- **Integration tasks** (multi-file, pattern matching, debugging): standard model
- **Architecture/review tasks**: most capable model

## Handling Implementer Status

- **DONE:** Proceed to spec compliance review
- **DONE_WITH_CONCERNS:** Read concerns before proceeding; address if about correctness/scope
- **NEEDS_CONTEXT:** Provide missing context and re-dispatch
- **BLOCKED:** Assess blocker — provide context, upgrade model, break task smaller, or escalate to human

**Never** ignore a BLOCKED status or force retry without changes.

## Prompt Templates

- `./implementer-prompt.md` — Dispatch implementer subagent
- Use `superpowers-devops:requesting-code-review` for reviewer subagents

## Red Flags

**Never:**
- Start on main/master branch without explicit user consent
- Skip spec compliance review OR code quality review
- Proceed with unfixed issues
- Dispatch multiple implementation subagents in parallel (conflict risk)
- Make subagent read plan file directly (provide full text instead)
- Accept "close enough" on spec compliance
- Skip review loops (reviewer found issues = implementer fixes = review again)
- Start code quality review before spec compliance is ✅

## Integration

**Required workflow skills:**
- **superpowers-devops:using-git-worktrees** — Isolated workspace
- **superpowers-devops:writing-plans** — Creates the plan this skill executes
- **superpowers-devops:requesting-code-review** — Code review template for reviewer subagents
- **superpowers-devops:finishing-a-development-branch** — Complete development after all tasks

**Alternative:**
- **superpowers-devops:executing-plans** — For parallel session instead of same-session execution
