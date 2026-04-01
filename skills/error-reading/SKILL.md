---
name: error-reading
description: Use when the user pastes any error output, stack trace, log, or failure message — structured interpretation before diagnosis
---

# Error Reading

## Works In Both Modes

This skill works entirely from pasted content. No local files needed.

## Process

### Step 1 — Identify the error type

Classify what you're looking at:
- **Stack trace** (application crash — Python, Node, Java, Go, etc.)
- **Build/compile failure** (CI, Docker build, npm/pip/cargo error)
- **K8s/container error** (CrashLoopBackOff, OOMKilled, ImagePullBackOff, etc.)
- **Infrastructure error** (Terraform, Ansible, Pulumi)
- **Cloud provider error** (AWS, GCP, Azure API error codes)
- **Network/proxy error** (502, 503, 504, connection refused, timeout)
- **CI pipeline failure** (GitHub Actions, GitLab CI, Jenkins)

### Step 2 — Read the full output

Never stop at the first error line. Scan for:
- The **actual root error** (often buried after a chain of caused-by lines)
- The **line number or resource** where it originated
- Any **preceding warnings** that hint at the cause

### Step 3 — Extract key facts

State clearly:
- What failed
- Where it failed (service, file, line, resource)
- What the error code or message means
- What it implies about the root cause

### Step 4 — Hand off to systematic-debugging

Error reading identifies the problem. Systematic debugging finds the root cause and fixes it. After reading the error, invoke `systematic-debugging` if a fix is needed.

## Quick Reference: Common Errors

### Kubernetes
| Error | Meaning |
|---|---|
| `CrashLoopBackOff` | Container keeps crashing on start — check `kubectl logs --previous` |
| `OOMKilled` | Container exceeded memory limit |
| `ImagePullBackOff` | Can't pull the image — wrong name, tag, or registry auth |
| `Pending` | No node has enough resources or matching node selector |
| `CreateContainerConfigError` | Bad env var, missing secret or configmap |

### Docker
| Error | Meaning |
|---|---|
| `no space left on device` | Disk full — run `docker system prune` |
| `port is already allocated` | Port conflict — find and stop the other process |
| `exec format error` | Wrong architecture (e.g., ARM image on AMD64) |

### Nginx / Proxy
| Error | Meaning |
|---|---|
| `502 Bad Gateway` | Upstream is down or not responding |
| `503 Service Unavailable` | No healthy upstream servers |
| `504 Gateway Timeout` | Upstream took too long — check `proxy_read_timeout` |
| `upstream connect error` | Wrong upstream address, port, or firewall blocking |

### Terraform
| Error | Meaning |
|---|---|
| `Error acquiring the state lock` | Another process holds the lock — check for stuck runs |
| `ResourceAlreadyExists` | Resource exists outside Terraform state — import it |
| `UnauthorizedOperation` | IAM permissions missing |
| `InvalidInstanceType` | Instance type not available in that region |

### AWS
| Error | Meaning |
|---|---|
| `AccessDenied` | IAM policy missing required action |
| `ThrottlingException` | API rate limit — add retry logic with backoff |
| `InvalidClientTokenId` | Wrong AWS credentials or region |

### GitHub Actions
| Error | Meaning |
|---|---|
| `Process completed with exit code 1` | A step failed — read that step's logs |
| `Context access might be invalid` | Wrong secret name or env var reference |
| `Resource not accessible by integration` | Missing permissions in workflow YAML |
