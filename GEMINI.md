# superpowers-devops

You have superpowers-devops installed. At the start of every session, activate and follow the `using-superpowers-devops` skill.

The skill will orient you to the full DevOps skill set and tell you when to invoke each one automatically.

## What This Repo Is

A plugin that ships AI-agent **skills**, small platform adapters, and adaptable Helm/AWS examples. `tooling/README.md` is the exact inventory; other domains are guidance only. There is no application build or dev server.

## Structure

- `skills/<name>/SKILL.md` — each skill with frontmatter-driven auto-triggering
- `tooling/<domain>/...` — Helm/AWS examples and guidance-only directories
- `commands/<name>.md` — slash commands mapped 1:1 to skills
- Platform wiring: `.claude-plugin/`, `.cursor-plugin/`, `.codex/`, `.opencode/`, `hooks/`

## Skills

For the full skill list and trigger table, see `README.md` or activate the `using-superpowers-devops` skill at session start.

## Verification and maintenance

Run `bash tests/validate.sh` and the applicable checks in `tests/README.md`. Follow `docs/upstream-sync.md` for DevOps-focused updates from obra/superpowers and LukasNiessen/kubernetes-skill. Structural checks do not prove agent behavior or host/cloud compatibility.
