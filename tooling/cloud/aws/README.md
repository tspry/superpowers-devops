# AWS Cloud Templates

Base configs and policies for common AWS resources.

## Templates

Example configurations, requiring environment-specific inputs and review:

- `iam-policy.json` — workload-policy example with exact placeholder S3, DynamoDB, and KMS resources; no generic guardrail denies
- `ecs-service.yaml` — ECS Fargate service + task definition (CloudFormation) with awsvpc networking, execution role, and CloudWatch logging
- `lambda.yaml` — Lambda function (CloudFormation) with generated physical names and required artifact, handler, and exact DynamoDB table inputs
- `s3-bucket.yaml` — generated-name S3 bucket with versioning, AES-256 default encryption, public access block, retained resources, and no object-expiration default

## Prerequisites and validation

- **ECS:** supply `ClusterArn`, `ExecutionRoleArn`, `TaskRoleArn`, `LogGroupName`, `SecurityGroupIds` and `SubnetIds` for existing resources. Roles must trust ECS tasks; the execution role needs image-pull/log permissions. Subnets and groups must belong to the same VPC. With public IPs disabled, provide NAT or the required registry/logging endpoints. This example creates no load balancer or ingress path.
- **Lambda:** supply an existing artifact bucket/key in the deployment region, a handler matching the selected runtime/package, and the exact DynamoDB table ARN. The default runtime is Node.js 22; review the [AWS runtime lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) before use. CloudFormation generates the function and role names to avoid global-name collisions and replacement constraints.
- **IAM:** replace the account, region, exact bucket/table names, and placeholder KMS key UUID with real resource ARNs. A KMS alias name is not a key UUID. This workload policy intentionally contains no broad explicit deny; organization guardrails belong in a separately reviewed SCP or permissions-boundary design.
- **S3:** CloudFormation generates the globally unique bucket name. Retained resources and object lifecycle expiry have different data consequences; no object expiration is enabled by default.

Run `bun tests/tooling.mjs` for offline parsed-template checks. This is not full CloudFormation schema validation. With the AWS CLI and authorized credentials, run `aws cloudformation validate-template --template-body file://tooling/cloud/aws/ecs-service.yaml` (and each other CloudFormation file), then create and review a change set in the confirmed account/region. Schema validation does not establish permissions, network reachability or rollout health. Deploy only after approval; verify the service and retain the previous task definition/function version or documented data recovery path.
