#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/skills/nanobanana-image-generation"

usage() {
  cat <<'EOF'
Usage:
  ./skill.sh <agent> [--global]

Agents:
  codex
  claude
  cursor
  gemini
  opencode

Behavior:
  Default: install into the current project directory
  --global: install into the user's home skill directory

Examples:
  ./skill.sh codex
  ./skill.sh claude --global
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

AGENT="$1"
SCOPE="${2:-}"

case "$AGENT" in
  codex)
    PROJECT_TARGET=".codex/skills/nanobanana-image-generation"
    GLOBAL_TARGET="$HOME/.codex/skills/nanobanana-image-generation"
    ;;
  claude)
    PROJECT_TARGET=".claude/skills/nanobanana-image-generation"
    GLOBAL_TARGET="$HOME/.claude/skills/nanobanana-image-generation"
    ;;
  cursor)
    PROJECT_TARGET=".cursor/skills/nanobanana-image-generation"
    GLOBAL_TARGET="$HOME/.cursor/skills/nanobanana-image-generation"
    ;;
  gemini)
    PROJECT_TARGET=".gemini/skills/nanobanana-image-generation"
    GLOBAL_TARGET="$HOME/.gemini/skills/nanobanana-image-generation"
    ;;
  opencode)
    PROJECT_TARGET=".opencode/skills/nanobanana-image-generation"
    GLOBAL_TARGET="$HOME/.opencode/skills/nanobanana-image-generation"
    ;;
  *)
    echo "Unknown agent: $AGENT" >&2
    usage
    exit 1
    ;;
esac

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source skill directory not found: $SOURCE_DIR" >&2
  exit 1
fi

if [[ "$SCOPE" == "--global" ]]; then
  TARGET="$GLOBAL_TARGET"
elif [[ -n "$SCOPE" ]]; then
  echo "Unknown option: $SCOPE" >&2
  usage
  exit 1
else
  TARGET="$SCRIPT_DIR/$PROJECT_TARGET"
fi

mkdir -p "$(dirname "$TARGET")"
rm -rf "$TARGET"
cp -R "$SOURCE_DIR" "$TARGET"

echo "Installed skill to:"
echo "  $TARGET"
