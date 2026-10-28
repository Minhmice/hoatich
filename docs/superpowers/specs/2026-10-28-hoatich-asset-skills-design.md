# Bộ skill tạo asset Hoa Tích — Thiết kế

**Builder-check:** agent độc lập `AssetSkillsBuilderCheck` trả lời `nothing important left`. User sau đó duyệt thiết kế và yêu cầu triển khai; bộ skill đã author/test và cutover, xem `2026-10-28-hoatich-asset-skills-verification.md`.

## Trạng thái và phạm vi đã thống nhất

Người dùng đã duyệt kiến trúc và thiết kế bảy skill riêng Hoa Tích, project-local tại `.agents/skills/`, một director điều phối và reference dùng chung. Implementation hoàn tất theo plan; task này không cấp phép chạy batch ảnh mới.

Mục tiêu: agent tạo prompt đúng từng nhóm asset, sinh từng ảnh qua 9Router, phối hợp nhiều worker không đụng file, kiểm tra chất lượng rồi mới cập nhật runtime. Không phải xây framework sinh ảnh, viết lại renderer hoặc thay đổi luật game.

## Nguồn sự thật

- `PRODUCT.md`: game cozy narrative shopkeeping, khách cõi trần/cõi âm, cắm hoa 2.5D, client-side React/Three.js.
- `DESIGN.md`: không khí hoài niệm, giấy/mực, palette ngày kem–olive và đêm tím xám–lam khói. Token UI không ép màu mọi cánh hoa hoặc áo nhân vật.
- Ảnh vẽ tay trong `asset-source/characters/` là bằng chứng nhận diện và nét vẽ. Các prompt và nhật ký tại `asset-source/generated/` là tài liệu hỗ trợ; không tự coi mọi ảnh AI cũ là mẫu chuẩn.
- Content IDs, asset maps và caller hiện tại quyết định ID/runtime path; skill không tự đặt lại ID hoặc giả định file tồn tại. Dùng tools/source để kiểm tra trước dispatch.
- Quy tắc repo về Graphify, MCP Hoa Tích và UI verification vẫn áp dụng theo phạm vi. Tạo ảnh không chứng minh ảnh được gameplay sử dụng.

## Các cách đóng gói đã cân nhắc

1. **Bảy skill độc lập + reference chung — phương án được duyệt.** Discover theo nhiệm vụ cụ thể; từng worker chỉ đọc phần cần; director sở hữu điều phối.
2. **Một director và bốn playbook bên trong.** Ít entrypoint, nhưng khó discover từng chuyên môn.
3. **Một skill tổng hoặc nhiều skill rời không director.** Dễ trộn luật transparency, lặp prompt/API, mất ownership và giới hạn concurrency.

## Bố cục và trách nhiệm

Mỗi thư mục sau có `SKILL.md`, frontmatter `name` trùng tên thư mục và `description` chỉ mô tả điều kiện kích hoạt, bắt đầu `Use when`. Nội dung hướng dẫn bằng tiếng Việt; prompt gửi model bằng tiếng Anh.

