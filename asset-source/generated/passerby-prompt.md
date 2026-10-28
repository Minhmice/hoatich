# Passerby Character Identity Specification & Generation Prompts (Hoa Tích)

Ground-truth identity and style specification extracted from canonical original sprites `passerby/01.png` and `passerby/02.png`. Eliminates stylistic drift seen in previously archived `03.png`–`05.png` (which drifted into photorealistic digital portraiture with floral áo bà ba).

---

## 1. Visual Landmark Grounding

All directional references are strictly **viewer-relative** (viewer-left = left side of canvas, viewer-right = right side of canvas).

| Region | Canonical Feature | Viewer Landmark | Negative Boundary |
| :--- | :--- | :--- | :--- |
| **Identity & Age** | Middle-aged Vietnamese woman (auntie / cô / thím archetype, ~45–55 years old). | Mature facial structure, slight laugh lines under eyes and beside mouth, confident assertive presence. | NO young girl, NO elderly grandmother, NO male traits. |
| **Hair Cut & Style** | Dark charcoal-brown short waved bob, flaring at ear and neck level. | Distinct retro S-curved wave fringe over center forehead, side locks curving outwards. | NO ponytail, NO bun, NO long hair, NO pigtails, NO modern pixie cut. |
| **Hair Color** | Soft matte charcoal-brown / black with subtle warm undertones. | Uniform flat color fill with dry pencil contour outlines. | NO blonde, NO red, NO bright saturated colors. |
| **Eyes & Face** | Stylized 2D anime-storybook almond eyes with dark irises and defined upper lash line. | Stylized mature 2D facial abstraction. Simplified nose (single dash/tick). | NO photorealistic eye anatomy, NO modeled nostrils, NO realistic lip cracks. |
| **Neck & Jewelry** | Dark green jade bead necklace around neck. | Prominent round emerald/jade beads forming a full loop hanging over collarbone. | NO gold chain, NO pendant, NO bare unadorned neck. |
| **Wrist Jewelry** | Dark green jade bangle bracelet on **viewer-left wrist** (character's right wrist). | Smooth circular dark green jade ring encircling viewer-left wrist. | NO watch, NO gold bracelets, NO jewelry on right wrist. |
| **Upper Body** | Plain pale pink / dusty blush short-sleeve cotton T-shirt. | Simple round crew/scoop neckline, short sleeves ending mid-bicep, gentle fabric fold creases at waist. | NO patterned shirt, NO collar/blouse, NO áo bà ba, NO floral embroidery, NO jacket. |
| **Lower Body** | Dark olive-brown / charcoal tailored trousers. | High-waist cut visible from waist down to mid-thigh. | NO skirt, NO jeans, NO shorts, NO apron. |
| **Pose & Framing** | Centered frontal portrait, cropped at mid-thigh. Both hands on hips (fists planted firmly on hips, elbows flared outward). | Sturdy assertive stance, elbows bent outward to sides, fists pressed to waistline. | NO arms hanging down, NO crossed arms, NO hand holding objects, NO head tilt. |
| **Art Style** | Hand-drawn 2D indie visual novel character sprite. | Coarse graphite/pencil tooth outlines, flat opaque cel shading (1–2 tones), matte paper finish, isolated on transparent background. | NO photorealism, NO 3D CGI, NO soft airbrushed gradients, NO watercolor pooling. |

---

## 2. Style-Only Prompt Block

```text
2D visual novel character sprite illustration, indie storybook anime art style. Hand-drawn textured dark graphite pencil linework with visible dry paper tooth, organic line weight variation, and clean defined contour outlines. Minimalist flat 2D cel shading with clean flat color planes and subtle dry colored pencil texture overlay. Maximum one to two simplified flat cast shadow steps, completely flat ambient diffuse lighting without directional light, zero volumetric 3D shading, zero airbrushed gradients, zero subsurface scattering. Stylized 2D anime aesthetic with simplified facial feature abstraction. Soft matte paper finish, muted cozy storybook color palette with warm gentle tones, crisp clean silhouette isolated on a clean transparent background.
```

---

## 3. Style-Only Negative Exclusions Block

```text
No photorealism, no semi-realism, no 3D render, no CGI, no blender render, no octane render, no digital painting realism, no realistic skin texture, no skin pores, no subsurface scattering, no airbrushed skin, no glossy skin, no shiny plastic highlights, no realistic hair strands, no individual hair fibers, no hair flyaways, no photorealistic hair rendering, no realistic facial anatomy, no modeled nostrils, no shaded nose bridge, no fleshy lips, no lip creases, no lip gloss, no tear ducts, no double eyelid folds, no realistic eye anatomy, no volumetric lighting, no dramatic cinematic lighting, no rim lighting, no specular highlights, no lens flare, no depth of field, no blurred background, no complex fabric folds, no micro-creases, no cloth simulation, no heavy drapery shadows, no painterly realism, no wet watercolor wash, no paint drips, no watercolor puddle edges, no messy sketch, no incomplete lineart, no western comic style, no manhwa realism, no webtoon semi-realism, no high dynamic range, no hyper-detailed rendering.
```

---

## 4. Identity Prompt Block

```text
A middle-aged Vietnamese woman with fair warm skin and mature features, stylized 2D anime storybook appearance. Short dark charcoal-brown waved bob hairstyle with a voluminous retro S-curve wave across the forehead and flared ends around the ears. Wearing a plain pale blush-pink short-sleeved crew-neck cotton T-shirt and dark charcoal-brown trousers. Wears a prominent dark green round jade bead necklace resting on her chest, and a matching dark green jade bangle bracelet on her viewer-left wrist. Standing facing directly forward, both hands planted firmly on hips with elbows flared outward in an assertive posture. Cutout sprite isolated on transparent background.
```

---

## 5. Expression Prompt Presets

All expression modifications are strictly confined to the facial features (eyebrows, eyes, mouth). The pose, head angle, hair silhouette, clothing, jade necklace, and jade bracelet must remain identical to original `02.png`.

### 01 – Skeptical / Stern (Clone Control)
```text
Edit the supplied ORIGINAL game sprite, do not redesign or redraw a different character. Keep the exact same illustration, proportions, composition, pose, clothes, hands on hips, hair outline, jade bead necklace and jade wrist bangle, and coarse pencil linework. Change ONLY facial expression within eyebrows and mouth: stern skeptical expression, downward-angled furrowed dark eyebrows, skeptical squinting dark eyes, tightly closed straight downturned mouth, suspicious judgmental stare, head facing straight forward without tilt. Match original's rough charcoal pencil outlines and opaque flat matte colors; do not polish, add texture, hair strands, realistic skin, or watercolor shading. Keep original square transparent framing.
```

### 02 – Neutral / Composed (Clone Control & Master Reference)
```text
Edit the supplied ORIGINAL game sprite, do not redesign or redraw a different character. Keep the exact same illustration, proportions, composition, pose, clothes, hands on hips, hair outline, jade bead necklace and jade wrist bangle, and coarse pencil linework. Maintain neutral composed facial expression: relaxed natural dark eyebrows, calm steady open dark eyes, neutral closed mouth, calm stoic demeanor, head facing straight forward without tilt. Match original's rough charcoal pencil outlines and opaque flat matte colors; do not polish, add texture, hair strands, realistic skin, or watercolor shading. Keep original square transparent framing.
```

### 03 – Happy / Smiling
```text
Edit the supplied ORIGINAL game sprite, do not redesign or redraw a different character. Keep the exact same illustration, proportions, composition, pose, clothes, hands on hips, hair outline, jade bead necklace and jade wrist bangle, and coarse pencil linework. Change ONLY facial expression within eyebrows, eyes, and mouth: warm genuine happy expression, gently raised arched dark eyebrows, soft smiling crinkled eye corners, cheerful warm closed-lip upward smile, pleasant friendly auntie demeanor, head facing straight forward without tilt. Keep hands on hips, pink t-shirt, dark pants, jade necklace and viewer-left jade bracelet unchanged. Match original's rough charcoal pencil outlines and opaque flat matte colors; do not polish, add texture, hair strands, realistic skin, or watercolor shading. Keep original square transparent framing.
```

### 04 – Angry / Displeased
```text
Edit the supplied ORIGINAL game sprite, do not redesign or redraw a different character. Keep the exact same illustration, proportions, composition, pose, clothes, hands on hips, hair outline, jade bead necklace and jade wrist bangle, and coarse pencil linework. Change ONLY facial expression within eyebrows, eyes, and mouth: intensely angry irritated expression, sharply furrowed downward-angled inner brows forming a deep scowl, tense glaring narrowed dark eyes, tightly clenched displeased frowning mouth turned down at corners, annoyed scolding demeanor, head facing straight forward without tilt. Keep hands on hips, pink t-shirt, dark pants, jade necklace and viewer-left jade bracelet unchanged. Match original's rough charcoal pencil outlines and opaque flat matte colors; do not polish, add texture, hair strands, realistic skin, or watercolor shading. Keep original square transparent framing.
```

### 05 – Surprised / Startled
```text
Edit the supplied ORIGINAL game sprite, do not redesign or redraw a different character. Keep the exact same illustration, proportions, composition, pose, clothes, hands on hips, hair outline, jade bead necklace and jade wrist bangle, and coarse pencil linework. Change ONLY facial expression within eyebrows, eyes, and mouth: surprised startled expression, high raised arched eyebrows, wide rounded open dark eyes with small pupils, small rounded open O-shaped mouth in an astonished gasp, caught-off-guard reaction, head facing straight forward without tilt. Keep hands on hips, pink t-shirt, dark pants, jade necklace and viewer-left jade bracelet unchanged. Match original's rough charcoal pencil outlines and opaque flat matte colors; do not polish, add texture, hair strands, realistic skin, or watercolor shading. Keep original square transparent framing.
```

---

## 6. Generation Contract

- **Endpoint**: `https://9router.minhmice.com/v1/images/generations`
- **Model**: `cx/gpt-image-2.5`
- **Reference Image**: Base64 data URL of `asset-source/characters/passerby/02.png` for 02/03/04/05; `01.png` for 01 clone.
- **Parameters**: `size: "1024x1024"`, `background: "transparent"`.
- **Runtime Export**: WebP max-height 1200px, quality 90, method 6.
- **Integrity Guarantee**: Original authored `asset-source/characters/passerby/01.png` and `02.png` are bit-preserved and never overwritten.
