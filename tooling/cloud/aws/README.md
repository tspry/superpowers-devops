# AWS Cloud Templates

Base configs and policies for common AWS resources.

## Templates

Example configurations, requiring environment-specific inputs and review:

- `iam-policy.json` — Least-privilege IAM policy scoped to specific S3 buckets, DynamoDB tables, and KMS keys with explicit deny on dangerous actions
- `ecs-service.yaml` — ECS Fargate service + task definition (CloudFormation) with awsvpc networking, execution role, and CloudWatch logging
- `lambda.yaml` — Lambda function config (CloudFormation) with IAM role, configurable runtime/handler/memory/timeout, and environment variables
- `s3-bucket.yaml` — S3 bucket with versioning enabled, AES-256 default encryption, public access block, lifecycle rules, and TLS-only bucket policy

## Prerequisites and validation

- **ECS:** supply `ClusterArn`, `ExecutionRoleArn`, `TaskRoleArn`, `LogGroupName`, `SecurityGroupIds` and `SubnetIds` for existing resources. Roles must trust ECS tasks; the execution role needs image-pull/log permissions. Subnets and groups must belong to the same VPC. With public IPs disabled, provide NAT or the required registry/logging endpoints. This example creates no load balancer or ingress path.
- **Lambda:** provide an existing artifact bucket/key in the deployment region and a handler matching the selected runtime/package. The default is Node.js 22; review the [AWS runtime lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) before use. Scope the example DynamoDB policy to real tables.
- **IAM:** replace account, region, bucket/table patterns and the placeholder KMS key UUID with real resource ARNs. A KMS alias name is not a key UUID. Explicit deny statements can override other grants; review before attachment.
- **S3:** choose a globally unique name; retained resources and lifecycle expiry have different data consequences. Review both before deployment.

Run `bun tests/tooling.mjs` for offline parsed-template checks. This is not full CloudFormation schema validation. With the AWS CLI and authorized credentials, run `aws cloudformation validate-template --template-body file://tooling/cloud/aws/ecs-service.yaml` (and each other CloudFormation file), then create and review a change set in the confirmed account/region. Schema validation does not establish permissions, network reachability or rollout health. Deploy only after approval; verify the service and retain the previous task definition/function version or documented data recovery path.
