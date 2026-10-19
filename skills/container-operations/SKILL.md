---
name: container-operations
description: Use when working with Docker — building images, writing Dockerfiles, debugging container issues
---

# Container Operations

## Mode Detection

- **Repo mode** — inspect existing Dockerfiles and the runtime. `tooling/containers/dockerfiles/` contains guidance only; generate and validate the actual Dockerfile for this project.
- **Chat mode** — user pastes configs, error logs, or `kubectl` output. Provide inline guidance.

## Docker

### Building Images
```bash
docker build -t myapp:1.0.0 .
docker build --no-cache -t myapp:1.0.0 .   # force fresh build
```

**Best practices:**
- Pin base image versions — never use `latest` in production
- Use multi-stage builds to keep production images small
- Add `.dockerignore` to exclude `node_modules`, `.git`, `.env`
- Run as non-root user
- One process per container

### Debugging Containers
```bash
docker logs <container>              # view logs
docker logs <container> --follow     # tail logs
docker exec -it <container> sh       # shell into running container
docker inspect <container>           # full config and state
docker stats                         # live resource usage
```

## Kubernetes & Helm — use the `kubernetes` skill

Kubernetes manifests, Helm charts, RBAC, NetworkPolicy, security hardening, and cluster debugging now live in the dedicated [`kubernetes`](../kubernetes/SKILL.md) skill. Invoke it for any K8s or Helm work.

## Tooling Templates

- `tooling/containers/dockerfiles/` — guidance; no base Dockerfiles are bundled
