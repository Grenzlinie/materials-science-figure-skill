#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_ROOT="$ROOT_DIR/skills"
MIRROR_ROOTS=(
  "$ROOT_DIR/.codex/skills"
  "$ROOT_DIR/.claude/skills"
  "$ROOT_DIR/.cursor/skills"
  "$ROOT_DIR/.gemini/skills"
  "$ROOT_DIR/.opencode/skills"
)

usage() {
  cat <<'EOF'
Usage:
  ./scripts/sync_skill_mirrors.sh <skill-name>
  ./scripts/sync_skill_mirrors.sh --all

Behavior:
  Copies canonical skills from ./skills/ into all workspace mirror directories.

Examples:
  ./scripts/sync_skill_mirrors.sh nanobanana-image-generation
  ./scripts/sync_skill_mirrors.sh --all
EOF
}

copy_skill() {
  local skill_name="$1"
  local source_dir="$SOURCE_ROOT/$skill_name"

  if [[ ! -d "$source_dir" ]]; then
    echo "Skill not found under $SOURCE_ROOT: $skill_name" >&2
    exit 1
  fi

  for mirror_root in "${MIRROR_ROOTS[@]}"; do
    local target_dir="$mirror_root/$skill_name"
    mkdir -p "$mirror_root"
    rm -rf "$target_dir"
    cp -R "$source_dir" "$target_dir"
    echo "Synced $skill_name -> ${target_dir#$ROOT_DIR/}"
  done
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

case "$1" in
  --all)
    mapfile -t skill_dirs < <(find "$SOURCE_ROOT" -mindepth 1 -maxdepth 1 -type d | sort)
    if [[ ${#skill_dirs[@]} -eq 0 ]]; then
      echo "No skills found under $SOURCE_ROOT" >&2
      exit 1
    fi
    for skill_dir in "${skill_dirs[@]}"; do
      copy_skill "$(basename "$skill_dir")"
    done
    ;;
  -h|--help)
    usage
    ;;
  *)
    copy_skill "$1"
    ;;
esac
