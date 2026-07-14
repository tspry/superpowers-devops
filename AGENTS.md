# AGENTS.md

Guidance for OpenCode (and other AI coding agents) working in this repo.

## What this repo is

A **plugin**, not an app or library. It ships AI-agent **skills** (behavior instructions) plus **tooling templates** (copy-ready configs). There is no runtime code to execute here.

- **No build, no test runner, no linter, no dev server.** `package.json` is metadata only (no `scripts`). Content is plain Markdown/JSON/YAML — verification is reading and checking consistency, not running a suite.
- **No new external dependencies.** `.opencode/` has its own `package.json` + `node_modules` for the plugin runtime — that is expected. Never add npm/pip/gem deps outside it.

## Structure

- `skills/<name>/SKILL.md` — each skill. Frontmatter must have `name` and `description`.
- `tooling/<domain>/...` — templates (Dockerfiles, TF, k8s, CI, nginx, etc.). Generic templates at domain root; some domains (currently `ci/`, `monitoring/`) have opinionated `starters/` subdirectories.
- `commands/<name>.md` — slash commands, each maps 1:1 to a skill.
- `agents/` — reusable agent definitions (e.g. `devops-debugger.md`).
- Platform wiring: `.claude-plugin/`, `.cursor-plugin/`, `.codex/`, `.opencode/`, `gemini-extension.json`, `hooks/`.

## The skill frontmatter is load-bearing

The `description` field in each `SKILL.md` is the **trigger** that decides when the skill auto-invokes. Changing wording changes agent behavior. Treat it as an API, not prose. Every skill needs both `name` and `description`.

**Source of truth:** The trigger table in `skills/using-superpowers-devops/SKILL.md` is the authoritative situation→skill mapping. All other files (README, CLAUDE.md, etc.) are secondary and may lag.

## Entrypoint

`skills/using-superpowers-devops/SKILL.md` is injected at session start and holds the **trigger table** (situation → skill). For OpenCode this is done by `.opencode/plugins/superpowers-devops.js`; for Claude/Cursor by `hooks/session-start` (driven by `hooks/hooks.json`, matcher `startup|clear|compact`, Windows entry `run-hook.cmd`). Do not break this injection — it is how the whole plugin activates.

## Conventions when changing skills

**Adding or renaming a skill is a multi-file change** — keep these in sync or the skill won't surface:
1. Create `skills/<name>/SKILL.md` with `name` + `description` frontmatter.
2. Add the situation→skill row to `skills/using-superpowers-devops/SKILL.md` trigger table.
3. Add `commands/<name>.md` if it should be a slash command (1:1 with the skill).
4. Update the skill lists in `README.md`, `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md`.

**Tooling path coupling:** skills reference `tooling/` paths by exact string. If you move/rename a template, update the skill's reference too.

**Dual-mode:** skills must work both with a local repo (scaffold real files) and in chat mode (inline guidance). Don't assume file access.

**Skill count discipline:** Skill count is near the maintainability ceiling — require a deprecate-before-add decision before introducing a new skill.

## Plugin version sync

The plugin version is duplicated across every platform manifest. **When bumping the version, update ALL of these or the plugin will report inconsistent versions per platform:**

- `package.json` — **source of truth** (`version` field)
- `.claude-plugin/plugin.json` — `version`
- `.claude-plugin/marketplace.json` — `plugins[].version`
- `gemini-extension.json` — `version`
- `.kimi-plugin/plugin.json` — `version`
- `.cursor-plugin/plugin.json` — `version`

Do **not** touch the `1.17.x` version in `.opencode/package-lock.json` — that is the `@opencode-ai/plugin` *runtime dependency*, not this plugin's own version.

## Git

`main` branch. Commits follow an "sync from upstream" style; there is no CI. Keep changes focused and update the relevant instruction files alongside content edits.

## Verification

`tests/validate.sh` is a bash structural check (frontmatter, path references, conventions). Run it after changes:
```
bash tests/validate.sh
```
There is no test suite, linter, or build step. "Verification" means this script + manual content review.

## Boundaries (never touch unless asked)

- Platform wiring (`.claude-plugin/`, `.cursor-plugin/`, `.codex/`, `.opencode/plugins/`, `hooks/`, `gemini-extension.json`)
- Root `package.json`, `package-lock.json`, `.opencode/node_modules/`
- Never add external npm/pip/gem dependencies
