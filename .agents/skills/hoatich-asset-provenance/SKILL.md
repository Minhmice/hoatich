---
name: hoatich-asset-provenance
description: Use when archiving, hashing, recording, exporting, resuming, or promoting Hoa Tích 9Router assets while preserving source files, secrets, manifests, and runtime wiring boundaries.
---

# Provenance asset Hoa Tích

Đọc [manifest contract](references/manifest-contract.md), [batch contract](../hoatich-asset-director/references/batch-contract.md) và review record. Skill này không tự duyệt mỹ thuật, không tự đổi caller/mapping; chỉ chuyển quyết định và bytes đã approved thành records/export.

## Record
Một record append-only theo `batchId+assetId+attempt`, tách `outcome` khỏi `review`. Ghi reference role/path/SHA-256, model, prompt hash, sanitized status/error, output hash/bytes/dimensions/mode/alpha-bounds, review decision/reason, archive/export hashes/status/wiring. Không ghi bearer/API key, raw base64, full authenticated request hoặc signed URL. `null`/`pending` là trạng thái thật, không điền hash placeholder.

`size` là hint nếu batch không ghi `strictSize`; ghi actual dimensions. `unknown` timeout sau submit không được tự retry mù, vì provider có thể đã tạo/tính phí; tra status khi hỗ trợ. `failed` malformed/transport đã biết; `rejected` validation/review; `needs-cleanup` giữ staging.

## Archive và promotion
1. Candidate phải `approved`, output hash phải là file đã review.
2. Nếu target tồn tại, hash exact bytes hiện tại rồi archive trước. Hash archive khác current: dừng, không overwrite.
3. Authored source bất biến; clone AI riêng staging.
4. Export theo asset type/caller convention; portrait mới dùng max-height1200, Lanczos, WebP90/method6 chỉ khi brief yêu cầu. Decode export lại, đo mode/dimensions/alpha.
5. Promote atomically theo scope; export lỗi không xóa candidate/backup.
6. File runtime không chứng minh caller đã wire; nếu chưa trace/review caller, ghi `wiring: not-verified` và báo rõ.

## Resume và security
Resume theo ID/attempt/manifest: succeeded đúng hash bỏ qua, pending chạy khi dependency/slot sẵn, unknown đối soát, rejected/needs-cleanup không promote. Khi cancel flush records và giữ in-flight unknown.

Secret chỉ in-memory. Nếu secret/base64 đã bị ghi log/file, dừng thao tác tiếp, báo security incident; không tự revoke hoặc đổi credential trừ khi user giao scope. Provenance không dùng raw response làm evidence công khai.

## Completion report
Báo counts `succeeded/approved/rejected/needs-cleanup/pending/unknown`, staging/archive/export paths, hashes, visual defects từ reviewer, validation command thật sự chạy, và assets chưa wire gameplay. Không nói “đã tích hợp” nếu chỉ có file trong public.
