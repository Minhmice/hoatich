# Asset Provenance & Generation Prompts

## Overview
- Generator Endpoint: `https://9router.minhmice.com/v1/images/generations`
- Model: `cx/gpt-image-2.5`
- Date: 2026-10-12
- Art Direction: Hand-drawn 2D 16:10 visual novel backgrounds and isolated botanical illustrations matching the character sketchy graphite pencil linework, delicate colored pencil texture, and soft watercolor wash.

---

## 1. Shop Day (`shop/shop-day.png`)
- **File path**: `public/assets/generated/shop/shop-day.png`
- **Dimensions**: 1586 x 992 (Landscape 16:10)
- **Format / Mode**: PNG / RGB (24-bit)
- **Model**: `cx/gpt-image-2.5`
- **Parameters**: `size: "1792x1024"`
- **Prompt**:
  ```text
  Detailed hand-drawn 2D illustration of an empty small Vietnamese neighborhood flower shop interior, landscape 16:10 aspect ratio. Fixed front-facing slight-perspective visual novel background camera. Room layout: on the left rear, sunlit multi-pane wooden windows looking out onto a quiet leafy street. In the center rear, a wooden and frosted glass entrance door. On the right rear, wooden display shelves holding ceramic vases, terracotta pots, and zinc buckets of assorted flowers. In the center, a rustic wooden service counter. In the lower foreground, an empty, clear, clean wooden bouquet assembly work surface facing the player, with completely open space for flower arranging. Mood and palette: morning lighting, warm cream walls, olive green leaves, soft muted earth tones, quiet healing, gentle nostalgic atmosphere. Visual style: hand-drawn sketchy graphite pencil linework with textured matte colored pencil and soft watercolor wash rendering, matching an indie storybook aesthetic. Strict constraints: no people, no characters, no customer, no shopkeeper, no text, no lettering, no signs, no typography, no UI, no watermark, no logo.
  ```
- **Provenance / Technique**:
  Direct text-to-image generation with explicit composition, perspective, color palette (cream/olive), and negative constraints. Clean foreground counter preserved for bouquet assembly mechanics.

---

## 2. Shop Evening (`shop/shop-evening.png`)
- **File path**: `public/assets/generated/shop/shop-evening.png`
- **Dimensions**: 1586 x 992 (Landscape 16:10)
- **Format / Mode**: PNG / RGB (24-bit)
- **Model**: `cx/gpt-image-2.5`
- **Parameters**: `size: "1792x1024"`, `image: "data:image/png;base64,...[shop-day.png]"`
- **Prompt**:
  ```text
  Transform this exact same flower shop room into evening twilight. Keep the identical layout, camera angle, furniture placement, windows left rear, entrance door center rear, shelves right rear, wooden counter, and empty clear foreground wooden bouquet work surface. Change the time and lighting from morning to evening twilight: dusk fallen outside, slate blue and deep plum twilight sky visible through the windows and glass door. The vintage hanging lamp overhead is turned on, casting a soft warm amber glow onto the wooden counter and empty foreground table. Peaceful, quiet healing twilight mood with subtle mystical stillness. Slate, plum, violet dusk tones with warm amber lantern highlights. Strict constraints: keep the foreground wooden table completely empty and clear for bouquet making, no people, no characters, no ghosts, no text, no signs, no UI, no watermark.
  ```
- **Provenance / Technique**:
  Image-to-image reference edit using `shop-day.png` as input image anchor. Preserved pixel-matched geometry (windows left rear, door center rear, shelves right rear, foreground table clear) while shifting illumination from morning cream/olive to evening slate/plum twilight with warm amber pendant lamp illumination.

---

