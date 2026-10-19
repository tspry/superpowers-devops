# Secret & Vulnerability Scanning Guidance

No scanner configuration files or CI workflows are shipped here. Use an installed scanner's defaults or an existing project config, not a nonexistent bundled config.

```bash
# Redact findings; do not paste raw credentials into chat or logs.
gitleaks git . --redact
# Substitute an actual immutable image tag or digest.
trivy image myapp:1.0.0
```

Scanner command syntax varies by version; check the installed tool's help. See the `secrets-management` skill for handling findings and the [shipped inventory](../../README.md).
