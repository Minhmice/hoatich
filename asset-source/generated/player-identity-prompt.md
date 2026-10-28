# Player Character Identity Specification (Hoa Tích)

**Asset update:** earlier failed `04/05` examples discussed below are archived under `player-redo/previous/{04,05}-source.png`. Current player04–07 use original02-reference regeneration; see `player-redo/manifest.json`.

Ground-truth identity extraction from verified original sprites `01.png`, `02.png`, `03.png`. Eliminates drift seen in `04.png`/`05.png` (black hair, tied bun, bib apron, photorealism).

---

## 1. Visual Landmark Grounding

All directional references are strictly **viewer-relative** (viewer-left = left side of canvas, viewer-right = right side of canvas).

| Region | Original Feature | Viewer Landmark | Negative Boundary |
| :--- | :--- | :--- | :--- |
| **Hair Cut** | Short flared bob, chin-to-nape length. | Hair flicks outward at neck sides; prominent right wing. | NO ponytail, NO bun, NO pigtails, NO tied hair. |
| **Hair Color** | Muted slate blue / dusty denim blue. | Uniform matte blue with faint soft highlights. | NO black hair, NO dark brown hair, NO neon cyan. |
| **Hair Details** | 1) Ahoge / cowlick tuft on crown.<br>2) Straight blunt fringe. | - Ahoge: Crown center-right.<br>- Fringe: Straight cut across forehead above brow line. | NO side-swept adult bangs. |
| **Hair Accessories** | 1) White flower hair pin.<br>2) Black headband.<br>3) Black ribbon tail. | - White 6-petal daisy/narcissus pin at **viewer-left** temple.<br>- Thin black headband across crown.<br>- Black ribbon knot/tail peeking out at **viewer-right** nape. | NO giant bows, NO metal barrettes, NO floral crown. |
| **Eyes & Face** | Warm amber / honey-golden irises, round anime eyes. | Distinct dark upper eyeliner, tiny white highlights, peach blush on cheeks and bridge of nose. Fair ivory skin. | NO brown realistic eyes, NO photorealistic pores/wrinkles. |
| **Neck** | Thin black neck band (choker). | Horizontal thin dark band visible across the throat between open collar flaps. | NO wide choker, NO metal pendants, NO bare unbanded neck. |
| **Upper Body (Base)** | White / off-white collared button-up blouse. | Open pointed collar spread flat, V-neck opening showing throat and neck band. Loose 3/4 sleeves gathered below elbow. | NO modern t-shirt, NO frilly Victorian ruffles. |
| **Upper Body (Vest)** | Olive-green / moss-green sleeveless V-neck vest. | Deep V-neck trimmed with a distinct **white contrast stripe**. | NO sweater crew-neck, NO yellow vest, NO plain unbordered vest. |
| **Lower Body (Apron)** | Dark charcoal-grey waist apron (half apron). | Starts at natural waistline, wraps hips. **Olive-green tie strap** hangs down on **viewer-right**. | **ABSOLUTELY NO BIB**, NO chest cover, NO shoulder straps. |
| **Crop & Framing** | Visible through upper thighs; lower spray bottle cropped at bottom edge. | Character centered, body turned slightly toward **viewer-left**. | NO waist-up crop, NO full body with feet, NO close-up face crop. |
| **Pose & Prop** | **Viewer-right hand** holds light-blue spray bottle with white trigger nozzle. | **Viewer-left arm** hangs relaxed along side of body. Spray bottle bottom cropped by canvas edge. | NO crossed arms, NO flower shears, NO empty floating hands. |
| **Art Style** | 2D visual novel sprite. | Flat opaque color with rough sketchy graphite pencil contours and matte storybook rendering. | NO watercolor wash, NO smooth cel-shading vector, NO 3D CGI, NO photorealism. |

---

## 2. Expression Differences in Original Sprites (01, 02, 03)

In verified originals `01.png`, `02.png`, and `03.png`, all pixels outside the facial rectangle `(xmin: 734, ymin: 357, xmax: 1048, ymax: 641)` are identical:

- **`01.png` (Worried / Flustered)**:
  - Eyebrows: Angled upward-inward in distress.
  - Eyes: Slightly wide, anxious gaze.
  - Mouth: Small open wavy/wobbly downturn (`~` shape).
  - Extra: Single cold sweat drop on **viewer-right cheek**.
- **`02.png` (Calm / Friendly)**:
  - Eyebrows: Relaxed, neutral-soft curve.
  - Eyes: Gentle, attentive gaze.
  - Mouth: Small subtle closed smile.
  - Extra: Clean cheeks, relaxed friendly demeanor.
