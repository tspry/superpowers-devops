---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment — especially when adding DevOps domain skills
---

# Writing Skills

## Overview

**Writing skills IS Test-Driven Development applied to process documentation for this DevOps plugin.**

You write test cases (pressure scenarios with subagents), watch them fail (baseline behavior), write the skill (documentation), watch tests pass (agents comply), and refactor (close loopholes).

**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

**REQUIRED BACKGROUND:** You MUST understand `test-driven-development` before using this skill. That skill defines the fundamental RED-GREEN-REFACTOR cycle. This skill adapts TDD to documentation.

## What is a Skill in This Plugin?

A **skill** is a `SKILL.md` file in `skills/<name>/` that shapes agent behavior for a specific DevOps workflow. Skills are auto-discovered by platform plugins and matched via their `description` field.

**Skills are:** Reusable techniques, patterns, reference guides for infrastructure, CI/CD, containers, cloud, networking, debugging.

**Skills are NOT:** Narratives about how you solved a problem once, project-specific notes, or mechanical constraints that should be automated.

## TDD Mapping for Skills

| TDD Concept | Skill Creation |
|-------------|----------------|
| **Test case** | Pressure scenario with subagent |
| **Production code** | Skill document (SKILL.md) |
| **Test fails (RED)** | Agent violates rule without skill (baseline) |
| **Test passes (GREEN)** | Agent complies with skill present |
| **Refactor** | Close loopholes while maintaining compliance |
| **Write test first** | Run baseline scenario BEFORE writing skill |
| **Watch it fail** | Document exact rationalizations agent uses |
| **Minimal code** | Write skill addressing those specific violations |
| **Watch it pass** | Verify agent now complies |
| **Refactor cycle** | Find new rationalizations → plug → re-verify |

## When to Create a DevOps Skill

**Create when:**
- A DevOps technique wasn't intuitively obvious to you
- You'd reference this pattern across projects (Terraform state debugging, Helm rollback patterns)
- Pattern applies broadly, not project-specific
- Others in the DevOps community would benefit

**Don't create for:**
- One-off infrastructure fixes
- Standard practices well-documented in official docs (e.g., "how to use kubectl get pods")
- Project-specific conventions (put in your AGENTS.md or instructions file)
- Mechanical constraints (use schema validation, linters, or pre-commit hooks — save documentation for judgment calls)

## Directory Structure

```
skills/
  writing-skills/
    SKILL.md              # Main reference (required)
```

**Flat namespace** — all skills in one searchable namespace under `skills/<name>/SKILL.md`.

## SKILL.md Structure

**Frontmatter (YAML):**
- Two required fields: `name` and `description`
- `name`: 1–64 lowercase letters, numbers, or single hyphens; no leading, trailing, or consecutive hyphens; must equal the parent directory name
- `description`: 1–1024 characters, written on one line for this plugin
- `description`: describes both what the skill covers and when to use it; this plugin starts descriptions with "Use when..."
  - Include specific symptoms, situations, and DevOps contexts
  - State the capability without listing the procedure
  - **NEVER summarize the skill's step-by-step process or workflow**
  - Keep under 500 characters if possible

**Body sections (adapt to need):**
- Overview — core principle in 1-2 sentences
- When to Use — symptoms, use cases, when NOT to use
- Core Pattern — before/after comparisons
- Quick Reference — tables or bullets for scanning
- Implementation — inline code, or link to `tooling/` paths
- Common Mistakes — what goes wrong + fixes
- Red Flags — rationalization self-checks

## Skill Discovery Optimization (SDO)

### 1. Rich Description Field

**Purpose:** Your agent reads the description to decide whether to load this skill. State the capability and answer: "Should I read this skill right now?"

**Format:** Start with "Use when..." to preserve this plugin's trigger convention, then identify the skill's capability.

**CRITICAL: Description = What the Skill Covers + When to Use It, NOT Its Workflow**

```yaml
# ❌ BAD: Summarizes workflow
description: Use when debugging Kubernetes — first checks pods, then events, logs, and network policies

# ❌ BAD: Too much process detail
description: Use for IaC testing — write terraform test first, watch it fail, write minimal code, refactor

# ✅ GOOD: Capability plus triggering conditions
description: Use when Kubernetes workloads are crashing, pending, or misbehaving — diagnoses workload, scheduling, networking, and policy failures

# ✅ GOOD: Capability plus triggering conditions
description: Use when implementing infrastructure changes or IaC modules — guides evidence-first planning, review, and safe application
```

