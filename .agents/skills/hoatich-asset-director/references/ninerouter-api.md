# 9Router image API — Hoa Tích

Nguồn provider: [9Router image docs](https://raw.githubusercontent.com/decolua/9router/master/skills/9router-image/SKILL.md). Bằng chứng project: `asset-source/generated/player-redo/*.payload.json`, `new-character-style/manifest.json`, `ASSET_PROMPTS.md`. Payload lịch sử không bảo đảm model hiện còn khả dụng.

## Kết nối
Dùng base URL và secret cấu hình hiện có/env; tra setup generator/config đúng scope, không đọc/dump toàn bộ provider database. Env thường dùng `NINEROUTER_BASE_URL`, `NINEROUTER_API_KEY` hoặc `MINHMICE_API_KEY`. Secret env name không phải literal API key. Không in base URL có credentials/query token, bearer header, secret, raw base64 hoặc full authenticated request. Không hardcode host cá nhân, không cài provider/model khác để lách lỗi.

Base đã kết thúc `/v1`: `POST <base>/images/generations`; tránh `/v1/v1`. Headers Authorization Bearer secret và Content-Type application/json. Trước thay model kiểm current configuration/discovery; route docs có `/v1/models/image` và `/v1/models/info?id=...`. Không tự dùng text-model catalog làm bằng chứng image-model không tồn tại.

## Request đã thử
```json
{
  "model": "cx/gpt-image-2.5",
  "prompt": "Edit the reference; change facial expression only. Keep identity, pose and drawing style. One isolated sprite, transparent background; no text or sheet.",
  "size": "1024x1024",
  "background": "transparent",
  "image": "data:image/png;base64,<in-memory reference bytes>"
}
```
`image` bỏ khi text-only; style-reference được gắn role riêng, không tự là identity. Background kín không gửi `background: transparent`; dùng option opaque khi provider hiện hỗ trợ hoặc omit và kiểm output. Model/provider có thể thay shape/params; chỉ dùng option đã xác minh. Không giả định masks, seeds, negative_prompt, weight syntax, pixel-preserving edits. Exclusions là text trong prompt.

## Response
Kiểm HTTP status; JSON thường `data[0].b64_json` hoặc `data[0].url`. Không có image là failure, không ghi text lỗi thành PNG. Với URL, kiểm HTTP khi download, không log signed URL; không forward Authorization của 9Router cho host ảnh khác. Decode raster thực, đo size/mode/alpha; response size1254² từ request1024² đã từng xảy ra: ghi actual, reject chỉ nếu strict deliverable không đạt.

Base64 chỉ tồn tại khi gửi/giải mã; manifest/payload lưu `{path,sha256,encoding}` thay bytes. Không log raw provider response có token/URL secret. Lưu HTTP/error code và thông điệp đã sanitize đủ chẩn đoán. Không tuyên bố cả alpha sạch hoặc cùng identity từ status200.

Retry/resume/cancel lấy duy nhất từ [batch contract](batch-contract.md). HTTP accepted/timeout có thể đã tính phí; unknown outcome không phải lời mời retry. Skill-authoring/scenario tests không chạy image API.
