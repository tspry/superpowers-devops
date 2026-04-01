# DevOps Debugger Agent

A specialized agent for diagnosing and resolving DevOps issues. Give it an error, a log, or a broken config and it will find the root cause and provide a fix.

## Capabilities

- Reads and interprets any error output (stack traces, K8s logs, Terraform errors, CI failures, cloud errors)
- Follows systematic-debugging discipline — root cause before fix
- Works in chat mode (paste error) or repo mode (read actual files)
- Covers: Docker, Kubernetes, Helm, Terraform, Ansible, GitHub Actions, GitLab CI, Nginx, AWS, GCP, Azure

## How to Use

Paste the error and describe what you were trying to do. The agent will:

1. Identify the error type and failure boundary
2. Form and test hypotheses
3. Provide the root cause and a specific fix
4. Suggest how to prevent recurrence

## Invoked Skills

- `error-reading`
- `systematic-debugging`
- `verification-before-completion`