| Skill | Đầu vào / đầu ra và giới hạn |
|---|---|
| `hoatich-asset-director` | Nhận yêu cầu, xác minh scope, inventory và reference; xuất batch brief cùng phân công worker, tổng hợp manifest và kết quả. Không chứa lại toàn bộ hướng dẫn prompt chuyên môn. |
| `hoatich-flower-prompts` | Nhận loài/content ID, reference, danh sách hướng/trạng thái; xuất prompt từng asset và tiêu chí botanical/direction. Phân biệt nghiêng thân, hướng mặt bông và góc nhìn; không thay `down` bằng `center`, không tạo sheet thay từng ảnh, không dùng phép mirror làm giả biến thể AI. |
| `hoatich-character-prompts` | Nhận nhân vật, ảnh gốc và mood; xuất identity/style/expression riêng. Clone từ ảnh gốc; nhân vật mới có neutral master được review trước khi sinh biểu cảm. Không đổi mặt/trang phục theo mô tả generic hoặc nối reference qua từng biểu cảm. |
| `hoatich-element-prompts` | Nhận vai trò element, kích thước tương đối, góc nhìn và vị trí sử dụng; xuất prompt cho bình/lọ/chậu/giấy gói/nơ/dụng cụ/vật trang trí/icon. Phân biệt sprite đồ vật với icon UI; không tự sinh chữ hoặc cả panel UI. Không áp cùng camera/điểm neo cho mọi loại. |
| `hoatich-background-prompts` | Nhận scene/camera/layout/ca ngày–đêm; xuất prompt nền và reference-edit constraints. Background mặc định kín RGB/opaque; giữ cửa/kệ/bàn và khoảng trống cắm hoa khi đổi ánh sáng; không tự thêm người, UI hoặc vật che vùng thao tác. |
| `hoatich-asset-review` | Nhận brief/reference/candidate; xuất quyết định từng ảnh `approved`, `rejected` hoặc `needs-cleanup`, bằng chứng và lỗi cụ thể. Kiểm tra alpha theo loại, crop, khoảng trống, nhận diện/style/hướng; không coi HTTP200 hay file decode thành công là duyệt mỹ thuật. |
| `hoatich-asset-provenance` | Nhận records và quyết định review; xuất payload metadata không secret, manifest/archive/hash, runtime exports và báo cáo promotion. Không tự duyệt lại mỹ thuật hoặc thay customer/flower maps. |

### Reference chung, một owner

Director sở hữu `.agents/skills/hoatich-asset-director/references/`:

- `art-direction.md`: bản đồ các nguồn chuẩn; nét chì nhám, màu lì, hình khối đơn giản; palette và khác biệt sprite/nền; identity authority của player/customer-one/passerby. Tham chiếu tài liệu project thay vì chép nguyên mọi prompt.
- `batch-contract.md`: schema brief/worker, cấp slot concurrency, retry/resume/cancel và tên trạng thái.
- `ninerouter-api.md`: request đã có bằng chứng, discovery model/base URL từ cấu hình hiện có, image-reference payload, xử lý response và giới hạn chưa xác minh.

Provenance sở hữu `.agents/skills/hoatich-asset-provenance/references/manifest-contract.md`: schema item/request/archive/review/export và một ví dụ sanitized. Các skill khác link tương đối đến nguồn chung; không sao chép các chính sách API/style/concurrency.

Không tạo skill thứ tám chỉ để giữ style. Không tạo script mới trừ khi một thao tác cần kiểm tra tự động mà tool hoặc script có sẵn không đáp ứng; quyết định và thử nghiệm đó thuộc implementation plan, không mặc định xây client mới.

## Scope guard và discovery

Các skill chỉ dùng khi working project là Hoa Tích: xác minh `PRODUCT.md` nhận diện Hoa Tích và các đường source tương ứng, không khóa tuyệt đối theo `/Users/...`. Mỗi skill có tên/description chứa Hoa Tích và loại asset để không kích hoạt nhầm repo khác.

Director là điểm vào cho batch hoặc nhóm asset hỗn hợp. Khi chỉ soạn prompt một loại, gọi trực tiếp skill tương ứng; không bắt sinh ảnh, spawn agent hay chạy test app cho yêu cầu prompt-only. Skill-writing/evaluation-only không cấp phép gọi image API.

Metadata và direct file reads được kiểm tra; runtime catalog có thể cần refresh/new session. Không tự sửa cấu hình global, restart service hoặc hứa `skill://` đã discover khi chưa kiểm chứng.

## Reference và art direction cụ thể

