# Customer-One Character Specification & Prompt Blocks

## Overview & Ground-Truth Identity
Previous iterations incorrectly described Customer-One as a female character. Visually verified from canonical hand-drawn sprites `asset-source/characters/customer-one/01.png` and `02.png`:
- **Identity**: Young man (late teens to early 20s), fair ivory skin, clean-shaven, soft peachy blush on cheeks and bridge of nose.
- **Hair**: Short charcoal-grey/soft black hair, styled with loose parted bangs exposing the forehead, natural hand-drawn pencil strand highlights.
- **Eyes**: Striking clear green irises with dark pupils and thin dark defined upper eyelashes, natural eyebrows drawn with rough pencil strokes.
- **Wardrobe**: Crisp short-sleeved white button-down collared shirt with a patch pocket on his left chest (viewer-right). A dark navy blue knit sweater/cardigan is tied casually around his neck and over his shoulders, with the long sleeves knotted loosely in front over the center of his chest.
- **Pose & Framing**: Waist-up / half-body front-facing portrait. Arms rest relaxed at his sides. Centered on a transparent canvas.
- **Baseline Emotion Difference in Originals**: In original authored sprites `01.png` and `02.png`, all pixels outside the mouth region `(xmin: 855, ymin: 693, xmax: 968, ymax: 712)` are bit-for-bit identical. `01` is neutral straight lips; `02` is a gentle closed-mouth smile.

---

## 1. Identity Block
```text
A young East Asian man in his late teens or early twenties with fair ivory skin and subtle peach blush on the nose and cheeks. Short charcoal grey-black hair with soft parted bangs showing his forehead and gentle tufts framing the sides. Expressive clear green eyes with dark pupils and defined pencil-drawn brows. Clean-shaven jawline. Clothing consists of a crisp white short-sleeved collared button-down shirt with a single left chest pocket, and a dark navy blue knit sweater tied over his shoulders with its sleeves knotted loosely in front across his chest. Waist-up front-facing pose with arms relaxed straight down at his sides.
```

---

## 2. Hand-Drawn Graphic Style Block
```text
2D hand-drawn anime and visual novel storybook illustration style. Coarse imperfect sketchy graphite pencil line art contours with subtle paper-like texture. Opaque flat matte color planes with restrained, minimalist flat cell shading. Cross-hatched pencil texture in dark shadows under the neck and chin. No 3D CGI rendering, no photorealistic skin pores or realistic hair fibers, no glossy specular highlights, no smooth digital airbrush gradients, no elaborate watercolor washes. Isolated character sprite centered on a pure transparent background.
```

---

## 3. Negative Prompt Block
```text
female, woman, girl, long hair, ponytail, hair bun, braids, makeup, lipstick, earrings, jewelry, necklace, apron, vest, long sleeves, coat, jacket, tie, hands raised, hand on chest, hand touching face, hand on heart, holding objects, photorealistic, 3D render, CGI, digital gradient painting, smooth vector art, watercolor bleed, messy background, solid background, white background, crop cutoff, multi-panel, comic sheet, extra limbs, watermark, signature.
```

---

## 4. Expression Blocks (Mood Semantics)

### 01 - Neutral (Baseline Reference)
```text
Neutral calm expression, level relaxed dark eyebrows, composed direct green-eyed gaze, small closed straight-line mouth, peaceful quiet demeanor.
```

### 02 - Happy (Warm Smile)
```text
Gentle happy expression, soft cheerful green eyes, relaxed curved eyebrows, subtle closed-mouth smile with corners softly upturned, warm friendly demeanor.
```

### 03 - Sad (Melancholic)
```text
Quietly sad melancholic expression, downcast sorrowful green eyes gazing slightly downward, inner brow ends subtly raised and tilted in quiet grief, small downturned closed mouth, subdued sorrowful demeanor.
```

### 04 - Touched (Emotionally Moved - Face Only)
```text
Deeply touched and moved expression, softened glistening green eyes with delicate emotional warmth, eyebrows gently curved in grateful relief, soft faint tender smile on slightly parted lips, emotional heartfelt look. Both arms and hands remain firmly at sides; absolutely no hands raised, no hand on chest, no hand on heart.
```

### 05 - Surprised (Astonished)
```text
Startled surprised expression, wide open astonishment in round green eyes with dilated pupils, high arched raised eyebrows, small parted circular O-shaped open mouth in a sudden quiet gasp, taken aback reaction.
```

---

## 5. Technical Sprite Specifications
- **Master Canvas**: 1800 x 1800 px RGBA.
- **Sprite Bounding Box**: `(xmin: 236, ymin: 126, xmax: 1482, ymax: 1800)`.
- **Runtime Target**: Max-height 1200 px, WebP quality 90, method 6, 32-bit RGBA alpha preservation at `public/assets/characters/customer-one/*.webp`.
