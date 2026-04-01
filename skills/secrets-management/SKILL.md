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

```bash
# gitleaks — scan for leaked secrets
gitleaks detect --source . --verbose

# truffleHog — scan git history
trufflehog git file://. --only-verified

# Check git history for a specific pattern
git log -p | grep -i "password\|secret\|api_key\|token"
```

**If you find a secret in git history:**
1. Rotate the credential immediately — assume it's compromised
2. Use `git filter-repo` to remove it from history
3. Force-push (coordinate with team first)
4. Add the pattern to `.gitleaks.toml` to prevent recurrence

## SOPS (Secrets OPerationS)

```bash
# Encrypt a file
sops --encrypt secrets.yaml > secrets.enc.yaml

# Decrypt
sops --decrypt secrets.enc.yaml

# Edit encrypted file in-place
sops secrets.enc.yaml
```

## HashiCorp Vault

```bash
# Authenticate
vault login

# Read a secret
vault kv get secret/myapp/database

# Write a secret
vault kv put secret/myapp/database password=mysecret

# List secrets
vault kv list secret/myapp
```

## Kubernetes Secrets

```bash
# Create a secret
kubectl create secret generic db-secret \
  --from-literal=password=mysecret

# Use in a pod (env var)
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: password
```

## Common Mistakes

| Mistake | Prevention |
|---|---|
| Secret in environment variable in CI YAML | Use CI secret store — never write value directly |
| Secret in Docker `ENV` instruction | Use secret mounts (`--secret`) or inject at runtime |
| `.env` file committed to git | Add `.env*` to `.gitignore` before first commit |
| Credentials in Terraform state | Use encrypted remote state |

## Tooling Templates

- `tooling/security/vault/` — Vault policies, auth configs
- `tooling/security/sops/` — .sops.yaml templates
- `tooling/security/scanning/` — gitleaks, truffleHog configs
