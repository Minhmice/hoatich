# Hoa Tích Character Art Style Specification & Style-Only Prompt

**Asset update:** failed `04–07` discussed below are archived as `player-redo/previous/{04,05,06,07}-source.png`; these are not the current replaced player portraits. New request metadata lives in `player-redo/manifest.json`.

Ground-truth artistic style extraction from canonical character sprites (`player/01.png`, `player/02.png`, `player/03.png`, `customer-one/01.png`, `passerby/01.png`). Establishes standard rendering definitions and rules to prevent semi-realistic drift as observed in `player/04.png` through `07.png`.

> **CRITICAL RULE**: This document defines **art style and rendering technique only**. It contains **ZERO character identity traits** (no gender, age, hair color, hair style, clothing, accessories, or props). Identity definitions belong exclusively in `player-identity-prompt.md`.

---

## 1. Visual Style Autopsy: Canon vs. Observed Failure Modes

Empirical inspection of original sprites (`01.png`–`03.png`) against failed generations (`04.png`–`07.png`), text-to-image trials (`text-sad.png`), and reference-conditioned edits (`reference-sad.png`) reveals **two distinct failure modes**:

```
[Mode A: Semi-Realism Drift (04-07.png)]   [Canon: 01-03.png (Trial: reference-sad)]   [Mode B: Polished Anime Drift (text-sad.png)]
---------------------------------------   -----------------------------------------   ---------------------------------------------
• Semi-realistic digital painting         • Hand-drawn indie visual novel sprite     • Generic modern light-novel / gacha anime
• Photorealistic facial anatomy (nostrils) • Stylized 2D anime facial abstraction     • Polished digital vector lines (no tooth)
• Thousands of realistic hair fibers      • Chunky flat anime hair locks with tufts   • Over-rendered hair layers & highlights
• Airbrush gradients & 3D ambient light    • Coarse charcoal pencil tooth outlines    • Soft digital airbrush gradient shading
• Wet watercolor bleed & fabric creases   • Flat 2D cel fills (1-2 shadow steps)     • Narrowed chin, altered head-to-body ratio
• Loss of sprite silhouette               • Muted matte colored pencil texture       • Modern polished commercial anime aesthetic
```

### 1.1. Failure Mode A: Semi-Realistic Watercolor Drift (`04.png`–`07.png`)
1. **Photorealistic Anatomical Modeling**: Rendered realistic nostril cavities, modeled nasal bridge, fleshy lips with vertical creases, tear ducts, and realistic neck/clavicle bone structure.
2. **Micro-Strand Hair Simulation**: Rendered individual realistic hair fibers with flyaways, realistic hair roots, and specular scalp highlights instead of stylized clumped shapes.
3. **Volumetric 3D Gradient Shading**: Continuous airbrush gradients and ambient occlusion folds instead of discrete 2D cel planes.
4. **Painterly Fabric Complexity**: Heavy drapery physics, micro-wrinkles, and wet watercolor edge bleeds.

### 1.2. Failure Mode B: Modern Polished Anime Drift (`text-sad.png`)
1. **Loss of Organic Pencil Tooth**: Lines became smooth, clean digital vector strokes rather than coarse charcoal/graphite pencil marks on paper.
2. **Over-Rendered Hair Subdivision**: Locks were split into numerous micro-layers with bright specular highlights, departing from the simple, flat, chunky silhouette.
3. **Subtle Digital Airbrush Shading**: Skin and clothing gained soft digital gradient shading instead of raw 1-step cel shadow blocks.
4. **Proportional Drift**: Tended toward modern gacha/light-novel proportions (sharper chin, narrower collar, altered head-to-body ratio).

### 1.3. Reference-Conditioned Candidate Trials (`reference-sad.png`, `reference-angry.png`, `reference-surprised.png`)
Empirical trials using `/images/generations` with `cx/gpt-image-2.5` and `image: "data:image/png;base64,..."` referencing `02.png`:
- **Exact Delta Ground Truth**: PIL measurement of canonical sprites reveals that differences between `02.png` and variants are strictly localized to facial features:
  - `02.png` vs. `01.png`: bounding box `(733, 356, 1026, 633)`, 6,307 modified pixels.
  - `02.png` vs. `03.png`: bounding box `(846, 347, 1052, 657)`, 2,610 modified pixels.
  - Facial modification union: `(733, 347, 1052, 657)` on the 1800x1800 canvas. All body pixels, hair silhouette, clothing, and props outside this union box are bit-for-bit identical across originals.
- **Preliminary Trial Observations (3 Samples)**: In this limited 3-trial sample, reference conditioning preserved coarse pencil contours, flat cel fills, and character anatomy significantly better than text-only prompts, producing subtle and distinct expressions (`reference-sad`, `reference-angry`, `reference-surprised`). This is a promising candidate approach, but not a generalized or proven production pipeline.
- **Rescaling Constraint**: The generative endpoint rescales and repositions the entire character sprite within the output canvas. The output is **not** pixel-aligned with the input image. Simple bounding box crop-and-paste will fail; any face composite approach requires image registration and scale normalization.
- **Edge Artifacts & Alpha QA**: Candidate reference images exhibit visible edge fringing and alpha haloing along the outer silhouette. These artifacts disqualify raw generated assets from direct production use without dedicated alpha cleanup and edge masking.
---

