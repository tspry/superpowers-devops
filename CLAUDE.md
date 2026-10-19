# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# superpowers-devops

You have superpowers-devops installed. At the start of every session, load and follow the `using-superpowers-devops` skill using the Skill tool.

The skill will orient you to the full DevOps skill set and tell you when to invoke each skill automatically.

## What This Repo Is

A plugin that provides a unified DevOps intelligence layer for AI coding agents. It has two deeply integrated halves:

1. **Skills** (`skills/`) — SKILL.md files that shape agent behavior for specific DevOps workflows
2. **Tooling** (`tooling/`) — Adaptable Helm/AWS examples; `tooling/README.md` is the exact inventory

In repo mode, inspect the inventory before using a template; other domains are guidance only and require project-specific generation and validation. In chat mode, provide inline guidance from supplied content.

## Architecture

### Skills

Each skill lives in `skills/<skill-name>/SKILL.md`. The frontmatter has `name` and `description` fields. The body defines when the skill applies, what the agent should do, and (for DevOps skills) which `tooling/` paths to reference.

Skill categories:
- **Workflow** (`brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `test-driven-development`, `requesting-code-review`, `receiving-code-review`, `finishing-a-development-branch`, `using-git-worktrees`, `verification-before-completion`, `writing-skills`) — process and orchestration
- **DevOps** (`infrastructure-provisioning`, `container-operations`, `kubernetes`, `ci-cd-pipeline`, `cloud-operations`, `monitoring-and-alerting`, `secrets-management`, `network-operations`, `reverse-proxy`, `dns-and-domains`, `load-balancing`) — domain-specific guidance
- **Code Analysis** (`systematic-debugging`, `code-audit`, `code-optimization`, `error-reading`) — diagnosis loop: audit → optimize → read errors → debug root cause

### Tooling

`tooling/` is organized by domain. Only Helm and AWS currently contain executable examples; the other directories and `starters/` READMEs contain guidance:

```
tooling/
├── ci/           # Guidance only
├── containers/   # Helm skeleton; Docker/raw Kubernetes guidance only
├── iac/          # Guidance only
├── cloud/        # AWS examples; GCP/Azure guidance only
├── monitoring/   # Guidance only
├── security/     # Scanning guidance only
└── network/      # Nginx guidance only
```

### Slash Commands

Commands in `commands/` map directly to skills:

| Command | Skill triggered |
|---|---|
| `/brainstorm` | `brainstorming` |
| `/write-plan` | `writing-plans` |
| `/execute-plan` | `executing-plans` |
| `/audit` | `code-audit` |
| `/debug` | `systematic-debugging` |
| `/optimize` | `code-optimization` |
| `/kubernetes` | `kubernetes` |
| `/test-driven-development` | `test-driven-development` |
| `/writing-skills` | `writing-skills` |

### Platform Integration Files

| File | Purpose |
|---|---|
| `.claude-plugin/plugin.json` | Claude Code marketplace metadata |
| `.cursor-plugin/plugin.json` | Cursor plugin metadata |
| `.codex/INSTALL.md` | Manual bootstrap for Codex |
| `.opencode/INSTALL.md` | Manual bootstrap for OpenCode |
| `gemini-extension.json` | Gemini CLI extension config |
| `hooks/hooks.json` | Claude Code session-start hook |
| `hooks/hooks-cursor.json` | Cursor-specific sessionStart hook schema |
| `hooks/session-start` | Hook script that runs at session start |
| `GEMINI.md` | Equivalent of this file for Gemini CLI |

## Design Principles

- **No new package dependencies** — small checks use stdlib/native tools; `.opencode/` has its existing SDK dependency
- **Dual-mode** — every skill works with or without a local repo
- **Skills reference real tooling** — DevOps skills specify exact `tooling/` paths
- **Honest inventory** — do not claim missing templates or starters are bundled

## Verification

- Run `bash tests/validate.sh` for a structural check (frontmatter, path references, conventions)
- Run applicable contract/template checks in `tests/README.md`; local checks do not certify host installs or cloud deployments
- `.pre-commit-config.yaml` provides pre-commit hooks for basic validation before commits
- Follow `docs/upstream-sync.md` when reviewing either upstream; record exact revisions, selective adaptations, evidence, and deferred work
