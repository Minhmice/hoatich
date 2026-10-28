---
name: hoatich-flower-prompts
description: Use when writing or generating Hoa Tích flower sprites, botanical variants, directions, buds, blooms, stems, leaves, or reference-conditioned flower images through 9Router.
---

# Prompt hoa Hoa Tích

## Contract

Đọc `PRODUCT.md`, `DESIGN.md`, `src/game/content/flowers.ts` và `flowerAssets.ts`; đọc reference ảnh trước. ID/species/màu canonical từ source, không bịa loài/ID/lore. Dùng [director](../hoatich-asset-director/SKILL.md) cho batch; dùng [review](../hoatich-asset-review/SKILL.md) trước promotion.

Một prompt hoa có đúng block:

```text
[REFERENCE / EDIT INSTRUCTION]
[IDENTITY / BOTANICAL SUBJECT]
[HOATICH STYLE]
[DIRECTION / STATE]
[COMPOSITION / ALPHA]
[PLAIN EXCLUSIONS]
```

Style mặc định: rough graphite contours, opaque flat matte fills, muted storybook 2D, sparse restrained shadow. Không tự thêm polished realism, glossy 3D, wet watercolor hoặc sheet.

Direction/state giữ đúng vocabulary user/source: `left`, `right`, `down`, `bud`, `bloom` nếu brief có. **Không đổi `down` thành `center`; không đổi left/right thành viewer-left/right nếu ID yêu cầu left/right.** Direction là vector stem/bloom riêng với camera. Không dùng mirror/flop như bản generated thay thế; prompt từng hướng khi cần.

## Prompt mẫu

```text
[REFERENCE / EDIT INSTRUCTION]
Keep authored rose botanical identity; change direction only. Use reference as species authority, not as a sheet.
[IDENTITY / BOTANICAL SUBJECT]
One Hoa Hồng Đỏ / red rose: layered crimson petals, thorny deep-green stem, serrated leaves; preserve petal and stem structure.
[HOATICH STYLE]
Hand-drawn 2D storybook game illustration, rough dry graphite contours, opaque muted matte color fills, sparse flat shadow, modest pencil grain.
[DIRECTION / STATE]
Stem and bloom curve distinctly toward viewer-left, approximately 25–30 degrees; bloom faces left; not mirrored from an existing render.
[COMPOSITION / ALPHA]
One isolated full stem, centered with margins, transparent background when sprite brief requires it.
[PLAIN EXCLUSIONS]
No vase, sheet, labels, text, watermark, background scene, glossy highlights, photorealism, wet watercolor bleed, white halo, cut-off stem.
```

## Checklist
- Source ID/reference/hash recorded.
- One request→one output ID; species not mixed.
- Petals, leaf, stem, color and world evidence match source.
- Direction visibly differs in stem/bloom, not only a rotated canvas unless runtime explicitly owns rotation.
- Bud/bloom state changes morphology, not just prompt label.
- Alpha rule follows brief: isolated sprite needs transparent+opaque pixels; opaque background is not a flower sprite.
- Output opened and marked `approved|rejected|needs-cleanup`; HTTP200 alone never passes.
