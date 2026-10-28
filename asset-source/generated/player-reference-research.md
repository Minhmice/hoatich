# 9Router Image Reference & IP-Adapter Research: Character Consistency

## 1. Primary Sources & Evidence Base

### 1.1 Upstream 9Router Gateway Specifications
- **Skill Documentation**: [skills/9router-image/SKILL.md](https://raw.githubusercontent.com/decolua/9router/master/skills/9router-image/SKILL.md) (fetched and verified from `decolua/9router`).
- **Endpoint**: `POST $NINEROUTER_URL/v1/images/generations`
- **Model Family**: Prefix `cx/` (e.g. `cx/gpt-image-2.5`) routes to the `codex` provider backend.
- **Provider Features for `codex`**:
  - Documented fields: `image`, `images[]`, `image_detail`, `output_format`, `background`.
  - Native alpha transparency supported via `background: "transparent"`.
  - Image input accepts base64 data URLs (`data:image/png;base64,...`) or hosted image URLs.

### 1.2 Codebase Precedents
- **`scripts/generate_asset_9router.mjs`**: Active generator implementation sending JSON requests `{ model: "cx/gpt-image-2.5", prompt, size, background: "transparent" }`. Currently wired for text-to-image only.
- **`asset-source/generated/ASSET_PROMPTS.md`**: Historical record for `shop-evening.png` documenting input parameter `image: "data:image/png;base64,...[shop-day.png]"`. Note: while room layout was preserved visually, neural img2img resamples the canvas; it does not provide bit-for-bit pixel preservation.

---

## 2. Observed Trials & Quantitative Analysis

Four trials executed under `asset-source/generated/player-fidelity/` using `cx/gpt-image-2.5` were evaluated directly against canonical originals `asset-source/characters/player/{01,02,03}.png`.

### 2.1 Trial Metadata & Payloads
- **Text-Only Baseline**:
  - Image: `asset-source/generated/player-fidelity/text-sad.png`
  - Payload: `asset-source/generated/player-fidelity/text-sad.payload.json` (`model`, `prompt`, `size: "1024x1024"`, `background: "transparent"`).
  - Outcome: **Identity and style drift**. Generated smoother anime rendering, altered eye shapes, different hair volume, smaller spray bottle, different hand posture, and digital gradient shading rather than rough graphite pencil texture.
- **Reference-Guided img2img Trials**:
  - Inputs: `asset-source/characters/player/02.png` passed as base64 data URL in `image` field to `POST https://9router.minhmice.com/v1/images/generations`.
  - Outputs:
    - `reference-sad.png` (Payload: `reference-sad.payload.json`) -> Sad, downturned mouth, lowered inner brows.
    - `reference-angry.png` (Payload: `reference-angry.payload.json`) -> Mildly annoyed, angled brows, tight mouth.
    - `reference-surprised.png` (Payload: `reference-surprised.payload.json`) -> Mildly surprised, raised brows, small open oval mouth.
  - HTTP Status: **HTTP 200 OK across all calls**.
  - Outcome: **Substantial identity and design retention**. Key signifiers (slate-blue outward-flipped bob hair, top cowlick, black headband, white daisy on viewer-left, amber eyes, cream rolled-sleeve shirt, olive V-neck vest with white stripe, dark waist apron, blue spray bottle) and coarse graphite pencil linework remain consistent. Expressions are subtle and distinct.

### 2.2 Exact PIL Canvas & Extent Measurements

```
+--------------------------+-------------+-----------------------+-------------+
| Asset                    | Canvas Size | Alpha Bounding Box    | Sprite WxH  |
+--------------------------+-------------+-----------------------+-------------+
| original_01.png          | 1800 x 1800 | (467, 46, 1466, 1800) | 999 x 1754  |
| original_02.png          | 1800 x 1800 | (467, 46, 1466, 1800) | 999 x 1754  |
| original_03.png          | 1800 x 1800 | (467, 46, 1466, 1800) | 999 x 1754  |
| text-sad.png             | 1254 x 1254 | (27, 0, 1228, 1254)   | 1201 x 1254 |
| reference-sad.png        | 1254 x 1254 | (49, 31, 1232, 1254)  | 1183 x 1223 |
+--------------------------+-------------+-----------------------+-------------+
```

### 2.3 Exact Non-Zero RGBA Difference in Canonical Originals
Measuring non-zero RGBA pixel deltas between the canonical original sprites:
- `02` (neutral) vs `01` (worried): Difference bounded to `(733, 356, 1026, 633)`, spanning exactly `6,307` non-identical pixels.
- `02` (neutral) vs `03` (happy): Difference bounded to `(846, 347, 1052, 657)`, spanning exactly `2,610` non-identical pixels.
- **Union Locus**: `(733, 347, 1052, 657)` (dimensions: 319 x 310 px).
- **Canvas Coverage**: The union box covers 98,890 pixels, approximately **3.05%** of the 1800x1800 canvas.
- **Preservation Finding**: Outside this 3.05% facial region, 100% of body, clothing, hands, spray bottle, and hair pixels are bit-for-bit identical across originals.

### 2.4 Limitations of Whole-Image Reference Generation
While `reference-*.png` preserves core identity and pencil linework, the generator rescales the whole sprite and alters canvas framing (e.g. 1254x1254 canvas with variable margins). Therefore:
1. Whole-image neural generation **cannot guarantee pixel alignment or identical silhouette bounding boxes** with the original 1800x1800 assets.
2. Styling and line details exhibit subtle local variation between runs.

---

## 3. Untested Alternatives: Diffusion Conditioning & Compositing

### 3.1 IP-Adapter (Decoupled Cross-Attention)
- **Citations**:
  - Ye et al., 2023, *IP-Adapter: Text Compatible Image Prompt Adapter for Text-to-Image Diffusion Models*, Tencent AI Lab. [arXiv:2308.06721](https://arxiv.org/abs/2308.06721).
  - Official Repository: [tencent-ailab/IP-Adapter](https://github.com/tencent-ailab/IP-Adapter).
  - Diffusers Implementation: [Hugging Face IP-Adapter Guide](https://huggingface.co/docs/diffusers/using-diffusers/ip_adapter).
- **Mechanism**: Injects image features via decoupled cross-attention layers into a frozen diffusion UNet.
- **Status in Repo**: **Untested**. Requires local or self-hosted Diffusers/ComfyUI pipelines with model checkpoints (`ip-adapter_sd15`, `ip-adapter-plus_sdxl_vit-h`). Not accessible via 9Router's hosted `cx/` endpoints.

### 3.2 ControlNet Reference-Only
- **Citation**: Mikubill et al., [sd-webui-controlnet Discussion #1436](https://github.com/Mikubill/sd-webui-controlnet/discussions/1436).
- **Mechanism**: Directly injects self-attention keys and values from reference image latents into the target diffusion steps without training adapter weights.
- **Status in Repo**: **Untested**.

### 3.3 Inpainting & Compositing
- **Native API Masking**: Inpainting endpoints (e.g. OpenAI `/v1/images/edits`) accept an image and mask. However, neural inpainting endpoints still resample border pixels and do not guarantee untouched pixels remain strictly unaltered unless enforced by code. Furthermore, mask support on 9Router `/v1/images/edits` is unverified in this repository.
- **Deterministic Compositing**: Only a local image processing script (e.g. Pillow / Canvas) can guarantee that unedited body pixels remain 100% bit-for-bit identical to `02.png`. However, because 9Router reference generation rescales the output sprite, pasting a generated face onto `02.png` requires facial landmark registration and scaling first; direct coordinate pasting will not align. This registration approach is currently untested.

---

## 4. Verification Matrix & Summary

```
+----------------------------------------------------+--------------------------+
| Mechanism                                          | Verification Status      |
+----------------------------------------------------+--------------------------+
| 9Router /v1/images/generations + image data URL    | VERIFIED (Observed       |
| under model cx/gpt-image-2.5                       | HTTP 200 in 3 trials)    |
+----------------------------------------------------+--------------------------+
| 9Router background: "transparent"                  | VERIFIED (In code and    |
|                                                    | observed trials)         |
+----------------------------------------------------+--------------------------+
| Multi-image conditioning (images: string[])        | DOCUMENTED UPSTREAM,     |
|                                                    | UNTESTED IN REPO         |
+----------------------------------------------------+--------------------------+
| Native API Inpainting (/v1/images/edits + mask)   | UNVERIFIED ON 9ROUTER    |
+----------------------------------------------------+--------------------------+
| Local Diffusers / ComfyUI IP-Adapter               | UNTESTED / NOT SUPPORTED |
|                                                    | ON HOSTED CX/ ENDPOINT   |
+----------------------------------------------------+--------------------------+
| Local Face Landmark Registration + Compositing     | UNTESTED                 |
+----------------------------------------------------+--------------------------+
```

### Actionable Conclusion
1. `POST https://9router.minhmice.com/v1/images/generations` with `model: "cx/gpt-image-2.5"` and `image: "data:image/png;base64,..."` of `02.png` is the sole empirically verified mechanism in this codebase that retains character design and coarse pencil style across emotions (`reference-sad.png`, `reference-angry.png`, `reference-surprised.png`).
2. Downstream asset export must account for canvas dimension and scale differences (e.g. 1254x1254 vs 1800x1800) during resizing.
