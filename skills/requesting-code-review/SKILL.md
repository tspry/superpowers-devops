---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

# Requesting Code Review

Dispatch a code reviewer subagent to catch issues before they cascade. The reviewer gets precisely crafted context for evaluation — never your session's history.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature or infra change
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug or config issue

## How to Request

**1. Set the full review boundary:** Record the task's starting commit before implementation; use it even if the task produces several commits. For a whole branch, use its merge-base with the actual target branch:
```bash
BASE_SHA=$(git merge-base origin/main HEAD)  # replace with the actual target
HEAD_SHA=$(git rev-parse HEAD)
```

Confirm the base is an ancestor of the head and the range includes the intended work. `HEAD~1` is only correct for a task known to occupy exactly one commit. If work is uncommitted, explicitly include staged/unstaged diffs and new files; do not review an empty commit range and call the task covered. In chat mode, supply the actual changed configs and requirements.

**2. Dispatch code reviewer subagent** — dispatch a `general-purpose` subagent, filling the template at [code-reviewer.md](code-reviewer.md).

Use the harness's available reviewer/general agent type. If delegation is unavailable or prohibited, review inline and identify it as self-review rather than an independent review. Reviewers are read-only and must not spawn agents.

**Placeholders:**
- `{DESCRIPTION}` — Brief summary of what you built
- `{PLAN_OR_REQUIREMENTS}` — What it should do
- `{BASE_SHA}` — Starting commit
- `{HEAD_SHA}` — Ending commit

**3. Act on feedback:**
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues

**If reviewer is wrong:** Push back with technical reasoning and show evidence.

See template at: [code-reviewer.md](code-reviewer.md)
