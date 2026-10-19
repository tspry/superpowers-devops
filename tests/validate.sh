#!/usr/bin/env bash
# Structural validation for superpowers-devops skills.
# Uses standard shell tools and Git for tracked hook permissions.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/skills"
ERRORS=0

echo "Validating skill frontmatter..."
for skill_file in "$SKILLS_DIR"/*/SKILL.md; do
  [ -f "$skill_file" ] || continue
  block=$(sed -n '2,/^---/p' "$skill_file")
  name=$(echo "$block" | grep "^name:" | head -1 | sed 's/^name: *//')
  desc=$(echo "$block" | grep "^description:" | head -1 | sed 's/^description: *//')
  if [ -z "$name" ] || [ -z "$desc" ]; then
    echo "  FAIL: $skill_file — missing name or description in frontmatter"
    ERRORS=$((ERRORS + 1))
  else
    echo "  OK: $name"
  fi
done

echo ""
echo "Validating trigger table consistency..."
TRIGGER_FILE="$SKILLS_DIR/using-superpowers-devops/SKILL.md"
if [ -f "$TRIGGER_FILE" ]; then
  referenced=$(grep -o '`[^`]*`' "$TRIGGER_FILE" | tr -d '`' | sort -u)
  for skill_name in $referenced; do
    case "$skill_name" in
      */*) continue ;;            # path reference (e.g. tooling/...), not a skill
      Skill|skill) continue ;;    # the "Skill tool" mention
    esac
    if [ ! -d "$SKILLS_DIR/$skill_name" ]; then
      echo "  FAIL: trigger table references '$skill_name' but skills/$skill_name/ does not exist"
      ERRORS=$((ERRORS + 1))
    fi
  done
  echo "  Trigger table references $(echo "$referenced" | wc -l | tr -d ' ') backtick entries"
fi

echo ""
echo "Validating tracked hook executable permissions..."
# Windows/core.filemode=false hides missing executable bits in the working tree.
# Check Git's index: that mode is what a fresh Unix install receives.
for hook in hooks/run-hook.cmd hooks/session-start; do
  entry=$(git -C "$REPO_ROOT" ls-files --stage -- "$hook")
  if [[ "$entry" == 100755\ * ]]; then
    echo "  OK: $hook"
  else
    echo "  FAIL: $hook must be tracked as executable (100755)"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
if [ $ERRORS -gt 0 ]; then
  echo "FAILED: $ERRORS error(s)"
  exit 1
else
  echo "ALL OK"
fi
