---
name: container-operations
description: Use when working with Docker, Kubernetes, or Helm — builds, deployments, debugging container issues
---

# Container Operations

## Mode Detection

- **Repo mode** — templates in `tooling/containers/`. Scaffold Dockerfiles, K8s manifests, Helm charts.
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

## Kubernetes

### Deploying
```bash
kubectl apply -f deployment.yaml
kubectl rollout status deployment/<name>
kubectl rollout undo deployment/<name>   # rollback
```

### Debugging Pods
```bash
kubectl get pods                          # list pods and status
kubectl describe pod <pod-name>           # detailed events and config
kubectl logs <pod-name>                   # current logs
kubectl logs <pod-name> --previous        # logs from crashed container
kubectl exec -it <pod-name> -- sh         # shell into pod
kubectl get events --sort-by=.lastTimestamp  # cluster events
```

### Common K8s Issues

| Symptom | Command to run |
|---|---|
| Pod stuck in Pending | `kubectl describe pod <pod>` → check Events |
| CrashLoopBackOff | `kubectl logs <pod> --previous` |
| OOMKilled | Check `resources.limits.memory` — increase or fix leak |
| Service not reachable | Check selector labels match pod labels |
| Image not pulling | Check image name, tag, and `imagePullSecret` |

## Helm

```bash
helm install <release> <chart>            # install
helm upgrade <release> <chart>            # upgrade
helm rollback <release> <revision>        # rollback
helm list                                  # list releases
helm status <release>                      # release status
```

## Tooling Templates

- `tooling/containers/dockerfiles/` — base Dockerfiles by runtime
- `tooling/containers/kubernetes/` — Deployment, Service, Ingress manifests
- `tooling/containers/helm/` — Helm chart templates
- `tooling/containers/starters/` — full app stacks
