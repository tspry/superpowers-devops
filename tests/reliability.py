"""Standard-library checks for repository contracts. No cloud access or dependencies."""
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]

SKILL_NAME = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')


def frontmatter_fields(text):
    if not text.startswith('---\n'):
        return {}
    block = text.split('---', 2)[1]
    return {
        key: value.strip()
        for line in block.splitlines()
        if ':' in line
        for key, value in [line.split(':', 1)]
    }


def skill_metadata_errors(directory_name, text):
    fields = frontmatter_fields(text)
    name = fields.get('name', '')
    description = fields.get('description', '')
    errors = []
    if not 1 <= len(name) <= 64 or not SKILL_NAME.fullmatch(name):
        errors.append('invalid skill name')
    if name != directory_name:
        errors.append('skill name must match its directory')
    if not 1 <= len(description) <= 1024:
        errors.append('invalid description length')
    return errors


class Reliability(unittest.TestCase):
    def test_bash_launcher_with_empty_path_and_spaced_arguments(self):
        with tempfile.TemporaryDirectory(prefix='hook contract ') as tmp:
            directory = Path(tmp)
            wrapper = directory / 'run-hook.cmd'
            wrapper.write_bytes((ROOT / 'hooks/run-hook.cmd').read_text(encoding='utf-8').encode('utf-8'))
            (directory / 'argument-check').write_bytes(b'[ "$1" = "two words" ] || exit 9\nexit 7\n')
            result = subprocess.run([shutil.which('bash'), wrapper.as_posix(), 'argument-check', 'two words'],
                                    env={**os.environ, 'PATH': ''}, capture_output=True, text=True)
            self.assertEqual(result.returncode, 7, result.stdout + result.stderr)
        result = subprocess.run(['git', 'check-attr', 'eol', '--', 'hooks/run-hook.cmd', 'hooks/session-start'],
                                cwd=ROOT, capture_output=True, text=True, check=True)
        self.assertEqual(result.stdout.count(': eol: lf'), 2)

    @unittest.skipUnless(os.name == 'nt', 'native cmd.exe contract runs on Windows')
    def test_windows_launcher_preserves_exit_status(self):
        with tempfile.TemporaryDirectory(prefix='hook contract ') as tmp:
            directory = Path(tmp)
            wrapper = directory / 'run-hook.cmd'
            # Exercise the LF checkout required by .gitattributes, without
            # write_text's Windows newline translation hiding incompatibility.
            wrapper.write_bytes((ROOT / 'hooks/run-hook.cmd').read_text(encoding='utf-8').encode('utf-8'))
            (directory / 'argument-check').write_bytes(b'[ "$1" = "two words" ] || exit 9\nexit 7\n')
            # cmd /s /c needs an outer quote pair; Python's argv quoting targets
            # the C runtime, not cmd's command-string parser.
            command = f'cmd.exe /d /s /c ""{wrapper}" argument-check "two words""'
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(result.returncode, 7, result.stdout + result.stderr)

    def test_precommit_checks_first_and_subsequent_files(self):
        line = next(line for line in (ROOT / '.pre-commit-config.yaml').read_text(encoding='utf-8').splitlines() if 'entry:' in line)
        command = shlex.split(line.split('entry:', 1)[1].strip())
        with tempfile.TemporaryDirectory() as tmp:
            good, bad = Path(tmp) / 'good.md', Path(tmp) / 'bad.md'
            good.write_text('---\nname: good\ndescription: Good skill\n---\n', encoding='utf-8')
            bad.write_text('Missing frontmatter\n', encoding='utf-8')
            for files, expected in [([good], 0), ([bad], 1), ([bad, good], 1), ([good, bad], 1)]:
                result = subprocess.run(command + list(map(str, files)), capture_output=True, text=True)
                self.assertEqual(result.returncode, expected, result.stdout + result.stderr)

    def test_manifest_versions(self):
        version = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']
        for filename in ['.claude-plugin/plugin.json', '.cursor-plugin/plugin.json', '.kimi-plugin/plugin.json', 'gemini-extension.json']:
            self.assertEqual(json.loads((ROOT / filename).read_text(encoding='utf-8'))['version'], version, filename)
        marketplace = json.loads((ROOT / '.claude-plugin/marketplace.json').read_text(encoding='utf-8'))
        self.assertEqual(marketplace['plugins'][0]['version'], version)

    def test_skill_metadata_rejects_invalid_contracts(self):
        valid = '---\nname: valid-skill\ndescription: Use when validating a skill\n---\n'
        self.assertEqual(skill_metadata_errors('valid-skill', valid), [])
        invalid = [
            ('Bad', '---\nname: Bad\ndescription: Use when uppercase is present\n---\n'),
            ('bad--name', '---\nname: bad--name\ndescription: Use when repeated hyphens are present\n---\n'),
            ('-bad', '---\nname: -bad\ndescription: Use when a leading hyphen is present\n---\n'),
            ('bad-', '---\nname: bad-\ndescription: Use when a trailing hyphen is present\n---\n'),
            ('different', '---\nname: valid\ndescription: Use when names differ\n---\n'),
            ('a' * 65, f"---\nname: {'a' * 65}\ndescription: Use when names are too long\n---\n"),
            ('valid', f"---\nname: valid\ndescription: {'x' * 1025}\n---\n"),
            ('valid', '---\nname: valid\ndescription: \n---\n'),
        ]
        for directory, text in invalid:
            self.assertTrue(skill_metadata_errors(directory, text), directory)

    def test_skills_commands_triggers_and_tooling_references(self):
        skills = list((ROOT / 'skills').glob('*/SKILL.md'))
        names = []
        trigger = (ROOT / 'skills/using-superpowers-devops/SKILL.md').read_text(encoding='utf-8')
        for skill in skills:
            text = skill.read_text(encoding='utf-8')
            fields = frontmatter_fields(text)
            self.assertEqual(skill_metadata_errors(skill.parent.name, text), [], str(skill))
            names.append(fields['name'])
            for reference in re.findall(r'`(tooling/[^`\n]*)`', text):
                self.assertTrue((ROOT / reference).exists(), f'{skill.relative_to(ROOT)}: missing {reference}')
        self.assertEqual(len(names), len(set(names)), 'skill names must be unique')

        expected_triggers = set(names) - {'using-superpowers-devops'}
        trigger_table = trigger.split('## When to Invoke Each Skill', 1)[1].split('## Dual-Mode Awareness', 1)[0]
        trigger_targets = set(re.findall(r'`([a-z0-9-]+)`', trigger_table))
        self.assertEqual(trigger_targets, expected_triggers)

        command_targets = []
        for command in (ROOT / 'commands').glob('*.md'):
            targets = re.findall(r'load `([a-z0-9-]+)`', command.read_text(encoding='utf-8'))
            self.assertEqual(len(targets), 1, f'{command.relative_to(ROOT)} must load exactly one skill')
            self.assertIn(targets[0], names, f'{command.relative_to(ROOT)} references missing skill')
            command_targets.extend(targets)
        self.assertEqual(len(command_targets), len(set(command_targets)), 'duplicate command target')


    def test_tooling_inventory(self):
        inventory = (ROOT / 'tooling/README.md').read_text(encoding='utf-8')
        actual = {str(p.relative_to(ROOT)).replace('\\', '/') for p in (ROOT / 'tooling').rglob('*') if p.is_file() and p.suffix != '.md'}
        listed = set(re.findall(r'`(tooling/[^`]+)`', inventory))
        self.assertEqual(actual, listed, 'Inventory must name every shipped template, and only shipped templates')

    def test_local_markdown_links(self):
        for filename in ROOT.rglob('*.md'):
            relative = filename.relative_to(ROOT)
            if any(part in ['node_modules', '.git', '.local-tools'] for part in relative.parts):
                continue
            for link in re.findall(r'\]\(([^\s)]+)\)', filename.read_text(encoding='utf-8')):
                if re.match(r'[a-zA-Z]+:', link) or link.startswith('#'):
                    continue
                target = link.split('#', 1)[0]
                self.assertTrue((filename.parent / target).exists(), f'{relative}: missing link {target}')

    def test_platform_hook_contracts(self):
        cursor = json.loads((ROOT / '.cursor-plugin/plugin.json').read_text(encoding='utf-8'))
        self.assertEqual(cursor['skills'], './skills/')
        cursor_hooks = json.loads((ROOT / cursor['hooks']).read_text(encoding='utf-8'))
        self.assertEqual(cursor_hooks['version'], 1)
        commands = [cursor_hooks['hooks']['sessionStart'][0]['command']]
        claude = json.loads((ROOT / 'hooks/hooks.json').read_text(encoding='utf-8'))
        commands.append(claude['hooks']['SessionStart'][0]['hooks'][0]['command'])
        for host, command in zip(['cursor', 'claude'], commands):
            env = {key: value for key, value in os.environ.items() if key not in ['CLAUDE_PLUGIN_ROOT', 'CURSOR_PLUGIN_ROOT', 'COPILOT_CLI']}
            env['CURSOR_PLUGIN_ROOT' if host == 'cursor' else 'CLAUDE_PLUGIN_ROOT'] = ROOT.as_posix()
            result = subprocess.run(['bash', '-c', command], cwd=ROOT, env=env, capture_output=True, text=True, encoding='utf-8')
            self.assertEqual(result.returncode, 0, result.stderr)
            payload = json.loads(result.stdout)
            text = payload['additional_context'] if host == 'cursor' else payload['hookSpecificOutput']['additionalContext']
            self.assertIn('name: using-superpowers-devops', text)


if __name__ == '__main__':
    unittest.main(verbosity=2)
