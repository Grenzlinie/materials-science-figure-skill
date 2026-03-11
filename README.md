# Materials Science Figure Skill

Portable AI-agent skill for materials-science figure generation and image editing with Nanobanana / Gemini image models through any Google-compatible Gemini endpoint.

This repository is packaged as a skill distribution repo, not just a script repo. It includes ready-to-drop skill folders for multiple agent ecosystems so other agents can integrate it with minimal setup.

## One-Command Install
(Recommened) Use skill.sh CLI and select which coding agent you want to install the skill.
```bash
npx skills add https://github.com/Grenzlinie/materials-science-figure-skill --skill nanobanana-image-generation
```

Use the bundled installer:

```bash
chmod +x skill.sh
./skill.sh codex
```

Other supported targets:

```bash
./skill.sh claude
./skill.sh cursor
./skill.sh gemini
./skill.sh opencode
```

Global install example:

```bash
./skill.sh codex --global
```

## Claude Quick Add

For Claude-style project-local setup:

```bash
./skill.sh claude
```

Manual equivalent:

```bash
mkdir -p .claude/skills
cp -R skills/nanobanana-image-generation .claude/skills/nanobanana-image-generation
```

## What This Skill Is For

Use this skill when an AI agent needs to:

- generate materials-science paper figures
- create graphical abstracts
- render mechanism diagrams
- draw device architecture figures
- build processing workflow figures
- edit scientific images with Gemini image models
- recreate attachment-only images when exact file-based editing is unavailable

The skill also includes built-in prompt shortcuts for:

- `graphical-abstract`
- `mechanism-figure`
- `device-architecture`
- `processing-workflow`

Both English and Simplified Chinese figure text are supported.

## Quick Setup

### Recommended configuration

Put these in `~/.zshrc`:

```bash
export NANOBANANA_API_KEY="your_provider_api_key"
export NANOBANANA_BASE_URL="https://your-google-compatible-endpoint.example"
export NANOBANANA_MODEL="gemini-3.1-flash-image-preview"
```

Then reload:

```bash
source ~/.zshrc
```

Optional: if you do not want the key stored directly in `~/.zshrc`, the bundled scripts also support `NANOBANANA_API_KEY_FILE` and `--api-key-file`.

Provider note:

- Any third-party endpoint that is compatible with the Gemini `generateContent` API shape should work.
- Zhizengzeng is one supported example:
  - `NANOBANANA_BASE_URL="https://api.zhizengzeng.com/google"`

## Supported Agent Layouts

This repo already ships the skill in several common locations:

- `skills/nanobanana-image-generation/`
  Canonical source folder in this repository.
- `.codex/skills/nanobanana-image-generation/`
  Codex-style project-local discovery.
- `.claude/skills/nanobanana-image-generation/`
  Claude Code style project-local discovery.
- `.cursor/skills/nanobanana-image-generation/`
  Cursor-style project-local discovery.
- `.gemini/skills/nanobanana-image-generation/`
  Gemini CLI style project-local discovery.
- `.opencode/skills/nanobanana-image-generation/`
  OpenCode-style project-local discovery.

If your agent supports project-local skill discovery from one of these paths, cloning this repo is often enough.

## Installation

### Codex

If your workflow supports project-local Codex skills, keep this repo as-is and let Codex read:

```text
.codex/skills/nanobanana-image-generation/
```

If you want global installation:

```bash
cp -R skills/nanobanana-image-generation ~/.codex/skills/
```

### Claude Code

If your Claude environment supports project-local skills:

```text
.claude/skills/nanobanana-image-generation/
```

For manual install:

```bash
cp -R skills/nanobanana-image-generation ~/.claude/skills/
```

### Cursor / Gemini / OpenCode

Use the matching prebuilt folder:

- `.cursor/skills/nanobanana-image-generation/`
- `.gemini/skills/nanobanana-image-generation/`
- `.opencode/skills/nanobanana-image-generation/`

More explicit platform notes are in [docs/installation.md](docs/installation.md).

## Repository Layout

```text
materials-science-figure-skill/
├── README.md
├── skill.sh
├── .gitignore
├── docs/
│   ├── installation.md
│   └── cases/
│       └── metal-heat-treatment-1.png
├── skills/
│   └── nanobanana-image-generation/         # canonical source
├── .codex/skills/
├── .claude/skills/
├── .cursor/skills/
├── .gemini/skills/
└── .opencode/skills/
```

## How Agents Should Use This Skill

When the user asks for:

- a materials-science figure
- a journal-style scientific illustration
- a graphical abstract
- a mechanism figure
- a device architecture figure
- a synthesis or processing workflow figure

the agent should load the skill and use the built-in materials-science templates instead of improvising a new prompt from scratch.

The intended workflow is:

1. Pick the closest figure subtype.
2. Choose `en` or `zh`.
3. Insert the user's scientific background into the template.
4. Preserve the template's rules about causality, color palette, typography, layout, and avoiding fabricated claims.
5. Generate the image through the bundled Gemini-compatible scripts.

## Direct Script Usage

The repo is primarily packaged as a skill, but direct script invocation is included for testing and automation.

### Basic example

```bash
python3 skills/nanobanana-image-generation/scripts/generate_image.py \
  "Create a clean scientific illustration of a catalyst nanoparticle on an oxide support."
```

### Materials figure shortcut

```bash
python3 skills/nanobanana-image-generation/scripts/generate_image.py \
  "Steel heat treatment covering annealing, quenching, tempering, and the resulting microstructure-property evolution." \
  --materials-figure processing-workflow \
  --lang en \
  --style-note "Use a clean publication-style schematic suitable for a metallurgy lecture slide and a materials journal overview figure." \
  --aspect-ratio 4:3 \
  --image-size 2K
```

### Image editing

```bash
python3 skills/nanobanana-image-generation/scripts/generate_image.py \
  "Using the provided image, change only the blue sofa to a vintage brown leather Chesterfield sofa. Keep everything else exactly the same." \
  --input-image ./living-room.png
```

Default output directory:

```text
./output/nanobanana/
```

relative to the current working directory.

## Case Study

### Metal heat-treatment workflow figure

The following image was generated with the built-in `processing-workflow` shortcut for a metallurgy-style educational figure.

![Metal heat-treatment workflow case](docs/cases/metal-heat-treatment-1.png)

Example prompt flow:

```bash
python3 skills/nanobanana-image-generation/scripts/generate_image.py \
  "Create an educational materials-science figure about the heat-treatment workflow of metals, covering annealing, quenching, tempering, and microstructure-property evolution. Show furnace heating, hold stage, controlled cooling versus rapid quenching, and the resulting changes in grain structure, hardness, toughness, and residual stress. Include clear arrows, compact panel layout, and concise English labels suitable for a journal-style explanatory figure." \
  --materials-figure processing-workflow \
  --lang en \
  --style-note "Use a clean publication-style schematic suitable for a metallurgy lecture slide and a materials journal overview figure." \
  --aspect-ratio 4:3 \
  --image-size 2K
```

## Notes

- The skill follows the official Gemini `generateContent` request shape and works with third-party Google-compatible Gemini endpoints.
- Zhizengzeng is one example provider, not a hard requirement.
- For attachment-only chat images, exact pixel-preserving editing may still require access to a real file path.
- Generated figures are best treated as first-pass publication visuals; exact scientific typography and quantitative plots should still be reviewed by a human.
