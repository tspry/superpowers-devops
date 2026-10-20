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
| `no space left on device` | Capacity exhausted somewhere in the storage path — inspect filesystem, Docker object usage, container writable layers, and logs before authorized cleanup |
| `port is already allocated` | Port conflict — find and stop the other process |
| `exec format error` | Wrong architecture (e.g., ARM image on AMD64) |

### Nginx / Proxy
| Error | Meaning |
|---|---|
| `502 Bad Gateway` | Upstream is down or not responding |
| `503 Service Unavailable` | No healthy upstream servers |
| `504 Gateway Timeout` | A configured request deadline expired — identify whether time was spent in DNS, connect, TLS, queueing, application code, a dependency, or response reads |
| `upstream connect error` | Wrong upstream address, port, or firewall blocking |

### Terraform
| Error | Meaning |
|---|---|
| `Error acquiring the state lock` | Another process holds the lock — check for stuck runs |
| `ResourceAlreadyExists` | The remote object already exists — establish its owner and state before deciding whether import is correct |
| `UnauthorizedOperation` | Authorization failed — identify the principal, action, resource, conditions, and controlling policy layer |
| `InvalidInstanceType` | Instance type not available in that region |

### AWS
| Error | Meaning |
|---|---|
| `AccessDenied` | Authorization failed — distinguish explicit/implicit denial and evaluate every applicable policy layer before changing permissions |
| `ThrottlingException` | API rate limit — add retry logic with backoff |
| `InvalidClientTokenId` | Wrong AWS credentials or region |

Quick-reference entries classify evidence; they do not authorize a fix. Do not jump from disk pressure to pruning, an existing object to import, a timeout to a larger timeout, or an authorization error to broader permissions.

### GitHub Actions
| Error | Meaning |
|---|---|
| `Process completed with exit code 1` | A step failed — read that step's logs |
| `Context access might be invalid` | Wrong secret name or env var reference |
| `Resource not accessible by integration` | Missing permissions in workflow YAML |
