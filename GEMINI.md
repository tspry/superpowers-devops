# superpowers-devops

You have superpowers-devops installed. At the start of every session, activate and follow the `using-superpowers-devops` skill.

The skill will orient you to the full DevOps skill set and tell you when to invoke each one automatically.

## What This Repo Is

A plugin that ships AI-agent **skills** (behavior instructions) and **tooling templates** (copy-ready configs). There is no runtime code to execute — content is plain Markdown/JSON/YAML.

## Structure

- `skills/<name>/SKILL.md` — each skill with frontmatter-driven auto-triggering
- `tooling/<domain>/...` — production-ready templates (Dockerfiles, TF, k8s, CI, nginx, etc.)
- `commands/<name>.md` — slash commands mapped 1:1 to skills
- Platform wiring: `.claude-plugin/`, `.cursor-plugin/`, `.codex/`, `.opencode/`, `hooks/`

## Skills

For the full skill list and trigger table, see `README.md` or activate the `using-superpowers-devops` skill at session start.
