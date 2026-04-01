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
