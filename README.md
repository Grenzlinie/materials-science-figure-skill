# MatFig Nanobanana Skill

Codex skill for materials-science figure generation and image editing with Gemini image models through Zhizengzeng's Google-compatible endpoint.

This repository packages a ready-to-install skill focused on:

- materials-science paper figures
- graphical abstracts
- mechanism diagrams
- device architecture figures
- processing workflow figures
- attachment-based recreation and translation workflows

## Repository Layout

```text
matfig-nanobanana-skill/
├── README.md
├── .gitignore
├── docs/
│   └── cases/
│       └── metal-heat-treatment-1.png
└── skill/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── scripts/
    └── references/
```

## Install

Copy `skill/` into your Codex skills directory, or keep this repository as the source of truth and sync it into `~/.codex/skills/`.

Example:

```bash
cp -R skill ~/.codex/skills/nanobanana-image-generation
```

## Configuration

Minimum environment:

```bash
export NANOBANANA_BASE_URL="https://api.zhizengzeng.com/google"
export NANOBANANA_MODEL="gemini-3.1-flash-image-preview"
```

Recommended key setup to avoid exposing the API key in commands:

```bash
mkdir -p .secrets
printf '%s' 'your_zzz_api_key' > .secrets/nanobanana_api_key
chmod 600 .secrets/nanobanana_api_key
export NANOBANANA_API_KEY_FILE="$PWD/.secrets/nanobanana_api_key"
```

## Usage

### Basic image generation

```bash
python3 skill/scripts/generate_image.py \
  "Create a clean scientific illustration of a catalyst nanoparticle on an oxide support." \
  --api-key-file ./.secrets/nanobanana_api_key
```

### Materials-science shortcut

The script can inject built-in prompt templates for materials figures.

Available subtypes:

- `graphical-abstract`
- `mechanism-figure`
- `device-architecture`
- `processing-workflow`

Example:

```bash
python3 skill/scripts/generate_image.py \
  "Steel heat treatment covering annealing, quenching, tempering, and the resulting microstructure-property evolution." \
  --materials-figure processing-workflow \
  --lang en \
  --style-note "Use a clean publication-style schematic suitable for a metallurgy lecture slide and a materials journal overview figure." \
  --aspect-ratio 4:3 \
  --image-size 2K \
  --api-key-file ./.secrets/nanobanana_api_key
```

### Attachment or image editing workflow

```bash
python3 skill/scripts/generate_image.py \
  "Using the provided image, change only the blue sofa to a vintage brown leather Chesterfield sofa. Keep everything else exactly the same." \
  --input-image ./living-room.png \
  --api-key-file ./.secrets/nanobanana_api_key
```

## Output

By default, generated files are saved to:

```text
./output/nanobanana/
```

relative to the current working directory.

## Case Study

### Metal heat-treatment workflow figure

The following figure was generated using the built-in `processing-workflow` materials-science shortcut and an English scientific background about annealing, quenching, tempering, and microstructure-property evolution.

![Metal heat-treatment workflow case](docs/cases/metal-heat-treatment-1.png)

Example generation command:

```bash
python3 skill/scripts/generate_image.py \
  "Create an educational materials-science figure about the heat-treatment workflow of metals, covering annealing, quenching, tempering, and microstructure-property evolution. Show furnace heating, hold stage, controlled cooling versus rapid quenching, and the resulting changes in grain structure, hardness, toughness, and residual stress. Include clear arrows, compact panel layout, and concise English labels suitable for a journal-style explanatory figure." \
  --materials-figure processing-workflow \
  --lang en \
  --style-note "Use a clean publication-style schematic suitable for a metallurgy lecture slide and a materials journal overview figure." \
  --aspect-ratio 4:3 \
  --image-size 2K \
  --api-key-file ./.secrets/nanobanana_api_key
```

## Notes

- The skill follows the official Gemini `generateContent` request shape and only swaps in Zhizengzeng's base URL and API key.
- For attachment-only chat images, exact pixel-preserving editing may still require access to a real file path.
- Generated figures are best treated as first-pass publication visuals; exact scientific typography and quantitative plots should still be reviewed by a human.