## 3. Flower Set (`flowers/flower-set.png`)
- **File path**: `public/assets/generated/flowers/flower-set.png`
- **Raw output path**: `public/assets/generated/flowers/raw-flower-set.png`
- **Dimensions**: 1536 x 1024
- **Format / Mode**: PNG / RGBA (32-bit with native alpha channel)
- **Model**: `cx/gpt-image-2.5`
- **Parameters**: `size: "1792x1024"`, `background: "transparent"`
- **Grid Layout**: 2 x 4 grid (8 botanical flower sprites with full stems and leaves):
  - Row 1 (Left to Right):
    1. Sunflower (hoa hướng dương) - yellow petals, brown center, green stem and broad leaves
    2. White daisy (hoa cúc trắng / họa mi) - white ray petals, golden disk, stem and leaves
    3. Rose (hoa hồng) - crimson red petals, thorny stem, serrated leaves
    4. Lily (hoa ly / bách hợp) - white recurved petals, yellow anthers, tall stem and leaves
  - Row 2 (Left to Right):
    5. Lotus (hoa sen) - graceful pink blooming petals, aquatic stem and lotus leaf
    6. Yellow daisy (hoa cúc vàng) - golden yellow chrysanthemum bloom, stem and lobed leaves
    7. Lavender (hoa oải hương) - purple florets clustered on slender upright stalks
    8. Carnation (hoa cẩm chướng) - pink ruffled petals, green calyx, slender stem and leaves
- **Prompt**:
  ```text
  Botanical sprite illustration sheet containing exactly 8 distinct flower sprites arranged neatly in a spacious 2x4 grid layout (2 rows of 4 flowers each). Top row of 4 flowers: 1) Sunflower with bright yellow petals and dark brown center, green stem and broad leaves; 2) White daisy with slender white petals, yellow center disk, green stem and delicate leaves; 3) Classic red garden rose with layered crimson petals, thorny green stem and serrated leaves; 4) Elegant white Madonna lily with curving white petals, yellow pollen stamens, tall stem and long leaves. Bottom row of 4 flowers: 5) Sacred pink lotus flower in graceful bloom, slender aquatic stem and green lotus leaf; 6) Bright golden-yellow daisy chrysanthemum flower with green stem and lobed leaves; 7) Fragrant purple lavender stalk with tiny violet florets clustered on tall slender green stem and needle-like leaves; 8) Pink carnation flower with ruffled frilled petals, green calyx, slender stem and narrow leaves. All flowers are fully isolated, standing vertically with clean stems and leaves, spacious gaps between each flower. Art style: hand-drawn 2D botanical illustration, soft sketchy graphite pencil outlines, delicate textured colored pencil and matte watercolor wash, matching indie visual novel sprites. Strict constraints: transparent background, completely isolated items, no text, no numbers, no labels, no boxes, no frames, no watermark, no logo.
  ```
- **Provenance / Technique**:
  Generated with model-native transparency (`background: "transparent"`). Raw generation output preserved at `raw-flower-set.png`. Visible petal and leaf pixels 100% bit-for-bit preserved, with zero-alpha transparent pixels cleared to (0,0,0,0) for clean composite rendering in game engines and browsers.

### Crop Geometry & Transformations (8 Sheet Cells)
- **Sheet Canvas**: 1536 x 1024 px, 2 rows x 4 columns
- **Cell Dimensions**: 384 x 512 px per cell
- **Transformation**: Exact rectangular crop `box = (c * 384, r * 512, (c + 1) * 384, (r + 1) * 512)` without resampling, preserving 100% bit-for-bit pixel data and 32-bit RGBA alpha channel.
- **Crops Output Directory**: `public/assets/generated/flowers/crops/`
- **Cell Breakdown**:
  - **Row 0, Col 0** `[0, 0, 384, 512]`: `sunflower.png` (384x512 RGBA) -> Content ID `hoa-huong-duong` (Texture Key `flower-hoa-huong-duong`)
  - **Row 0, Col 1** `[384, 0, 768, 512]`: `white-daisy.png` (384x512 RGBA) -> Content ID `hoa-cuc-trang` (Texture Key `flower-hoa-cuc-trang`)
  - **Row 0, Col 2** `[768, 0, 1152, 512]`: `rose.png` (384x512 RGBA) -> Content ID `hoa-hong-do` (Texture Key `flower-hoa-hong-do`)
  - **Row 0, Col 3** `[1152, 0, 1536, 512]`: `lily.png` (384x512 RGBA) -> Unmapped botanical lily (Texture Key `flower-crop-lily`)
  - **Row 1, Col 0** `[0, 512, 384, 1024]`: `lotus.png` (384x512 RGBA) -> Content ID `hoa-sen-hong` (Texture Key `flower-hoa-sen-hong`)
  - **Row 1, Col 1** `[384, 512, 768, 1024]`: `yellow-chrysanthemum.png` (384x512 RGBA) -> Unmapped golden chrysanthemum (Texture Key `flower-crop-yellow-chrysanthemum`)
  - **Row 1, Col 2** `[768, 512, 1152, 1024]`: `lavender.png` (384x512 RGBA) -> Content ID `hoa-oai-huong` (Texture Key `flower-hoa-oai-huong`)
  - **Row 1, Col 3** `[1152, 512, 1536, 1024]`: `carnation.png` (384x512 RGBA) -> Content ID `hoa-cam-chuong-hong` (Texture Key `flower-hoa-cam-chuong-hong`)

