// Bun's built-in YAML parser; no package dependencies. These are invariant checks,
// not CloudFormation schema validation, admission testing, or live deployments.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
// Preserve !Ref semantics in this repository's simple CFN fixtures. Other YAML
// tags are parsed as values by Bun; no claim is made about their evaluation.
const parse = text => Bun.YAML.parse(text.replace(/!Ref ([\w:]+)/g, '{Ref: $1}'));
const yamlBlock = (markdown, heading) => {
  const text = markdown.replace(/\r\n?/g, '\n');
  const start = text.indexOf(heading);
  assert.notEqual(start, -1, `missing Markdown section: ${heading}`);
  const bodyStart = start + heading.length;
  const nextHeading = text.indexOf('\n### ', bodyStart);
  const section = text.slice(bodyStart, nextHeading === -1 ? undefined : nextHeading);
  const match = section.match(/```yaml[ \t]*\n([\s\S]*?)```/);
  assert.ok(match, `missing YAML block in Markdown section: ${heading}`);
  return match[1];
};
const crlfFixture = [
  '### Named example',
  '',
  '```yaml',
  'kind: ConfigMap',
  '```',
  '',
  '### Next example',
  '',
  '```yaml',
  'kind: Secret',
  '```'
].join('\r\n');
assert.equal(yamlBlock(crlfFixture, '### Named example').trim(), 'kind: ConfigMap');
assert.throws(() => yamlBlock(crlfFixture, '### Missing example'), /missing Markdown section/);
assert.throws(() => yamlBlock('### Named example\r\n\r\nNo fixture', '### Named example'), /missing YAML block/);
const chart = parse(read('tooling/containers/helm/Chart.yaml'));
assert.equal(chart.annotations['superpowers-devops.io/artifact-status'], 'example');

const ecs = parse(read('tooling/cloud/aws/ecs-service.yaml'));
assert.equal(ecs.Metadata.ArtifactStatus, 'Example');
const network = ecs.Resources.Service.Properties.NetworkConfiguration.AwsvpcConfiguration;
for (const [property, parameter, type] of [
  ['SecurityGroups', 'SecurityGroupIds', 'List<AWS::EC2::SecurityGroup::Id>'],
  ['Subnets', 'SubnetIds', 'List<AWS::EC2::Subnet::Id>']
]) {
  assert.deepEqual(network[property], { Ref: parameter });
  assert.equal(ecs.Parameters[parameter].Type, type);
  assert.equal(ecs.Parameters[parameter].Default, undefined, 'network IDs must be supplied');
}
const task = ecs.Resources.TaskDefinition.Properties;
for (const parameter of ['ExecutionRoleArn', 'TaskRoleArn']) {
  assert.deepEqual(task[parameter], { Ref: parameter });
  assert.equal(ecs.Parameters[parameter].Default, undefined);
}
assert.deepEqual(ecs.Resources.Service.Properties.Cluster, { Ref: 'ClusterArn' });
assert.deepEqual(task.ContainerDefinitions[0].LogConfiguration.Options['awslogs-group'], { Ref: 'LogGroupName' });
const lambda = parse(read('tooling/cloud/aws/lambda.yaml'));
assert.equal(lambda.Metadata.ArtifactStatus, 'Example');
assert.ok(lambda.Parameters.Runtime.AllowedValues.includes(lambda.Parameters.Runtime.Default));
assert.ok(!lambda.Parameters.Runtime.AllowedValues.some(value => ['nodejs18.x', 'nodejs20.x'].includes(value)));
const memory = lambda.Parameters.MemorySize;
assert.equal(memory.MinValue, 128);
assert.equal(memory.MaxValue, 32768);
assert.ok(memory.Default >= memory.MinValue && memory.Default <= memory.MaxValue);
for (const parameter of ['Handler', 'S3Bucket', 'S3Key', 'TableArn']) {
  assert.equal(lambda.Parameters[parameter].Default, undefined, `${parameter} must be supplied`);
}
assert.equal(lambda.Resources.Function.Properties.FunctionName, undefined);
assert.equal(lambda.Resources.FunctionRole.Properties.RoleName, undefined);
assert.equal(lambda.Resources.Function.Properties.Environment.Variables.NODE_ENV, undefined);
const tableAccess = lambda.Resources.FunctionRole.Properties.Policies[0].PolicyDocument.Statement
  .find(statement => statement.Action.includes('dynamodb:GetItem'));
assert.deepEqual(tableAccess.Resource, { Ref: 'TableArn' });

const s3Template = parse(read('tooling/cloud/aws/s3-bucket.yaml'));
assert.equal(s3Template.Metadata.ArtifactStatus, 'Example');
const s3 = s3Template.Resources.DataBucket;
assert.equal(s3.DeletionPolicy, 'Retain');
assert.equal(s3.UpdateReplacePolicy, 'Retain');
assert.equal(s3Template.Parameters.BucketName, undefined);
assert.equal(s3.Properties.BucketName, undefined);
assert.ok(Object.values(s3.Properties.PublicAccessBlockConfiguration).every(value => value === true));
assert.ok(s3.Properties.LifecycleConfiguration.Rules.every(rule => rule.NoncurrentVersionExpirationInDays === undefined));

const iamText = read('tooling/cloud/aws/iam-policy.json');
const iam = JSON.parse(iamText);
assert.ok(iam.Statement.every(statement => statement.Effect !== 'Deny'));
assert.ok(!iamText.includes('my-app-*'));
for (const placeholder of [
  '123456789012',
  'replace-with-bucket-name',
  'replace-with-table-name',
  '00000000-0000-0000-0000-000000000000'
]) {
  assert.ok(iamText.includes(placeholder), `IAM example must retain placeholder: ${placeholder}`);
}

const kubernetes = read('skills/kubernetes/SKILL.md');
const good = yamlBlock(kubernetes, '### 1. Deployment securityContext');
const resources = good.split(/^---\s*$/m).map(parse);
const deployment = resources.find(item => item.kind === 'Deployment');
const account = resources.find(item => item.kind === 'ServiceAccount');
const service = resources.find(item => item.kind === 'Service');
const pod = deployment.spec.template;
assert.equal(pod.spec.serviceAccountName, account.metadata.name);
assert.equal(account.metadata.namespace, deployment.metadata.namespace);
assert.equal(pod.spec.securityContext.runAsNonRoot, true);
assert.equal(pod.spec.automountServiceAccountToken, false);
for (const [key, value] of Object.entries(service.spec.selector)) assert.equal(pod.metadata.labels[key], value);
assert.equal(service.spec.ports[0].targetPort, pod.spec.containers[0].readinessProbe.httpGet.port);
const ingress = parse(yamlBlock(kubernetes, '### 5. Image tags and apiVersion correctness'));
const backend = ingress.spec.rules[0].http.paths[0].backend.service;
assert.equal(backend.name, service.metadata.name);
assert.equal(backend.port.number, service.spec.ports[0].port);
assert.equal(ingress.metadata.namespace, service.metadata.namespace);
console.log('PASS: safe AWS defaults/input invariants, CRLF-safe named extraction, and Kubernetes GOOD-example consistency');