## 2. Diagnostic Visual Rubric

Use this diagnostic rubric to evaluate any candidate sprite generation against canonical standards:

| Aesthetic Dimension | Canonical Pass Criteria (`01.png`–`03.png`) | Failure / Rejection Criteria (`04.png` & `text-sad.png` drift) | Weight |
| :--- | :--- | :--- | :--- |
| **1. Linework & Contour** | Visible, hand-drawn dark charcoal or soft graphite pencil outlines. Line has dry paper tooth, organic texture, and subtle weight variation. Continuous stylized contour. | Sterile hairline digital vector, boundary-less painterly edges, airbrushed outlines, or messy multi-line scratchy sketch. | **Mandatory** |
| **2. Shading & Lighting** | Flat 2D cel-shading with at most 1–2 discrete shade steps (e.g., sharp neck cast shadow under chin, simple inner sleeve shadow). Flat ambient diffuse light. | Continuous airbrushed gradients, 3D ambient occlusion, rounded volumetric form modeling, rim lighting, or directional cast shadows. | **Mandatory** |
| **3. Surface Finish & Grain** | Matte paper tooth texture overlay. Subtle dry colored pencil grain across flat color fills. Non-reflective, tactile indie storybook feel. | Digital plastic gloss, specular highlights on skin/hair, wet watercolor wash pooling/puddle edges, or photographic skin pores. | **Mandatory** |
| **4. Hair Rendering** | Broad, stylized anime hair clumps/locks with crisp silhouette outlines and neat tapered tips. Internal volume rendered via minimal flat tones or sparse pencil hatching. | Realistic hair fibers, thousands of individual rendered hair strands, frizzy flyaways, photorealistic root-to-tip specular sheen. | **Mandatory** |
| **5. Facial Stylization** | Iconic 2D anime abstraction: simplified nose (single small tick, dot, or subtle bridge accent), single-stroke expressive anime mouth, bold stylized upper lash line with simple flat iris and minimal highlight. | Modeled 3D nose with nostrils and shaded sides, fleshy lips with realistic creases and volume, realistic double-eyelid fold, photorealistic eyes with tear ducts. | **Mandatory** |
| **6. Fabric & Drapery** | Clean, simplified structural fold lines following body silhouette. Minimalist 1-step cel shadow planes for major fabric creases. | Photorealistic micro-wrinkles, crumpled linen physics, heavy drapery folds, intricate realistic fabric thread textures. | High |
| **7. Palette & Saturation** | Muted, warm, cozy retro storybook palette. Low-to-moderate saturation with warm ivory/cream undertones and cohesive ambient color temperature. | Hyper-saturated neon colors, stark modern gacha game digital grading, or grim desaturated monochromatic grayscale. | High |
| **8. Canvas & Isolation** | Clean, crisp sprite silhouette against an isolated background / native alpha transparency. No residual halos or edge smudges. | Scenery bleed, background artifacts, drop shadows, blurred depth-of-field background elements, or messy watercolor splatters. | **Mandatory** |

---

## 3. Reusable Style-Only English Prompt

This prompt is **completely character-agnostic**. It defines exclusively the artistic medium, linework, shading, surface texture, and aesthetic constraints. It can be paired with any character's identity block.

```text
2D visual novel character sprite illustration, indie storybook anime art style. Hand-drawn textured dark graphite pencil linework with visible dry paper tooth, organic line weight variation, and clean defined contour outlines. Minimalist flat 2D cel shading with clean flat color planes and subtle dry colored pencil texture overlay. Maximum one to two simplified flat cast shadow steps, completely flat ambient diffuse lighting without directional light, zero volumetric 3D shading, zero airbrushed gradients, zero subsurface scattering. Stylized 2D anime aesthetic with simplified facial feature abstraction. Soft matte paper finish, muted cozy storybook color palette with warm gentle tones, crisp clean silhouette isolated on a clean transparent background.
```

---

## 4. Style-Only Negative Exclusions

> **Tested payload**: These `cx/gpt-image-2.5` trials concatenate plain-text exclusions in `prompt`; they do not send `negative_prompt`. No model-specific weighting parser or standalone negative field was tested. Avoid `(token:weight)` syntax in this workflow; other 9Router providers may support different fields.

### Plain Negative Clause:
```text
No photorealism, no semi-realism, no 3D render, no CGI, no blender render, no octane render, no unreal engine, no digital painting realism, no realistic skin texture, no skin pores, no subsurface scattering, no airbrushed skin, no glossy skin, no shiny plastic highlights, no realistic hair strands, no individual hair fibers, no hair flyaways, no photorealistic hair rendering, no realistic facial anatomy, no modeled nostrils, no shaded nose bridge, no fleshy lips, no lip creases, no lip gloss, no tear ducts, no double eyelid folds, no realistic eye anatomy, no volumetric lighting, no dramatic cinematic lighting, no rim lighting, no specular highlights, no lens flare, no depth of field, no blurred background, no complex fabric folds, no micro-creases, no cloth simulation, no heavy drapery shadows, no painterly realism, no wet watercolor wash, no paint drips, no watercolor puddle edges, no messy sketch, no incomplete lineart, no western comic style, no manhwa realism, no webtoon semi-realism, no high dynamic range, no hyper-detailed rendering.
```

