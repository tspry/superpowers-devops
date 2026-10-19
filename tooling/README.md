# Shipped Tooling Inventory

These are starting points to customize and validate, not a production-readiness guarantee. Skills also cover tools for which no template is shipped. Check the target account, cluster, versions, prerequisites and rollback before deployment.

## Helm chart

- `tooling/containers/helm/Chart.yaml`
- `tooling/containers/helm/values.yaml`
- `tooling/containers/helm/templates/_helpers.tpl`
- `tooling/containers/helm/templates/deployment.yaml`
- `tooling/containers/helm/templates/service.yaml`
- `tooling/containers/helm/templates/ingress.yaml`
- `tooling/containers/helm/templates/serviceaccount.yaml`

See [chart setup and checks](containers/helm/README.md).

## AWS examples

- `tooling/cloud/aws/iam-policy.json`
- `tooling/cloud/aws/ecs-service.yaml`
- `tooling/cloud/aws/lambda.yaml`
- `tooling/cloud/aws/s3-bucket.yaml`

See [AWS prerequisites and validation](cloud/aws/README.md).

## Guidance only — no templates shipped

Dockerfiles, standalone Kubernetes manifests, CI/CD pipelines and starters, Terraform/Ansible/Pulumi modules, GCP/Azure configs, observability stacks, Vault/SOPS/scanner configs, and proxy configs are not bundled. Their directories contain guidance where present; they are not copy sources. Generate from the user's existing configuration and confirmed requirements, or use an explicitly selected maintained upstream project. Do not invent local file paths.

When adding/removing an actual template, update this inventory, the domain README and skill references together. `python tests/reliability.py` checks inventory parity and skill tooling paths.
