#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_BASE_URL = process.env.NANOBANANA_BASE_URL || "https://api.zhizengzeng.com/google";
const DEFAULT_MODEL = process.env.NANOBANANA_MODEL || "gemini-3.1-flash-image-preview";
const DEFAULT_TIMEOUT = Number(process.env.NANOBANANA_TIMEOUT || "120");
const MATERIALS_FIGURE_TEMPLATES = {
  "graphical-abstract": {
    en: `Create a publication-quality graphical abstract for a materials-science paper. The figure should synthesize the core scientific story into a compact, high-clarity visual summary on a white background.

Foreground the central materials entities, such as composition, phases, defects, interfaces, microstructure, device layers, transport pathways, or reaction intermediates. Show the most important cause-and-effect chain with explicit directional arrows, for example synthesis or processing -> structure or defects -> property -> performance.

Use a clean, balanced layout suitable for Nature-family journals. Apply a colorblind-friendly palette. Use neutral gray or black for scaffolds and non-focal elements. Keep typography concise and professional. Avoid unsupported or speculative claims. If exact values are not provided, use qualitative labels or placeholders.

Output at journal-ready high resolution, legible at single-column width, with modular elements suitable for later editing in Adobe Illustrator.

Scientific Background:
{background}`,
    zh: `创建一张适用于材料科学论文的高质量 graphical abstract。整张图应在白色背景上，以紧凑、清晰、适合投稿的方式概括核心科学故事。

突出最关键的材料科学对象与变量，例如成分、物相、缺陷、界面、微观结构、器件层、传输路径或反应中间体。用明确的方向箭头展示最重要的因果链，例如 合成或加工 -> 结构或缺陷 -> 性能参数 -> 最终表现。

采用接近 Nature 系期刊的整洁平衡布局。使用色盲友好配色。结构支撑、基底和非重点元素用中性灰或黑色。文字简洁、专业、易读。避免无依据或推测性表述；若未提供精确数值，则使用定性标签或占位符，不要编造数据。

输出应为白底、期刊级高分辨率、单栏宽度下仍清晰可读，并具有便于后续在 Adobe Illustrator 中编辑的模块化结构。

Scientific Background:
{background}`,
  },
  "mechanism-figure": {
    en: `Create a publication-quality materials-science mechanism figure that explains the dominant structure-property-performance relationship inferred from the scientific context.

The figure should foreground scientifically central entities such as composition, phases, crystal structure, defects, interfaces, diffusion pathways, stress states, adsorption sites, charge-transfer routes, crack initiation sites, or reaction intermediates. Make causality explicit with labeled arrows, for example processing -> microstructure or defects -> governing mechanism -> measured property -> application performance.

Use consistent visual encoding across panels so the same color represents the same phase, state, or functional role. Include legends, units, and scale cues where appropriate. Apply a colorblind-friendly Nature-style palette with neutral gray or black for non-focal structure. Avoid unsupported claims and fabricated quantitative detail.

Output on a white background with a professional panel layout, clear labels, and journal-ready resolution.

Scientific Background:
{background}`,
    zh: `创建一张适用于材料科学论文的高质量机理示意图，用来解释由科学背景推断出的主导性“结构-性质-性能”关系。

图中应突出关键科学对象，例如成分、物相、晶体结构、缺陷、界面、扩散路径、应力状态、吸附位点、电荷传输路径、裂纹萌生位置或反应中间体。用带标签的箭头明确表达因果关系，例如 加工 -> 微观结构或缺陷 -> 主导机理 -> 测得性质 -> 应用表现。

跨 panel 使用一致的视觉编码，同一种颜色始终表示同一物相、状态或功能角色；在适当情况下加入图例、单位和尺度提示。采用适合 Nature 风格的色盲友好配色，非焦点结构使用中性灰或黑色。避免无依据结论和虚构定量细节。

输出为白色背景、专业 panel 布局、标签清晰、适合期刊分辨率的机理图。

Scientific Background:
{background}`,
  },
  "device-architecture": {
    en: `Create a publication-quality materials-science device architecture figure. Focus on the layered structure, interfaces, active materials, transport directions, contacts, and the role of each functional region.

Clearly show device layers, compositions, interfaces, electrodes or contacts, transport pathways, field directions, and any relevant processing or testing conditions. Use arrows and annotations to explain how architecture influences charge transport, ionic transport, stress distribution, optical behavior, catalytic activity, or other device-relevant mechanisms.

Use a clean white background, a balanced panel layout, a colorblind-friendly palette, and professional journal-style typography. Keep non-focal scaffolding neutral. Avoid unsupported or speculative details. If numerical parameters are not given, use qualitative labels or placeholders.

Output at high resolution with modular, vector-friendly panel composition suitable for later editing.

Scientific Background:
{background}`,
    zh: `创建一张适用于材料科学论文的高质量器件结构图。重点表现层状结构、界面、活性材料、传输方向、电极或接触以及各功能区域的作用。

清晰展示器件层、组成、界面、电极或接触、传输路径、电场或流向，以及相关加工条件或测试条件。使用箭头和注释解释器件结构如何影响电荷传输、离子迁移、应力分布、光学行为、催化活性或其他与器件性能相关的机理。

采用白色背景、平衡的 panel 布局、色盲友好配色和专业期刊风格字体。非重点结构保持中性。避免无依据或推测性细节；若未提供数值参数，则使用定性标签或占位符。

输出应为高分辨率，并具有便于后续编辑的模块化、矢量风格 panel 结构。

Scientific Background:
{background}`,
  },
  "processing-workflow": {
    en: `Create a publication-quality materials-science processing workflow figure. The figure should explain the experimental route from precursor selection and synthesis or deposition steps through structural evolution and final testing.

Highlight central materials entities such as precursor chemistry, processing conditions, phase evolution, defects, grain growth, porosity, interfaces, and final structure-property relationships. Include key parameters when provided, such as temperature, time, rate, atmosphere, concentration, pH, pressure, power, thickness, or loading mode. Show the process as an explicit directional workflow with arrows and concise mechanistic annotations.

Use a white background, clean panel grid, professional typography, consistent color mapping, and a colorblind-friendly journal palette. Keep the figure readable at single-column width and avoid unsupported claims or fabricated values.

Scientific Background:
{background}`,
    zh: `创建一张适用于材料科学论文的高质量加工流程图。该图应解释从前驱体选择、合成或沉积步骤，到结构演化以及最终测试评价的完整实验路线。

突出关键材料对象与变量，例如前驱体化学、加工条件、相演化、缺陷、晶粒生长、孔隙、界面以及最终的结构-性质关系。在用户提供时纳入关键参数，例如温度、时间、升降温速率、气氛、浓度、pH、压力、功率、厚度或加载方式。用明确的箭头和简洁的机理注释展示流程方向。

采用白色背景、整洁 panel 网格、专业字体、一致的颜色映射和色盲友好期刊配色。确保单栏宽度下仍清晰可读，并避免无依据表述或虚构数据。

Scientific Background:
{background}`,
  },
};

