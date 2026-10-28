# Batch contract — Hoa Tích

## Brief trước dispatch
Một brief có `batchId`, `mode` (`prompt-only`, `generate-staging`, `promote`), `assetType`, `items[]`, `styleAuthority`, `owner`, `acceptance`, `slots`.
Mỗi item có ID/state **đúng yêu cầu/source**, references `{role: identity|style|neutral-master, path, sha256}`, staging paths, canvas `{requested, strictSize}`, alpha policy (`isolated|opaque|explicit`), camera, crop, anchor/relative scale nếu liên quan và lý do replacement. Nếu thông tin còn thiếu: tra source/caller/reference trước; không tự đoán filename/camera/ID, chỉ hỏi phần không thể tra.

Output prompt gồm reference/edit instruction, identity/botanical subject, style, expression/direction/state, composition/alpha, plain exclusions. Mỗi asset một request/ảnh, không sheet hoặc mirror thay generation.

## Ownership và slots
Parent xác nhận Hoa Tích từ PRODUCT và inventory, giao một family độc lập/worker, thư mục staging riêng, prompt document riêng, quota HTTP rõ. Tổng quota được cấp ≤4, mỗi worker≤2; có thể2+1+1 hoặc wave2+2. Không spawn5worker rồi mặc định2request mỗi worker. Worker không tăng quota, sửa shared manifest/source mapping/runtime/sibling. Parent tích hợp records sau kết quả worker; subagent read-only dùng scout theo runtime policy, worker tạo prompt/asset dùng implementer phù hợp.

Neutral NPC mới và expression có dependency thật: review neutral, freeze path/hash, rồi expressions cùng tham chiếu master. Không chain biểu cảm. Authored original luôn là identity authority khi có; clone output để riêng.

## Mode và side effects
- `prompt-only`: chỉ prompt/brief theo yêu cầu. Không image API, không runtime writes, không build/test app hoặc dựng framework.
- `generate-staging`: prompt + từng request + records + review; không tự sửa caller/mapping.
- `promote`: chỉ item đã approved, parent archive/hash trước replacement; originals authored vẫn giữ nguyên, clone lưu riêng.
Tạo skill/đánh giá kế hoạch không cấp phép batch trả phí. User đã ủy quyền tự chạy không cần duyệt từng ảnh: agent vẫn phải tự review; không dựng approval loop không cần thiết.

## Failure và resume
Request outcome `pending|succeeded|failed|unknown` độc lập review `pending-review|approved|rejected|needs-cleanup`. HTTP200 chưa reviewed không được promote. Ghi fail riêng, tiếp tục family không phụ thuộc.

429/5xx: tối đa2 transient retry (tổng3attempt),2s/4s+jitter, honor Retry-After dài hơn; giảm slots khi429. Transport chỉ retry khi biết chưa submit. Timeout/sự cố sau submit: có thể provider đã tạo ảnh/tính phí; tra status nếu có, nếu không đánh unknown và không blind retry. Không tự chuyển model/provider/chi phí. Validation/style failure không retry cùng payload; candidate sửa prompt là attempt mới trong scope, giữ rejection evidence.

Resume theo item+attempt ID và hash files: succeeded không gọi lại chỉ vì chưa export; pending xử lý nếu dependency sẵn; unknown đối soát trước; không đổi unknown thành failed chỉ để chạy lại. File tồn tại không chứng minh succeeded/reviewed. Record cả output/candidate bị reject, không xóa evidence tự động.

## Dừng
User cancel: dừng dispatch mới, cancel in-flight nếu API hỗ trợ, ghi kết quả biết được hoặc unknown, flush records; không hứa queue vô hạn/không giám sát, không tự khởi động lại. Nhiều wave hữu hạn được tiếp tục tự động trong scope/quota.

## Gate
Worker tự decode và xem ảnh từng item. Reviewer chốt lý do; `needs-cleanup` giữ staging. Parent promote approved theo provenance. Workers không build/lint/test app giữa chừng; parent chạy checks affected một lần sau tích hợp nếu code/runtime path thay đổi. Docs/prompt-only dùng scenario/link checks, không test game để chứng minh prompt.
