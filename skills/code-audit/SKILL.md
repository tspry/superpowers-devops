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

### 2. Container Readiness — when a container image is shipped

- [ ] Dockerfile and `.dockerignore` match the actual build context
- [ ] Base image is pinned according to the project's update policy; production does not rely on `latest`
- [ ] Build tools and development dependencies are absent from the runtime image; use multi-stage builds when that is the simplest way to achieve this
- [ ] PID 1 forwards termination signals and reaps children; multiple worker processes are not automatically a defect
- [ ] Runtime user and filesystem permissions match workload requirements; avoid root when it is not required
- [ ] Health checks exist only where the runtime or orchestrator consumes them, and test behavior the process can recover from

### 3. Kubernetes / Orchestration — when workloads are deployed there

- [ ] Workload kind and scaling model match the role: serving Deployment, singleton, worker, StatefulSet, Job, or CronJob
- [ ] Resource requests are based on scheduling needs; memory limits and any CPU limits reflect measured workload/platform policy rather than a universal default
- [ ] Serving containers have readiness probes; liveness is limited to recoverable process failures and startup probes protect slow initialization
- [ ] Availability and replica findings apply only to long-running workloads that can run concurrently; do not require `replicas > 1` for Jobs, CronJobs, or intentional singletons
- [ ] Namespace, service account, RBAC, selectors, ports, and controller ownership are explicit where applicable
- [ ] Kubernetes Secrets are only base64-encoded API objects; verify encryption at rest, access controls, delivery, and external secret management requirements
- [ ] Images use immutable digests or registry-enforced immutable tags. `imagePullPolicy: Always` does not make a mutable tag immutable

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
