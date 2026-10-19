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
- The user chose delegated execution in this session

**vs. Executing Plans (inline):** This workflow delegates implementation and adds an independent task review with two verdicts. `executing-plans` implements in the current agent's context. Honor the user's choice; if delegation is unavailable or prohibited, use inline execution and report that limitation.

## Pre-Flight Plan Review

Before dispatching Task 1, scan the plan once for conflicts:
- tasks that contradict each other or the plan's Global Constraints
- anything the plan explicitly mandates that the review rubric treats as a defect

Present everything you find to your human partner as one batched question — each finding beside the plan text that mandates it, asking which governs — before execution begins, not one interrupt per discovery mid-plan. If the scan is clean, proceed without comment.

## The Process

**Setup:** Read the plan and referenced design, Global Constraints, and Review Focus. Confirm the workspace and target environment, record the starting commit, and create todos. Keep a small plan-scoped record in the plan or existing tracking: task status, implementer/reviewer IDs, changed paths or commit range, verification evidence, findings, and fix-round count. After compaction, resume from that record and current repository state instead of dispatching completed tasks again.

**Per task:**
1. Record the task's starting commit or diff boundary. Dispatch one implementer with the task contract below
2. Answer any questions the implementer asks before work begins
3. Implementer implements, verifies, self-reviews, and reports evidence; commits only if authorized
4. Dispatch **one task reviewer** using `requesting-code-review`, with the task requirements, constraints, exact diff boundary, and verification evidence. Require separate spec-compliance and task-quality verdicts
5. Resolve unavailable evidence and findings; use the bounded fix loop below for blocking issues
6. Mark the task complete only when both verdicts pass and required verification is accounted for

**After all tasks:**
- Dispatch a final reviewer for the entire change against the design, Global Constraints, and Review Focus. This review covers cross-task integration, not just accumulated task verdicts
- Resolve blocking findings, run required final verification with `verification-before-completion`, and report limitations honestly
- Use `superpowers-devops:finishing-a-development-branch`

## Model Selection

Use the least powerful model that can handle each role to conserve cost and increase speed.

**Mechanical implementation tasks** (isolated functions, clear specs, 1-2 files): use a fast, cheap model.
**Integration and judgment tasks** (multi-file coordination, debugging): use a standard model.
**Architecture and design tasks**: use the most capable available model.
**Review tasks**: choose the model scaled to the diff's size, complexity, and risk.

Choose a model explicitly when the harness supports it. If it does not, use the available agent and do not invent unsupported tool parameters.

**Turn count beats token price.** Wall-clock and context cost scale with how many turns a subagent takes. Use a mid-tier model as the floor for reviewers and for implementers working from prose descriptions.

**Task complexity signals (implementation tasks):**
- Touches 1-2 files with a complete spec → cheap model
- Touches multiple files with integration concerns → standard model
- Requires design judgment or broad codebase understanding → most capable model

## Handling Implementer Status

- **DONE:** Proceed to task review (spec compliance + quality)
- **DONE_WITH_CONCERNS:** Read concerns before proceeding; address if about correctness/scope
- **NEEDS_CONTEXT:** Provide missing context and re-dispatch
- **BLOCKED:** Assess blocker — provide context, upgrade model, break task smaller, or escalate to human

**Never** ignore a BLOCKED status or force retry without changes.

## Handling Reviewer ⚠️ Items

The task reviewer may report "⚠️ Cannot verify from diff" items — requirements that live in unchanged code or span tasks. These do not block the rest of the review, but you must resolve each one yourself before marking the task complete: you hold the plan and cross-task context the reviewer lacks. Return supporting evidence to the reviewer for the final verdict. If you confirm an item is a real gap, treat it as a failed spec review — send it back to the implementer and re-review. Unavailable required live checks remain explicitly unverified and are escalated, not silently waived.

## Task Contracts

**Implementer receives:** task goal; exact files and required interfaces; relevant Global Constraints; dependency contracts; verification and rollback checks; allowed environment/actions; commit authorization. Provide the task text, not the whole session history.

**Implementer returns:** DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED; changed paths and commit range if any; commands and observed results; self-review findings; deviations and unavailable checks. No nested delegation. Do not apply infrastructure or expose secrets merely to satisfy a test.

**Reviewer receives:** the same requirements, the complete task diff (including uncommitted changes when applicable), and implementer evidence. Use the existing template in `requesting-code-review`; reviewers remain read-only and do not delegate.

## Bounded Fix Loop

1. Record findings with stable IDs, severity, evidence, and disposition. Fix Critical/Important issues before proceeding; carry Minor issues explicitly into final review.
2. For rounds 1–3, resume the original implementer with the concrete open findings. The controller supplies missing context and resolves requirement conflicts.
3. Re-review the fixes and affected behavior, not unrelated settled areas; expand scope only when new evidence warrants it.
4. If context is exhausted or rounds 4–5 need a fresh implementer, provide the task contract, current diff, evidence, and open findings. Stop after five unsuccessful rounds and ask the user to resolve the blocker.

Do not paper over data-loss, secret exposure, unsafe production actions, or unresolved correctness defects to obtain a passing verdict. Record a disputed finding with technical evidence; escalate unresolved load-bearing disputes rather than silently declaring them passed.

## Constructing Reviewer Prompts

- Do not add open-ended directives like "check all uses" without a concrete, task-specific reason
- Give the reviewer existing test evidence; repeat a check only to investigate a concrete gap or contradiction
- Do not pre-judge findings for the reviewer — never instruct a reviewer to ignore or not flag a specific issue
- A dispatch prompt describes one task, not the session's history. Do not paste accumulated prior-task summaries into later dispatches
- Resume the task implementer for Critical and Important fixes. Record Minor findings for the final whole-change review
- If the final review returns findings, use one fix implementer for the complete blocking list and re-review the affected scope, within the same bounded-loop limit

## Red Flags

**Never:**
- Start on main/master branch without explicit user consent
- Skip task review, or accept a report missing either verdict (spec compliance AND task quality are both required)
- Proceed with open Critical/Important issues or unaccounted-for required verification
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
- **superpowers-devops:executing-plans** — For inline implementation rather than delegation