- Player: ảnh authored01–03 là authority, không dùng ảnh generic04–07 cũ. Không tạo lại player trong scope chuyển skill.
- Customer-one: nam tóc ngắn charcoal, mắt xanh, sơ mi trắng, áo len navy khoác vai; ảnh authored01–02 là authority. Không áp prompt nữ cũ.
- Passerby: nữ tóc bob uốn, áo hồng, vòng ngọc xanh, tay chống hông; ảnh authored01–02 là authority. Không áp áo bà ba generic.
- Bác Ba/thi sĩ/Chú Tư: các thiết kế AI hiện có là candidate hoặc accepted master tùy trạng thái review đã ghi; việc file đang nằm trong `public/` không tự chứng minh chất lượng được duyệt.
- Hoa: lấy ID/species từ source; màu, petals, leaf/stem và trạng thái khóa theo loài/reference. Hướng và góc nhìn là hai thuộc tính khác nhau; ảnh nhiều góc kết hợp rotation runtime, không thay đổi renderer theo skill.
- Đồ vật: sprite isolated cần transparency; tâm hình, điểm neo và camera phù hợp nơi sử dụng được ghi trong brief trước sinh.
- Nền: ảnh kín, fixed camera, bố cục ngày/đêm nhất quán; không yêu cầu alpha như sprite. Pixel-lock geometry không được hứa chỉ bằng prompt.

## Contract điều phối

Brief có `batchId`, `mode` (`prompt-only`, `generate-staging`, `promote`), loại asset, các item ID/state chính xác, source/reference paths và role (`identity`, `style`, `neutral-master`), style authority, output paths, yêu cầu canvas/alpha/anchor/camera, tiêu chí review và owner.

Một worker sở hữu một loài hoa, một nhân vật hoặc một family đồ vật/scene độc lập. Parent giao thư mục riêng và quota HTTP cụ thể, tổng không vượt bốn request đang chạy; tối đa hai mỗi worker là trần, không phải quyền mặc định. Ví dụ ba worker được cấp2+1+1. Wave sau chỉ nhận slot khi wave trước trả lại. Worker không chỉnh shared manifest, caller hoặc runtime mapping.

Mỗi request sinh một asset; không gộp cả bộ vào sheet. Hoa/NPC khác nhau có thể song song. Nếu chưa có master nhân vật mới, neutral và các expression phụ thuộc nhau phải theo thứ tự; các expression dùng cùng master đã review, không chain.

Giữ phân biệt hai cấp review: agent tự kiểm mỹ thuật/kỹ thuật không đồng nghĩa user phải duyệt từng ảnh. Cho phép tự tiếp tục nhiều wave khi scope và quota đã rõ, nhưng không gọi vòng lặp vô hạn hoặc nói chạy liên tục khi queue thực tế hữu hạn. Khi user dừng: không dispatch thêm, hủy/ghi nhận request đang chạy theo khả năng API, flush trạng thái; không tự lặp lại request timeout vì chưa biết provider đã hoàn thành hay chưa.

## API, lỗi và chi phí ngoài phạm vi

Dùng 9Router hiện đã cấu hình, không hardcode host cá nhân, không ghi secret vào skill/repo/log. Model `cx/gpt-image-2.5` là model đã thử trong dự án, không là bảo đảm model còn khả dụng mãi. Đọc provider docs/discovery hiện tại khi cần; không tự chuyển provider/model nếu đổi contract hoặc chi phí.

Giữ request prompt/style/expression riêng và image dataURL khi route hỗ trợ. Không giả định mask/seed/negative_prompt hay pixel-preserving edit nếu chưa có tài liệu và thử đường thực tế.

429/5xx/transport có tối đa hai transient retry, chờ2s/4s+jitter và honor `Retry-After`; giảm slot khi gặp rate limit. Request timeout là kết quả chưa rõ: tra trạng thái nếu provider có, không tự coi ảnh đã tạo hoặc tự retry tốn phí; ghi pending/unknown khi không truy được. Validation/style fail không retry unchanged. Sửa prompt có thể tạo candidate attempt mới trong scope batch, giữ rejection evidence.

Kích thước request có thể chỉ là hint; đo output. Sai hint không tự reject, sai kích thước bắt buộc của deliverable thì reject. Ảnh JPEG/opaque là hợp lệ cho background nếu brief cho phép, không hợp lệ cho isolated sprite yêu cầu transparency.

## Archive, review và promotion

