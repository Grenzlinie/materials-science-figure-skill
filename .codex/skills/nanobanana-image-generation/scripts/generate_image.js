#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_BASE_URL = process.env.NANOBANANA_BASE_URL || "https://api.zhizengzeng.com/google";
const DEFAULT_MODEL = process.env.NANOBANANA_MODEL || "gemini-3.1-flash-image-preview";
const DEFAULT_TIMEOUT = Number(process.env.NANOBANANA_TIMEOUT || "120");

function loadMaterialsFigureTemplates() {
  const templatePath = path.join(__dirname, "..", "references", "materials-science-figure-templates.json");
  return JSON.parse(fs.readFileSync(templatePath, "utf8"));
}

function parseArgs(argv) {
  const args = {
    prompt: "",
    promptFile: "",
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
    printPrompt: false,
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
    if (key === "--print-prompt") {
      args.printPrompt = true;
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
      case "--prompt-file":
        args.promptFile = value;
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
  let rawPrompt = args.prompt;
  if (args.promptFile) {
    if (!fs.existsSync(args.promptFile)) {
      throw new Error(`Prompt file not found: ${args.promptFile}`);
    }
    rawPrompt = fs.readFileSync(args.promptFile, "utf8");
  }

  if (args.materialsFigure) {
    const subtype = loadMaterialsFigureTemplates()[args.materialsFigure];
    if (!subtype) {
      throw new Error(`Unknown materials figure subtype: ${args.materialsFigure}`);
    }
    if (!rawPrompt) {
      throw new Error("Provide scientific background as the positional prompt when using --materials-figure.");
    }
    let prompt = subtype[args.lang].replace("{background}", rawPrompt.trim());
    if (args.styleNote) {
      prompt += `\n\nAdditional Style Requirement:\n${args.styleNote}`;
    }
    return prompt;
  }

  if (!rawPrompt) {
    throw new Error("Missing prompt.");
  }
  return rawPrompt;
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
  if (args.printPrompt) {
    process.stdout.write(`${resolvePrompt(args)}\n`);
    return;
  }
  const json = await requestJson(args);
  saveOutputs(json, args);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
