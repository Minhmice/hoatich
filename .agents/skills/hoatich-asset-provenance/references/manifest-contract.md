# Manifest contract — Hoa Tích

Parent owns consolidated manifest; workers write only family fragments. Mỗi request một record append-only theo assetId+attempt. Không sửa records lịch sử để che fail; repair candidate là attempt mới.

## Fields
- `batchId`, `assetId`, `family`, `assetType`, `state`, `attempt`.
- `references[]`: role `identity|style|neutral-master`, verified path, actual SHA-256.
- `request`: model, sanitized prompt hoặc prompt path+hash, requested dimensions, background option, submittedAt; không Authorization/token/base64/signed URL.
- `outcome`: `pending|succeeded|failed|unknown`, HTTP status nếu biết, sanitized error code/reason. Timeout sau submit không tự đổi failed; check status nếu available rồi ghi evidence, không blind retry.
- `output`: actual path/hash/bytes/format/dimensions/mode, alpha extrema/bounds nếu có.
- `review`: `pending-review|approved|rejected|needs-cleanup`, reason, reviewer, evidence/ảnh đã mở.
- `archive`: original target path, backup path, hash actual; `export`: target/hash/format/dimensions/options, status, wiring evidence hoặc `not-verified`.
- `timestamps`: current clock và note khi clock lệch; không lấy ngày từ brief làm timestamp giả.

## Ví dụ sanitized record
```json
{
  "batchId": "rose-direction-check",
  "assetId": "hoa-hong-do-left",
  "family": "hoa-hong-do",
  "assetType": "flower",
  "state": "left",
  "attempt": 1,
  "references": [],
  "request": {"model": "cx/gpt-image-2.5", "submittedAt": null},
  "outcome": {"status": "pending", "httpStatus": null},
  "output": null,
  "review": {"status": "pending-review", "reason": "Not generated or inspected"},
  "archive": null,
  "export": {"status": "not-exported", "wiring": "not-verified"}
}
```
Đây là record chưa generate, không fabricated response/output hash. Trước dispatch phải điền reference path/hash nếu có và prompt hash thực từ brief, không dùng SHA placeholder như bằng chứng.

## Promotion transaction
1. Approved và artifact hash đúng review; đổi bytes sau review phải review lại.
2. Target existing: đọc/hash current, archive exact bytes, hash backup phải bằng current. Mismatch: stop promotion, giữ candidate; không overwrite hoặc xóa backup.
3. Authored originals bất biến; AI clones lưu staging riêng.
4. Export theo loại và convention caller hiện tại. Portrait hiện có maxheight1200,Lanczos,WebP quality90/method6; không áp resize đó lên background/icon/flower tự động. Decode export, record hash/dimensions/alpha policy.
5. Chỉ thay authorized target sau checks, không mất file cũ nếu export lỗi; parent là integration owner.
6. Runtime file tồn tại không chứng minh caller dùng. Báo `generated/exported, wiring not verified` nếu chưa trace caller/runtime.

Resume: succeeded có file/hash đúng không gọi lại; pending có thể dispatch theo quota/dependency; unknown đối soát; rejected/needs-cleanup không promote. Metadata JSON không chứa bytes ảnh; base64 xử lý trong memory khi request/decode. Không dump raw response. Secret chỉ hiện trong response in-memory không tự chứng minh leaked externally; nếu đã persist/log thì báo incident theo scope, không tự revoke credential hoặc đổi auth.
