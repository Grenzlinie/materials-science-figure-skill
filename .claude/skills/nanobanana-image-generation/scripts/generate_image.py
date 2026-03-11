#!/usr/bin/env python3
"""Generate or edit images with the Gemini generateContent API."""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


DEFAULT_BASE_URL = "https://api.zhizengzeng.com/google"
DEFAULT_MODEL = "gemini-3.1-flash-image-preview"
DEFAULT_TIMEOUT = 120
MATERIALS_FIGURE_TEMPLATES = {
    "graphical-abstract": {
        "en": """Create a publication-quality graphical abstract for a materials-science paper. The figure should synthesize the core scientific story into a compact, high-clarity visual summary on a white background.

Foreground the central materials entities, such as composition, phases, defects, interfaces, microstructure, device layers, transport pathways, or reaction intermediates. Show the most important cause-and-effect chain with explicit directional arrows, for example synthesis or processing -> structure or defects -> property -> performance.

Use a clean, balanced layout suitable for Nature-family journals. Apply a colorblind-friendly palette. Use neutral gray or black for scaffolds and non-focal elements. Keep typography concise and professional. Avoid unsupported or speculative claims. If exact values are not provided, use qualitative labels or placeholders.

Output at journal-ready high resolution, legible at single-column width, with modular elements suitable for later editing in Adobe Illustrator.

Scientific Background:
{background}""",
        "zh": """创建一张适用于材料科学论文的高质量 graphical abstract。整张图应在白色背景上，以紧凑、清晰、适合投稿的方式概括核心科学故事。

突出最关键的材料科学对象与变量，例如成分、物相、缺陷、界面、微观结构、器件层、传输路径或反应中间体。用明确的方向箭头展示最重要的因果链，例如 合成或加工 -> 结构或缺陷 -> 性能参数 -> 最终表现。

采用接近 Nature 系期刊的整洁平衡布局。使用色盲友好配色。结构支撑、基底和非重点元素用中性灰或黑色。文字简洁、专业、易读。避免无依据或推测性表述；若未提供精确数值，则使用定性标签或占位符，不要编造数据。

输出应为白底、期刊级高分辨率、单栏宽度下仍清晰可读，并具有便于后续在 Adobe Illustrator 中编辑的模块化结构。

Scientific Background:
{background}""",
    },
    "mechanism-figure": {
        "en": """Create a publication-quality materials-science mechanism figure that explains the dominant structure-property-performance relationship inferred from the scientific context.

The figure should foreground scientifically central entities such as composition, phases, crystal structure, defects, interfaces, diffusion pathways, stress states, adsorption sites, charge-transfer routes, crack initiation sites, or reaction intermediates. Make causality explicit with labeled arrows, for example processing -> microstructure or defects -> governing mechanism -> measured property -> application performance.

Use consistent visual encoding across panels so the same color represents the same phase, state, or functional role. Include legends, units, and scale cues where appropriate. Apply a colorblind-friendly Nature-style palette with neutral gray or black for non-focal structure. Avoid unsupported claims and fabricated quantitative detail.

Output on a white background with a professional panel layout, clear labels, and journal-ready resolution.

Scientific Background:
{background}""",
        "zh": """创建一张适用于材料科学论文的高质量机理示意图，用来解释由科学背景推断出的主导性“结构-性质-性能”关系。

图中应突出关键科学对象，例如成分、物相、晶体结构、缺陷、界面、扩散路径、应力状态、吸附位点、电荷传输路径、裂纹萌生位置或反应中间体。用带标签的箭头明确表达因果关系，例如 加工 -> 微观结构或缺陷 -> 主导机理 -> 测得性质 -> 应用表现。

跨 panel 使用一致的视觉编码，同一种颜色始终表示同一物相、状态或功能角色；在适当情况下加入图例、单位和尺度提示。采用适合 Nature 风格的色盲友好配色，非焦点结构使用中性灰或黑色。避免无依据结论和虚构定量细节。

输出为白色背景、专业 panel 布局、标签清晰、适合期刊分辨率的机理图。

Scientific Background:
{background}""",
    },
    "device-architecture": {
        "en": """Create a publication-quality materials-science device architecture figure. Focus on the layered structure, interfaces, active materials, transport directions, contacts, and the role of each functional region.

Clearly show device layers, compositions, interfaces, electrodes or contacts, transport pathways, field directions, and any relevant processing or testing conditions. Use arrows and annotations to explain how architecture influences charge transport, ionic transport, stress distribution, optical behavior, catalytic activity, or other device-relevant mechanisms.

Use a clean white background, a balanced panel layout, a colorblind-friendly palette, and professional journal-style typography. Keep non-focal scaffolding neutral. Avoid unsupported or speculative details. If numerical parameters are not given, use qualitative labels or placeholders.

Output at high resolution with modular, vector-friendly panel composition suitable for later editing.

Scientific Background:
{background}""",
        "zh": """创建一张适用于材料科学论文的高质量器件结构图。重点表现层状结构、界面、活性材料、传输方向、电极或接触以及各功能区域的作用。

清晰展示器件层、组成、界面、电极或接触、传输路径、电场或流向，以及相关加工条件或测试条件。使用箭头和注释解释器件结构如何影响电荷传输、离子迁移、应力分布、光学行为、催化活性或其他与器件性能相关的机理。

采用白色背景、平衡的 panel 布局、色盲友好配色和专业期刊风格字体。非重点结构保持中性。避免无依据或推测性细节；若未提供数值参数，则使用定性标签或占位符。

输出应为高分辨率，并具有便于后续编辑的模块化、矢量风格 panel 结构。

Scientific Background:
{background}""",
    },
    "processing-workflow": {
        "en": """Create a publication-quality materials-science processing workflow figure. The figure should explain the experimental route from precursor selection and synthesis or deposition steps through structural evolution and final testing.

Highlight central materials entities such as precursor chemistry, processing conditions, phase evolution, defects, grain growth, porosity, interfaces, and final structure-property relationships. Include key parameters when provided, such as temperature, time, rate, atmosphere, concentration, pH, pressure, power, thickness, or loading mode. Show the process as an explicit directional workflow with arrows and concise mechanistic annotations.

Use a white background, clean panel grid, professional typography, consistent color mapping, and a colorblind-friendly journal palette. Keep the figure readable at single-column width and avoid unsupported claims or fabricated values.

Scientific Background:
{background}""",
        "zh": """创建一张适用于材料科学论文的高质量加工流程图。该图应解释从前驱体选择、合成或沉积步骤，到结构演化以及最终测试评价的完整实验路线。

突出关键材料对象与变量，例如前驱体化学、加工条件、相演化、缺陷、晶粒生长、孔隙、界面以及最终的结构-性质关系。在用户提供时纳入关键参数，例如温度、时间、升降温速率、气氛、浓度、pH、压力、功率、厚度或加载方式。用明确的箭头和简洁的机理注释展示流程方向。

采用白色背景、整洁 panel 网格、专业字体、一致的颜色映射和色盲友好期刊配色。确保单栏宽度下仍清晰可读，并避免无依据表述或虚构数据。

Scientific Background:
{background}""",
    },
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate or edit images with Gemini generateContent.")
    parser.add_argument("prompt", nargs="?", help="Prompt text or scientific background for shortcut modes.")
    parser.add_argument(
        "--materials-figure",
        choices=tuple(MATERIALS_FIGURE_TEMPLATES.keys()),
        help="Use a built-in materials-science figure template.",
    )
    parser.add_argument(
        "--lang",
        choices=("en", "zh"),
        default="en",
        help="Template output language for shortcut modes.",
    )
    parser.add_argument(
        "--style-note",
        help="Optional extra style constraint appended after a shortcut template.",
    )
    parser.add_argument(
        "--input-image",
        action="append",
        default=[],
        help="Input image path. Repeat to provide multiple reference images.",
    )
    parser.add_argument("--out-dir", default="./output/nanobanana", help="Output directory.")
    parser.add_argument("--prefix", default="nanobanana", help="Saved filename prefix.")
    parser.add_argument("--base-url", default=os.getenv("NANOBANANA_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--model", default=os.getenv("NANOBANANA_MODEL", DEFAULT_MODEL))
    parser.add_argument(
        "--api-key",
        default=os.getenv("NANOBANANA_API_KEY"),
        help="API key. Defaults to NANOBANANA_API_KEY.",
    )
    parser.add_argument(
        "--api-key-file",
        default=os.getenv("NANOBANANA_API_KEY_FILE"),
        help="Path to a file containing the API key. Preferred when you do not want the key shown in the command line.",
    )
    parser.add_argument(
        "--aspect-ratio",
        help="Official Gemini image aspect ratio, e.g. 1:1, 16:9, 3:2.",
    )
    parser.add_argument(
        "--image-size",
        help="Official Gemini image size, e.g. 512, 1K, 2K, 4K.",
    )
    parser.add_argument(
        "--text-only",
        action="store_true",
        help="Request only text output.",
    )
    parser.add_argument(
        "--include-thoughts",
        action="store_true",
        help="Request returned thoughts when the provider supports it.",
    )
    parser.add_argument(
        "--thinking-level",
        choices=("minimal", "high", "Minimal", "High"),
        help="Gemini 3.1 Flash Image thinking level.",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=int(os.getenv("NANOBANANA_TIMEOUT", str(DEFAULT_TIMEOUT))),
        help="HTTP timeout in seconds.",
    )
    return parser


def file_to_inline_part(path_str: str) -> dict:
    path = Path(path_str)
    if not path.is_file():
        raise SystemExit(f"Input image not found: {path}")
    mime_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return {
        "inlineData": {
            "mimeType": mime_type,
            "data": base64.b64encode(path.read_bytes()).decode("ascii"),
        }
    }


def resolve_prompt(args: argparse.Namespace) -> str:
    if args.materials_figure:
        if not args.prompt:
            raise SystemExit("Provide scientific background as the positional prompt when using --materials-figure.")
        template = MATERIALS_FIGURE_TEMPLATES[args.materials_figure][args.lang]
        prompt = template.format(background=args.prompt)
        if args.style_note:
            prompt = f"{prompt}\n\nAdditional Style Requirement:\n{args.style_note}"
        return prompt

    if not args.prompt:
        raise SystemExit("Missing prompt.")
    return args.prompt


def resolve_api_key(args: argparse.Namespace) -> str:
    if args.api_key:
        return args.api_key
    if args.api_key_file:
        path = Path(args.api_key_file)
        if not path.is_file():
            raise SystemExit(f"API key file not found: {path}")
        return path.read_text(encoding="utf-8").strip()
    raise SystemExit("Missing API key. Set NANOBANANA_API_KEY, NANOBANANA_API_KEY_FILE, or pass --api-key.")


def build_payload(args: argparse.Namespace) -> dict:
    parts = [{"text": resolve_prompt(args)}]
    parts.extend(file_to_inline_part(path_str) for path_str in args.input_image)

    payload = {
        "contents": [
            {
                "parts": parts,
            }
        ]
    }

    generation_config: dict = {}
    generation_config["responseModalities"] = ["TEXT"] if args.text_only else ["TEXT", "IMAGE"]

    image_config: dict = {}
    if args.aspect_ratio:
        image_config["aspectRatio"] = args.aspect_ratio
    if args.image_size:
        image_config["imageSize"] = args.image_size
    if image_config:
        generation_config["imageConfig"] = image_config

    thinking_config: dict = {}
    if args.thinking_level:
        thinking_config["thinkingLevel"] = args.thinking_level
    if args.include_thoughts:
        thinking_config["includeThoughts"] = True
    if thinking_config:
        generation_config["thinkingConfig"] = thinking_config

    if generation_config:
        payload["generationConfig"] = generation_config

    return payload


def request_json(args: argparse.Namespace) -> dict:
    api_key = resolve_api_key(args)

    request = urllib.request.Request(
        f"{args.base_url.rstrip('/')}/v1beta/models/{args.model}:generateContent",
        data=json.dumps(build_payload(args)).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "X-goog-api-key": api_key,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=args.timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Request failed with HTTP {exc.code}: {body}") from exc
    except urllib.error.URLError as exc:
        raise SystemExit(f"Request failed: {exc.reason}") from exc


def save_parts(response_json: dict, out_dir: Path, prefix: str) -> list[str]:
    candidates = response_json.get("candidates") or []
    if not candidates:
        raise SystemExit(f"Unexpected response shape: {json.dumps(response_json, ensure_ascii=False)}")

    parts = ((candidates[0].get("content") or {}).get("parts")) or []
    if not parts:
        raise SystemExit(f"Unexpected response shape: {json.dumps(response_json, ensure_ascii=False)}")

    out_dir.mkdir(parents=True, exist_ok=True)
    outputs: list[str] = []
    image_index = 0
    text_index = 0

    for part in parts:
        text = part.get("text")
        if text:
            text_index += 1
            path = out_dir / f"{prefix}-text-{text_index}.txt"
            path.write_text(text, encoding="utf-8")
            outputs.append(str(path))
            continue

        inline_data = part.get("inlineData") or part.get("inline_data")
        if not inline_data:
            continue

        image_index += 1
        mime_type = inline_data.get("mimeType") or inline_data.get("mime_type") or "image/png"
        extension = mimetypes.guess_extension(mime_type) or ".png"
        path = out_dir / f"{prefix}-{image_index}{extension}"
        path.write_bytes(base64.b64decode(inline_data["data"]))
        outputs.append(str(path))

    if not outputs:
        raise SystemExit(f"No text or image parts found: {json.dumps(response_json, ensure_ascii=False)}")
    return outputs


def main() -> int:
    args = build_parser().parse_args()
    response_json = request_json(args)
    for output in save_parts(response_json, Path(args.out_dir), args.prefix):
        print(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
