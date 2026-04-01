# superpowers-devops — Design Spec

**Date:** 2026-04-01
**Status:** Approved

---

## Overview

`superpowers-devops` is a clean-break transformation of the superpowers plugin into a unified DevOps intelligence layer. It combines two deeply integrated halves:

1. **AI agent skills** — behavior-shaping SKILL.md files that guide agents through DevOps workflows
2. **Real tooling** — production-ready scripts, IaC templates, and configs organized by domain

Both halves know about each other: skills reference specific paths in `tooling/`, so agents work with real artifacts rather than abstract guidance.

Supported platforms: Claude Code, Cursor, Codex, OpenCode, Copilot CLI, Gemini CLI.

---

## Repo Structure

```
superpowers-devops/
├── skills/                  # AI agent behavior skills (one dir per skill)
├── tooling/                 # Real scripts, IaC templates, configs
│   ├── ci/
│   ├── containers/
│   ├── iac/
│   ├── cloud/
│   ├── monitoring/
│   ├── security/
│   └── network/
├── agents/                  # Specialized agent definitions
├── commands/                # Slash commands
├── hooks/                   # Platform hooks
├── .claude-plugin/
├── .cursor-plugin/
├── .codex/
├── .opencode/
├── CLAUDE.md
└── GEMINI.md
```

---

## Skills

### Workflow Skills (process/orchestration)

| Skill | Trigger | Purpose |
|---|---|---|
| `using-superpowers-devops` | Session start | Orients agent to DevOps context |
| `brainstorming` | Before any build/change | Refine requirements before touching anything |
| `writing-plans` | After brainstorming | Break work into reviewable tasks |
| `executing-plans` | After plan approval | Run plans via subagents |
| `using-git-worktrees` | Before infra changes | Isolated environments |
| `verification-before-completion` | Before declaring done | Confirm infra changes actually worked |

### DevOps-Specific Skills

| Skill | Purpose |
|---|---|
| `infrastructure-provisioning` | Guide IaC changes (Terraform/Ansible/Pulumi), enforce plan-before-apply |
| `container-operations` | Docker builds, K8s deployments, Helm releases |
| `ci-cd-pipeline` | Design, debug, and fix CI/CD workflows |
| `cloud-operations` | AWS/GCP/Azure resource management |
| `monitoring-and-alerting` | Set up and interpret Prometheus, Grafana, logs |
| `secrets-management` | Vault, SOPS, scanning for leaked secrets |
| `network-operations` | IP management, port configuration, firewall rules, routing |
| `reverse-proxy` | Nginx, Traefik, HAProxy setup, config debugging, SSL termination |
| `dns-and-domains` | DNS records, propagation debugging, domain routing |
| `load-balancing` | Upstream configuration, health checks, traffic distribution |

### Code Analysis Skills

| Skill | Purpose |
|---|---|
| `systematic-debugging` | Root cause analysis — no fix without root cause investigation |
| `code-audit` | DevOps readiness + security scan (secrets, missing configs, insecure images) |
| `code-optimization` | Memory leaks, inefficient loops, blocking calls, over-provisioning |
| `error-reading` | Structured interpretation of stack traces, build failures, K8s crash logs, cloud errors |

These four form a complete diagnosis loop: **audit → optimize → read errors → debug root cause.**

---

## Code Analysis Detail

### `code-audit`
- Missing Dockerfile, .dockerignore, health check endpoints
- Hardcoded secrets, API keys, passwords in code
- No CI/CD config or broken pipeline definitions
- Missing resource limits in K8s manifests
- Exposed ports, insecure base images

### `code-optimization`
- Memory leaks (unreleased connections, unbounded caches, unclosed file handles)
- Inefficient loops (N+1 queries, nested iterations on large datasets)
- Blocking calls in async contexts
- Oversized container images, redundant layers
- CPU/memory over-provisioning or under-provisioning in IaC

### `error-reading`
- Stack traces (any language)
- Build/compile failures
- Docker/K8s crash logs (CrashLoopBackOff, OOMKilled, etc.)
- CI pipeline failures
- Cloud provider error codes (AWS, GCP, Azure)
- Nginx/proxy 502/503/504 errors

### `systematic-debugging`
- Iron law: no fix without root cause investigation
- Works across infra, code, network, and pipeline failures

---

## Tooling Structure

Each domain follows a consistent layout: generic templates at root, opinionated starter packs in `starters/`.

