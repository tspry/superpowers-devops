# Helm Charts

Base Helm chart templates for Kubernetes workloads.

## Templates

Chart skeleton to customize and validate (not a complete platform deployment):

- `Chart.yaml` — Chart metadata
- `values.yaml` — conservative defaults: ingress disabled, CPU/memory requests, memory limit, probes, and security context
- `templates/deployment.yaml` — Deployment with security context (runAsNonRoot, readOnlyRootFilesystem, drop ALL caps), probes, and configurable resources
- `templates/service.yaml` — ClusterIP Service
- `templates/ingress.yaml` — optional networking.k8s.io/v1 Ingress requiring explicit class, host, and TLS secret
- `templates/serviceaccount.yaml` — dedicated account, created by default
- `templates/_helpers.tpl` — shared names and ServiceAccount selection

Replace the placeholder image, port and probe paths with ones your application actually implements. Confirm non-root/read-only filesystem compatibility. Ingress is disabled by default. Before enabling it, confirm the installed controller and class, DNS ownership, TLS secret source, certificate/issuer owner, and controller-specific annotations; this chart does not install an ingress controller or cert-manager. Add a CPU limit only when workload measurements and platform policy justify one. Namespace, NetworkPolicies and workload RBAC remain environment-specific.

`serviceAccount.create=true` creates the generated or configured name. With `create=false`, supply a nonempty `serviceAccount.name` for an existing dedicated account; otherwise rendering fails. API access remains disabled by default.

Run `python tests/helm.py` with Helm installed for lint and render checks covering disabled/default ingress, explicit TLS ingress, resource defaults, generated/custom/external ServiceAccounts, and invalid inputs. Before deployment, render with your real values, review the diff in the confirmed cluster/namespace, validate policy/schema and obtain approval. Verify rollout and service health afterward; use the previous Helm revision for rollback. Offline rendering does not prove cluster admission or application readiness.
