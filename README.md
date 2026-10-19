# superpowers-devops

> **Based on [superpowers](https://github.com/obra/superpowers)** by Jesse Vincent - the original AI coding agent skill plugin. This repo is a DevOps-focused transformation: same plugin architecture, entirely new skill set built around infrastructure, containers, CI/CD, cloud, networking, code analysis, and debugging.

> **For kubernetes-skill, adapted from [KubeShark](https://github.com/LukasNiessen/kubernetes-skill)** by Lukas Niessen - a failure-mode-first, security-hardened Kubernetes agent skill.

A DevOps-focused skill plugin for AI coding agents, with infrastructure/debugging guidance and a small set of adaptable Helm and AWS examples. Templates require project-specific inputs and validation; they are not a production-readiness guarantee.

## What It Does

Once skills are discovered and the entrypoint is loaded, the trigger table guides the agent toward the relevant workflow for errors, Terraform plans, Kubernetes manifests, or proxy configs. Activation depends on the host integration; verify your installation below.

Works in two modes:
- **Repo mode** - agent has access to your files, scaffolds from templates, modifies configs directly
- **Chat mode** - no repo needed, paste errors/logs/code and get inline guidance and fix snippets

## Platform Integrations

| Platform | Integration and current evidence |
|---|---|
| Claude Code | Marketplace packaging and session hook; hook output tested through Bash, not a native installation matrix |
| Cursor | Native plugin skill paths and Cursor-specific hook schema; hook contract tested through Bash |
| Codex | Native skill-directory install; explicit entrypoint load, no automatic session hook |
| OpenCode | Native V1/V2 adapter contracts tested; host installation smoke check still required |
| Gemini CLI | Extension manifest supplied; host installation not exercised here |
| GitHub Copilot CLI | Manual skill/instruction use; automatic bootstrap is not verified |

Pi and Kimi wiring is also present but remains experimental. Repository checks do not certify every host/OS combination.

## Installation

### Claude Code

#### Option 1 - Via Plugin Marketplace (recommended)

Run these commands inside an interactive Claude Code session.

**Step 1:** Register the marketplace repository:
```
/plugin marketplace add tspry/superpowers-devops
```

**Step 2:** Install the plugin:
```
/plugin install superpowers-devops@superpowers-devops-marketplace
```

The name after `@` comes from `.claude-plugin/marketplace.json`, not the GitHub repository name. Use `/plugin` to confirm the plugin appears under **Installed**.

#### Option 2 - Via a Local Clone

**Step 1:** Clone the repo in your terminal:
```bash
git clone https://github.com/tspry/superpowers-devops
```

**Step 2:** In Claude Code, register the clone as a local marketplace. This relative path assumes your session is in the directory containing the clone; otherwise use its absolute path:
```
/plugin marketplace add ./superpowers-devops
/plugin install superpowers-devops@superpowers-devops-marketplace
```

See the [Claude Code plugin installation documentation](https://code.claude.com/docs/en/discover-plugins) for installation scopes and activation instructions.

### Cursor

Use Cursor's plugin installation UI with this GitHub repository/local clone, following [Cursor's plugin documentation](https://cursor.com/docs/plugins). Marketplace publication is not guaranteed. The clone includes `.cursor-plugin/plugin.json`, skills, and a Cursor-specific `sessionStart` hook. Restart Cursor, confirm the plugin is enabled, and verify that `kubernetes` is available and the entrypoint context loads.

### Codex

```
Fetch and follow instructions from https://raw.githubusercontent.com/tspry/superpowers-devops/main/.codex/INSTALL.md
```

### OpenCode

```
Fetch and follow instructions from https://raw.githubusercontent.com/tspry/superpowers-devops/main/.opencode/INSTALL.md
```

### Gemini CLI

Install the extension using `gemini extensions install https://github.com/tspry/superpowers-devops` on a Gemini CLI release supporting Git extensions. Restart and check `gemini extensions list`, the loaded `GEMINI.md` context, and skill discovery. See [Gemini extension documentation](https://geminicli.com/docs/extensions/); this host flow has not been exercised in this repository's checks.

### GitHub Copilot CLI

Use a local clone and explicitly load/read `skills/using-superpowers-devops/SKILL.md` through your CLI's supported instruction/skill mechanism. Keep the clone's absolute path available when working in another project. No automatic Copilot hook installation is promised; verify skill loading before relying on the trigger table.

## Skills

### Workflow
- `brainstorming` - establish intent and right-size design to scope and operational risk
- `writing-plans` - record decisions, interfaces, verification, and rollback in reviewable tasks
- `executing-plans` - implement plans inline with progress and verification evidence
- `subagent-driven-development` - delegate tasks with spec/quality review and bounded fix loops
- `dispatching-parallel-agents` - investigate independent problems in parallel
- `test-driven-development` - write tests before implementation code
- `requesting-code-review` - submit changes for peer review
- `receiving-code-review` - process and act on code review feedback
- `finishing-a-development-branch` - merge and wrap up completed work
- `using-git-worktrees` - isolated environments for infra changes
- `verification-before-completion` - confirm changes actually worked
- `writing-skills` - create or edit agent skill definitions

### DevOps
- `infrastructure-provisioning` - Terraform, Ansible, Pulumi
- `container-operations` - Docker
- `kubernetes` - Kubernetes manifests, Helm, RBAC, NetworkPolicy, security
- `ci-cd-pipeline` - GitHub Actions, GitLab CI, Jenkins
- `cloud-operations` - AWS, GCP, Azure
- `monitoring-and-alerting` - Prometheus, Grafana, logs
- `secrets-management` - Vault, SOPS, secret scanning
- `network-operations` - IPs, ports, firewall rules
- `reverse-proxy` - Nginx, Traefik, HAProxy, SSL
- `dns-and-domains` - DNS records, propagation debugging
- `load-balancing` - upstream configs, health checks

### Code Analysis
- `systematic-debugging` - root cause before any fix
- `code-audit` - DevOps readiness + security scan
- `code-optimization` - memory leaks, loops, performance
- `error-reading` - stack traces, crash logs, cloud errors

## Slash Commands

| Command | What it does |
|---|---|
| `/brainstorm` | Start a guided design session |
| `/write-plan` | Create an implementation plan |
| `/execute-plan` | Execute a plan inline with verification checkpoints |
| `/audit` | Run a DevOps readiness + security audit |
| `/debug` | Trigger systematic debugging |
| `/optimize` | Analyze code for performance issues |
| `/kubernetes` | Author, review, harden, or debug Kubernetes and Helm workloads |
| `/test-driven-development` | Define and verify tests before implementation |
| `/writing-skills` | Create or maintain skill instructions |

These files are exposed as slash commands only on hosts that discover the plugin's `commands/` directory; native skill invocation is the portable alternative.

## Tooling

See the [exact tooling inventory](tooling/README.md). Shipped assets are a Helm chart skeleton and four AWS examples. Other domain directories and starter READMEs are guidance, not bundled implementations. Skills can generate project-specific configurations for those domains; generated output needs its own verification.

## Verification

See [the verification guide](tests/README.md) for required structural, platform-contract, and template checks and their limits. No cloud deployment or host-installation certification is implied by local checks.

## Upstream Sync

Selected improvements are adapted from **obra/superpowers v7.0.0** and **LukasNiessen/kubernetes-skill**. See [the sync record and repeatable maintenance procedure](docs/upstream-sync.md) for exact revisions, adapted files, deliberate differences, and verification. Future syncs preserve DevOps as the main direction rather than importing all upstream features.

## License

MIT
