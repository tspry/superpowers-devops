---
name: kubernetes
description: Use when working with Kubernetes or Helm — authoring, reviewing, hardening, or debugging manifests, Deployments, Services, Ingress, RBAC, NetworkPolicy, or cluster operations
---

# Kubernetes

LLMs hallucinate constantly with Kubernetes: missing security contexts, deprecated `apiVersion`s, wildcard RBAC, forgotten resource limits, and probes that cause cascading failures. This skill forces a **failure-mode-first workflow** so you diagnose before you generate, default to secure and reliable manifests, and validate before you finalize.

Adapted from the KubeShark approach (failure-mode workflow + security defaults + good/bad examples), tuned for this plugin's dual-mode operation.

## Mode Detection

- **Repo mode** — templates in `tooling/containers/kubernetes/` and `tooling/containers/helm/`. Scaffold real manifests, Helm charts, Kustomize overlays, RBAC, and policies.
- **Chat mode** — user pastes manifests, `kubectl` output, or error logs. Provide inline guidance and copy-paste-ready fixes.

## The Failure-Mode Workflow

Run this top to bottom for every Kubernetes task:

1. **Capture execution context** — cluster version/distribution, namespace, environment criticality, workload type, deployment method (raw YAML / Helm / Kustomize), and policy enforcement (PSA / Kyverno / OPA). If unknown, state assumptions explicitly.
2. **Diagnose likely failure mode(s)** — pick from the six core failure modes below based on intent and risk.
3. **Load relevant guidance** — apply the matching failure-mode guidance plus the security defaults and do/don't checklist. Pull platform-specific detail (EKS/GKE/AKS/OpenShift, GitOps, observability) only when that signal is present.
4. **Propose the fix path with controls** — for each change, state why it addresses the failure mode, what could still go wrong at deploy/runtime, and the guardrails (validation commands, policy checks, rollback path).
5. **Generate the artifacts** — manifests, Helm values/templates, Kustomize overlays, NetworkPolicies, RBAC, PDBs, policy rules.
6. **Validate before finalize** — `kubectl apply --dry-run=server` or `kubectl diff`; `kubeconform` schema validation; cross-resource consistency (label/selector/port alignment); policy scan. **Never recommend a direct production apply without a reviewed diff and approval.**
7. **Deliver the output contract** — assumptions and cluster version floor, selected failure mode(s), chosen remediation and tradeoffs, validation/test plan, and rollback/recovery notes (`kubectl rollout undo`, revision history, data safety).

## The 6 Core Failure Modes

| # | Failure mode | What it catches |
|---|---|---|
| 1 | **Insecure workload defaults** | Missing security contexts, PSS violations, container runs as root, host access |
| 2 | **Resource starvation** | Missing requests/limits, no PDB, BestEffort QoS, scheduling chaos |
| 3 | **Network exposure** | Flat networking (no NetworkPolicy), wrong Service types, silent selector mismatches |
| 4 | **Privilege sprawl** | Over-permissive RBAC, `cluster-admin` on workload SAs, leaked secrets |
| 5 | **Fragile rollouts** | Probes on external deps, mutable `:latest` tags, unsafe update strategies |
| 6 | **API drift** | Removed `apiVersion`s (`extensions/v1beta1`, `policy/v1beta1`, `autoscaling/v2beta1`), schema violations |

## Security Defaults (baseline posture)

Default to the Pod Security Standards **restricted** profile unless the user explicitly requests otherwise with justification. Apply these to every workload:

- `runAsNonRoot: true` with explicit `runAsUser`/`runAsGroup`/`fsGroup` (non-zero, e.g. `65534`) at pod level
- `allowPrivilegeEscalation: false` on every container (including init containers)
- `capabilities.drop: ["ALL"]` on every container — add back only specific caps if justified
- `seccompProfile.type: RuntimeDefault` at pod level
- `readOnlyRootFilesystem: true` on every container — mount writable paths as `emptyDir`
- `automountServiceAccountToken: false` unless the workload calls the Kubernetes API
- Never `privileged: true` for application workloads; never `hostNetwork`/`hostPID`/`hostIPC`
- Dedicated ServiceAccount per workload — never the `default` SA
- Namespace-scoped `Role` + `RoleBinding`, explicit verbs only, no `*` wildcards, no `cluster-admin` for workloads
- Default-deny `NetworkPolicy` in every namespace; allow only what is needed, always include DNS egress
- Secrets never in ConfigMaps or env vars; mount as files; prefer ExternalSecrets/Sealed Secrets
- Immutable image tags (`v1.2.3`) or digests (`@sha256:...`) — never `:latest`
- Workloads never in `default`, `kube-system`, or `kube-public`; label every namespace `pod-security.kubernetes.io/enforce: restricted`