**Content rules:**
- Use concrete triggers: error messages, symptoms, specific situations
- Describe the *problem* (flaky builds, untested IaC, dangling resources) not *tool-specific symptoms*
- Keep triggers technology-agnostic unless the skill itself is technology-specific
- Write in third person
- **NEVER summarize the skill's process or workflow**

### 2. Keyword Coverage

Use words an agent would search for in a DevOps context:
- Error messages: "CrashLoopBackOff", "ImagePullBackOff", "context deadline exceeded", "403 Forbidden"
- Symptoms: "flaky pipeline", "hung deployment", "zombie pod", "dangling security group"
- Synonyms: "timeout/hang/freeze", "cleanup/teardown/rollback"
- Tools: Terraform, kubectl, helm, docker, ansible, nginx, prometheus

### 3. Descriptive Naming

**Use active voice, verb-first:**
- ✅ `writing-skills` not `skill-authoring`
- ✅ `infrastructure-provisioning` not `iac-management`
- ✅ `container-operations` not `docker-guidance`

**Gerunds (-ing) work well for processes:**
- `writing-skills`, `testing-infrastructure`, `debugging-networks`

### 4. Token Efficiency

**Target word counts:**
- Frequently-loaded skills (like `using-superpowers-devops`): <200 words total
- Other skills: <500 words (be concise)

**Techniques:**
- Move flag details to tool `--help` references
- Use cross-references to other skills instead of repeating content
- Compress examples — one excellent example beats many mediocre ones
- Eliminate redundancy with cross-referenced skills

### 5. Cross-Referencing Other Skills

```markdown
**REQUIRED SUB-SKILL:** Use `test-driven-development` for the TDD cycle
**REQUIRED BACKGROUND:** You MUST understand `systematic-debugging` before using this skill
```

Use explicit requirement markers. Avoid `@` syntax that force-loads files.

## DevOps Plugin Conventions

### The Trigger Table Is the Source of Truth

The authoritative situation→skill mapping lives in `skills/using-superpowers-devops/SKILL.md`. Every new or renamed skill must have a row added there. All other references (README, CLAUDE.md, AGENTS.md, GEMINI.md) are secondary.

### Multi-File Change Rule

Creating or renaming a skill requires updating ALL of these:
1. **Skill directory + SKILL.md** — `skills/<name>/SKILL.md`
2. **Trigger table** — add row to `skills/using-superpowers-devops/SKILL.md`
3. **Slash command** — `commands/<name>.md` (if the skill should be a slash command)
4. **Skill lists** — update `README.md`, `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md`

### Tooling Path Coupling

If the skill references `tooling/` templates (Terraform files, Dockerfiles, CI configs), the path must be exact. Moving or renaming a template requires updating the skill's reference too.

Example from `infrastructure-provisioning`:
```markdown
For a shipped Helm example: inspect `tooling/containers/helm/` and its prerequisites.
For Terraform or Ansible: inspect the project's IaC; no modules are bundled. Check `tooling/README.md` before promising a template.
```

### Dual-Mode Awareness

Every DevOps skill must work in two modes:

- **Repo mode** — agent has access to `tooling/` templates. Scaffold real files, modify configs directly.
- **Chat mode** — no local repo. User is pasting errors, logs, or manifests. Provide inline guidance and copy-paste-ready fixes.

Detect which mode you're in and adapt. Don't assume file access.

### Bundled Script Invocation

Invoke scripts through their interpreter in guidance: `bash scripts/check.sh`, `node scripts/tool.js`, or `python scripts/tool.py`. Bare executable paths can fail when plugin packaging strips executable bits. Reference only scripts actually shipped with this plugin.

### Example: Creating a Kubernetes-Observability Skill

When creating a skill for debugging Kubernetes networking:

1. **RED (baseline):** Run a pressure scenario where the agent is told "pods can't reach each other" without the skill. Document what the agent does — likely jumps to checking endpoints without checking CNI, network policies, or DNS first.

