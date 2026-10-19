---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup
---

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Detect environment → Present options → Execute choice → Clean up.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

## The Process

### Step 1: Verify Tests and State

**Before presenting options, verify the work is complete:**

```bash
# Run project's test suite / verification
npm test / cargo test / pytest / go test ./...
# For DevOps: run terraform validate, helm lint, etc.
```

**If verification fails:** Stop. Show failures. Do not proceed to Step 2.

**If verification passes:** Continue to Step 2.

### Step 2: Detect Environment

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

Capture these in the original workspace **before changing directories**, along with branch name and ownership/provenance. Reuse them during cleanup; recomputing from the main repo loses the worktree identity. Stop if detection fails. When commands run in separate shells, carry the captured values explicitly.

| State | Menu | Cleanup |
|-------|------|---------|
| `GIT_DIR == GIT_COMMON` (normal repo) | Standard 3 options | No worktree to clean up |
| `GIT_DIR != GIT_COMMON`, named branch | Standard 3 options | Provenance-based (see Step 6) |
| `GIT_DIR != GIT_COMMON`, detached HEAD | Reduced 2 options (no merge) | No cleanup (externally managed) |

### Step 3: Determine Base Branch

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

Or ask: "This branch split from main — is that correct?"

### Step 4: Present Options

**Normal repo and named-branch worktree — present these 3 options:**

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)

Which option?
```

**Detached HEAD — present these 2 options:**

```
Implementation complete. You're on a detached HEAD (externally managed workspace).

1. Push as new branch and create a Pull Request
2. Keep as-is (I'll handle it later)

Which option?
```

**Don't add explanation** — keep options concise.

Discard is not a routine completion option. Handle it only when the user explicitly requests it (see below).

### Step 5: Execute Choice

#### Option 1: Merge Locally

```bash
MAIN_ROOT=$(git -C "$GIT_COMMON/.." rev-parse --show-toplevel)
# Run the following commands with MAIN_ROOT as the working directory.

git checkout <base-branch>
git pull
git merge <feature-branch>

# Verify after merge
<verification command>
```

Run each command only if the previous one succeeds. If merge or merged-result verification fails, stop and preserve the feature branch and worktree for investigation. Do not remove either as part of failure handling.

After success, clean up an owned worktree (Step 6), then delete the merged branch. If removal is refused or ownership is uncertain, keep both and report the reason:
```bash
git branch -d <feature-branch>
```

#### Option 2: Push and Create PR

```bash
git push -u origin <feature-branch>

gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)"
```

**Do NOT clean up worktree** — user needs it for PR iteration.

#### Option 3: Keep As-Is

Report: "Keeping branch `<name>`. Worktree preserved at `<path>`."

**Don't cleanup worktree.**

#### Explicit Discard Request

**Confirm first:**
```
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
```

Inspect tracked and untracked changes and show what would be lost before asking. Wait for exact confirmation. Preserve host-owned workspaces; remove only a verified agent-owned worktree using Step 6. If removal refuses, stop and keep the branch too. Only after successful removal (or when no linked worktree exists), delete the branch:
```bash
git branch -D <feature-branch>
```

In a normal repository, first switch safely to the confirmed base branch; Git cannot delete the checked-out branch. If local changes prevent switching, stop and report them rather than forcing checkout or resetting files.

### Step 6: Cleanup Workspace

**Only after a successful local merge or an explicit confirmed discard request.** PR and keep choices preserve the worktree. Use the original values captured in Step 2.

**If `GIT_DIR == GIT_COMMON`:** Normal repo, no worktree to clean up. Done.

**If creation provenance confirms this agent workflow owns the worktree** (commonly under `.worktrees/` or `worktrees/`): clean it up. A directory name alone is not proof of ownership.

```bash
MAIN_ROOT=$(git -C "$GIT_COMMON/.." rev-parse --show-toplevel)
# Run from MAIN_ROOT, outside WORKTREE_PATH:
git worktree remove "$WORKTREE_PATH"
# Only after removal succeeds:
git worktree prune
```

If removal refuses, inspect `git -C "$WORKTREE_PATH" status --short --untracked-files=all`, report the files, and preserve the workspace and branch. Never retry with `--force` or delete files to make cleanup pass.

**Otherwise:** The host environment owns this workspace. Do NOT remove it.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | yes | — | — | yes |
| 2. Create PR | — | yes | yes | — |
| 3. Keep as-is | — | — | yes | — |

## Red Flags

**Never:**
- Proceed with failing verification
- Merge without verifying the merged result
- Delete work without typed 'discard' confirmation
- Force-push without explicit request
- Remove a worktree without a verified successful merge or an explicit confirmed discard request
- Run `git worktree remove` from inside the worktree
- Clean up worktrees you didn't create

**Always:**
- Verify before offering options
- Present 3 options (or 2 for detached HEAD); discard only on explicit request
- Use the main repo root as working directory before worktree removal
- Run `git worktree prune` after removal
