# Kubernetes Manifests

Base manifest templates for common K8s resources.

## Available

- `deployment.yaml` — Deployment with resource limits, liveness/readiness probes, non-root security context
- `service.yaml` — ClusterIP and LoadBalancer service templates
- `ingress.yaml` — Ingress with TLS (cert-manager annotation)
- `hpa.yaml` — HorizontalPodAutoscaler template
- `configmap.yaml` — ConfigMap template
- `secret.yaml` — Secret template (reminder: don't commit real values)
- `namespace.yaml` — Namespace with resource quotas

Copy and substitute your app name, image, and port.
