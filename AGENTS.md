# AGENTS.md

## Development Scope

- Primary development happens under `skills/`.
- Treat `skills/` as the source of truth for all skill content:
  - `SKILL.md`
  - `scripts/`
  - `references/`
  - `agents/`

## Mirror Directories

- The agent-specific directories in the current workspace are distribution mirrors, not primary edit targets:
  - `.codex/skills/`
  - `.claude/skills/`
  - `.cursor/skills/`
  - `.gemini/skills/`
  - `.opencode/skills/`

- If a skill is updated, make the change in `skills/` first.
- After the canonical version in `skills/` is correct, copy the same files into the mirror directories.

## Editing Rules

- Do not start feature work by editing `.codex/` or `.claude/` copies first.
- Only edit mirror directories directly when there is a mirror-specific packaging issue.
- Keep mirrored files aligned with the matching files under `skills/`.

## Practical Workflow

1. Implement the change in `skills/<skill-name>/`.
2. Verify the canonical version there.
3. Copy the updated files into the mirror directories under the current workspace.
4. If a file exists only in mirrors but should be shared, move it into `skills/` and mirror it back out.

Preferred sync command:

```bash
./scripts/sync_skill_mirrors.sh <skill-name>
```

To sync every canonical skill under `skills/`:

```bash
./scripts/sync_skill_mirrors.sh --all
```

## Intent

- `skills/` is the development area.
- `.codex/`, `.claude/`, and similar directories are delivery copies for different agent ecosystems.
