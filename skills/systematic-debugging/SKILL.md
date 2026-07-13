---
name: systematic-debugging
description: Use when encountering any bug, error, crash, or unexpected behavior — before proposing any fix
---

# Systematic Debugging

## The Iron Law

```
NO FIX WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

Random fixes waste time and create new bugs. Quick patches mask underlying issues. If you haven't completed Phase 1, you cannot propose fixes.

## Works In Both Modes

- **Repo mode** — read actual log files, configs, code. Run diagnostic commands.
- **Chat mode** — work entirely from what the user pastes. Ask for more output if needed.

## Phase 1 — Gather Evidence

Do NOT skip any of these:

1. **Read the full error** — not just the first line. The root cause is often at the bottom.
2. **Identify the failure boundary** — where exactly did it break? Which service, which line, which step?
3. **Check what changed** — recent deploy, config change, dependency update, infra change?
4. **Collect context**:
   - Exact error message and full stack trace
   - Environment (prod/staging/local, OS, runtime version)
   - Logs immediately before the failure
   - Any recent changes

## Phase 2 — Form Hypotheses

List 2-3 specific, falsifiable hypotheses. Examples:
- "The container is OOMKilled because the memory limit is too low"
- "The 502 is caused by the upstream timing out before the proxy does"
- "The Terraform apply fails because the IAM role lacks the required permission"

Do not combine hypotheses. Test one at a time.

## Phase 3 — Test Hypotheses

For each hypothesis:
- What evidence would confirm it?
- What evidence would rule it out?
- Run the smallest possible test

## Phase 4 — Fix

Only after you have confirmed the root cause:
- Fix the specific root cause, not the symptom
- Explain what caused it and why the fix resolves it
- Check if the same issue exists elsewhere

## Red Flags — STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- **"One more fix attempt" (when already tried 2+)**
- **Each fix reveals new problem in different place**

**ALL of these mean: STOP. Return to Phase 1.**

**If 3+ fixes failed:** Question the architecture — is this pattern fundamentally sound? Discuss with your human partner before attempting more fixes.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem. Question pattern, don't fix again. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Gather Evidence** | Read errors, reproduce, check changes, collect context | Understand WHAT and WHERE |
| **2. Form Hypotheses** | List falsifiable hypotheses, one at a time | Specific, testable theories |
| **3. Test Hypotheses** | Smallest possible test per hypothesis | Confirmed or ruled out |
| **4. Fix** | Fix root cause, verify, check for spread | Bug resolved, no regressions |

## Common DevOps Error Patterns

| Error | First thing to check |
|---|---|
| `CrashLoopBackOff` | `kubectl logs <pod> --previous` |
| `OOMKilled` | Memory limits vs actual usage |
| `502 Bad Gateway` | Upstream health, timeout settings |
| `Connection refused` | Service running? Port correct? Firewall? |
| Terraform apply fails | State drift, permissions, provider version |
| CI pipeline fails | Dependency versions, environment vars, secrets |
| `Permission denied` | IAM/RBAC roles, file permissions |
| DNS not resolving | Propagation time, correct record type, TTL |
