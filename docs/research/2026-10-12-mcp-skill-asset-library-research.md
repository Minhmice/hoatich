# Nghiên cứu sau: MCP và Skill cho kho tài nguyên game

## Trạng thái

- **Loại:** research brief / decision log
- **Trạng thái:** chưa nghiên cứu sâu, chưa triển khai
- **Liên quan:** `docs/superpowers/specs/2026-10-12-flower-shop-narrative-game-design.md`
- **Không thuộc:** gameplay runtime, browser build, Steam build hoặc vertical slice hiện tại

## 1. Mục tiêu

Tìm cách giúp assistant và công cụ phát triển truy cập kho tài nguyên lớn của game mà không phải nạp toàn bộ file binary vào context.

Kho có thể gồm:

- concept board;
- character reference;
- flower reference;
- background và scene layers;
- sprites, animation và UI assets;
- dialogue notes và lore;
- music, ambience và SFX;
- asset versions, license và trạng thái duyệt.

Mục tiêu cuối:

1. Tìm asset theo tên, tag, loại, chapter, nhân vật hoặc content ID.
2. Tìm content đang tham chiếu asset nào.
3. Phát hiện asset thiếu, asset trùng ID hoặc dùng nhầm version.
4. Lấy metadata/thumbnail trước; chỉ đọc binary khi thật sự cần.
5. Giữ asset riêng tư và tránh gửi toàn bộ kho vào model context.
6. Có thể mở rộng từ local folder sang cloud/database sau này.

## 2. Câu hỏi cần nghiên cứu

### Kho và dữ liệu

- Kho đang nằm ở local folder, external disk, cloud drive, Git LFS hay nhiều nơi?
- File chính gồm loại nào: PNG, PSD, SVG, GLB, WAV, MP3, JSON, Markdown, Ink?
- Quy mô: số file, tổng dung lượng, tốc độ thay đổi, số người cùng sửa?
- Có asset cần bảo mật hoặc không được upload ra ngoài không?
- Có metadata sẵn hay phải quét từ filename/folder/board?

### Workflow

- Ai tạo và duyệt asset?
- Asset có trạng thái `concept`, `draft`, `approved`, `deprecated` không?
- Có cần version pin theo build/chapter không?
- Content ID được đặt trong code, Ink, board hay spreadsheet?
- Cần search one-shot hay cần đồng bộ index liên tục?

### Tool boundary

- Assistant chỉ cần đọc hay cần ghi metadata?
- Có cần rename/move/delete/replace asset không?
- Có cần preview ảnh/audio/video không?
- Có cần validate reference trong CI/build không?
- Có cần nhiều client cùng dùng server không?

### Runtime và triển khai

- MCP chạy local stdio hay HTTP server?
- Có cần auth, multi-user, audit log không?
- Có cần dùng chung index với game build pipeline không?
- Có cần deploy trên máy khác/CI không?

## 3. Phương án cần so sánh

### A. Không dùng MCP: catalog JSON + script

Tạo `asset-catalog.json`, script index folder và validator.

**Ưu:** ít code, dễ debug, đủ cho kho local nhỏ.

**Nhược:** assistant không có tool search trực tiếp; cần mở file hoặc chạy script thủ công.

**Chỉ chọn khi:** kho đơn giản, một người dùng, search ít, chưa có nhu cầu automation.

### B. Local MCP read-only

Một MCP server local đọc catalog/index và expose tool hẹp:

```text
search_assets(query, filters)
get_asset(asset_id)
get_related_content(asset_id)
find_references(content_id)
validate_references(scope)
```

**Ưu:** context nhỏ, search có cấu trúc, giữ binary local, dễ mở rộng.

**Nhược:** thêm server lifecycle, schema, lỗi permission và test tool.

**Khuyến nghị sơ bộ:** phương án này nếu kho lớn hoặc phân tán, nhưng chỉ sau khi catalog format đã ổn định.

### C. MCP đọc/ghi đầy đủ

Cho phép search, metadata edit, rename, move, delete, publish.

**Ưu:** workflow tập trung.

**Nhược:** rủi ro xóa/sửa nhầm, audit và conflict phức tạp, không cần cho giai đoạn đầu.

**Không khuyến nghị ban đầu.** Nếu cần write, tách từng action, có dry-run, approval và audit log.

### D. Asset database/cloud service

Đưa kho vào object storage + DB/search service rồi MCP làm gateway.

**Ưu:** multi-user, scale, query mạnh, history rõ.

**Nhược:** chi phí, auth, upload pipeline, backup và privacy.

