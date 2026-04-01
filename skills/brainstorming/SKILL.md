---
name: brainstorming
description: Use before any DevOps build, change, or new feature — refine requirements through dialogue before touching infrastructure or code
---

# Brainstorming

## The Rule

Do NOT touch infrastructure, write configs, or scaffold anything until you have presented a design and the user has approved it.

## Process

1. **Understand the request** — ask clarifying questions one at a time
2. **Propose 2-3 approaches** — with trade-offs and your recommendation
3. **Present the design** — in sections, get approval after each
4. **Write a design doc** — save to `docs/specs/YYYY-MM-DD-<topic>-design.md`
5. **Hand off to writing-plans** — invoke the `writing-plans` skill

## Questions to Ask

Focus on:
- What problem is this solving? What's broken or missing today?
- What scale? (traffic, data size, team size, environments)
- What constraints? (cloud provider, budget, existing stack)
- What does success look like?
- What's the blast radius if this goes wrong?

One question at a time. Multiple choice when possible.

## Key Principles

- **YAGNI** — don't design for hypothetical future scale
- **Reversibility** — prefer reversible changes, flag irreversible ones
- **Blast radius** — always ask: what breaks if this goes wrong?
- **Incremental** — can this be rolled out gradually?