- **`03.png` (Happy / Welcoming)**:
  - Eyebrows: Raised cheerful arches.
  - Eyes: Bright, energetic curved lids.
  - Mouth: Open cheerful smile showing upper teeth.
  - Extra: Welcoming customer-greeting expression.

---

## 3. Modular English Identity Prompt

### Core Positive Identity Prompt
```text
2D visual novel character sprite, storybook illustration with rough sketchy pencil contours and flat opaque colors, 3/4 view facing slightly viewer-left, portrait visible through upper thighs with bottom of spray bottle cut off at lower canvas edge. A young female florist apprentice with fair ivory skin and soft peachy blush. Short dusty slate-blue hair cut into a flared chin-length bob with ends flicked outward, straight blunt bangs across forehead, and a small ahoge tuft standing on crown center-right. Wears a thin black headband with a small black ribbon knot at the viewer-right nape, and a single small white six-petal daisy flower pinned on the viewer-left side of her hair. Warm amber-honey eyes with soft dark upper lashlines. A thin black neck band choker around throat. Clothing: an off-white button-up collared shirt with open pointed collar and 3/4 rolled sleeves, under a moss-olive green sleeveless V-neck vest featuring a prominent white V-stripe contrast trim along the neckline. A dark charcoal-grey waist apron wrapped around her waist with an olive-green fabric belt ribbon hanging down viewer-right, no chest bib and no shoulder straps. Her viewer-right hand holds a translucent light-blue plastic spray bottle with a white trigger nozzle, viewer-left arm relaxed at side. Clean isolated transparent background.
```

### Core Identity Negative Exclusions
```text
photorealistic, semi-realistic, realistic skin texture, realistic portrait, 3D, CGI, render, digital painting, watercolor wash, vector art, black hair, dark brown hair, blonde hair, bright cyan hair, long hair, ponytail, hair bun, pigtails, braided hair, tied-up hair, bib apron, full apron, apron shoulder straps, apron chest cover, embroidered apron, casual t-shirt, sweater, cleavage, modern Western clothing, crossed arms, shears, scissors, extra hands, missing fingers, background scenery, furniture, text, watermark, logo.
```

---

## 4. Giải thích tiếng Việt (Vietnamese Design Guide)

### 4.1. Lỗi sai nghiêm trọng ở mẫu thử cũ `04.png` / `05.png`
1. **Sai tóc**: Mẫu thử cũ vẽ tóc đen rối buộc túm (messy bun/tied hair) theo phong cách tả thực. Bản gốc là **tóc ngắn ngang cằm màu xanh lam tro (slate blue)**, đuôi tóc vểnh tự nhiên ra hai bên, **không buộc tóc**, có cọng tóc đứng (ahoge) trên đỉnh đầu.
2. **Sai tạp dề**: Mẫu thử vẽ tạp dề có yếm che ngực (bib apron) với quai quàng vai và thêu hoa. Bản gốc là **tạp dề quấn eo (waist half-apron)** màu than đen, mặc ngoài áo gile len màu xanh rêu cổ chữ V viền trắng. Thân trên hoàn toàn là áo gile và cổ áo sơ mi trắng, không có yếm tạp dề.
3. **Sai phụ kiện**: Mẫu gốc có **hoa trắng nhỏ 6 cánh cài bên thái dương trái (theo góc nhìn người xem)**, **băng đô đen mảnh ngang đầu**, và **vòng đen mảnh ôm quanh cổ**.
4. **Sai đạo cụ và bố cục**: Mẫu gốc cầm **bình xịt nước màu xanh dương nhạt vòi trắng** ở tay phía bên phải (góc nhìn người xem), khung hình cắt ngang đùi trên, không phải ngang ngực hay thắt lưng.
5. **Sai phong cách**: Mẫu gốc dùng nét phác chì thô mộc, mảng màu phẳng lì (flat opaque) kiểu minh họa truyện tranh indie visual novel, không phải tranh màu nước loang hay bán tả thực kỹ thuật số.

### 4.2. Cấu trúc trang phục chuẩn (Từng lớp từ trong ra ngoài)
1. **Lớp trong**: Áo sơ mi trắng ngà, cổ bẻ nhọn mở rộng hình chữ V để lộ cổ và vòng cổ đen mảnh. Tay áo phồng lửng 3/4 bo nhẹ dưới khuỷu tay.
2. **Lớp giữa**: Áo gile len sát nách màu xanh rêu (olive green), cổ khoét chữ V sâu. Viền cổ áo gile có **đường viền sọc trắng nổi bật (white contrast stripe)**.
3. **Lớp dưới**: Tạp dề quấn ngang hông (half-apron) màu than chì, dải dây buộc màu xanh rêu rủ xuống phía bên phải (góc nhìn người xem). Tuyệt đối không có yếm che ngực.
4. **Phụ kiện & Đạo cụ**: Băng đô đen mảnh, nơ nhỏ sau gáy phải, hoa trắng cài tóc bên trái, vòng cổ đen mảnh, bình xịt nước vòi trắng cầm ở tay phía bên phải (góc nhìn người xem).