**Chỉ chọn khi:** kho đã vượt local workflow hoặc có nhiều người/thiết bị cần làm việc chung.

## 4. Skill cần nghiên cứu

Skill không phải asset server. Skill định nghĩa cách assistant sử dụng kho và giữ convention.

Nội dung skill dự kiến:

1. Đọc catalog trước khi đoán path.
2. Search bằng content ID/tag trước filename mơ hồ.
3. Không mở binary lớn nếu thumbnail/metadata đủ.
4. Luôn trả asset ID, version, path và status.
5. Không dùng asset `draft` trong production content nếu chưa được phép.
6. Khi tạo flower/customer/order mới, tạo hoặc cập nhật related content references.
7. Chạy validator sau thay đổi reference.
8. Không rename/move/delete bằng tool nếu chưa có approval.
9. Báo rõ khi asset thiếu, duplicate hoặc license chưa rõ.
10. Không biến asset metadata thành game runtime state ngoài contract.

## 5. Catalog schema sơ bộ

```json
{
  "id": "flower.mong-tan.v1",
  "kind": "flower-art",
  "path": "assets/flowers/mong-tan/v1/",
  "previewPath": "assets/flowers/mong-tan/v1/preview.webp",
  "tags": ["dead-world", "purple", "story"],
  "status": "concept",
  "version": 1,
  "relatedContentIds": ["flower.mong-tan"],
  "source": "concept-board-2026-10-12",
  "license": "owned",
  "checksum": "sha256:...",
  "updatedAt": "2026-10-12T00:00:00Z"
}
```

Cần nghiên cứu thêm:

- schema có nên tách `assetId` và `contentId` không;
- version là semver hay integer;
- checksum tính trên file hay manifest;
- preview tự sinh bằng tool nào;
- metadata lưu JSON, SQLite hay sidecar YAML;
- cách biểu diễn variant/layer/animation frame.

## 6. MCP security baseline

Mặc định phải:

- read-only;
- allowlist root directories;
- chặn path traversal và symlink escape;
- không execute arbitrary shell command;
- không upload binary ra external service mặc định;
- trả kết quả compact, phân trang khi nhiều record;
- không expose hidden/private folders;
- log request và lỗi, không log nội dung riêng tư không cần thiết;
- giới hạn kích thước preview và file đọc trực tiếp;
- có timeout cho scan/search;
- tách index refresh khỏi request search nếu scan lớn.

Nếu có write:

- dry-run bắt buộc;
- action allowlist riêng;
- confirmation cho rename/move/delete/publish;
- audit log trước/sau;
- backup hoặc undo cho destructive operation;
- test permission bằng user không có quyền ghi.

## 7. Acceptance criteria cho nghiên cứu sau

Nghiên cứu chỉ được xem là đủ khi trả lời được:

- Catalog tối thiểu nên dùng JSON, SQLite hay database khác.
- MCP có thật sự cần hay script/catalog đã đủ.
- Transport local stdio hay HTTP phù hợp.
- Tool names và input/output schema tối thiểu.
- Cách index ảnh/audio và tạo preview.
- Cách link asset với flower/customer/order/dialogue/chapter.
- Quyền đọc/ghi và approval boundary.
- Cách chạy validator trong local workflow và CI.
- Cách migrate catalog khi đổi schema.
- Cách test bằng fixture nhỏ mà không cần mount toàn bộ kho.

Deliverable nghiên cứu:

1. decision record có recommendation;
2. catalog schema đã chọn;
3. MCP tool contract nếu cần;
4. skill draft nếu workflow đủ ổn định;
5. threat model ngắn;
6. spike plan với kho fixture nhỏ;
7. tiêu chí dừng nếu catalog/script đơn giản đã đáp ứng nhu cầu.

## 8. Thứ tự làm khuyến nghị

1. Kiểm kê kho thật.
2. Chọn naming/ID convention.
3. Tạo catalog fixture nhỏ bằng script.
4. Đo search, refresh, preview và reference validation.
5. Dùng catalog thủ công trong một workflow content.
6. Chỉ khi friction còn rõ mới bọc catalog thành local MCP.
7. Viết skill sau khi workflow thực tế ổn định.
8. Chỉ thêm write tools khi read-only workflow đã an toàn.

## 9. Ngoài phạm vi hiện tại

- Không scan kho thật trong task game spec.
- Không cài MCP server.
- Không tạo skill production.
- Không tự ý đổi tên, di chuyển, xóa hoặc upload asset.
- Không để MCP trở thành dependency bắt buộc của browser game.
- Không xây asset DAM/cloud platform trước khi có quy mô và workflow thực tế.
