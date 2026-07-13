// superpowers-devops OpenCode plugin
// Injects the using-superpowers-devops skill at session start

const fs = require('fs');
const path = require('path');

const pluginRoot = path.resolve(__dirname, '../..');
const skillPath = path.join(pluginRoot, 'skills/using-superpowers-devops/SKILL.md');

module.exports = {
  name: 'superpowers-devops',
  version: '1.0.0',
  onSessionStart: () => {
    try {
      const content = fs.readFileSync(skillPath, 'utf8');
      return {
        systemMessage: `<EXTREMELY_IMPORTANT>\nYou have superpowers-devops.\n\n**IMPORTANT: The using-superpowers-devops skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-superpowers-devops" again - that would be redundant.**\n\n${content}\n</EXTREMELY_IMPORTANT>`
      };
    } catch (e) {
      return {};
    }
  }
};