**Init-container deviation path:** document the reason, set `runAsNonRoot: false` + `runAsUser: 0`, add only the specific capability needed (e.g. `CHOWN`), keep `allowPrivilegeEscalation: false` and `readOnlyRootFilesystem: true`.

## Do / Don't Checklist

- DO set `runAsNonRoot`, `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, `capabilities.drop: ["ALL"]`, `seccompProfile: RuntimeDefault` on every workload.
- DO set `requests` (CPU + memory) and `limits.memory` on every container; leave CPU limits unset or generous to avoid CFS throttling.
- DO set a readiness probe on every serving container and a liveness probe that checks **only the process's own health** (never external deps).
- DO use `networking.k8s.io/v1` for Ingress/NetworkPolicy and `ingressClassName` (not the deprecated `kubernetes.io/ingress.class` annotation).
- DO use namespace-scoped RBAC with explicit verbs/resources; set `automountServiceAccountToken: false` on API-unaware pods.
- DO verify label/selector/port chains line up across Deployment → Service → Ingress.
- DON'T use `:latest` or omit the image tag (implicitly `:latest`).
- DON'T bind `cluster-admin` or use `ClusterRoleBinding` when `RoleBinding` suffices; don't grant `*` verbs/resources.
- DON'T expose Services as `type: LoadBalancer`/`NodePort` without cost/security justification and firewall rules.
- DON'T assume namespace isolation gives network isolation — it does not without NetworkPolicies.
- DON'T use `hostPath` volumes or `ReadWriteMany` with block storage classes in production.
- DON'T commit raw Secret manifests or embed credentials in ConfigMaps.

## Good vs Bad Examples

### 1. Deployment securityContext

**GOOD** — full pod + container security context, immutable image, probes, resources:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: my-app
  labels:
    app.kubernetes.io/name: api-server
spec:
  replicas: 3
  revisionHistoryLimit: 5
  selector:
    matchLabels:
      app.kubernetes.io/name: api-server
  template:
    metadata:
      labels:
        app.kubernetes.io/name: api-server
    spec:
      automountServiceAccountToken: false
      securityContext:
        runAsNonRoot: true
        runAsUser: 65534
        runAsGroup: 65534
        fsGroup: 65534
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: api-server
          image: ghcr.io/org/api-server:v1.4.2
          imagePullPolicy: IfNotPresent
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              memory: 256Mi
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 15
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
```
**BAD** — no security context, no resources, no probes, `:latest` tag, no namespace:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:latest
          ports:
            - containerPort: 8080
```
**Why it fails:** runs as root with all capabilities, no resource bounds (BestEffort QoS, first to be evicted), no probes (health undetectable), mutable `:latest` (breaks rollback), and no namespace (deploy location undefined).

### 2. Probes — liveness must not depend on external services

**GOOD** — liveness checks only process health; readiness may check dependencies:
```yaml
livenessProbe:
  httpGet:
    path: /healthz        # process health only
    port: 8080
  periodSeconds: 15
  failureThreshold: 3
readinessProbe:
  httpGet:
    path: /ready          # may check DB dependency
    port: 8080
  periodSeconds: 5
  failureThreshold: 2
```
**BAD** — liveness probes an external database:
```yaml
livenessProbe:
  exec:
    command: ["/bin/sh", "-c", "pg_isready -h postgres.db.svc -p 5432"]
  periodSeconds: 10
  failureThreshold: 3
