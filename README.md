# Materials Science Figure Skill

Portable AI-agent skill for materials-science figure generation and image editing with Nanobanana / Gemini image models through any Google-compatible Gemini endpoint.

This repository is packaged as a skill distribution repo, not just a script repo. It includes ready-to-drop skill folders for multiple agent ecosystems so other agents can integrate it with minimal setup.

便携式 AI 智能体技能，用于材料科学图表生成和图像编辑，通过任何兼容 Google 的 Gemini 端点使用 Nanobanana / Gemini 图像模型。

本仓库以技能分发仓库的形式打包，而不仅仅是脚本仓库。它包含可直接投放的多个智能体生态系统的技能文件夹，以便其他智能体能够以最小设置进行集成。

## One-Command Install
(Recommened) Use skill.sh CLI and select which coding agent you want to install the skill.
```bash
npx skills add https://github.com/Grenzlinie/materials-science-figure-skill --skill nanobanana-image-generation
```

Recommended: use `npx skills add` to install `nanobanana-image-generation` directly from this repository.

```bash
npx skills add https://github.com/Grenzlinie/materials-science-figure-skill --skill nanobanana-image-generation
```

> Or you can just give the AI the link to this GitHub repository and let it execute commands according to the instructions.
> 或者你直接把这个 Github 仓库的链接给 AI，让他根据说明来执行命令就好了。

## Case Study

### Metal heat-treatment workflow figure

The following image was produced in a Codex conversation using this skill for a metallurgy-style educational figure.

![Metal heat-treatment workflow case](docs/cases/metal-heat-treatment-1.png)

Example Codex CLI prompt:

```bash
codex "生成一张材料科学示意图，主题是金属热处理流程，包含退火、淬火、回火，以及显微组织和力学性能的变化。要求白底、清晰箭头、适合论文或课程讲义。"
```

You can also ask in English:

```bash
codex "Generate a materials-science workflow figure for metal heat treatment, covering annealing, quenching, tempering, and microstructure-property evolution. Use a clean white background, clear arrows, and a journal-style schematic layout."
```



Another Case:

![OM analysis workflow case](docs/cases/metallography_optical_segmentation-1.png)

Example Codex CLI prompt:

```bash
codex "生成一张材料科学示意图，主题是金相的光学显微镜识别，涵盖图像拍摄，预处理，光学图像识别，深度学习分割，后处理，晶粒分析输出等各个部分。"
```

You can also ask in English:

```bash
codex "Generate a schematic diagram of materials science, with the theme of optical microscope identification of metallography, covering various parts such as image acquisition, preprocessing, optical image recognition, deep learning segmentation, post-processing, and grain analysis output."
```



## skill.sh Install

For command line users, use the bundled installer:

```bash
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
4. Inspect or refine the resolved prompt first when the figure is scientifically dense or style-sensitive.
5. Preserve the template's rules about causality, color palette, typography, layout, and avoiding fabricated claims.
6. Generate the image through the bundled Gemini-compatible scripts.

Prompt-first preflight:

```bash
python3 skills/nanobanana-image-generation/scripts/build_materials_figure_prompt.py \
  --materials-figure mechanism-figure \
  --lang en \
  --background-file ./background.md \
  --style-note "Nature Materials aesthetic with concise panel labels."
```

You can also inspect the resolved prompt directly from the generation CLIs:

```bash
python3 skills/nanobanana-image-generation/scripts/generate_image.py \
  --materials-figure processing-workflow \
  --lang en \
  --prompt-file ./background.md \
  --print-prompt
```

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

Long scientific background from file:

```bash
python3 skills/nanobanana-image-generation/scripts/generate_image.py \
  --materials-figure mechanism-figure \
  --lang en \
  --prompt-file ./background.md \
  --style-note "Nature Energy style" \
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

## Notes

- The skill follows the official Gemini `generateContent` request shape and works with third-party Google-compatible Gemini endpoints.
- Zhizengzeng is one example provider, not a hard requirement.
- For attachment-only chat images, exact pixel-preserving editing may still require access to a real file path.
- Generated figures are best treated as first-pass publication visuals; exact scientific typography and quantitative plots should still be reviewed by a human.
