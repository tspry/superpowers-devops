---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute a plan by dispatching a fresh implementer subagent per task, a task review (spec compliance + code quality) after each, and a broad whole-branch review at the end.

**Core principle:** Fresh subagent per task + task review (spec + quality) + broad final review = high quality, fast iteration.

**Narration:** between tool calls, narrate at most one short line — the ledger and the tool results carry the record.

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

## Pre-Flight Plan Review

Before dispatching Task 1, scan the plan once for conflicts:
- tasks that contradict each other or the plan's Global Constraints
- anything the plan explicitly mandates that the review rubric treats as a defect

Present everything you find to your human partner as one batched question — each finding beside the plan text that mandates it, asking which governs — before execution begins, not one interrupt per discovery mid-plan. If the scan is clean, proceed without comment.

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

Use the least powerful model that can handle each role to conserve cost and increase speed.

**Mechanical implementation tasks** (isolated functions, clear specs, 1-2 files): use a fast, cheap model.
**Integration and judgment tasks** (multi-file coordination, debugging): use a standard model.
**Architecture and design tasks**: use the most capable available model.
**Review tasks**: choose the model scaled to the diff's size, complexity, and risk.

**Always specify the model explicitly when dispatching a subagent.** An omitted model inherits your session's model — often the most capable and most expensive — which silently defeats this section.

**Turn count beats token price.** Wall-clock and context cost scale with how many turns a subagent takes. Use a mid-tier model as the floor for reviewers and for implementers working from prose descriptions.

**Task complexity signals (implementation tasks):**
- Touches 1-2 files with a complete spec → cheap model
- Touches multiple files with integration concerns → standard model
- Requires design judgment or broad codebase understanding → most capable model

## Handling Implementer Status

- **DONE:** Proceed to spec compliance review
- **DONE_WITH_CONCERNS:** Read concerns before proceeding; address if about correctness/scope
- **NEEDS_CONTEXT:** Provide missing context and re-dispatch
- **BLOCKED:** Assess blocker — provide context, upgrade model, break task smaller, or escalate to human

**Never** ignore a BLOCKED status or force retry without changes.

## Handling Reviewer ⚠️ Items

The task reviewer may report "⚠️ Cannot verify from diff" items — requirements that live in unchanged code or span tasks. These do not block the rest of the review, but you must resolve each one yourself before marking the task complete: you hold the plan and cross-task context the reviewer lacks. If you confirm an item is a real gap, treat it as a failed spec review — send it back to the implementer and re-review.

## Prompt Templates

- `./implementer-prompt.md` — Dispatch implementer subagent
- Use `superpowers-devops:requesting-code-review` for reviewer subagents

## Constructing Reviewer Prompts

- Do not add open-ended directives like "check all uses" without a concrete, task-specific reason
- Do not ask a reviewer to re-run tests the implementer already ran
- Do not pre-judge findings for the reviewer — never instruct a reviewer to ignore or not flag a specific issue
- A dispatch prompt describes one task, not the session's history. Do not paste accumulated prior-task summaries into later dispatches
- Dispatch fix subagents for Critical and Important findings. Record Minor findings for the final whole-branch review
- If the final whole-branch review returns findings, dispatch ONE fix subagent with the complete findings list — not one fixer per finding

## Red Flags

**Never:**
- Start on main/master branch without explicit user consent
- Skip task review, or accept a report missing either verdict (spec compliance AND task quality are both required)
- Proceed with unfixed issues
- Dispatch multiple implementation subagents in parallel (conflict risk)
- Make a subagent read the whole plan file (provide its task brief instead)
- Skip scene-setting context (subagent needs to understand where task fits)
- Ignore subagent questions (answer before letting them proceed)
- Accept "close enough" on spec compliance (reviewer found spec issues = not done)
- Skip review loops (reviewer found issues = implementer fixes = review again)
- Let implementer self-review replace actual review (both are needed)
- Tell a reviewer what not to flag, or pre-rate a finding's severity in the dispatch prompt
- Move to next task while the review has open Critical/Important issues

## Integration

**Required workflow skills:**
- **superpowers-devops:using-git-worktrees** — Isolated workspace
- **superpowers-devops:writing-plans** — Creates the plan this skill executes
- **superpowers-devops:requesting-code-review** — Code review template for reviewer subagents
- **superpowers-devops:finishing-a-development-branch** — Complete development after all tasks

**Alternative:**
- **superpowers-devops:executing-plans** — For parallel session instead of same-session execution
