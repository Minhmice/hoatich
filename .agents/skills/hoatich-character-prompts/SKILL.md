---
name: hoatich-character-prompts
description: Use when writing Hoa Tích character identity prompts, cloning authored sprites, creating NPC designs, or changing expressions and poses through 9Router.
---

# Prompt nhân vật Hoa Tích

**Bắt buộc đọc:** [art direction](../hoatich-asset-director/references/art-direction.md), [batch contract](../hoatich-asset-director/references/batch-contract.md). Xác minh project root từ PRODUCT; mở ảnh và đọc characterAssets/customers hiện tại trước gán ID/mood. Không tạo mới luật/lore hoặc sửa caller trong nhiệm vụ prompt.

## Đầu ra
Trả item ID/mood đúng source, reference path/hash/role, ba block tách biệt **identity / style / expression**, composition/crop và exclusions. Prompt-only không gọi image API.

Identity mô tả tóc, mắt, khuôn mặt, phụ kiện, lớp áo, prop, tư thế theo ảnh thật; hướng luôn nói rõ viewer-left/right trong mô tả, không đổi ID. Style lấy reference chung, không lặp policy API/retry. Expression chỉ thay phần được brief cho phép. Giữ pose, hands, prop, head angle, silhouette và canvas nếu chỉ sửa mặt.

Authored customer-one là nam tóc charcoal mắt xanh sơ mi trắng và len navy khoác vai; passerby là nữ trung niên áo hồng vòng ngọc chống hông. Không dùng prompt nữ/cardigan hoặc áo bà ba cũ. Mở authored01–02 để xác nhận, không suy từ tên.

## Reference
- Có artwork: mỗi mood dùng trực tiếp cùng ảnh gốc. Clone01–02 ở staging riêng, không thay authored originals.
- NPC mới: neutral là candidate; review bằng `hoatich-asset-review`, sau approved mới freeze path/hash thành neutral-master. Cùng master cho mọi expression; không chain sad→happy.
- Style-only reference không là mặt/trang phục cần copy. Tuổi/wardrobe tự thiết kế ghi là art decision, không canonical lore.

## Ví dụ expression-only (customer-one)
```text
Edit the supplied original young man's sprite; change facial expression only. Keep short charcoal parted hair, green eyes, white short-sleeved shirt and navy sweater tied over shoulders. Match the original rough graphite contours and matte simple color planes. Quietly sad: slightly raised inner brows, lowered gaze, small downturned mouth. Keep head angle, arms, hands, clothing and crop unchanged. One isolated sprite on transparent background; no extra props, hand-on-chest gesture, text, sheet or photorealistic rendering.
```

**Lỗi thường gặp:** gộp sad/touched thành một ảnh; đoán identity từ prompt cũ; tự nghiêng đầu/đưa tay lên cằm; coi request200 là approved master. Neural edit có thể rescale toàn ảnh, không hứa pixel-locked body. Xuất candidates cho [review](../hoatich-asset-review/SKILL.md) và [provenance](../hoatich-asset-provenance/SKILL.md), không promote ảnh viền lỗi.
