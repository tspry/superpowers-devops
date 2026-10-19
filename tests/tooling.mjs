// Bun's built-in YAML parser; no package dependencies. These are invariant checks,
// not CloudFormation schema validation, admission testing, or live deployments.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
// Preserve !Ref semantics in this repository's simple CFN fixtures. Other YAML
// tags are parsed as values by Bun; no claim is made about their evaluation.
const parse = text => Bun.YAML.parse(text.replace(/!Ref ([\w:]+)/g, '{Ref: $1}'));
const ecs = parse(read('tooling/cloud/aws/ecs-service.yaml'));
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
assert.ok(lambda.Parameters.Runtime.AllowedValues.includes(lambda.Parameters.Runtime.Default));
assert.ok(!lambda.Parameters.Runtime.AllowedValues.some(value => ['nodejs18.x', 'nodejs20.x'].includes(value)));
const s3 = parse(read('tooling/cloud/aws/s3-bucket.yaml')).Resources.DataBucket;
assert.equal(s3.DeletionPolicy, 'Retain');
assert.equal(s3.UpdateReplacePolicy, 'Retain');
assert.ok(Object.values(s3.Properties.PublicAccessBlockConfiguration).every(value => value === true));
JSON.parse(read('tooling/cloud/aws/iam-policy.json'));

const kubernetes = read('skills/kubernetes/SKILL.md');
const block = section => section.match(/```yaml\n([\s\S]*?)```/)[1];
const good = block(kubernetes.split('### 1. Deployment securityContext')[1]);
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
const ingress = parse(block(kubernetes.split('### 5. Image tags and apiVersion correctness')[1]));
const backend = ingress.spec.rules[0].http.paths[0].backend.service;
assert.equal(backend.name, service.metadata.name);
assert.equal(backend.port.number, service.spec.ports[0].port);
assert.equal(ingress.metadata.namespace, service.metadata.namespace);
console.log('PASS: AWS input invariants and Kubernetes GOOD-example resource/port/security consistency');
