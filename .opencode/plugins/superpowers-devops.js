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
        systemMessage: `<EXTREMELY_IMPORTANT>\nYou have superpowers-devops.\n\n${content}\n</EXTREMELY_IMPORTANT>`
      };
    } catch (e) {
      return {};
    }
  }
};
