// Run with node or bun. Host contracts adapted from obra/superpowers v7.0.0.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plugin = createRequire(import.meta.url)('../.opencode/plugins/superpowers-devops.js');
assert.equal(typeof plugin.server, 'function', 'OpenCode 1.x requires a plugin function');
assert.equal(typeof plugin.setup, 'function', 'OpenCode 2 requires setup');
const skills = path.join(root, 'skills');
const names = readdirSync(skills).filter(name => !name.startsWith('.'));
const marker = '<superpowers-devops-bootstrap>';
const bootstrapCount = messages => JSON.stringify(messages).split(marker).length - 1;
let lookups = 0;
const hooks = await plugin.server({ client: { session: { get: async ({ path: { id } }) => {
  lookups++;
  return { data: { id, ...(id === 'child' ? { parentID: 'parent' } : {}) } };
} } } });
const config = { skills: { paths: ['existing'] } };
await hooks.config(config);
await hooks.config(config);
assert.deepEqual(config.skills.paths, ['existing', skills]);
const flatConfig = { skills: ['existing'] };
await hooks.config(flatConfig);
assert.deepEqual(flatConfig.skills, ['existing'], 'v1 config callback must leave v2 skill lists intact');
const message = sessionID => ({ info: { role: 'user', sessionID }, parts: [{ type: 'text', text: 'Deploy the approved change', id: 'part-1' }] });
const output = { messages: [message('parent')] };
await hooks['experimental.chat.messages.transform']({}, output);
await hooks['experimental.chat.messages.transform']({}, output);
assert.equal(bootstrapCount(output.messages), 1, 'no duplicate bootstrap on reused messages');
assert.match(output.messages[0].parts[0].text, /When to Invoke Each Skill/);
assert.match(output.messages[0].parts[0].text, /todowrite/);
assert.equal(output.messages[0].parts.at(-1).text, 'Deploy the approved change');
const fresh = { messages: [message('parent')] };
await hooks['experimental.chat.messages.transform']({}, fresh);
assert.equal(bootstrapCount(fresh.messages), 1, 'fresh DB messages need reinjection');
const child = { messages: [message('child')] };
await hooks['experimental.chat.messages.transform']({}, child);
assert.equal(bootstrapCount(child.messages), 0, 'workers must not restart controller workflows');
assert.ok(lookups >= 2);
await hooks['experimental.chat.messages.transform']({}, { messages: [] });

const registered = [];
let context;
await plugin.setup({
  skill: { transform: async fn => fn({ add: skill => {
    assert.equal(skill.path, path.join(skills, skill.id, 'SKILL.md'));
    assert.equal(skill.name, skill.id);
    assert.ok(skill.description && skill.content);
    assert.ok(readFileSync(skill.path, 'utf8').includes(skill.description));
    registered.push(skill);
  } }) },
  session: {
    get: async ({ sessionID }) => ({ id: sessionID, ...(sessionID === 'child' ? { parentID: 'parent' } : {}) }),
    hook: async (name, callback) => { assert.equal(name, 'context'); context = callback; }
  }
});
assert.equal(registered.length, names.length);
const event = { sessionID: 'parent', messages: [{ role: 'user', content: [{ type: 'text', text: 'Continue' }] }] };
await context(event);
await context(event);
assert.equal(bootstrapCount(event.messages), 1);
assert.match(event.messages[0].content[0].text, /subagent/);
assert.match(event.messages[0].content[0].text, /shell/);
const childEvent = { sessionID: 'child', messages: [{ role: 'user', content: [{ type: 'text', text: 'Implement task' }] }] };
await context(childEvent);
assert.equal(bootstrapCount(childEvent.messages), 0);
const compacted = { sessionID: 'parent', messages: [{ role: 'checkpoint', content: 'opaque' }] };
await context(compacted);
assert.equal(compacted.messages[0].content, 'opaque');
assert.equal(bootstrapCount(compacted.messages), 1);
await plugin.setup({}); // 1.x hosts can also call setup with no v2 domains.
// A transient lookup must not poison a child-session cache; a rejected skill
// must not prevent the remaining skills or context hook from registering.
const warnings = [];
const originalError = console.error;
console.error = text => warnings.push(text);
try {
  let attempts = 0;
  const retry = await plugin.server({ client: { session: { get: async ({ path: { id } }) => {
    if (++attempts === 1) throw new Error('temporary lookup failure');
    return { data: { id, parentID: 'parent' } };
  } } } });
  const uncertain = { messages: [message('child')] };
  await retry['experimental.chat.messages.transform']({}, uncertain);
  assert.equal(bootstrapCount(uncertain.messages), 1, 'lookup failure is explicitly fail-open');
  const recovered = { messages: [message('child')] };
  await retry['experimental.chat.messages.transform']({}, recovered);
  assert.equal(bootstrapCount(recovered.messages), 0, 'classification must retry after failure');
  const accepted = [];
  let hookRegistered = false;
  await plugin.setup({
    skill: { transform: async fn => fn({ add: skill => {
      if (skill.id === names[0]) throw new Error('host rejected one skill');
      accepted.push(skill.id);
    } }) },
    session: { hook: async () => { hookRegistered = true; } }
  });
  assert.equal(accepted.length, names.length - 1);
  assert.ok(hookRegistered);
} finally {
  console.error = originalError;
}
assert.equal(warnings.length, 2);
console.log(`PASS: OpenCode 1.x/2.x contracts, ${registered.length} skills, parent/child and compaction bootstrap`);
