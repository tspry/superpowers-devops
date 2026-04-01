# superpowers-devops

> **Based on [superpowers](https://github.com/obra/superpowers)** by Jesse Vincent — the original AI coding agent skill plugin. This repo is a DevOps-focused transformation: same plugin architecture, entirely new skill set built around infrastructure, containers, CI/CD, cloud, networking, code analysis, and debugging.

A unified DevOps intelligence layer for AI coding agents. Combines AI agent skills that guide you through DevOps workflows with real production-ready tooling templates — all in one plugin.

## What It Does

Install once. Then just work. When you paste an error, a crash log, a Terraform plan, or a broken nginx config, the right skill kicks in automatically and guides you through diagnosis and resolution.

Works in two modes:
- **Repo mode** — agent has access to your files, scaffolds from templates, modifies configs directly
- **Chat mode** — no repo needed, paste errors/logs/code and get inline guidance and fix snippets

## Supported Platforms

- Claude Code
- Cursor
- Codex
- OpenCode
- GitHub Copilot CLI
- Gemini CLI

## Installation

### Option 1 — Via Plugin Marketplace (recommended)

**Step 1:** Register the marketplace:
```
/plugin marketplace add tspry/superpowers-devops
```

**Step 2:** Install the plugin:
```
/plugin install superpowers-devops@superpowersdevops
```

### Option 2 — Via Git Clone

**Step 1:** Clone the repo:
```bash
git clone https://github.com/tspry/superpowers-devops
```

**Step 2:** Install from local path:
```
/plugin install ./superpowers-devops
```

### Cursor

Search for `superpowers-devops` in the plugin marketplace, or:

```
/add-plugin superpowers-devops
```

### Codex

```
Fetch and follow instructions from https://raw.githubusercontent.com/tspry/superpowers-devops/main/.codex/INSTALL.md
```

### OpenCode

```
Fetch and follow instructions from https://raw.githubusercontent.com/tspry/superpowers-devops/main/.opencode/INSTALL.md
```

## Skills

### Workflow
- `brainstorming` — refine requirements before touching anything
- `writing-plans` — break work into reviewable tasks
- `executing-plans` — run plans via subagents
- `using-git-worktrees` — isolated environments for infra changes
- `verification-before-completion` — confirm changes actually worked

### DevOps
- `infrastructure-provisioning` — Terraform, Ansible, Pulumi
- `container-operations` — Docker, Kubernetes, Helm
- `ci-cd-pipeline` — GitHub Actions, GitLab CI, Jenkins
- `cloud-operations` — AWS, GCP, Azure
- `monitoring-and-alerting` — Prometheus, Grafana, logs
- `secrets-management` — Vault, SOPS, secret scanning
- `network-operations` — IPs, ports, firewall rules
- `reverse-proxy` — Nginx, Traefik, HAProxy, SSL
- `dns-and-domains` — DNS records, propagation debugging
- `load-balancing` — upstream configs, health checks

### Code Analysis
- `systematic-debugging` — root cause before any fix
- `code-audit` — DevOps readiness + security scan
- `code-optimization` — memory leaks, loops, performance
- `error-reading` — stack traces, crash logs, cloud errors

## Slash Commands

| Command | What it does |
|---|---|
| `/brainstorm` | Start a guided design session |
| `/write-plan` | Create an implementation plan |
| `/execute-plan` | Execute a plan via subagents |
| `/audit` | Run a DevOps readiness + security audit |
| `/debug` | Trigger systematic debugging |
| `/optimize` | Analyze code for performance issues |

## Tooling

Real templates and configs in `tooling/` organized by domain:

```
tooling/
├── ci/           GitHub Actions, GitLab CI, Jenkins
├── containers/   Dockerfiles, Kubernetes, Helm
├── iac/          Terraform, Ansible, Pulumi
├── cloud/        AWS, GCP, Azure
├── monitoring/   Prometheus, Grafana
├── security/     Vault, SOPS, scanning
└── network/      Nginx, Traefik, HAProxy
```

Each domain has generic templates plus opinionated `starters/` for common full-stack setups.

## License

MIT
