---
name: hoatich-background-prompts
description: Use when writing Hoa Tích flower-shop or environment background prompts, day/night variants, fixed-camera scenes, or reference-conditioned layout and lighting edits through 9Router.
---

# Prompt background Hoa Tích

Đọc [art direction](../hoatich-asset-director/references/art-direction.md), [batch contract](../hoatich-asset-director/references/batch-contract.md); xác minh PRODUCT. Scene source/reference phải mở thật. Chỉ prompt thì không gọi API.

## Brief
Trả scene ID/ca, reference path/hash, camera/aspect/crop, vị trí cửa–cửa sổ–kệ–quầy, vùng trống dành cho cắm hoa, palette/lighting và exclusions. Tra reference hiện tại trước khi chốt vị trí; không áp bố cục ví dụ cho scene chưa biết. Background mặc định **opaque**, RGB JPEG/PNG hoặc RGBA opaque đều có thể hợp lệ nếu brief cho phép; không yêu cầu alpha0 hoặc export portrait1200 cho nền.

Tách style nét vẽ, composition geometry và lighting. Ca ngày ấm kem–olive; đêm tím xám/lam khói và nguồn đèn ấm theo DESIGN. Không đổi mặt bằng/phối cảnh để thể hiện thời gian. Reference-edit ưu tiên cảnh gốc đã kiểm tra. Prompt không bảo đảm geometry pixel-identical, phải so ảnh sau sinh.

## Ví dụ đổi shop-day thành evening khi reference xác nhận bố cục
```text
Edit the supplied Hoa Tich flower-shop background into evening twilight. Keep the same fixed camera, room geometry, window positions, entrance door, shelves, service counter and empty foreground flower-arrangement work surface. Change only outdoor dusk light and the existing lamp's warm amber illumination. Match hand-drawn rough graphite contours, simple matte color planes and the reference's detail level. Opaque complete landscape background, same framing. No people, ghosts, bouquets or objects on the clear work surface, no signage, lettering, UI, watermark or new furniture.
```

## Review và lỗi hay gặp
Dùng [review](../hoatich-asset-review/SKILL.md) so doorway/shelf/table và crop ở intended viewport, nhìn cả vùng thao tác chứ không chỉ màu. JPEG RGB không phải fail vì thiếu alpha. Có alpha holes không chủ ý, người/UI/chữ, bàn bị che, camera trôi là lỗi; ghi rejected/needs-cleanup thay vì tự approve. Không tự cắt cửa/kệ thành layer, viết shader crossfade hoặc thêm customer sprite trong scope prompt.
