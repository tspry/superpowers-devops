---
name: cloud-operations
description: Use when working with AWS, GCP, or Azure resource management, permissions, or deployments
---

# Cloud Operations

## Mode Detection

- **Repo mode** — check `tooling/README.md` for shipped AWS examples and prerequisites; generate other cloud configs from the project's conventions.
- **Chat mode** — user pastes cloud error or config. Diagnose and provide corrected config.

## AWS

### Essential debugging commands
```bash
# Check current identity
aws sts get-caller-identity

# List resources
aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId,State.Name,Tags[?Key==`Name`].Value|[0]]' --output table

# CloudWatch logs
aws logs describe-log-groups
aws logs tail /aws/lambda/my-function --follow

# ECS
aws ecs describe-services --cluster my-cluster --services my-service
aws ecs describe-tasks --cluster my-cluster --tasks <task-arn>
```

### Common AWS errors

| Error | Fix |
|---|---|
| `AccessDenied` | Add required action to IAM policy |
| `ThrottlingException` | Implement exponential backoff retry |
| `InvalidClientTokenId` | Check AWS credentials and region config |
| `NoSuchBucket` | Wrong region or bucket name |

### IAM least privilege
Always scope policies to specific resources:
```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
```

## GCP

```bash
# Check current identity
gcloud auth list
gcloud config get-value project

# View logs
gcloud logging read "severity>=ERROR" --limit=50

# GKE
gcloud container clusters get-credentials my-cluster --zone us-central1-a
kubectl get nodes
```

## Azure

```bash
# Check current identity
az account show

# View resources
az resource list --output table

# AKS
az aks get-credentials --resource-group my-rg --name my-cluster
```

## Tooling Templates

- `tooling/cloud/aws/` — IAM, ECS, Lambda, S3 configs
- `tooling/cloud/gcp/` and `tooling/cloud/azure/` — guidance only; no bundled configs
