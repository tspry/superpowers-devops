---
name: verification-before-completion
description: Use before declaring any work complete — run verification commands and confirm output before making any success claims
---

# Verification Before Completion

## The Rule

```
EVIDENCE BEFORE ASSERTIONS
```

Do not say "done", "fixed", "deployed", or "working" until you have run verification commands and confirmed the output.

## Verification Checklist

Before declaring any DevOps task complete:

- [ ] The resource/service exists and is in the expected state
- [ ] Health checks are passing
- [ ] Logs show no new errors introduced by the change
- [ ] The original problem is actually resolved (not just "the command ran")
- [ ] Rollback procedure is documented if applicable

## Verification by Task Type

**Infrastructure apply:**
```bash
terraform show          # confirm state matches intent
# or test the actual resource in the cloud console/CLI
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
curl -v https://example.com  # correct response, no errors
tail -n 50 /var/log/nginx/error.log  # no new errors
```

## What NOT to do

- Do not say "this should work" without testing it
- Do not claim success based on a command exiting 0 without checking what it did
- Do not skip verification because the change "was small"
