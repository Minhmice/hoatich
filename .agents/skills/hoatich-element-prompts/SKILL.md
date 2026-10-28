---
name: hoatich-element-prompts
description: Use when writing Hoa Tích prompts for vases, pots, ribbons, wrapping paper, tools, props, decorative elements or UI icons through 9Router.
---

# Prompt element Hoa Tích

Đọc [art direction](../hoatich-asset-director/references/art-direction.md) và [batch contract](../hoatich-asset-director/references/batch-contract.md); xác minh Hoa Tích từ PRODUCT. Tạo prompt khác nhau cho **đồ vật trong scene** và **icon UI**, không lấy cùng ảnh1024 thu nhỏ dùng cả hai.

## Brief và đầu ra
Trước prompt final: tra asset/caller/tham chiếu nơi sử dụng để lấy `role`, `camera`, `relativeScale`, `anchor`, `displaySize`, `crop`, `alphaPolicy`, `state`. Không có thông tin thì ghi `unresolved`, tra source trước hỏi user; không tự chốt camera15°, anchor3D hoặc padding10% thành contract đã duyệt. Prompt nháp có thể trình bày phần chưa rõ, không dispatch.

**Khi camera/anchor/scale/displaySize unresolved: đầu ra chỉ có bảng field còn thiếu + nguồn cần tra + subject/style/exclusions độc lập geometry. Không viết câu prompt đặt front view, centered base, padding hoặc pixel size mẫu cho field chưa biết.** Không dùng ví dụ bên dưới để tự điền brief thiếu.

Trả item ID/source path đã xác minh, reference role/path/hash, identity hình học–vật liệu–màu, style chung, pose/state, composition/alpha và exclusions. Prompt-only không sinh ảnh. Batch nhiều props dùng director; review/provenance trước promotion.

| Vai trò | Ràng buộc cần khóa |
|---|---|
| Bình/chậu trên bàn | Mặt trên/miệng bình nhìn theo camera bàn, điểm đặt đáy, chiều cao so stem, vùng che khuất |
| Giấy gói/nơ | Trạng thái phẳng/gấp/buộc, điểm nối và phần nào được che stem; không tự cắm bouquet hoàn chỉnh |
| Dụng cụ | Góc nhìn, kích thước so tay, có/không bàn tay theo brief |
| Icon UI | Kích thước hiển thị thực, silhouette nhỏ, contrast/padding, không scene/label baked-in |

## Ví dụ phần prompt không phụ thuộc geometry
```text
One empty ceramic vase for the Hoa Tich arrangement scene, cream body and olive rim. Match rough graphite contours and opaque flat matte color fills. Do not add flowers, hands, table, UI panel, lettering, label, logo, watermark, glossy 3D or photorealistic texture.
```
Đây chỉ là subject/style/exclusions, chưa dispatchable: ghép camera/anchor/scale/composition/alpha sau khi tra đủ brief. Nhãn tiếng Việt là UI text riêng nếu caller cần; không tự vẽ chữ bằng model.

## Review
Mở ảnh tại intended scale và so reference: đúng góc/anchor/relative size, không cắt miệng/đáy/handle, không tự thêm hoa hoặc người. Alpha theo brief, không ép opaque background thành isolated sprite. Không hứa “sạch alpha” chỉ vì RGBA. Missing camera/anchor không được giấu bằng prompt generic hoặc xuất runtime trước.
