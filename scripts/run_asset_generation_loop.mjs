import fs from "node:fs";
import { generateImage, saveOptimizedImage } from "./generate_asset_9router.mjs";
import { ASSET_QUEUE } from "./asset_queue.mjs";

const PROGRESS_FILE = "asset-source/GENERATION_PROGRESS.json";

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf-8");
}

async function main() {
  console.log(`[LoopRunner] Total items in queue: ${ASSET_QUEUE.length}`);
  const progress = loadProgress();

  let completedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < ASSET_QUEUE.length; i++) {
    const item = ASSET_QUEUE[i];
    console.log(`\n============================================================`);
    console.log(`[Item ${i + 1}/${ASSET_QUEUE.length}] [${item.category.toUpperCase()}] ${item.name} (${item.id})`);
    console.log(`Target: ${item.outWebp}`);

    // Check if already generated
    if (fs.existsSync(item.outWebp) && fs.statSync(item.outWebp).size > 1000) {
      console.log(`[Skip] Already exists (${fs.statSync(item.outWebp).size} bytes).`);
      skippedCount++;
      continue;
    }

    try {
      console.log(`[Generating] Sending prompt to 9Router cx/gpt-image-2.5...`);
      const buffer = await generateImage(item.prompt, "1024x1024", 3);
      console.log(`[Received] Buffer ${buffer.length} bytes. Saving & converting...`);

      saveOptimizedImage(buffer, item.outPng, item.outWebp, item.maxH);

      const stat = fs.statSync(item.outWebp);
      console.log(`[Saved] ${item.outWebp} (${stat.size} bytes)`);

      progress[item.id] = {
        name: item.name,
        category: item.category,
        outPng: item.outPng,
        outWebp: item.outWebp,
        sizeBytes: stat.size,
        timestamp: new Date().toISOString()
      };
      saveProgress(progress);
      completedCount++;

      // Small pause between items to prevent hitting rate limits
      console.log(`[Cooldown] Waiting 3 seconds before next asset...`);
      await new Promise(r => setTimeout(r, 3000));
    } catch (err) {
      console.error(`[Error] Failed to generate ${item.id}: ${err.message}`);
      progress[item.id] = {
        name: item.name,
        error: err.message,
        timestamp: new Date().toISOString()
      };
      saveProgress(progress);
      console.log(`[Continuing] Moving to next asset in queue...`);
    }
  }

  console.log(`\n============================================================`);
  console.log(`[LoopRunner Finished] Generated: ${completedCount}, Skipped: ${skippedCount}, Total: ${ASSET_QUEUE.length}`);
}

main().catch(err => {
  console.error("Fatal runner error:", err);
  process.exit(1);
});
