# Installing for Codex

Use Codex native skill discovery from a persistent clone. Do not copy instructions with paths relative to whichever application project happens to be open.

The location and symlink behavior follow [Codex's official skill documentation](https://developers.openai.com/codex/skills/).

Linux/macOS (replace the example clone path as desired):

```bash
git clone https://github.com/tspry/superpowers-devops "$HOME/superpowers-devops"
mkdir -p "$HOME/.agents/skills"
ln -s "$HOME/superpowers-devops/skills" "$HOME/.agents/skills/superpowers-devops"
```

Windows PowerShell (directory junction, no admin symlink privilege required):

```powershell
git clone https://github.com/tspry/superpowers-devops "$HOME\superpowers-devops"
New-Item -ItemType Directory -Force "$HOME\.agents\skills"
New-Item -ItemType Junction -Path "$HOME\.agents\skills\superpowers-devops" -Target "$HOME\superpowers-devops\skills"
```

If a link already exists, inspect its target instead of replacing it blindly. Restart Codex, open a different project, and confirm `kubernetes` and `using-superpowers-devops` are discoverable. Explicitly load `using-superpowers-devops` at session start; this native-discovery install does not provide an automatic session hook. Optionally add that instruction to your own agent instructions.

Update the clone after reviewing local changes, then restart. The link stays pointed at it. Skill names are unprefixed; check collisions with other bundles. This is an installation recipe, not evidence of a tested Codex host release.
