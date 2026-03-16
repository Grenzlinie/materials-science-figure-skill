# Installation

This repository is distributed as a multi-agent skill package. The same skill is mirrored into several common project-local paths so different agents can discover it without manual repackaging.

## Included Layouts

- `skills/nanobanana-image-generation/`
  Canonical source folder in this repository.
- `.codex/skills/nanobanana-image-generation/`
- `.claude/skills/nanobanana-image-generation/`
- `.cursor/skills/nanobanana-image-generation/`
- `.gemini/skills/nanobanana-image-generation/`
- `.opencode/skills/nanobanana-image-generation/`

## Codex

Project-local:

```text
.codex/skills/nanobanana-image-generation/
```

Global manual copy:

```bash
cp -R skills/nanobanana-image-generation ~/.codex/skills/
```

## Claude Code

Project-local:

```text
.claude/skills/nanobanana-image-generation/
```

Global manual copy:

```bash
cp -R skills/nanobanana-image-generation ~/.claude/skills/
```

## Cursor

Project-local:

```text
.cursor/skills/nanobanana-image-generation/
```

## Gemini CLI

Project-local:

```text
.gemini/skills/nanobanana-image-generation/
```

## OpenCode

Project-local:

```text
.opencode/skills/nanobanana-image-generation/
```

## Environment

Recommended in `~/.zshrc`:

```bash
export NANOBANANA_API_KEY="your_provider_api_key"
export NANOBANANA_BASE_URL="https://your-google-compatible-endpoint.example"
export NANOBANANA_MODEL="gemini-3.1-flash-image-preview"
```

Reload:

```bash
source ~/.zshrc
```

Optional alternative:

- `NANOBANANA_API_KEY_FILE`
- `--api-key-file`

Provider note:

- Any third-party endpoint compatible with Gemini `generateContent` should work.
- Zhizengzeng is one example:
  - `https://api.zhizengzeng.com/google`

## Canonical Source

If you need to update the skill, treat `skills/nanobanana-image-generation/` as the canonical source in this repository and then sync mirrored copies to the platform folders.

## Registry Metadata

ClawHub/OpenClaw publishing metadata for this skill lives in:

```text
docs/clawhub-metadata.yaml
```

Notes:

- Python is the required runtime baseline for the published skill.
- `node` is optional and only used for the alternate `scripts/generate_image.js` parity CLI.
- Required env vars are `NANOBANANA_API_KEY` and `NANOBANANA_BASE_URL`.
- Optional env vars are documented in `docs/clawhub-metadata.yaml` and in the skill's `SKILL.md`.
