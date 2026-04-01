# Secret & Vulnerability Scanning

Config files for secret scanning and vulnerability detection tools.

## Tools

### gitleaks
Scans git repos for leaked secrets.
```bash
gitleaks detect --source . --config .gitleaks.toml
```

### Trivy
Scans container images and filesystems for vulnerabilities.
```bash
trivy image myapp:latest
trivy fs .
```

### truffleHog
Scans git history for secrets.
```bash
trufflehog git file://. --only-verified
```

## Files

- `.gitleaks.toml` — gitleaks config with common allowlist patterns
- `trivy.yaml` — Trivy config with severity thresholds
- `github-actions-scan.yml` — CI workflow that runs all scanners on PR
