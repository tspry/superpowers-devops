# AGENTS.md

Guidance for OpenCode (and other AI coding agents) working in this repo.

## What this repo is

A **plugin**, not an app or library. It ships AI-agent **skills**, platform adapters, and a small set of adaptable **tooling examples**. `tooling/README.md` is the exact shipped inventory; other domains are guidance only.

- **No application build, framework test runner, or dev server.** Root `package.json` is metadata only (no `scripts`). Small executable checks live in `tests/`; see `tests/README.md` for required commands and evidence limits.
- **No new external dependencies.** `.opencode/` has its own `package.json` + `node_modules` for the plugin runtime — that is expected. Never add npm/pip/gem deps outside it.

## Structure

- `skills/<name>/SKILL.md` — each skill. Frontmatter must have `name` and `description`.
- `tooling/<domain>/...` — Helm/AWS examples plus guidance-only directories. Do not claim missing templates/starters are bundled; update the inventory when assets change.
- `commands/<name>.md` — slash commands, each maps 1:1 to a skill.
- `agents/` — reusable agent definitions (e.g. `devops-debugger.md`).
- Platform wiring: `.claude-plugin/`, `.cursor-plugin/`, `.codex/`, `.opencode/`, `gemini-extension.json`, `hooks/`.

## The skill frontmatter is load-bearing

The `description` field in each `SKILL.md` is the **trigger** that decides when the skill auto-invokes. Changing wording changes agent behavior. Treat it as an API, not prose. Every skill needs both `name` and `description`.

**Source of truth:** The trigger table in `skills/using-superpowers-devops/SKILL.md` is the authoritative situation→skill mapping. All other files (README, CLAUDE.md, etc.) are secondary and may lag.

## Entrypoint

`skills/using-superpowers-devops/SKILL.md` holds the **trigger table** (situation → skill). OpenCode's adapter injects it for parent sessions; Claude uses `hooks/hooks.json`, Cursor uses its separate `hooks/hooks-cursor.json` schema, both launching `hooks/session-start` through `run-hook.cmd`. Native skill-only installations require an explicit entrypoint load. Do not conflate these host contracts.

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
Also run the applicable contract/template checks in `tests/README.md` and review changed instructions manually. No cloud apply is part of repository validation. A passing synthetic contract check does not certify a host installation or agent behavior.

## Upstream maintenance

`docs/upstream-sync.md` records the reviewed revisions for **obra/superpowers** and **LukasNiessen/kubernetes-skill**, mappings, deviations, and the fetch/diff/check procedure. Update it whenever adapting either upstream. Preserve DevOps scope, local controls, and licensing; do not blindly merge generic workflows or copy unvalidated platform claims.

## Boundaries (never touch unless asked)

- Platform wiring (`.claude-plugin/`, `.cursor-plugin/`, `.codex/`, `.opencode/plugins/`, `hooks/`, `gemini-extension.json`)
- Root `package.json`, `package-lock.json`, `.opencode/node_modules/`
- Never add external npm/pip/gem dependencies
