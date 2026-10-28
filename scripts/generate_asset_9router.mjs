import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";

// 1. Resolve 9Router API credentials
function getApiKey() {
  const envKey = process.env.MINHMICE_API_KEY || process.env.NINEROUTER_API_KEY;
  if (envKey) return envKey;

  const agentEnvPath = path.join(os.homedir(), ".omp", "agent", ".env");
  if (fs.existsSync(agentEnvPath)) {
    const content = fs.readFileSync(agentEnvPath, "utf-8");
    const match = content.match(/MINHMICE_API_KEY\s*=\s*["']?([^"'\s\r\n]+)["']?/);
    if (match) return match[1];
  }
  throw new Error("MINHMICE_API_KEY not found in environment or ~/.omp/agent/.env");
}

const BASE_URL = process.env.NINEROUTER_BASE_URL || "https://9router.minhmice.com/v1";
const MODEL = "cx/gpt-image-2.5";

// 2. Generate image via 9Router
export async function generateImage(prompt, size = "1024x1024", retries = 3) {
  const apiKey = getApiKey();
  const endpoint = `${BASE_URL}/images/generations`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[9Router] Calling ${MODEL} (attempt ${attempt}/${retries})...`);
      const startTime = Date.now();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          prompt,
          size,
          background: "transparent"
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const json = await res.json();
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[9Router] Success in ${elapsed}s`);

      if (json.data && json.data[0]) {
        if (json.data[0].b64_json) {
          return Buffer.from(json.data[0].b64_json, "base64");
        } else if (json.data[0].url) {
          const imgRes = await fetch(json.data[0].url);
          const arrayBuf = await imgRes.arrayBuffer();
          return Buffer.from(arrayBuf);
        }
      }
      throw new Error("No image data found in response: " + JSON.stringify(json));
    } catch (err) {
      console.warn(`[9Router] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) throw err;
      const delay = attempt * 5000;
      console.log(`[9Router] Waiting ${delay / 1000}s before retry...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// 3. Save buffer and convert to WebP / PNG
export function saveOptimizedImage(buffer, outPngPath, outWebpPath, targetHeight = 1200) {
  // Ensure directory exists
  const dir = path.dirname(outPngPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write PNG first
  fs.writeFileSync(outPngPath, buffer);

  // Use python3 PIL to scale & convert to WebP
  const pyScript = `
import sys
from PIL import Image

in_path = sys.argv[1]
out_webp = sys.argv[2]
max_h = int(sys.argv[3])

img = Image.open(in_path)
w, h = img.size
if max_h > 0 and h > max_h:
    new_w = int(w * (max_h / h))
    img = img.resize((new_w, max_h), Image.Resampling.LANCZOS)

img.save(out_webp, "WEBP", quality=90, method=6)
print(f"Saved {out_webp} ({img.size[0]}x{img.size[1]})")
`;

  if (outWebpPath) {
    const webpDir = path.dirname(outWebpPath);
    if (!fs.existsSync(webpDir)) {
      fs.mkdirSync(webpDir, { recursive: true });
    }
    execSync(`python3 -c '${pyScript}' "${outPngPath}" "${outWebpPath}" ${targetHeight}`);
  }
}
