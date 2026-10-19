---
name: secrets-management
description: Use when working with Vault, SOPS, secret scanning, or managing credentials safely
---

# Secrets Management

## The Rule

```
SECRETS NEVER GO IN CODE, CONFIGS, OR GIT HISTORY
```

## Mode Detection

- **Repo mode** — can scan for leaked secrets, set up SOPS, configure Vault integration.
- **Chat mode** — user pastes config with potential secrets. Flag issues, provide safe alternatives.

## Secret Scanning

Confirm the repository and target environment. Keep values out of chat, logs, shell tracing, command arguments, and reports. Report location, secret type, and rotation status with redacted evidence; never reproduce a detected credential. Obtain authorization for writes, rotation, or history rewrites and plan recovery for consumers.

```bash
# gitleaks — redact matches, including history findings (current CLI)
gitleaks git . --redact
```

Check the installed scanner's CLI and redaction support first. Avoid raw `git log -p`, `env`, or unredacted scanner output when investigating credentials.

**If you find a secret in git history:**
1. Rotate the credential immediately — assume it's compromised
2. Identify affected consumers, rotate/revoke safely, and verify the replacement without printing it
3. Propose a coordinated `git filter-repo` history rewrite only when needed and explicitly approved; account for forks, clones, and protected branches before any force-push
4. Enable secret scanning and ignored local secret paths; custom scanner patterns supplement built-in detectors, not allowlist the leak

## SOPS (Secrets OPerationS)

```bash
# Local plaintext input must be ignored, permission-restricted, and never logged
umask 077
sops --encrypt secrets.yaml > secrets.enc.yaml

# Decrypt to a protected, ignored file only when required, not stdout/chat
sops --decrypt secrets.enc.yaml > .secrets.local.yaml

# Edit encrypted file in-place
sops secrets.enc.yaml
```

## HashiCorp Vault

```bash
# Authenticate using the approved method without printing the resulting token
vault login -no-print

# Inspect metadata without fetching secret values (KV v2 mount)
vault kv metadata get secret/myapp/database

# Approved write from a permission-restricted, ignored JSON file; no values in argv
vault kv put secret/myapp/database @/secure/path/database.json

# List secrets
vault kv list secret/myapp
```

## Kubernetes Secrets

```bash
# After context/namespace and change approval; input file is protected and ignored
kubectl --context <context> -n <namespace> create secret generic db-secret \
  --from-file=password=/secure/path/password
```

Prefer an approved external secret integration and file mounts. Kubernetes Secret data is base64, not encryption; enforce RBAC and encryption at rest. A pod-spec fragment (merge `volumeMounts` into the real application container):

```yaml
volumes:
  - name: database-secret
    secret:
      secretName: db-secret
      defaultMode: 0440
containers:
  - name: app
    volumeMounts:
      - name: database-secret
        mountPath: /run/secrets/database
        readOnly: true
```

Set ownership/group permissions for the application's non-root UID; verify the mount is readable without printing its contents. Avoid `subPath` when live secret-volume updates are required. Environment injection is a documented compatibility exception for apps that cannot read files; it requires restart on rotation and must never be logged. Remove transient plaintext files according to local policy after use.

## Common Mistakes

| Mistake | Prevention |
|---|---|
| Secret in environment variable in CI YAML | Use CI secret store — never write value directly |
| Secret in Docker `ENV` instruction | Use secret mounts (`--secret`) or inject at runtime |
| `.env` file committed to git | Add `.env*` to `.gitignore` before first commit |
| Credentials in Terraform state | Use encrypted remote state |

## Tooling Templates

- `tooling/security/scanning/` — guidance only. Vault policies, SOPS configs, and scanner configs are not bundled.
