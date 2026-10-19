// Adapted from obra/superpowers v7.0.0 (bb92a77). See docs/upstream-sync.md.
// No runtime dependencies. CJS preserves this package's existing main entry.
const fs = require('node:fs');
const path = require('node:path');
const skillsDir = path.resolve(__dirname, '../../skills');
const marker = '<superpowers-devops-bootstrap>';
const readSkill = name => {
  const filename = path.join(skillsDir, name, 'SKILL.md');
  const text = fs.readFileSync(filename, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`Missing skill frontmatter: ${filename}`);
  // This fork uses single-line name/description fields; validation enforces them.
  const field = key => match[1].match(new RegExp(`^${key}: (.+)$`, 'm'))?.[1].trim();
  return { id: name, name: field('name'), description: field('description'), path: filename, content: match[2] };
};
const mappings = {
  v1: 'Use todowrite for progress, task (subagent_type: "general") for authorized delegation, apply_patch for file changes, and bash for shell commands.',
  v2: 'Track progress in a markdown file (no todo tool). Use subagent (agent: "general", sessionID to resume) for authorized delegation, patch (patchText) or write/edit for file changes, and shell for commands.'
};
const bootstraps = new Map();
function bootstrap(flavor) {
  if (!bootstraps.has(flavor)) {
    bootstraps.set(flavor, `${marker}\nYou have superpowers-devops. The using-superpowers-devops skill is ALREADY LOADED below; do not load it again.\n\n${readSkill('using-superpowers-devops').content}\n\nTool mapping: ${mappings[flavor]} Use skill to load skills, read to read files, grep/glob to search, and webfetch to fetch URLs.\n</superpowers-devops-bootstrap>`);
  }
  return bootstraps.get(flavor);
}

async function isChild(fetchSession, id) {
  if (!id || !fetchSession) return false;
  try {
    const result = await fetchSession(id);
    const session = result?.data ?? result;
    if (result?.error || result?.response?.ok === false || session?.id !== id) throw new Error('Invalid session lookup');
    return typeof session.parentID === 'string' && session.parentID.length > 0;
  } catch {
    // Fail open and retry on the next step, as upstream does on lookup failure.
    console.error('[superpowers-devops] Cannot classify session; injecting bootstrap for this step.');
    return false;
  }
}

async function server({ client } = {}) {
  return {
    config: async config => {
      if (Array.isArray(config.skills)) return; // v2 registers through setup.
      config.skills ||= {};
      config.skills.paths ||= [];
      if (!config.skills.paths.includes(skillsDir)) config.skills.paths.push(skillsDir);
    },
    'experimental.chat.messages.transform': async (_input, output) => {
      const first = output.messages.find(message => message.info.role === 'user');
      if (!first?.parts.length || first.parts.some(part => part.type === 'text' && part.text.includes(marker))) return;
      if (await isChild(client?.session?.get ? id => client.session.get({ path: { id } }) : null, first.info.sessionID)) return;
      first.parts.unshift({ ...first.parts[0], type: 'text', text: bootstrap('v1') });
    }
  };
}

async function setup(ctx) {
  // Some 1.x hosts call setup too, without the v2 domains.
  if (!ctx?.skill?.transform || !ctx?.session?.hook) return;
  const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => readSkill(entry.name));
  await ctx.skill.transform(draft => {
    for (const skill of skills) {
      try { draft.add(skill); }
      catch { console.error(`[superpowers-devops] Host rejected skill: ${skill.id}`); }
    }
  });
  await ctx.session.hook('context', async event => {
    if (!event.messages?.length) return;
    const first = event.messages.find(message => message.role === 'user');
    if (first && (!first.content?.length || first.content.some(part => part.type === 'text' && part.text?.includes(marker)))) return;
    if (await isChild(ctx.session.get ? id => ctx.session.get({ sessionID: id }) : null, event.sessionID)) return;
    if (first) first.content.unshift({ type: 'text', text: bootstrap('v2') });
    else event.messages.push({ role: 'user', content: [{ type: 'text', text: bootstrap('v2') }] });
  });
}

module.exports = { id: 'superpowers-devops', server, setup };
