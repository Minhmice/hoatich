---
name: hoatich-asset-review
description: Use when checking Hoa Tích AI asset candidates for identity, style, direction, crop, transparency, halos, malformed images, or promotion readiness after 9Router generation.
---

# Review asset Hoa Tích

Đọc [art direction](../hoatich-asset-director/references/art-direction.md) và [batch contract](../hoatich-asset-director/references/batch-contract.md). Xác minh PRODUCT; nhận brief, reference thực và candidate path. Thiếu ảnh/không mở được thì giữ `pending-review`, không duyệt dựa prompt/report worker. Evaluation-only không gọi API hoặc tự sửa ảnh.

## Gate theo thứ tự
1. Kiểm HTTP/outcome và decode raster bằng image library; file lỗi dù HTTP200 vẫn failed. Không coi header/dung lượng tối thiểu là đủ.
2. Đo actual dimensions, mode, alpha extrema/bounds nếu có; request size chỉ là hint trừ strictSize. Không tự resize trước để giấu crop lỗi.
3. Áp alpha theo category:
   - isolated sprite cần RGBA và vùng transparent/visible theo brief; alpha255 toàn ảnh là rejected.
   - background kín cho phép RGB JPEG/PNG hoặc RGBA opaque; không reject chỉ vì không alpha.
   - spirit translucent theo explicit alpha policy: không ép có pixel255 nếu brief yêu cầu toàn figure bán trong suốt.
4. Mở ảnh thật và so reference: identity/species, style, pose/hands/clothes/props, direction/state, camera/layout, crop/margins và chữ/vật thừa.
5. Xem viền trên nền sáng/tối nếu tool hỗ trợ: trắng/đốm đỏ-vàng/halo nhìn thấy không phải “alpha sạch”. Không tự defringe/chroma-key/bỏ lỗi để pass.
6. Ghi review decision và reason; request outcome tách biệt.

| Decision | Ý nghĩa / promotion |
|---|---|
| `pending-review` | Chưa có đủ bằng chứng nhìn ảnh; không promote |
| `approved` | Decode + contract + visual checks đạt; đủ điều kiện provenance, chưa chứng minh được wire gameplay |
| `rejected` | Sai identity/state/layout/alpha bắt buộc, raster hỏng; không promote |
| `needs-cleanup` | Candidate đúng hướng nhưng viền/crop/chi tiết cần sửa; giữ staging, không promote |

## Ví dụ quyết định
A RGB background đúng brief: alpha category hợp lệ, **chỉ approved sau decode và nhìn layout thật**. B flower RGBA alpha255: rejected. C NPC đúng mặt nhưng viền trắng/đỏ: needs-cleanup. D HTTP200 invalidPNG: failed request artifact, rejected candidate. Không nói99% giống từ prompt; metric nếu có phải nói đo gì, không thay visual judgement.

## Đầu ra
Item ID/attempt, measured format/dimensions/mode/alpha, reference đã mở, observed defects, review status/reason/reviewer. Reference chỉ được “đã xem” nếu tool thật mở thành công. Ảnh chưa có thì mô tả expected checks, không fabricated observations. Chuyển approved records sang [provenance](../hoatich-asset-provenance/SKILL.md); không đổi mapping/source code trong review.