```
**Why it fails:** a brief DB blip fails liveness on **all** pods at once → kubelet restarts everything → thundering herd reconnects → DB overloads further → cascading crash loop.

### 3. RBAC / ServiceAccount

**GOOD** — namespace-scoped Role, explicit verbs, dedicated SA, token not automounted:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ci-deployer
  namespace: my-app
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: ci-deployer
  namespace: my-app
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch", "patch", "update"]
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list", "create", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: ci-deployer
  namespace: my-app
subjects:
  - kind: ServiceAccount
    name: ci-deployer
    namespace: my-app
roleRef:
  kind: Role
  name: ci-deployer
  apiGroup: rbac.authorization.k8s.io
```
**BAD** — `cluster-admin` ClusterRoleBinding to the `default` SA:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: my-app-admin
subjects:
  - kind: ServiceAccount
    name: default
    namespace: my-app
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```
**Why it fails:** `cluster-admin` grants unrestricted access to every resource in every namespace. A compromised pod owns the entire cluster, and the `default` SA is shared by every pod in the namespace.

### 4. NetworkPolicy — default-deny + explicit allow with DNS egress

**GOOD:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: my-app
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-traffic
  namespace: my-app
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: api-server
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector: {}
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
```
**BAD** — `NodePort` Service with no NetworkPolicy and a possibly-wrong selector:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-server
spec:
  type: NodePort            # exposed on every node IP, no access control
  selector:
    app: api                # may not match pod label app.kubernetes.io/name: api-server
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080
```
**Why it fails:** Kubernetes has flat networking by default — without a NetworkPolicy every pod can reach every other pod. `NodePort` exposes the service on every node without TLS. A selector that doesn't match pod labels causes a silent zero-endpoint failure.

### 5. Image tags and apiVersion correctness

**GOOD** — immutable tag + current `apiVersion`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: nginx
  tls:
    - hosts: ["app.example.com"]
      secretName: app-tls-cert
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-server
                port:
                  number: 8080
```
**BAD** — removed `apiVersion` + deprecated annotation + old backend syntax:
```yaml
apiVersion: extensions/v1beta1    # REMOVED in k8s 1.22
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    kubernetes.io/ingress.class: nginx   # replaced by spec.ingressClassName
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            # missing pathType (required in networking.k8s.io/v1)
            backend:
              serviceName: frontend       # old flat format
              servicePort: 80
```
**Why it fails:** `extensions/v1beta1` Ingress was removed in Kubernetes 1.22 — the API server rejects the manifest. The annotation is deprecated, `pathType` is required in v1, and the old `serviceName`/`servicePort` backend format is unrecognized.

## Validation Step

Before finalizing any output, validate according to deployment method and risk:

**Schema validation**
```bash
kubectl apply --dry-run=server -f manifest.yaml          # catches CRDs, webhooks, unknown fields
kubectl apply --dry-run=client -f manifest.yaml          # no cluster needed
kubeconform -strict -kubernetes-version 1.30.0 manifest.yaml
helm template my-release ./chart | kubeconform -kubernetes-version 1.30.0 -strict
kustomize build overlays/production | kubeconform -kubernetes-version 1.30.0 -strict
```

**Cross-resource consistency**
- Service `spec.selector` must exactly match pod template `metadata.labels` — confirm with `kubectl get endpoints <svc>` (non-zero endpoints).
- Port chain: Service `port` → `targetPort` → container `containerPort` must align.
- Ingress backend service name/port must match an existing Service.
- HPA `minReplicas` must be >= PDB `minAvailable`.
- In a NetworkPolicy `from` entry, `namespaceSelector` + `podSelector` = AND; separate entries = OR.

**Policy scan**
```bash
kubesec scan manifest.yaml          # security context issues
pluto detect-files -d manifests/    # deprecated/removed apiVersions
```

**Runtime verification (post-apply)**
```bash
kubectl rollout status deployment/my-app -n my-app
kubectl get endpoints my-app -n my-app
kubectl get pod <pod> -n my-app -o jsonpath='{.status.qosClass}'
kubectl auth can-i --list --as=system:serviceaccount:my-app:my-sa -n my-app
```

**Hard rule:** never recommend a direct production apply without a reviewed diff and approval. Always `kubectl diff` or `--dry-run=server` first, and always provide a rollback path (`kubectl rollout undo`, revision history, data-safety notes).

## Tooling Templates

- `tooling/containers/kubernetes/` — Deployment, Service, Ingress, NetworkPolicy, RBAC manifests
- `tooling/containers/helm/` — Helm chart templates and values
- `tooling/containers/dockerfiles/` — base images (see `container-operations` for Docker)

## Red Flags (you are rationalizing — stop)

| Thought | Reality |
|---|---|
| "Kubernetes accepts most YAML, I'll just apply it" | Silent runtime failures are the norm — validate before apply. |
| "This is a simple Deployment" | Simple manifests still need security context, resources, and probes. |
| "`:latest` is fine for dev" | Mutable tags break rollback and cause inconsistent replicas. |
| "The default SA is fine" | Dedicated SA + least-privilege RBAC is the baseline. |
| "NetworkPolicy is optional" | Flat networking means every pod can reach every pod. |
| "I'll skip the dry-run" | `--dry-run=server` / `kubectl diff` is the cheapest safety check. |
