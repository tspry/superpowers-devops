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
| `AccessDenied` | Identify the denied principal, action, resource, and controlling policy layer before changing permissions |
| `ThrottlingException` | Implement exponential backoff retry |
| `InvalidClientTokenId` | Check AWS credentials and region config |
| `NoSuchBucket` | Wrong region or bucket name |

### AWS authorization denials

Do not treat `AccessDenied` as proof that the identity policy needs another action.

1. Preserve the full error and record the caller from `aws sts get-caller-identity`, requested action, resource ARN, account, region, credentials/session, and network path.
2. Distinguish an explicit deny from an implicit deny. Use any policy type named in the error, but do not assume it is the only applicable deny.
3. Evaluate the effective policy layers that apply: identity policy, resource policy, permissions boundary, session policy, Organizations SCP/RCP, VPC endpoint policy, and request conditions. For `sts:AssumeRole`, also inspect the target role trust policy.
4. Check action/resource shape and condition context, including region, tags, organization, source VPC/endpoint, and principal/session ARN.
5. Propose only the narrowest authorized change to the policy layer proven to cause the denial. An SCP or boundary denial is not fixed by broadening the role's identity policy.
6. Re-test with the same principal, session path, region, action, and resource. Use CloudTrail, the policy simulator, or authorization details when available; state when those sources are unavailable.

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