---

## 5. Expression-Only Edit Template

Quy tắc biên tập biểu cảm:
- **Giữ nguyên 100% phần Identity Prompt** (tư thế, trang phục, góc quay cơ thể, tay cầm bình xịt, hướng đầu).
- **Cấm thay đổi tư thế**: Nghiêm cấm thay đổi góc nghiêng đầu, không đưa tay lên cằm, không khoanh tay.
- **Chỉ thay đổi ngũ quan**: Chân mày, ánh mắt, khuôn miệng, giọt mồ hôi hoặc vệt nước mắt.

Cú pháp:
```text
[CORE_IDENTITY_PROMPT], [EXPRESSION_BLOCK]
```

### Expression Presets (Khớp ngữ nghĩa hiện hành của game):
- **04 (Sad)**:
  ```text
  sad expression, downcast sorrowful amber eyes looking slightly down, drooped inner eyebrows angled in distress, softly closed trembling downturned mouth, melancholic unhappy demeanor, unchanged body posture and fixed head angle
  ```
- **05 (Angry / Annoyed)**:
  ```text
  angry expression, irritated scowl, sharply furrowed downward-slanted dark eyebrows, tense glaring amber eyes, tightly clamped displeased frowning mouth, frustrated annoyed face, unchanged body posture and fixed head angle
  ```
- **06 (Surprised / Shocked)**:
  ```text
  surprised expression, wide open startled amber eyes with small pupils, high raised arched eyebrows, small open circular O-shaped mouth, astonished gasp reaction, unchanged body posture and fixed head angle
  ```
- **07 (Thinking / Pondering)**:
  ```text
  thinking expression, pensive gaze with amber eyes glancing upward-sideways in thought, slightly narrowed focused eyelids, one eyebrow gently raised, small pursed contemplative lips, thoughtful wondering face, unchanged body posture and fixed head angle
  ```

---

## 6. Technical Sprite Specifications & Bounding Geometry

- **Canvas Resolution**: 1800 x 1800 px (Square RGBA).
- **Alpha Sprite Bounding Box**: `(xmin: 467, ymin: 46, xmax: 1466, ymax: 1800)`.
- **Exact RGBA Differences in Originals (PIL Verified, Non-Zero Delta Pixels)**:
  - `02.png` vs `01.png`: `(xmin: 733, ymin: 356, xmax: 1026, ymax: 633)` (6,307 pixels)
  - `02.png` vs `03.png`: `(xmin: 846, ymin: 347, xmax: 1052, ymax: 657)` (2,610 pixels)
  - **Union Face Delta Bounds**: `(xmin: 733, ymin: 347, xmax: 1052, ymax: 657)`
  - *Note*: In verified originals `01.png`–`03.png`, all sprite pixels outside this union bounding box are bit-for-bit identical.

---

## 7. Reference Generation Trial Observations & Limitations

- **Trial Set**: Evaluated actual 9Router image generations using `image: dataURL` anchored to verified original `02.png` (`reference-sad.png`, `reference-angry.png`, `reference-surprised.png`).
- **Observed Behavior**:
  - Retains core character design: short flicked slate-blue hair, blunt bangs, ahoge, white daisy pin at viewer-left temple, black headband, olive V-neck vest with white stripe, dark waist apron, and spray bottle.
  - Matches canonical hand-drawn sketchy graphite pencil contour aesthetic with flat matte colors without drifting to photorealism.
  - Generates subtle, distinct facial expressions per prompt slot (sad downturned mouth, angry scowl, surprised open mouth).
- **Observed Limitations**:
  - Full-canvas regeneration: output canvas and sprite framing differ from the original; no measured scale-error percentage is claimed.
  - Pixels outside the face are not identical to originals across diffusion runs.
- **Downstream Compositing Workflow (Proposed, Untested)**:
  - Direct coordinate pasting from trial outputs into original `02.png` coordinates fails due to global rescaling.
  - Any composite pipeline requires prior geometric registration (affine or landmark alignment) of the generated head/face before alpha-feathered blending onto the master base body.