2. **GREEN (write skill):** Create `skills/kubernetes-networking/SKILL.md` with a systematic debugging flow: CNI health → NetworkPolicy audit → DNS resolution → endpoint slices → kube-proxy. Reference `tooling/network/` for base configs.

3. **REFACTOR (close loopholes):** Test again. If the agent skips CNI checks again, add explicit prohibition: "Do NOT check pod-to-pod connectivity before verifying the CNI plugin is healthy."

4. **Deploy:** Add trigger row to trigger table, create `commands/k8s-networking.md`, update README/CLAUDE/GEMINI/AGENTS.md.

## RED-GREEN-REFACTOR for Skills

### RED: Write Failing Test (Baseline)

Run pressure scenario with subagent WITHOUT the skill. Document exact behavior:
- What choices did they make?
- What rationalizations did they use (verbatim)?
- Which pressures triggered violations?

### GREEN: Write Minimal Skill

Write skill that addresses those specific rationalizations. Don't add extra content for hypothetical cases.

Run same scenarios WITH skill. Agent should now comply.

### REFACTOR: Close Loopholes

Agent found new rationalization? Add explicit counter. Re-test until bulletproof.

## Match the Guidance to the Failure

Classify the observed failure before adding rules:

| Failure | Guidance form |
|---|---|
| Knows a safety rule but skips it under pressure | Explicit prohibition, rationalization table, and red flags |
| Produces the wrong output shape | Positive recipe showing required parts and their order |
| Omits a required element | Required field in the template being filled in |
| Behavior depends on context | Conditional tied to an observable fact, such as "if no cluster access, mark rollout unverified" |

Do not use a growing prohibition list to fix an output-format problem. Avoid vague exemptions such as "unless relevant"; express genuine exceptions as explicit conditionals. Evaluate changed wording against the observed failure rather than assuming more forceful prose works better.

## Bulletproofing Skills Against Rationalization

Use this section for skipped rules under pressure; use recipes and required fields for wrong-shaped or incomplete output.

### Close Every Loophole Explicitly

Don't just state the rule — forbid specific workarounds:

```markdown
# ✅ GOOD
**No exceptions:**
- Don't keep untested changes as "reference"
- Don't "adapt" while running tests
- Delete means delete
```

### Build Rationalization Table

| Excuse | Reality |
|--------|---------|
| "Skill is obviously clear" | Clear to you ≠ clear to other agents. Test it. |
| "It's just a reference skill" | References can have gaps. Test retrieval. |
| "Testing is overkill" | Untested skills have issues. 15 min testing saves hours. |
| "No time to test" | Deploying untested skill wastes more time fixing it later. |

### Create Red Flags List

```markdown
## Red Flags — STOP

- Writing skill before testing baseline
- Editing skill without re-testing
- "I'll test if problems emerge"
- "Too tedious to test"
```

## The Iron Law

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

This applies to NEW skills AND EDITS to existing skills. Write skill before testing? Delete it. Start over.

**No exceptions:** Not for "simple additions," "just adding a section," or "documentation updates."

## Flowchart Usage

Use flowcharts ONLY for:
- Non-obvious decision points
- Process loops where you might stop too early
- "When to use A vs B" decisions

Never use flowcharts for reference material (use tables), code examples (use code blocks), or linear instructions (use numbered lists).

## Anti-Patterns

### ❌ Narrative Example
"In session 2025-10-03, we fixed a Terraform state lock by..."
**Why bad:** Too specific, not reusable

### ❌ Multi-Tool Dilution
Dockerfile, docker-compose.yml, Dockerfile.arm64 — all in one skill
**Why bad:** Maintenance burden, mediocre quality

### ❌ Generic Labels
step1, helper2, pattern3
**Why bad:** Labels should have semantic meaning

## Verification Checklist

- [ ] Name uses only letters, numbers, hyphens
- [ ] YAML frontmatter with `name` and `description`
- [ ] Description starts with "Use when..." and states both capability and triggering conditions, not the workflow
- [ ] Description written in third person
- [ ] DevOps-specific keywords for search discovery
- [ ] Clear overview with core principle
- [ ] Dual-mode awareness (repo + chat)
- [ ] Cross-references use explicit requirement markers
- [ ] No narrative storytelling
