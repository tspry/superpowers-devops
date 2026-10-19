---
name: code-audit
description: Use when reviewing code or a codebase for DevOps readiness, security issues, and missing best practices
---

# Code Audit

Apply checks to the repository's actual role and deployed components. Mark categories not applicable with a reason: a content-only plugin does not need a Dockerfile, deployment pipeline, or IaC just to pass an audit. Separate absent applicable controls from deliberately absent application infrastructure.

## Works In Both Modes

- **Repo mode** — scan actual files in the working directory
- **Chat mode** — audit pasted code snippets or configs

## Audit Categories

Run through each category. Report findings as: **CRITICAL**, **WARNING**, or **INFO**.

---

### 1. Secrets & Security

- [ ] Hardcoded API keys, passwords, tokens, or credentials in code
- [ ] `.env` files committed to git (check `.gitignore`)
- [ ] Secrets passed as plain environment variables in CI configs
- [ ] Insecure base images (e.g., `FROM ubuntu:latest` without pinned version)
- [ ] Running containers as root when not needed
- [ ] World-readable file permissions on sensitive configs

### 2. Container Readiness

- [ ] Dockerfile present
- [ ] `.dockerignore` present (prevents leaking local files into image)
- [ ] Base image pinned to a specific version (not `latest`)
- [ ] Multi-stage build used to minimize final image size
- [ ] Health check defined (`HEALTHCHECK` in Dockerfile or K8s `livenessProbe`)
- [ ] Non-root user defined in Dockerfile

### 3. Kubernetes / Orchestration

- [ ] Resource `requests` and `limits` set for CPU and memory
- [ ] `livenessProbe` and `readinessProbe` defined
- [ ] `replicas` > 1 for production workloads
- [ ] Namespace defined (not running in `default`)
- [ ] Secrets stored in K8s Secrets, not ConfigMaps
- [ ] `imagePullPolicy: Always` for mutable tags

### 4. CI/CD

- [ ] CI config present (`.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`)
- [ ] Tests run in CI before deploy
- [ ] Linting/formatting check in CI
- [ ] Secrets injected via CI secret store, not hardcoded
- [ ] Deployment gated on test pass

### 5. Infrastructure as Code

- [ ] IaC files present (Terraform, Ansible, Pulumi, etc.)
- [ ] State backend configured (not local state for production)
- [ ] Variables used instead of hardcoded values
- [ ] Least-privilege IAM/RBAC roles
- [ ] Resource tagging for cost tracking

### 6. Observability

- [ ] Application logs written to stdout/stderr (not to files inside container)
- [ ] Structured logging (JSON preferred)
- [ ] Health check endpoint exposed (`/health`, `/ready`)
- [ ] Metrics endpoint exposed if applicable (`/metrics`)

---

## Reporting Format

For each finding:

```
[SEVERITY] Category — Description
  File: path/to/file (or "pasted code")
  Why it matters: ...
  Fix: ...
```

End with a summary count: X critical, Y warnings, Z info items.
