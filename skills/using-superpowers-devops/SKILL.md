---
name: using-superpowers-devops
description: Use at session start — orients the agent to the full DevOps skill set and when to invoke each skill automatically
---

# superpowers-devops

You have superpowers-devops. This plugin gives you a complete DevOps intelligence layer: skills that shape how you approach infrastructure, debugging, code analysis, networking, and more.

## The Rule

**Invoke the relevant skill BEFORE any action.** Even a 1% chance a skill applies means you must check. Skills tell you HOW to approach a task — they are not optional.

## When to Invoke Each Skill

| Situation | Skill to invoke |
|---|---|
| User wants to build or change something | `brainstorming` first |
| You have a spec and need a plan | `writing-plans` |
| You have a plan to execute | `executing-plans` |
| Any bug, error, crash, or unexpected behavior | `systematic-debugging` |
| User pastes a stack trace, log, or error output | `error-reading` |
| User asks to review code quality or DevOps readiness | `code-audit` |
| User wants to optimize code, fix memory leaks, loops | `code-optimization` |
| Working with Terraform, Ansible, or Pulumi | `infrastructure-provisioning` |
| Working with Docker, Kubernetes, or Helm | `container-operations` |
| Working with CI/CD pipelines | `ci-cd-pipeline` |
| Working with AWS, GCP, or Azure | `cloud-operations` |
| Working with Prometheus, Grafana, or logs | `monitoring-and-alerting` |
| Working with secrets, Vault, or SOPS | `secrets-management` |
| Working with IPs, ports, or firewall rules | `network-operations` |
| Working with Nginx, Traefik, or HAProxy | `reverse-proxy` |
| Working with DNS records or domain routing | `dns-and-domains` |
| Working with load balancers | `load-balancing` |
| Before declaring any work complete | `verification-before-completion` |
| Starting work that needs isolation | `using-git-worktrees` |

## Dual-Mode Awareness

You operate in two modes. Detect which one you're in:

- **Repo mode** — you have access to files in a working directory. Use `tooling/` templates, scaffold real files, modify configs.
- **Chat mode** — no local repo. User is pasting errors, logs, or code. Provide inline guidance and copy-paste-ready fixes.

Most skills work in both modes. Adapt based on what's available.

## Red Flags (you are rationalizing — stop)

| Thought | Reality |
|---|---|
| "This is a simple DevOps question" | Check for a skill first. |
| "I just need to look at the error" | `error-reading` skill first. |
| "Let me just apply this fix" | `systematic-debugging` first. |
| "I know how to write a Dockerfile" | `container-operations` skill first. |
| "This is obvious" | Obvious tasks become complex. Use the skill. |