---

## 4. Fictional Flower Mộng Tàn (`flowers/flower-mong-tan.png`)
- **File path**: `public/assets/generated/flowers/flower-mong-tan.png`
- **Raw output path**: `public/assets/generated/flowers/raw-flower-mong-tan.png`
- **Dimensions**: 1024 x 1536
- **Format / Mode**: PNG / RGBA (32-bit with native alpha channel)
- **Model**: `cx/gpt-image-2.5`
- **Parameters**: `size: "1024x1024"`, `background: "transparent"`
- **Prompt**:
  ```text
  Botanical sprite illustration of a single isolated fictional flower called Mong Tan (hoa Mong Tan), an otherworldly silver-violet flower from the spirit world. The flower has elegant, delicate, semi-translucent petals that shimmer with soft silver, pale lilac, and gentle violet tones under quiet moonlight. Slender graceful dark silvery-green stem with delicate ethereal leaves. The blossom has a clean, graceful silhouette, poetic and wistfully beautiful. Atmosphere: gentle moonlight, peaceful, melancholic and healing, sacred spirit realm flower, strictly not horror, not scary, not monstrous. Art style: hand-drawn 2D botanical illustration, visible soft graphite pencil linework, delicate textured colored pencil and translucent watercolor wash. Orientation: single vertical specimen centered on canvas. Strict constraints: transparent background, isolated sprite, no text, no letters, no label, no frame, no watermark.
  ```
- **Provenance / Technique**:
  Generated with model-native transparency (`background: "transparent"`). Raw generation output preserved at `raw-flower-mong-tan.png`. Single isolated vertical sprite, translucent silver-violet petals with delicate graphite pencil outlines, clean alpha mask for UI and bouquet compositing.

---

## 5. Flower Extra Set (`flowers/flower-extra-set.png`) & Crops
- **File path**: `public/assets/generated/flowers/flower-extra-set.png`
- **Raw output path**: `public/assets/generated/flowers/raw-flower-extra-set.png`
- **Dimensions**: 1290 x 1219
- **Format / Mode**: PNG / RGBA (32-bit with native alpha channel)
- **Model**: `cx/gpt-image-2.5`
- **Parameters**: `size: "2048x2048"`, `background: "transparent"`
- **Grid Layout**: 2 x 2 equal quadrant cells:
  - **Top-Left (x: 0..645, y: 0..609)**: `hoa-thuy-tien` (Thủy tiên / Narcissus)
    - Pure white petals, golden-yellow cup/corona, upright green stems and strap-like leaves.
    - Content ID: `hoa-thuy-tien`
    - Crop: `public/assets/generated/flowers/crops/thuy-tien.png` (645 x 609), `thuy-tien.webp`
  - **Top-Right (x: 645..1290, y: 0..609)**: `hoa-luu-ly` (Lưu ly / Forget-me-not)
    - Delicate sky-blue 5-petaled florets, tiny yellow centers, branching leafy green stems.
    - Content ID: `hoa-luu-ly`
    - Crop: `public/assets/generated/flowers/crops/luu-ly.png` (645 x 609), `luu-ly.webp`
  - **Bottom-Left (x: 0..645, y: 609..1219)**: `hoa-hoang-tuyen` (Hoàng Tuyền / Red Lantern Spirit Flower)
    - Fictional dead-world flower: arching fiery red petals and curving stamens (Lycoris / Red Spider Lily style), subtle cold crimson glow, slender dark green stem.
    - Content ID: `hoa-hoang-tuyen`
    - Crop: `public/assets/generated/flowers/crops/hoang-tuyen.png` (645 x 610), `hoang-tuyen.webp`
  - **Bottom-Right (x: 645..1290, y: 609..1219)**: `hoa-da-ngan` (Dạ Ngân / Moonlit Night Flower)
    - Fictional night flower: luminous silver and pale-blue translucent petals under quiet moonlight, delicate buds, graceful stem.
    - Content ID: `hoa-da-ngan`
    - Crop: `public/assets/generated/flowers/crops/da-ngan.png` (645 x 610), `da-ngan.webp`
