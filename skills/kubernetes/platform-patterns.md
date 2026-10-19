# Conditional Kubernetes Platform Guidance

Adapted selectively from Lukas Niessen's [KubeShark references](https://github.com/LukasNiessen/kubernetes-skill/tree/34f93c1e409156958cc7c410ab1aa88ab512f10f/references/conditional). Read only when the task names one of these platforms/controllers. This is a checklist of decisions to verify, not a replacement for installed-version documentation or proof of live compatibility.

## EKS / AWS

- Prefer supported EKS Pod Identity or IRSA, explicitly naming which mechanism is in use. Keep ServiceAccount namespace/name stable and use least-privilege workload roles, not static access keys.
- IRSA uses `eks.amazonaws.com/role-arn`; Pod Identity uses an association. Do not conflate them or disable the projected-token flow needed for cloud authentication.
- Match annotations and resource APIs to the installed AWS Load Balancer Controller. Check subnet discovery, IAM, security groups, and private-endpoint/NAT access before inventing ingress settings.
- Check VPC CNI IP capacity and NetworkPolicy enforcement before increasing replicas. EBS is topology-sensitive block storage; EFS supports shared-file use cases. Verify CSI/snapshot support and real StorageClass names.
- With Karpenter, verify installed NodePool/provider-class APIs and disruption settings; resource requests and scheduling constraints must drive capacity decisions.
- Ground version-sensitive choices in [EKS identity guidance](https://docs.aws.amazon.com/eks/latest/best-practices/identity-and-access-management.html) and installed add-on documentation.

## GKE / Google Cloud

- Establish Standard vs Autopilot; confirm restrictions before proposing privileged agents, host access, or DaemonSets.
- Prefer Workload Identity Federation over service-account JSON keys. Preserve namespace/ServiceAccount identity bindings and allow the documented metadata-server egress for the actual dataplane.
- Distinguish GCE Ingress, supported Gateway controllers, NEGs, and health checks; other providers' annotations are not interchangeable.
- Verify Persistent Disk/Filestore CSI access modes and topology. For Config Sync, change Git-owned state through Git.
- Check [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity) and [Dataplane V2](https://cloud.google.com/kubernetes-engine/docs/how-to/dataplane-v2) for the target mode/version.

## AKS / Azure

- Prefer Microsoft Entra Workload ID: verify OIDC/workload-identity enablement, ServiceAccount client-ID annotation, and `azure.workload.identity/use: "true"` pod label. Restart affected pods after identity annotation changes.
- Capture Azure CNI/Overlay and policy engine, outbound connectivity, private DNS, and controller version. Do not mix AGIC/Application Gateway annotations with Nginx settings.
- Use actual Azure Disk/File/Blob CSI classes matching access semantics; Blob mounts are not generic database volumes.
- Consult [AKS Workload ID](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview) and current network migration/support guidance before recommending legacy pod identity or network plugins.

## OpenShift / OKD / ROSA / ARO

- Respect arbitrary namespace-assigned UIDs and restricted-v2 SCC. Images and writable paths must support them; do not hardcode a UID that admission rejects.
- Never modify default SCCs. Any exception needs justification and a narrow dedicated-ServiceAccount grant, not broad `anyuid`/privileged access.
- Choose Route TLS termination explicitly (edge/passthrough/re-encrypt); Ingress annotations do not configure Routes.
- Confirm operator-owned CRDs and installed OLM resources before creating custom resources. Use `oc` admission and SCC authorization checks against the target namespace.
- See [OpenShift SCC guidance](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/authentication_and_authorization/managing-pod-security-policies).

## Argo CD / Flux / Config Sync

- Treat Git as desired state. Emergency imperative changes require an approved reconciliation plan and a matching Git fix. Pin chart versions/artifact digests/revisions.
- Review ownership, destination clusters/namespaces, deletion, prune, and self-heal before enabling automation; handle CRDs before CRs without pruning owned data accidentally.
- Argo sync waves order resources within a sync, not unrelated independent Applications. Keep hooks idempotent and `ignoreDifferences` narrow.
- Flux Kustomization CRs are not `kustomization.yaml` files. Use supported `dependsOn`, timeouts, and bounded Helm remediation; check source references.
- Start with read-only diff/status. Reconcile/sync/prune are changes requiring approval. Roll back the owning Git revision, accounting for data migration compatibility.
- References: [Argo sync ordering](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/), [Flux concepts](https://fluxcd.io/flux/concepts/).

## Prometheus Operator / OpenTelemetry / Loki / Grafana

- Confirm CRDs and their installed versions. ServiceMonitor selects **Services** and named Service ports; PodMonitor selects pods. Prometheus label/namespace selectors must select the monitor; rule selectors must select PrometheusRule.
- Choose Collector deployment mode by signal source. Avoid duplicate singleton/cluster-wide receivers across replicas; configure memory limiting, resources, and narrowly exposed receivers.
- Verify durable log storage and low-cardinality labels. Dashboard discovery labels/RBAC must match the actual Grafana deployment; never put datasource credentials in ConfigMaps.
- Inspect selected targets, generated config, dropped telemetry, and actionable alert behavior. Accepted CRDs are not proof of collection.
- References: [Prometheus Operator design](https://prometheus-operator.dev/docs/getting-started/design/), [OpenTelemetry Collector modes](https://opentelemetry.io/docs/platforms/kubernetes/helm/collector/).
