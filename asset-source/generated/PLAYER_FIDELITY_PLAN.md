# Player identity and style fidelity plan

Historical failure references to `04–07` below now mean archived files in `player-redo/previous/` (`04-source.png` through `07-source.png`). Current player source/runtime `04–07` were regenerated from original02; see `player-redo/manifest.json`.

## Goal
Recreate only the player in the three supplied originals; separate reusable identity and drawing-style prompts, then evaluate actual individually generated 9Router images. Preserve originals and runtime until visual evidence supports replacement.

## Evidence and diagnosis
- Canonical PNGs: `asset-source/characters/player/{01,02,03}.png`. Actual source dimensions 1800×1800; chat preview is 1568×1568.
- Generated `04.png` visibly changes identity (dark realistic hair/face, missing headband/daisy), clothing (embroidered apron bib), framing and rendering (semi-realistic portrait). Generic stylistic adjectives did not constrain design.
- Existing generator sends text only; historical `ASSET_PROMPTS.md` documents an image data URL reference for shop generation. Historical documentation alone does not establish current API behavior.

## Approach
Text-only prompt is a reproducibility baseline, not expected to lock identity. Prefer original-reference expression edits; mask-supported local edits may improve preservation if current endpoint genuinely supports them. IP-Adapter/control pipelines are research alternatives, not installed dependencies or assumed 9Router features. No exact-match guarantee from prompt wording alone.

## Work sequence
1. Parallel specialist artifacts: `player-identity-prompt.md`, `player-style-prompt.md`, `player-reference-research.md`. Parent integrates and owns API writes.
2. Same sad-expression task: generate one text-only baseline and one original-reference candidate, each separate request using `cx/gpt-image-2.5`, explicit transparent background. Store under `asset-source/generated/player-fidelity/`, never over originals.
3. Inspect each output directly beside original. Record identity, silhouette/accessories, clothing/prop, rendering, crop/pose, expression and actual alpha; distinguish visual judgement from calculated measurements.
4. Correct observed drift, then generate separate expression candidates from original `02.png` rather than chaining generated images. User asked happy/sad/mid: original neutral and happy already serve as canonical references; reproduction trials measure fidelity before broader variants.
5. Keep selected prompts, exact payload metadata excluding credentials, reference SHA-256 and results. No app or character mapping expansion in this phase.

## Acceptance and verification
- Character: slate-indigo outward-flipped short hair, black headband, white daisy on viewer-left, amber eyes; cream collared rolled-sleeve shirt, olive V-neck vest with cream stripe, dark waist apron, blue spray bottle and consistent three-quarter stance.
- Style: rough charcoal/pencil-like outlines, low-detail flat matte colors, restrained simple shadows, large stylized eyes; not realistic facial anatomy, detailed individual hair strands or painterly portrait lighting.
- Expression changes remain subordinate to identity. Detect silhouette/wardrobe drift even when image looks attractive.
- Decode PNGs and measure alpha/extents; visual inspection mandatory. Whole-image pixel similarity alone is not proof, especially with much transparent canvas.
- Consistency: inspect all generator call sites before any shared interface change. Scope: trials/documents only; no runtime replacement without evidence. If source changes become necessary, run entire affected test file/module, not a selected assertion. Existing full suite results belong to earlier work, not evidence for these new trials.
