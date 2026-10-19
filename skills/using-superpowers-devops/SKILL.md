---
name: using-superpowers-devops
description: Use at session start — orients the agent to the full DevOps skill set and when to invoke each skill automatically. If there is even a 1% chance a skill applies, check it before acting.
---

# superpowers-devops

You have superpowers-devops. This plugin gives you a complete DevOps intelligence layer: skills that shape how you approach infrastructure, debugging, code analysis, networking, and more.

## Instruction Priority

User instructions (CLAUDE.md, AGENTS.md, direct requests) take precedence over skills, which in turn override default behavior. Only skip skill workflows when your human partner has explicitly told you to.

## The Rule

**Invoke the relevant skill BEFORE any action.** Even a 1% chance a skill applies means you must check. Skills tell you HOW to approach a task — they are not optional.

## Skill Priority

When multiple skills apply, process skills come first — they set the approach, then implementation skills carry it out.

- "Set up a new Kubernetes cluster" → `brainstorming` first, then `kubernetes` and the infrastructure skills needed.
- "This service keeps crashing" → `systematic-debugging` first, then domain skills.

## When to Invoke Each Skill

| Situation | Skill to invoke |
|---|---|
| User wants to build or change something | `brainstorming` first |
| You have a spec and need a plan | `writing-plans` |
| You have a plan to execute yourself in this session | `executing-plans` |
| You have a plan with independent tasks and chose delegation | `subagent-driven-development` |
| Any bug, error, crash, or unexpected behavior | `systematic-debugging` |
| User pastes a stack trace, log, or error output | `error-reading` |
| User asks to review code quality or DevOps readiness | `code-audit` |
| User wants to optimize code, fix memory leaks, loops | `code-optimization` |
| Working with Terraform, Ansible, or Pulumi | `infrastructure-provisioning` |
| Working with Docker | `container-operations` |
| Working with Kubernetes or Helm | `kubernetes` |
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
| Implementation complete, deciding how to merge/PR | `finishing-a-development-branch` |
| Receiving code review feedback | `receiving-code-review` |
| Need to request a code review | `requesting-code-review` |
| 2+ independent problems to investigate in parallel | `dispatching-parallel-agents` |
| Creating or editing a skill | `writing-skills` |
| Writing tests, or any code where tests should drive implementation | `test-driven-development` |

## Dual-Mode Awareness

You operate in two modes. Detect which one you're in:

- **Repo mode** — you have access to files in a working directory. Check `tooling/README.md` for actual assets and prerequisites before copying templates; guidance-only directories require project-specific generation and validation.
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
| "Let me explore the infrastructure" | Skills tell you HOW to explore. Check first. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