- **Prompt**:
  ```text
  Botanical sprite illustration sheet containing exactly 4 distinct flower sprites arranged neatly in an exact 2x2 grid of 4 equal quadrants. Top-left cell: Thuy Tien (Narcissus flower), delicate pure white petals with a small cup-shaped golden yellow center corona, slender green stems and erect strap-like green leaves. Top-right cell: Luu Ly (Forget-me-not flower), sprays of small delicate sky-blue five-petaled blossoms with tiny yellow centers on branching slender green stems with soft green leaves. Bottom-left cell: Hoang Tuyen (fictional spirit flower from the dead world), glowing crimson red lantern flower with arching fiery red petals and curling delicate stamens like a mystical red spider lily, emitting a faint ethereal crimson luminescence on a slender dark green stem. Bottom-right cell: Da Ngan (fictional moonlit flower), elegant luminous silver and pale-blue night flower with delicate semi-translucent petals shimmering with faint silver and cool pale blue moonlight, on a graceful slender stem with silver-green leaves. All 4 flowers are upright, isolated specimens with full stems and leaves centered within their respective 2x2 quadrants with spacious margins between them. Art style: hand-drawn 2D botanical illustration, soft sketchy graphite pencil outlines, delicate textured colored pencil and matte watercolor wash, matching indie visual novel sprites. Strict constraints: transparent background, clean equal quadrants, no text, no labels, no names, no numbers, no dividing lines or boxes, no frame, no watermark.
  ```
- **Note on Mộng Tàn**:
  `flowers/flower-mong-tan.png` is retained as a source concept art asset, but the canonical fictional flower IDs in `src/game/content/flowers.ts` are `hoa-hoang-tuyen` and `hoa-da-ngan`, which are provided by the crops above.

---

## 6. Character Portrait WebP Optimization
- **Source PNGs**: `public/assets/characters/{player,passerby,customer-one}/*.png`
- **Transformation**:
  - Max height capped at 1200 px while preserving aspect ratio (`scale = 1200 / original_height` if height > 1200).
  - Resampling filter: High-quality Lanczos (`Image.Resampling.LANCZOS`).
  - Encoding: WebP format, quality 90, method 6, 32-bit RGBA alpha preservation.
  - Target outputs: `public/assets/characters/{player,passerby,customer-one}/*.webp` alongside untouched original PNGs.
  - Checksum tracking: Original source files in `DEMO_assets` SHA-256 hashes preserved verbatim in `characterAssets.ts`.

