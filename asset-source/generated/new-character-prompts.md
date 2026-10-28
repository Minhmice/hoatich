# New character identity prompts

## Shared drawing-style block

```text
Use the attached hand-drawn sprite ONLY as a DRAWING STYLE reference, NOT as a person/identity/wardrobe reference. Draw a completely different person described below. Same coarse dry charcoal/graphite pencil contours with visible imperfect grain, simple anime/storybook facial abstraction, tiny dash nose and small mouth, opaque muted flat matte color fills, sparse broad flat shadows, very few fold lines. No realistic pores, individual hair fibers, glossy rendering, elaborate watercolor, airbrushed portrait, detailed wrinkles, 3D, cinematic light. One isolated character from crown to upper thighs, square transparent canvas, arms resting naturally below chest, generous margins. Do not copy reference young man, navy sweater, school shirt, face or haircut; do not draw the player girl, blue bob, flower hairpin or florist apron. No sheet, no text, no scenery.
```

Original `asset-source/characters/customer-one/01.png` supplied solely as drawing-style reference for new neutral01 images. Its identity is not the new character design. Ages, wardrobe and facial details below are art decisions, not new canonical lore.

## Bác Ba (`bac-ba`)

```text
An elderly Vietnamese man around65, lean shoulders, gently squared aged face, short salt-and-pepper gray hair combed sideways with a receding hairline, modest thick gray eyebrows, warm dark-brown simplified anime eyes, only two small age lines by eyes and mouth. Wears a plain faded olive-gray unzipped windbreaker over a muted beige collared shirt, dark charcoal trousers. No glasses, no hat, no props, no beard. Upright reserved three-quarter stance, hands lowered. Calm restrained melancholic neutral expression, mouth closed. Make age clear with shape and gray hair, NOT photorealistic wrinkles.
```

Expressions, each generated independently from this character’s new neutral01, never from previous expression:
- `02` sad: grieving quietly, inner eyebrows lifted slightly, eyes lowered, small downturned closed mouth, no tears
- `03` peaceful: warm grateful gentle closed-mouth smile, relaxed eyebrows, eyes softened with relief

## Hồn Thi Sĩ (`spirit-poet`)

```text
A Vietnamese male poet spirit around30, slender elegant build, long narrow softly angular face, short black side-parted hair swept back, round thin dark wireframe spectacles over simplified gray-blue eyes. Wears a plain dark slate-blue traditional Vietnamese standing-collar long tunic (ao dai ngu than) with simple narrow front closure, no embroidery, no modern necktie, no sweater. Three-quarter standing portrait, hands lowered. Restrained wistful neutral expression. Clearly distinct from the young reference customer. Convey ghostliness by a restrained pale cool face and desaturated bluish clothing with a few very faint pale-blue strokes close to silhouette, NOT heavy smoke, glowing background or horror, NO full-canvas translucent overlay. Crisp visible character on true transparent background.
```

Expressions, each generated independently from this character’s new neutral01, never from previous expression:
- `02` sorrow: deep lingering regret, inner eyebrows slightly raised and drawn together, lower gaze and a small sad closed mouth
- `03` peaceful: quiet closure, serene gentle closed-mouth smile and relaxed softly attentive eyes

## Chú Tư (`chu-tu`)

```text
A middle-aged Vietnamese man around45 with stocky broad build and round friendly face, short dark-brown hair with slightly uneven fringe, thick gently arched eyebrows, warm brown simple anime eyes, a small neat dark moustache. Wears a muted ochre short-sleeve open-collar casual button shirt with a plain chest pocket, dark brown trousers. No sweater, no uniform, no jacket, no glasses, no hat, no apron. Three-quarter standing portrait, both arms lowered naturally. Friendly easygoing neutral expression with small closed smile, slightly sheepish charm. Distinct adult face and build, not elderly or teenage.
```

Expressions, each generated independently from this character’s new neutral01, never from previous expression:
- `02` worried: sheepish worried expression, inner eyebrows raised and one brow slightly uneven, small awkward closed mouth; no head scratching, arms unchanged
- `03` happy: cheerful relieved open smile showing a simple white tooth shape and warm raised cheeks, friendly eyes

## Execution / limitations

Nine separate 9Router `cx/gpt-image-2.5` requests; exact sanitized payloads in `new-character-style/{bac-ba,spirit-poet,chu-tu}/*.payload.json`, response/ref/output hashes in its `manifest.json`. Every raw image directly viewed. Rough contours/simple flat colors visually align with reference direction; hair detail and silhouette edge flecks still vary. No claim of pixel-locked expression geometry, fully cleaned alpha, or exact style match. Originals/old outputs preserved in `new-character-style/previous/`. No gameplay/customer mappings changed in this asset task.
