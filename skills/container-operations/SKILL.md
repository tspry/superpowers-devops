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
docker build --no-cache -t myapp:1.0.0 .   # diagnose cache correctness; not a routine default
```

**Best practices:**
- Pin base image versions — never use `latest` in production
- Use multi-stage builds when they materially reduce the runtime image or remove build tools
- Add `.dockerignore` to exclude `node_modules`, `.git`, `.env`
- Run as a non-root user when the workload supports it
- Keep one service or responsibility per container. Multiple worker processes are valid when PID 1 forwards signals and reaps children correctly.

### Debugging Containers
```bash
docker logs <container>              # view logs
docker logs <container> --follow     # tail logs
docker exec -it <container> sh       # shell into running container
docker inspect <container>           # full config and state
docker stats                         # live resource usage
```

### Disk pressure and cleanup

Start with `df`, `docker system df -v`, container writable-layer sizes, log-file usage, and volume ownership. Determine what is consuming the filesystem and which team or workload owns it.

Pruning is destructive. Obtain authorization and confirm rollback/retention requirements before deleting stopped containers, images, build cache, or volumes. Plain `docker system prune` does not remove volumes by default; named-volume deletion is a separate explicit action. Verify recovered space and service health after cleanup.

## Kubernetes & Helm — use the `kubernetes` skill

Kubernetes manifests, Helm charts, RBAC, NetworkPolicy, security hardening, and cluster debugging now live in the dedicated [`kubernetes`](../kubernetes/SKILL.md) skill. Invoke it for any K8s or Helm work.

## Tooling Templates

- `tooling/containers/dockerfiles/` — guidance; no base Dockerfiles are bundled