function parseArgs(argv) {
  const args = {
    prompt: "",
    materialsFigure: "",
    lang: "en",
    styleNote: "",
    inputImages: [],
    outDir: "./output/nanobanana",
    prefix: "nanobanana",
    baseUrl: DEFAULT_BASE_URL,
    model: DEFAULT_MODEL,
    apiKey: process.env.NANOBANANA_API_KEY || "",
    apiKeyFile: process.env.NANOBANANA_API_KEY_FILE || "",
    aspectRatio: "",
    imageSize: "",
    textOnly: false,
    includeThoughts: false,
    thinkingLevel: "",
    timeout: DEFAULT_TIMEOUT,
  };

  const parts = [...argv];
  if (parts.length === 0) {
    throw new Error("Usage: node scripts/generate_image.js \"prompt\" [--input-image file.png]");
  }

  args.prompt = parts.shift();
  while (parts.length > 0) {
    const key = parts.shift();
    if (key === "--text-only") {
      args.textOnly = true;
      continue;
    }
    if (key === "--include-thoughts") {
      args.includeThoughts = true;
      continue;
    }

    const value = parts.shift();
    if (!value) {
      throw new Error(`Missing value for ${key}`);
    }

    switch (key) {
      case "--input-image":
        args.inputImages.push(value);
        break;
      case "--materials-figure":
        args.materialsFigure = value;
        break;
      case "--lang":
        args.lang = value;
        break;
      case "--style-note":
        args.styleNote = value;
        break;
      case "--out-dir":
        args.outDir = value;
        break;
      case "--prefix":
        args.prefix = value;
        break;
      case "--base-url":
        args.baseUrl = value;
        break;
      case "--model":
        args.model = value;
        break;
      case "--api-key":
        args.apiKey = value;
        break;
      case "--api-key-file":
        args.apiKeyFile = value;
        break;
      case "--aspect-ratio":
        args.aspectRatio = value;
        break;
      case "--image-size":
        args.imageSize = value;
        break;
      case "--thinking-level":
        args.thinkingLevel = value;
        break;
      case "--timeout":
        args.timeout = Number(value);
        break;
      default:
        throw new Error(`Unknown argument: ${key}`);
    }
  }

  return args;
}

