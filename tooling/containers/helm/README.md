# Helm Charts

Base Helm chart templates for Kubernetes workloads.

## Templates

Ready-to-use templates (copy the chart skeleton and substitute your app name, image, and port):

- `Chart.yaml` — Chart metadata
- `values.yaml` — Sane defaults (image, replicaCount, resources, service, ingress, probes, security context)
- `templates/deployment.yaml` — Deployment with security context (runAsNonRoot, readOnlyRootFilesystem, drop ALL caps), probes, and resource limits
- `templates/service.yaml` — ClusterIP Service
- `templates/ingress.yaml` — networking.k8s.io/v1 Ingress with ingressClassName and TLS

All templates follow the security-hardening baseline from `skills/kubernetes/SKILL.md`: immutable image tags, restricted Pod Security Standards, and never `:latest`.
