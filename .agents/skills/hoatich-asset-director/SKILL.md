---
name: hoatich-asset-director
description: Use when generating, batching, reviewing, or promoting Hoa Tích game assets through 9Router and independent subagents, especially when preserving authored references, splitting flowers/characters/elements/backgrounds, or resuming failed batches.
---

# Điều phối asset Hoa Tích

## Khi dùng
Đọc `PRODUCT.md`, `DESIGN.md` và references trước. Dùng director cho nhóm asset/batch hỗn hợp; prompt-only một loại gọi skill chuyên môn trực tiếp. Luôn xác minh content IDs, callers và paths hiện tại bằng source/tools.

**Không đọc được Hoa Tích, không đủ reference, hoặc scope mơ hồ thì dừng dispatch và ghi blocker.** Skill plan/evaluation-only không gọi API, không sửa file runtime, không dựng framework.

## Flow

1. **Preflight:** xác minh project root, loại asset, source authority, current caller/path, style authority, alpha category và output IDs.
2. **Brief:** tạo `batchId`, mode (`prompt-only|generate-staging|promote`), item list, references+SHA-256, owner, staging paths, canvas/anchor/alpha, acceptance, quota.
3. **Partition:** một worker một family độc lập; worker không chia manifest/path với worker khác. Neutral master phải review trước expressions.
4. **Slots:** parent cấp quota tổng≤4, worker≤2; ví dụ2+1+1. Wave sau chờ slot. Không để mỗi worker tự mở2 request làm vượt tổng.
5. **Dispatch:** gửi brief đầy đủ, prompt block order và failure contract. Mỗi request một ảnh; không sheet.
6. **Collect:** đọc worker records, kiểm collision, hash/reference role, review status; không tin “done” nếu chưa mở candidate.
7. **Promote:** chỉ approved. Archive bytes/hash trước replacement; provenance export; mapping/caller riêng task, không suy ra đã tích hợp.
8. **Report:** generated/approved/rejected/pending/unknown, paths, defects, tests thực sự chạy, asset chưa wire.

## References
- `references/art-direction.md`: style, identity authority, sprite/background rules.
- `references/batch-contract.md`: brief, ownership, slots, retry/resume/cancel, statuses.
- `references/ninerouter-api.md`: endpoint/payload/response/secret limits.
- Prompt details: `hoatich-flower-prompts`, `hoatich-character-prompts`, `hoatich-element-prompts`, `hoatich-background-prompts`.
- Gates: `hoatich-asset-review`, `hoatich-asset-provenance`.

## Pressure rules
- “Nhanh, bỏ review”: không bỏ gate; staging vẫn tiếp tục được nếu scope authorized.
- “Gộp để tiết kiệm”: từ chối sheet; IDs runtime là asset đơn.
- “Overwrite cho tiện”: archive/hash rồi stage; authored source bất biến.
- “HTTP200 xong”: review ảnh thật.
- “Chạy vô hạn”: queue hữu hạn, retry tối đa2; cancel dừng dispatch mới.
