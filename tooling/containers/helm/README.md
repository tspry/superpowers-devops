# Helm Charts

Base Helm chart templates for Kubernetes workloads.

## Templates

Chart skeleton to customize and validate (not a complete platform deployment):

- `Chart.yaml` — Chart metadata
- `values.yaml` — Sane defaults (image, replicaCount, resources, service, ingress, probes, security context)
- `templates/deployment.yaml` — Deployment with security context (runAsNonRoot, readOnlyRootFilesystem, drop ALL caps), probes, and resource limits
- `templates/service.yaml` — ClusterIP Service
- `templates/ingress.yaml` — networking.k8s.io/v1 Ingress with ingressClassName and TLS
- `templates/serviceaccount.yaml` — dedicated account, created by default
- `templates/_helpers.tpl` — shared names and ServiceAccount selection

Replace the placeholder image, port and probe paths with ones your application actually implements. Confirm non-root/read-only filesystem compatibility. Set the ingress class, DNS, TLS secret and issuer for your environment, or disable ingress. Ingress controller, cert-manager, namespace, NetworkPolicies and RBAC are not installed by this skeleton.

`serviceAccount.create=true` creates the generated or configured name. With `create=false`, supply a nonempty `serviceAccount.name` for an existing dedicated account; otherwise rendering fails. API access remains disabled by default.

Run `python tests/helm.py` with Helm installed for lint and render checks covering generated, custom and externally managed accounts. Before deployment, render with your real values, review the diff in the confirmed cluster/namespace, validate policy/schema and obtain approval. Verify rollout and service health afterward; use the previous Helm revision for rollback. Offline rendering does not prove cluster admission or application readiness.
