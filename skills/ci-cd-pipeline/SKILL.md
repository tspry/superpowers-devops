---
name: ci-cd-pipeline
description: Use when designing, debugging, or fixing CI/CD pipelines — GitHub Actions, GitLab CI, Jenkins
---

# CI/CD Pipeline

## Mode Detection

- **Repo mode** — templates in `tooling/ci/`. Scaffold or modify pipeline configs.
- **Chat mode** — user pastes pipeline config or failure logs. Diagnose and provide corrected config.

## Pipeline Design Principles

1. **Fast feedback** — lint and test before build; build before deploy
2. **Fail fast** — stop the pipeline at the first failure
3. **Secrets via secret store** — never hardcode credentials
4. **Idempotent deploys** — running the same deploy twice should be safe
5. **Gate production** — require passing tests before any production deploy

## Standard Pipeline Stages

```
lint → test → build → push image → deploy staging → smoke test → deploy production
```

## GitHub Actions

### Debugging failures
```bash
# Enable debug logging by setting repository secret:
ACTIONS_STEP_DEBUG = true
ACTIONS_RUNNER_DEBUG = true
```

**Common issues:**
| Issue | Fix |
|---|---|
| `Context access might be invalid` | Check secret/var name spelling |
| `Resource not accessible by integration` | Add `permissions:` block to workflow |
| `Process completed with exit code 1` | Read that step's full log output |
| Workflow not triggering | Check `on:` trigger matches branch/event |

### Useful patterns
```yaml
# Run only on main branch
on:
  push:
    branches: [main]

# Matrix builds
strategy:
  matrix:
    node-version: [18, 20, 22]

# Reuse secrets
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## GitLab CI

**Common issues:**
| Issue | Fix |
|---|---|
| Job stuck in pending | Check runner availability and tags |
| `artifacts` not found in later stage | Define `artifacts:` in the producing job |
| Cache not working | Check `cache: key` is consistent |

## Jenkins

**Common issues:**
| Issue | Fix |
|---|---|
| Build never starts | Check agent availability and labels |
| Credentials not found | Verify credential ID in Jenkins credentials store |
| Workspace dirty | Add `cleanWs()` at start of pipeline |

## Tooling Templates

- `tooling/ci/github-actions/` — reusable workflow templates
- `tooling/ci/gitlab-ci/` — .gitlab-ci.yml templates
- `tooling/ci/jenkins/` — Jenkinsfile templates
- `tooling/ci/starters/` — full CI/CD setups by stack
