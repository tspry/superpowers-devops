---
name: brainstorming
description: Use before a DevOps build, infrastructure change, or new automation feature, especially when intent, constraints, or operational risk need clarification
---

# Brainstorming Ideas Into Designs

Help turn DevOps ideas into fully formed designs and specs through natural collaborative dialogue.

First establish what the user wants and why, then match the design effort to the change. Build on the existing environment rather than inventing a new stack.

## Establish Shared Understanding

- Read the request and available project context. Identify the intended outcome, constraints, and observable success criteria.
- If material information is missing, ask one open question anchored in the user's experience: "What happened during the last deploy that you want to prevent?" Offer choices only when they help the user answer.
- Reflect the intent back concisely. Mark assumptions as your assumptions, not agreed requirements.
- Establish which choices the user wants to own: cloud provider, cluster/environment, IaC tool, CI platform, budget. State defaults you choose and follow existing conventions.

## Size the Work

| Change | Design artifact | Next step |
|---|---|---|
| Quick, clear, fully specified edit | The request itself | Make the requested edit and verify it |
| Small change to existing infrastructure or automation | Short in-chat design: intended behavior, affected environment, verification, rollback | Get agreement, then implement through the relevant domain skill |
| New platform, subsystem, or cross-environment architecture | Written design | Review the design, then use `writing-plans` |
| Feasibility investigation | Agreed question and non-production probe | Report evidence; label any prototype throwaway |

Say which size fits in plain language. If the work grows, stop and reassess. If the user explicitly asks to skip design questions, state significant assumptions and proceed through the normal domain workflow.

<HARD-GATE>
For small changes and projects, get approval of the actual description before implementation: the chat design for a small change, the written document for a project. Approval of an idea does not approve an unwritten design or plan. A fully specified edit or an explicit opt-out of design questions does not need a new design gate.

Design shortcuts do not authorize infrastructure side effects. Keep the domain skill's plan/diff review, target-environment checks, secret handling, and authorization for destructive or production actions. A probe is not permission to deploy or to keep its prototype as production code.
</HARD-GATE>

## Checklist for a Project

1. **Explore project context** — check files, docs, recent commits, existing infra; in chat mode, use supplied configs and ask for missing evidence
2. **Establish intent** — understand purpose, constraints, success criteria, and ownership of technical choices
3. **Compare approaches** — recommend the simplest viable option; show alternatives when there is a meaningful trade-off
4. **Present design** — in sections scaled to their complexity, get user approval after each section
5. **Write design doc** — save to `docs/specs/YYYY-MM-DD-<topic>-design.md` (or the user's preferred location)
6. **Builder check** — read as the engineer who must implement it; resolve missing decisions and ambiguity
7. **User reviews written spec** — ask user to review before proceeding
8. **Transition to implementation** — invoke `writing-plans` skill to create implementation plan

For a project, the next skill after written-design approval is `writing-plans`. Small changes and fully specified edits proceed through their normal domain workflow without two extra documents.

## The Process

**Understanding the idea:**

- Check out the current project state first (files, docs, recent commits, existing infra)
- Before asking detailed questions, assess scope: if the request covers multiple independent systems, flag this immediately. Don't refine details of a project that needs to be decomposed first.
- For appropriately-scoped changes, ask questions one at a time
- Ask open questions first; use a short menu if the user is stuck
- Focus on: purpose, constraints, success criteria, blast radius, rollback plan

**DevOps-specific questions to ask:**

- What problem is this solving? What's broken or missing today?
- What scale? (traffic, data size, team size, environments)
- What constraints? (cloud provider, budget, existing stack, compliance)
- What does success look like?
- What's the blast radius if this goes wrong?
- Is this reversible? What's the rollback plan?
- Can this be rolled out gradually?

**Exploring approaches:**

- Compare viable approaches where the decision matters; do not manufacture alternatives for a settled choice
- Present options with your recommendation and reasoning
- Lead with your recommended option and explain why

**Presenting the design:**

- Once you understand what you're building, present the design
- Scale each section to its complexity
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, rollback, testing
- Be ready to go back and clarify

**Working in existing environments:**

- Explore the current state before proposing changes. Follow existing patterns.
- Where existing infra has problems that affect the work, include targeted improvements — the way a good engineer improves what they're working in.
- Don't propose unrelated refactoring. Stay focused on what serves the current goal.

## After the Design (Projects)

**Documentation:**

- Write the validated design (spec) to `docs/specs/YYYY-MM-DD-<topic>-design.md`
- In chat mode, provide the document inline. Commit only when requested or authorized by the user's workflow.

**Builder Check:**
Read the spec as an engineer who must build it without the conversation. Ask what decisions are still missing, then check:

1. **Placeholder scan:** Any "TBD", "TODO", or vague requirements? Fix them.
2. **Internal consistency:** Do sections contradict each other?
3. **Scope check:** Is this focused enough for a single implementation plan?
4. **Ambiguity check:** Could any requirement be interpreted two ways? Pick one, make it explicit.

Resolve answers already in the project or conversation. Make minor implementation calls yourself and label them. Bring questions that change the outcome, blast radius, or rollback to the user in one round. Fix the document before handoff.

**User Review Gate:**
After the builder check, ask the user to review the written spec:

> "Spec saved to `<path>`. Please review it, including the assumptions I marked, before we write the implementation plan."

Wait for the user's response. Only proceed once the user approves.

**Implementation:**

- Invoke the `writing-plans` skill to create a detailed implementation plan

## Red Flags

| Thought | Reality |
|---|---|
| "I know this stack, so I know what they want" | Reflect their intended outcome; familiarity does not supply requirements. |
| "They approved the idea, so the plan is approved" | Approval covers the artifact they actually saw. |
| "It's only a one-line production change" | File size does not measure blast radius. Keep target, verification, and rollback checks. |
| "The probe worked, so I'll deploy it" | Keeping or deploying a prototype is a new implementation decision. |
