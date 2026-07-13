---
name: using-git-worktrees
description: Use before starting infrastructure or feature work that needs isolation from the current workspace — ensures an isolated workspace exists via native tools or git worktree fallback
---

# Using Git Worktrees

## Overview

Ensure work happens in an isolated workspace. Prefer your platform's native worktree tools. Fall back to manual git worktrees only when no native tool is available.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0: Detect Existing Isolation

**Before creating anything, check if you are already in an isolated workspace.**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside git submodules. Before concluding "already in a worktree," verify:

```bash
# If this returns a path, you're in a submodule — treat as normal repo
git rev-parse --show-superproject-working-tree 2>/dev/null
```

**If `GIT_DIR != GIT_COMMON` (and not a submodule):** Already in a linked worktree. Skip to Step 3.

Report:
- On a branch: "Already in isolated workspace at `<path>` on branch `<name>`."
- Detached HEAD: "Already in isolated workspace at `<path>` (detached HEAD, externally managed)."

**If `GIT_DIR == GIT_COMMON` (or in a submodule):** Normal repo checkout. Ask for consent:

> "Would you like me to set up an isolated worktree? It protects your current branch from changes."

If user declines, work in place and skip to Step 3.

## Step 1: Create Isolated Workspace

**Try in this order:**

### 1a. Native Worktree Tools (preferred)

Do you have a tool like `EnterWorktree`, `WorktreeCreate`, `/worktree`, or `--worktree`? If so, use it and skip to Step 3.

Native tools handle directory placement, branch creation, and cleanup automatically.

### 1b. Git Worktree Fallback

Only when no native tool is available:

```bash
# Create worktree with a new branch
git worktree add -b feature/<branch-name> .worktrees/<branch-name> main

# Or for a specific base branch
git worktree add -b infra/<change-name> .worktrees/<change-name> origin/main

# List worktrees
git worktree list
```

## Step 2: Enter the Worktree

```bash
cd .worktrees/<branch-name>
# All changes here are isolated from the main working directory
```

## Step 3: Project Setup

Once in the isolated workspace, confirm you're on the expected branch and proceed with the planned work.

## Cleanup

Cleanup is handled by `superpowers-devops:finishing-a-development-branch` at the end of the work. Only clean up worktrees you created:

```bash
# From main repo root (NOT from inside the worktree)
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git worktree remove .worktrees/<branch-name>
git worktree prune  # clean up stale registrations
```

## Safety Rules

- Never run destructive infra commands (terraform destroy, kubectl delete) without confirming the target environment
- Always confirm which branch/worktree you're in before applying changes
- Do NOT run `git worktree remove` from inside the worktree being removed
- Only clean up worktrees under `.worktrees/` or `worktrees/`
- Run `git worktree prune` after removal as self-healing