```
tooling/
├── ci/
│   ├── github-actions/        # Reusable workflow templates
│   ├── gitlab-ci/             # .gitlab-ci.yml templates
│   ├── jenkins/               # Jenkinsfile templates
│   └── starters/              # Opinionated full setups (e.g., node-app-aws)
│
├── containers/
│   ├── dockerfiles/           # Base Dockerfiles by language/runtime
│   ├── kubernetes/            # Deployment, Service, Ingress manifests
│   ├── helm/                  # Chart templates
│   └── starters/              # Full app stacks (e.g., django-k8s-starter)
│
├── iac/
│   ├── terraform/             # Modules by resource type
│   ├── ansible/               # Roles and playbooks
│   ├── pulumi/                # Program templates
│   └── starters/              # Opinionated infra stacks (e.g., aws-vpc-eks)
│
├── cloud/
│   ├── aws/                   # IAM, ECS, Lambda, S3 configs
│   ├── gcp/                   # GKE, Cloud Run, IAM configs
│   └── azure/                 # AKS, App Service configs
│
├── monitoring/
│   ├── prometheus/            # Scrape configs, alert rules
│   ├── grafana/               # Dashboard JSONs
│   └── starters/              # Full observability stack
│
├── security/
│   ├── vault/                 # Vault policies, auth configs
│   ├── sops/                  # .sops.yaml templates
│   └── scanning/              # Trivy, gitleaks configs
│
└── network/
    ├── nginx/                 # nginx.conf templates, reverse proxy configs
    ├── traefik/               # traefik.yml, dynamic configs
    ├── haproxy/               # haproxy.cfg templates
    └── starters/              # Full reverse proxy + SSL setups
```

---

## Platform Integrations

### Plugin Files
```
.claude-plugin/plugin.json        # Claude Code marketplace metadata
.claude-plugin/marketplace.json   # Registry entry
.cursor-plugin/plugin.json        # Cursor plugin metadata
.codex/INSTALL.md                 # Manual setup for Codex
.opencode/INSTALL.md              # Manual setup for OpenCode
.opencode/plugins/superpowers-devops.js
gemini-extension.json             # Gemini CLI extension config
```

### Bootstrap
```
CLAUDE.md     # Loaded by Claude Code — triggers using-superpowers-devops skill
GEMINI.md     # Same for Gemini CLI
```

### Hooks
```
hooks/hooks.json           # Claude Code hooks
hooks/hooks-cursor.json    # Cursor hooks
hooks/session-start        # Runs at session start
```

### Slash Commands
```
commands/brainstorm.md     # /brainstorm
commands/write-plan.md     # /write-plan
commands/execute-plan.md   # /execute-plan
commands/audit.md          # /audit    → triggers code-audit skill
commands/debug.md          # /debug    → triggers systematic-debugging skill
commands/optimize.md       # /optimize → triggers code-optimization skill
```

---

## Dual-Mode Operation

Every skill must work in two distinct contexts without requiring the user to do anything special — the agent detects the mode automatically.

### Repo Mode
The user has the plugin installed AND is working inside a local repository. The agent has access to files, can read/write code, scaffold from `tooling/` templates, and modify configs directly.

- Skills reference `tooling/` paths and can scaffold real files
- `/audit`, `/debug`, `/optimize` commands run against actual codebase files
- `infrastructure-provisioning` can generate and apply Terraform/Ansible/K8s files
- Full brainstorm → plan → execute workflow available

### Chat Mode
The user has the plugin installed but has **no local repo** — they are just using Claude CLI and pasting errors, logs, outputs, or code snippets directly into the chat.

- Skills detect no working directory / no relevant files present
- Agent switches to inline guidance: explains root cause, generates fix snippets, provides commands to run
- `error-reading` and `systematic-debugging` work entirely from pasted content
- `code-optimization` and `code-audit` work from pasted code snippets
- No file access required — all output is inline text/code blocks the user can copy

### Mode Detection
Skills determine mode by checking:
1. Is there a working directory with relevant files? → Repo mode
2. Is the user pasting raw text/errors with no file context? → Chat mode

Skills explicitly state at the top which modes they support and adapt their instructions accordingly.

---

## Design Principles

- **Zero external dependencies** — the plugin itself has no npm/pip/gem dependencies
- **Dual-mode** — every skill works both with and without a local repo
- **Skills reference real tooling** — in repo mode, every DevOps skill knows where the relevant templates live
- **Diagnosis loop** — audit → optimize → error-reading → systematic-debugging
- **Generic + opinionated** — generic templates for flexibility, starter packs for speed
- **Platform-agnostic** — all 6 major AI coding platforms supported from day one
