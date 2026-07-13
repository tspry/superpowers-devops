# AWS Cloud Templates

Base configs and policies for common AWS resources.

## Templates

Ready-to-use templates (copy and substitute your resource names and regions):

- `iam-policy.json` — Least-privilege IAM policy scoped to specific S3 buckets, DynamoDB tables, and KMS keys with explicit deny on dangerous actions
- `ecs-service.yaml` — ECS Fargate service + task definition (CloudFormation) with awsvpc networking, execution role, and CloudWatch logging
- `lambda.yaml` — Lambda function config (CloudFormation) with IAM role, configurable runtime/handler/memory/timeout, and environment variables
- `s3-bucket.yaml` — S3 bucket with versioning enabled, AES-256 default encryption, public access block, lifecycle rules, and TLS-only bucket policy
