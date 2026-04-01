---
name: using-git-worktrees
description: Use before starting infrastructure or feature work that needs isolation from the current workspace
---

# Using Git Worktrees

## When to Use

- Before making infrastructure changes that might break the working directory
- When working on multiple features simultaneously
- When you need to test a change without affecting current work

## Creating a Worktree

```bash
# Create a new worktree for a feature branch
git worktree add ../superpowers-devops-feature-name feature/name

# Create with a new branch
git worktree add -b feature/my-infra-change ../superpowers-devops-infra main

# List worktrees
git worktree list
```

## Working in a Worktree

```bash
cd ../superpowers-devops-feature-name
# Make changes here — completely isolated from main working directory
```

## Cleaning Up

```bash
# Remove worktree when done
git worktree remove ../superpowers-devops-feature-name

# Force remove if there are uncommitted changes (be careful)
git worktree remove --force ../superpowers-devops-feature-name
```

## Safety Rules

- Never run destructive infra commands (terraform destroy, kubectl delete) in a worktree without confirming the environment
- Always confirm which branch/worktree you're in before applying changes
- Remove worktrees when done to avoid confusion