---

## 5. Vocabulary Distinction Guide: Flat Textured Anime vs. Semi-Realism

Empirical testing indicates that `04.png` failed under a combined prompt mixing descriptive detail tokens and generic realism modifiers, rather than a single-keyword ablation. However, prompt vocabulary strongly influences how generative models allocate texture and edge weight:

### 5.1. Linework Vocabulary
- **Correlated with Success**: `hand-drawn dark graphite pencil linework`, `visible dry paper tooth`, `defined contour outlines`, `stylized anime line weight`.
- **Correlated with Drift**: `delicate watercolor outlines`, `soft edges`, `borderless`, `realistic sketch`, `loose concept sketch`.
- **Limit**: No single-word ablation was run. These are vocabulary choices for the next prompt, not proof that one word caused the failed image.

### 5.2. Shading & Surface Vocabulary
- **Correlated with Success**: `flat 2D cel shading`, `flat color fills`, `discrete shadow steps`, `dry colored pencil texture`, `matte paper finish`.
- **Correlated with Drift**: `watercolor wash`, `soft shading`, `smooth gradients`, `realistic shading`, `detailed rendering`.
- **Limit**: Reference input and prompt both changed between trials. The visual target is flat matte color with rough pencil contours; the relative contribution of individual wording choices is unknown.

### 5.3. Facial Feature Vocabulary
- **Correlated with Success**: `simplified 2D anime facial abstraction`, `stylized anime features`, `stylized hair clumps`, `clean graphic silhouette`.
- **Correlated with Drift**: `detailed face`, `beautiful face`, `realistic face`, `intricate hair`, `flowing hair strands`.
- **Empirical Note**: General "detailed/intricate" modifiers frequently bias diffusion decoders toward rendering photorealistic anatomical structures (nostril holes, lip wrinkles, micro hair strands).

---

## 6. Prompt Assembly Pattern

Assemble generation prompts using modular blocks. Since endpoints do not support separate negative prompts, append negative exclusions directly to the end:

```
[STYLE_PROMPT] + [IDENTITY_PROMPT] + [EXPRESSION_BLOCK] + [NEGATIVE_CONSTRAINTS]
```

### Strict Invariance Rule:
- **Pose & Anatomy Invariance**: Expression swapping is strictly confined to facial features within the empirical union box `(733, 347, 1052, 657)` (eyebrows, eyelids, mouth). **Pose changes, head tilts, arm position shifts, clothing variations, and prop modifications are strictly disallowed.**

### Combined Prompt Template:
```text
2D visual novel character sprite illustration, indie storybook anime art style. Hand-drawn textured dark graphite pencil linework with visible dry paper tooth, organic line weight variation, and clean defined contour outlines. Minimalist flat 2D cel shading with clean flat color planes and subtle dry colored pencil texture overlay. Maximum one to two simplified flat cast shadow steps, completely flat ambient diffuse lighting without directional light, zero volumetric 3D shading, zero airbrushed gradients, zero subsurface scattering. Stylized 2D anime aesthetic with simplified facial feature abstraction. Soft matte paper finish, muted cozy storybook color palette with warm gentle tones, crisp clean silhouette isolated on a clean transparent background. [INSERT CHARACTER IDENTITY AND CLOTHING HERE]. [INSERT FACIAL EXPRESSION ONLY - KEEP POSE AND PROPS IDENTICAL]. [INSERT CONCATENATED NEGATIVE EXCLUSIONS CLAUSE HERE].
```

---

## 7. Quality Assurance Checklist (Before Asset Approval)

Before committing any newly generated character sprite to the repository:

- [ ] **Linework Check**: Are outlines textured dark pencil with visible paper tooth, continuous and cartoon/anime styled? (Reject if thin vector or borderless painterly).
- [ ] **Cel Shading Check**: Are shadows flat, discrete blocks with at most 1–2 steps? (Reject if smooth airbrushed gradient or 3D curved lighting).
- [ ] **Hair Check**: Is the hair composed of stylized solid clumps with clean edges? (Reject if individual hair fibers or realistic flyaways are visible).
- [ ] **Face Check**: Are nose and mouth abstracted (simple dot/dash and clean line)? (Reject if nostrils, lip depth, or realistic bone structure are modeled).
- [ ] **Pose Invariance Check**: Did the pose, hands, props, or clothing shift from `02.png`? (Reject any pose or clothing delta).
- [ ] **Finish Check**: Does the surface resemble matte paper with colored pencil grain? (Reject if glossy, shiny, or wet watercolor bleed).
- [ ] **Alpha & Edge Artifact Check**: Inspect silhouette boundaries at 200% zoom for white fringing, pixel halos, or alpha clipping artifacts (observed in candidate reference image trials). Must be manually cleaned or masked before production deployment.