- Original authored artwork không ghi đè. Clone AI lưu riêng.
- Staging: `asset-source/generated/<batchId>/<family>/<assetId>.*`; archive trước thay file thuộc scope, kèm hash.
- Record gồm asset/state/ref-role/ref-path/ref-hash/model/prompt-hash/attempt/HTTP-status/output-path/hash/size/dimensions/mode/alpha-bounds/review/reason/export. Request outcome (`succeeded`, `failed`, `pending`, `unknown`) tách review decision (`pending-review`, `approved`, `rejected`, `needs-cleanup`).
- Save reference path/hash/encoding thay base64; không log raw authenticated requests. Dùng clock hiện tại và ghi rõ nếu timestamp môi trường bất thường, không suy diễn ngày từ prompt.
- Reviewer mở ảnh thật: đúng subject, style, pose/hướng/state, không cắt bộ phận cần giữ, không chữ/vật thừa, không trắng/đốm màu viền. Decode/alpha không chứng minh sạch viền.
- Chỉ promote ảnh `approved`; `needs-cleanup` không được tự coi là pass. Runtime export dùng convention hiện tại theo loại; max-height1200/WebP90method6 là convention portrait, không áp cứng cho background/hoa/icon.
- Tạo file runtime không đồng nghĩa asset được caller dùng. Đổi mapping/source là task riêng có Graphify/references/MCP/tests theo AGENTS, không tự kèm vào batch tạo ảnh.

## Chuyển từ skill cũ

Skill global hiện tại: `~/.agents/skills/generating-9router-assets/SKILL.md`. Giữ nguyên trong lúc author/test bộ local, không tạo shim hay hai nguồn policy sống lâu dài. Sau khi cả bộ local được kiểm chứng: lưu bản skill cũ trong archive migration của repo, xóa đúng entry global này để hoàn tất rename/cutover; không xóa skill global khác. Chỉ xóa file nếu bytes/hash vẫn là bản migration đã đọc; nếu có chỉnh sửa ngoài phiên thì dừng cutover và xử lý thay đổi đó.

Reference local dùng link tương đối để không phụ thuộc runtime nhận `skill://` mới trong cùng phiên. Kiểm tra cả link resolution lẫn discovery metadata; nếu catalog chưa refresh thì báo chính xác giới hạn, không cài global thêm để lách.

## Kiểm chứng và acceptance

Thực hiện author/test từng skill theo writing-skills; không viết cả bảy rồi mới thử. Chạy baseline scenario trước khi author, guided scenario sau; baseline chỉ chứng minh lỗi quan sát được, không bịa tỷ lệ pass. Giữ scenario kết quả và giới hạn trong tài liệu kiểm chứng của bộ skill.

Các tình huống bắt buộc: identity/style không trộn; species/state không tự thay; original immutable; master mới phải được review; background opaque được chấp nhận còn sprite alpha255 bị reject; slot tổng không vượt4; timeout unknown không tạo request lặp mù; malformed response; cancel/resume/collision; no-paid-API trong prompt/skill-only; no auto app edits.

Acceptance cuối: đúng bảy SKILL.md tại repo, frontmatter/discovery/link hợp lệ, không policy copy lệch, reference chung đủ source anchors, baseline/guided evidence cho từng skill, không đổi asset/runtime/app ngoài yêu cầu, skill cũ cutover có archive, báo riêng file đọc được và catalog thực tế discover được.

## Ngoài phạm vi và quyền builder

Không sinh batch ảnh mới, sửa sạch alpha hàng loạt, thay gameplay mapping, cài package, thêm backend, thêm model training/ComfyUI, đổi art direction hoặc refactor generator trong task tạo bộ skill. Không commit/push nếu user chưa yêu cầu.

Builder được quyết định diễn đạt ngắn gọn, ví dụ prompt từng category, số case đủ để pin lỗi thực tế, cấu trúc tài liệu evidence và cách kiểm link/frontmatter bằng công cụ hiện có. Không được đổi tên bảy skill, ownership, alpha theo category hoặc cửa promotion đã chốt ở trên.