## 7. Player 04–07 Reference Regeneration
- Four independent requests to `https://9router.minhmice.com/v1/images/generations`, model `cx/gpt-image-2.5`, using original `asset-source/characters/player/02.png` as a base64 image reference for every request.
- Expressions: `04` sad, `05` angry, `06` surprised, `07` thinking. Source PNG paths: `asset-source/characters/player/{04,05,06,07}.png`; runtime paths: `public/assets/characters/player/{04,05,06,07}.webp`.
- Requested `size: 1024x1024`, `background: transparent`; received four `1254x1254` RGBA PNGs. Runtime exports are `1200x1200` WebP, Lanczos resampling, quality90/method6.
- Exact prompts, reference SHA-256, output SHA-256 and observed HTTP status are recorded in `player-redo/{04,05,06,07}.payload.json` and `player-redo/manifest.json`. Payload metadata replaces base64 bytes with reference path/hash; API credentials are never stored.
- Previous PNG/WebP files are archived under `player-redo/previous/`, with hashes in its `manifest.json`. Original01–03 unchanged; character mapping URLs and mood semantics unchanged.
- Direct visual inspection confirms the slate-blue hair, headband/daisy, olive V-neck vest, dark waist apron and spray bottle are retained. Whole-image regeneration still changes pixels and leaves visible edge flecks; these are not pixel-identical face edits or a claim of fully cleaned alpha edges.

## 8. Remaining Character Style Cutover
- Plan: `REMAINING_CHARACTERS_PLAN.md`. New character identity/style/expression prompts: `new-character-prompts.md`; exact requests and response/ref/output hashes: `new-character-style/manifest.json` and character subdirectories.
- Bác Ba (`bac-ba`): `01` neutral, `02` sad, `03` peaceful. Hồn Thi Sĩ (`spirit-poet`): `01` neutral, `02` sorrow, `03` peaceful. Chú Tư (`chu-tu`): `01` neutral, `02` worried, `03` happy.
- Each neutral design used authored `customer-one/01.png` as drawing-style reference ONLY, with a distinct text identity. Each subsequent emotion referenced its character's own new neutral01 directly. Nine separate `cx/gpt-image-2.5` requests returned HTTP200, `1254x1254` RGBA PNGs; runtime exports `1200x1200` WebP quality90/method6, Lanczos.
- Source assets: `asset-source/characters/{bac-ba,spirit-poet,chu-tu}/{01,02,03}.png`; runtime files: `public/assets/characters/{bac-ba,spirit-poet,chu-tu}/{01,02,03}.webp`. Previous Bác Ba/thi sĩ files archived under `new-character-style/previous/` with hashes. All nine outputs directly inspected; simplified matte2D rendering retained, but colored edge flecks and global resampling remain.
- Customer-one/passerby authored01–02 are identity authorities, not the older generic AI portrayals. Previous prompts describing customer-one as a woman or passerby in patterned traditional clothing were incorrect. Updated prompt documents and their respective redo manifests record corrected identities and outputs.
- This pass generates/replaces assets only. `customers.ts` portrait mappings still use the existing generic keys; new Bác Ba/thi sĩ/Chú Tư images are exported but not automatically selected by gameplay. No claim of in-game activation.
- Customer-one: AI clone controls `customer-one-redo/clones/{01-clone,02-clone}.png`; regenerated source/runtime03 sad,04 touched,05 surprised. Identity/style/expression blocks in `customer-one-prompt.md`; hashes and reference metadata in `customer-one-redo/manifest.json`; replaced generic portraits archived in `customer-one-redo/archive/`. Authored01–02 PNG/WebP unchanged.
- Passerby: AI clone controls `passerby-redo/clones/{01,02}.png`; regenerated source/runtime03 happy,04 angry,05 surprised. Prompt blocks in `passerby-prompt.md`; payload/hash/status metadata in `passerby-redo/manifest.json`; prior generic portraits archived in `passerby-redo/archive/`. Authored01–02 PNG/WebP unchanged.
- Parent directly viewed all19 outputs:4 clone controls and15 new/replacement expressions. Customer-one neutral clone differs in crop; passerby has visible white/color fringe along shoulders/arms and inside arm gaps, not merely verified-clean antialiasing. Clone controls remain separate; no automated promotion of authored01–02. Source/runtime files decode as RGBA, but neural edges and geometry are not guaranteed production-perfect.
