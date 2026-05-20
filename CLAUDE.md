# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# superpowers-devops

You have superpowers-devops installed. At the start of every session, load and follow the `using-superpowers-devops` skill using the Skill tool.

The skill will orient you to the full DevOps skill set and tell you when to invoke each skill automatically.

## What This Repo Is

A plugin that provides a unified DevOps intelligence layer for AI coding agents. It has two deeply integrated halves:

1. **Skills** (`skills/`) — SKILL.md files that shape agent behavior for specific DevOps workflows
2. **Tooling** (`tooling/`) — Production-ready templates and configs that skills reference by path

Skills know where their relevant tooling templates live. In repo mode, agents scaffold real files from `tooling/`. In chat mode (no local repo), agents provide inline guidance from pasted content.

## Architecture

### Skills

Each skill lives in `skills/<skill-name>/SKILL.md`. The frontmatter has `name` and `description` fields. The body defines when the skill applies, what the agent should do, and (for DevOps skills) which `tooling/` paths to reference.

Skill categories:
- **Workflow** (`brainstorming`, `writing-plans`, `executing-plans`, `using-git-worktrees`, `verification-before-completion`) — process and orchestration
- **DevOps** (`infrastructure-provisioning`, `container-operations`, `ci-cd-pipeline`, `cloud-operations`, `monitoring-and-alerting`, `secrets-management`, `network-operations`, `reverse-proxy`, `dns-and-domains`, `load-balancing`) — domain-specific guidance
- **Code Analysis** (`systematic-debugging`, `code-audit`, `code-optimization`, `error-reading`) — diagnosis loop: audit → optimize → read errors → debug root cause

### Tooling

`tooling/` is organized by domain. Each domain has generic templates at its root and opinionated full setups in `starters/`:

```
tooling/
├── ci/           # GitHub Actions, GitLab CI, Jenkins
├── containers/   # Dockerfiles, Kubernetes manifests, Helm charts
├── iac/          # Terraform, Ansible, Pulumi
├── cloud/        # AWS, GCP, Azure configs
├── monitoring/   # Prometheus, Grafana
├── security/     # Vault, SOPS, scanning (Trivy, gitleaks)
└── network/      # Nginx, Traefik, HAProxy
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

### Platform Integration Files

| File | Purpose |
|---|---|
| `.claude-plugin/plugin.json` | Claude Code marketplace metadata |
| `.cursor-plugin/plugin.json` | Cursor plugin metadata |
| `.codex/INSTALL.md` | Manual bootstrap for Codex |
| `.opencode/INSTALL.md` | Manual bootstrap for OpenCode |
| `gemini-extension.json` | Gemini CLI extension config |
| `hooks/hooks.json` | Claude Code session-start hook |
| `hooks/session-start` | Hook script that runs at session start |
| `GEMINI.md` | Equivalent of this file for Gemini CLI |

## Design Principles

- **Zero external dependencies** — no npm/pip/gem dependencies
- **Dual-mode** — every skill works with or without a local repo
- **Skills reference real tooling** — DevOps skills specify exact `tooling/` paths
- **Generic + opinionated** — generic templates for flexibility, `starters/` for speed