function imagePathToPart(imagePath) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Input image not found: ${imagePath}`);
  }
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === ".jpg" || ext === ".jpeg"
    ? "image/jpeg"
    : ext === ".webp"
      ? "image/webp"
      : "image/png";

  return {
    inlineData: {
      mimeType,
      data: fs.readFileSync(imagePath).toString("base64"),
    },
  };
}

function resolvePrompt(args) {
  if (args.materialsFigure) {
    const subtype = MATERIALS_FIGURE_TEMPLATES[args.materialsFigure];
    if (!subtype) {
      throw new Error(`Unknown materials figure subtype: ${args.materialsFigure}`);
    }
    if (!args.prompt) {
      throw new Error("Provide scientific background as the positional prompt when using --materials-figure.");
    }
    let prompt = subtype[args.lang].replace("{background}", args.prompt);
    if (args.styleNote) {
      prompt += `\n\nAdditional Style Requirement:\n${args.styleNote}`;
    }
    return prompt;
  }

  if (!args.prompt) {
    throw new Error("Missing prompt.");
  }
  return args.prompt;
}

function resolveApiKey(args) {
  if (args.apiKey) {
    return args.apiKey;
  }
  if (args.apiKeyFile) {
    if (!fs.existsSync(args.apiKeyFile)) {
      throw new Error(`API key file not found: ${args.apiKeyFile}`);
    }
    return fs.readFileSync(args.apiKeyFile, "utf8").trim();
  }
  throw new Error("Missing API key. Set NANOBANANA_API_KEY, NANOBANANA_API_KEY_FILE, or pass --api-key.");
}

function buildPayload(args) {
  const parts = [{ text: resolvePrompt(args) }, ...args.inputImages.map(imagePathToPart)];
  const payload = {
    contents: [
      {
        parts,
      },
    ],
    generationConfig: {
      responseModalities: args.textOnly ? ["TEXT"] : ["TEXT", "IMAGE"],
    },
  };

  if (args.aspectRatio || args.imageSize) {
    payload.generationConfig.imageConfig = {};
    if (args.aspectRatio) {
      payload.generationConfig.imageConfig.aspectRatio = args.aspectRatio;
    }
    if (args.imageSize) {
      payload.generationConfig.imageConfig.imageSize = args.imageSize;
    }
  }

  if (args.thinkingLevel || args.includeThoughts) {
    payload.generationConfig.thinkingConfig = {};
    if (args.thinkingLevel) {
      payload.generationConfig.thinkingConfig.thinkingLevel = args.thinkingLevel;
    }
    if (args.includeThoughts) {
      payload.generationConfig.thinkingConfig.includeThoughts = true;
    }
  }

  return payload;
}

async function requestJson(args) {
  const apiKey = resolveApiKey(args);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), args.timeout * 1000);

  try {
    const response = await fetch(
      `${args.baseUrl.replace(/\/$/, "")}/v1beta/models/${args.model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify(buildPayload(args)),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed with HTTP ${response.status}: ${text}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function mimeToExt(mimeType) {
  if (!mimeType) return ".png";
  if (mimeType.includes("jpeg")) return ".jpg";
  if (mimeType.includes("webp")) return ".webp";
  return ".png";
}

function saveOutputs(json, args) {
  const candidates = json.candidates || [];
  if (!candidates.length || !candidates[0].content || !Array.isArray(candidates[0].content.parts)) {
    throw new Error(`Unexpected response shape: ${JSON.stringify(json)}`);
  }

  fs.mkdirSync(args.outDir, { recursive: true });
  let imageIndex = 0;
  let textIndex = 0;

  for (const part of candidates[0].content.parts) {
    if (part.text) {
      textIndex += 1;
      const filePath = path.join(args.outDir, `${args.prefix}-text-${textIndex}.txt`);
      fs.writeFileSync(filePath, part.text, "utf8");
      console.log(filePath);
      continue;
    }

    const inlineData = part.inlineData || part.inline_data;
    if (!inlineData || !inlineData.data) {
      continue;
    }

    imageIndex += 1;
    const filePath = path.join(
      args.outDir,
      `${args.prefix}-${imageIndex}${mimeToExt(inlineData.mimeType || inlineData.mime_type)}`,
    );
    fs.writeFileSync(filePath, Buffer.from(inlineData.data, "base64"));
    console.log(filePath);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const json = await requestJson(args);
  saveOutputs(json, args);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
