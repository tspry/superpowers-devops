---
name: verification-before-completion
description: Use before declaring any work complete — run verification commands and confirm output before making any success claims
---

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Deploy succeeded | Pod status Running + health check 200 | `kubectl apply` exit 0 |
| Infra applied correctly | `terraform show` matches intent | `terraform apply` exit 0 |
| Bug fixed | Original symptom tested: passes | Code changed, assumed fixed |
| Pipeline fixed | Green checkmark in CI | Config change committed |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |

## Verification by Task Type

**Infrastructure apply:**
```bash
terraform show          # confirm state matches intent
# test the actual resource in cloud console/CLI
```

**Container deploy:**
```bash
kubectl get pods        # all pods Running, not CrashLoopBackOff
kubectl logs <pod>      # no errors
curl /health            # health check passes
```

**CI/CD change:**
- Trigger the pipeline and watch it pass
- Don't claim "fixed" until the green checkmark exists

**DNS change:**
```bash
dig @8.8.8.8 example.com    # resolves to expected IP
curl https://example.com     # site loads correctly
```

**Proxy/network change:**
```bash
curl -v https://example.com
tail -n 50 /var/log/nginx/error.log  # no new errors
```

## Red Flags — STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Done!", "Fixed!", "Deployed!", etc.)
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "The command exited 0" | Exit code ≠ correct behavior |
| "Agent said success" | Verify independently |
| "The change was small" | Small changes break things too |
| "Partial check is enough" | Partial proves nothing |
| "Different words so rule doesn't apply" | Spirit over letter |

## Key Patterns

**Infra:**
```
✅ [Run terraform show] [Confirm resource matches intent] "Infrastructure applied correctly"
❌ "Apply exited 0, should be good"
```

**Deploy:**
```
✅ [kubectl get pods: all Running] [curl /health: 200] "Deploy successful"
❌ "Kubectl apply succeeded"
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, done"
```

**Agent delegation:**
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state
❌ Trust agent report
```

## The Bottom Line

**No shortcuts for verification.**

Run the command. Read the output. THEN claim the result.

This is non-negotiable.
