# Hoa Tích — MCP tri thức và tính toán

## 1. Trạng thái và quyết định

- Ngày: 2026-10-25.
- Trạng thái: người dùng đã duyệt triển khai; builder check độc lập không còn câu hỏi quan trọng.
- Người dùng chọn hướng 2: tri thức có cấu trúc, lần quan hệ, tính toán bằng luật game hiện có; bổ sung tìm kiếm văn bản cho tài liệu.
- Quy mô: một phần tích hợp nhiều mảng, không phải thay đổi nhỏ.
- Các mặc định ghi “đề xuất” là quyết định của người thiết kế, được giữ làm baseline sau khi người dùng yêu cầu triển khai.

## 2. Ý định

Agent mới vào dự án phải tự khám phá các miền tri thức, tìm dữ kiện có nguồn, lần quan hệ và kiểm chứng phép tính mà không cần nạp toàn bộ repo vào context hoặc yêu cầu tác giả giải thích lại.

“Biết hết” được chuyển thành hợp đồng kiểm chứng được: có mục lục, bao phủ nguồn đã khai báo, truy vấn có phân trang, dẫn chứng và giới hạn rõ. Không hứa hiểu mọi ý định tác giả, mọi file chưa được index hoặc nội dung chưa tồn tại.

MCP phục vụ phát triển game, có quyền đọc toàn bộ nội dung đã khai báo, kể cả nhánh truyện chưa mở khóa. Đây không phải chế độ trợ giúp người chơi tránh spoiler.

## 3. Hiện trạng đã xác minh

- `package.json`: TypeScript 5.7.2, Phaser 3.90.0, Vite 6.3.1; game chỉ chạy phía trình duyệt.
- `src/main.ts:bootstrap` gọi `src/game/createGame.ts:createGame`, nạp BootScene và ShopScene.
- `src/game/content/index.ts:contentBundle`: hoa, khách, đơn, thoại, flags, journal, asset keys. Validator đã chạy thành công: 10 hoa, 4 khách, 4 đơn, 37 node thoại.
- `src/game/content/types.ts`: ID và quan hệ tường minh, requirements, conditions, effects.
- `src/game/content/flowerAssets.ts:flowerAssets` và `characterAssets.ts:characterAssets`: ánh xạ URL/texture, biến thể chân dung và nguồn gốc.
- `src/game/bouquet/evaluateBouquet.ts:evaluateBouquet`: luật taboo, requirement, resonance, effects; không kiểm tra kho hoặc unlock. `preferences` hiện chưa ảnh hưởng kết quả trong hàm này.
- `src/game/GameSession.ts:GameSession`: tiến trình, choices hợp lệ, trao hoa, chuyển buổi; `deliver` kiểm tra kho nhưng không tự chặn mọi thao tác sai thời điểm mà UI chặn.
- `src/game/state/stateReducer.ts`: cập nhật trạng thái và effects; không thay thế bộ điều phối phiên chơi.
- `src/game/save/migrations.ts`: xác thực/migrate save. Browser save nằm trong localStorage; MCP Node không tự có quyền đọc localStorage.
- `GameSession` chỉ shallow-copy initialState; mô phỏng phải deep-clone trước khi tạo session.
- `ShopScene.updateSceneState` tự bắt đầu đơn tiếp theo; gọi riêng GameSession không tái tạo đầy đủ đường UI.
- Không tìm thấy bridge MCP/WebSocket/postMessage/fetch trong src và cấu hình dự án đã khảo sát.
- Tài liệu thiết kế cũ vẫn ghi repo trống. Vì vậy tài liệu thiết kế không được coi là bằng chứng runtime.
- Smoke đã thực hiện: khởi động Vite bằng Node 24 có sẵn trên origin riêng, chọn mở đầu, quan sát Bác Ba/đơn đầu, xác minh save và reload; không sửa source/tests. `npm run dev` qua Node Homebrew ban đầu lỗi thiếu dylib; không sửa môi trường hệ thống.

## 4. Mục tiêu, ngoài phạm vi, điều phải tránh

### Mục tiêu

1. Tự khám phá miền dữ liệu, ID, nguồn, công cụ và cách dùng.
2. Tra cứu chính xác entity và tìm kiếm tên/nội dung tiếng Việt.
3. Lần quan hệ hai chiều giữa nội dung, quy tắc và asset.
4. Tính kết quả bó hoa và tính khả thi theo snapshot kho/unlock cụ thể.
5. Mô phỏng chuỗi hành động hữu hạn trên bản sao trạng thái, giải thích hệ quả quan sát được.
6. Tìm nơi phụ thuộc vào entity/flag để phân tích phạm vi ảnh hưởng.
7. Trả nguồn, độ mới và phân biệt dữ kiện, tính toán, quan hệ cấu trúc, suy luận.

### Ngoài phạm vi

- Điều khiển tab game thật, sửa save thật, đồng bộ live state.
- Sửa code/nội dung/metadata; rename, delete, publish hoặc upload asset.
- Tự giải mọi đường đi, tìm bó hoa tối ưu toàn cục, chứng minh mọi ending đạt được.
- Tự hiểu toàn bộ symbol/call graph TypeScript hay thay thế LSP.
- Vector DB, embeddings, cloud backend, tài khoản hoặc multi-user HTTP.
- Tạo skill riêng; MCP phải dùng được với client hỗ trợ tools mà không cần skill độc quyền.

### Điều phải tránh

- Viết bộ luật chấm điểm thứ hai trong MCP.
- Coi spec là tính năng đã triển khai; coi reference là bằng chứng nhánh chắc chắn chạy.
- Trả kết quả thiếu nhưng gọi là đầy đủ, hoặc coi không có kết quả tìm kiếm là chứng minh không tồn tại.
- Cài MCP vào browser bundle hoặc khiến game cần server mới chơi được.

## 5. Các phương án đã cân nhắc

| Phương án | Điểm mạnh | Đánh đổi |
| --- | --- | --- |
| Chỉ mục repo | Ít code, tìm văn bản và nguồn nhanh | Agent tự nối quan hệ và tự tính, dễ sai |
| Tri thức có cấu trúc + tính toán | ID rõ, reference kiểm chứng được, dùng đúng luật hiện có | Cần adapter và kiểm tra tính đầy đủ của quan hệ |
| Tìm kiếm ngữ nghĩa làm trung tâm | Tốt với diễn đạt tự do và lore dài | Index/độ mới phức tạp; gần nghĩa không bảo đảm đúng luật |

Người dùng chọn phương án thứ hai. Đề xuất dùng tìm kiếm văn bản chuẩn hóa cho tài liệu; không thêm vector DB lúc này.

## 6. Kiến trúc và cách chạy

- Đề xuất MCP server TypeScript chạy tiến trình Node riêng qua stdio. MCP client khởi động/dừng tiến trình; không cần port, daemon hoặc browser bridge.
- Dùng SDK chính thức `@modelcontextprotocol/server` dòng stable v2, Node >=20; xác minh release/API khi lập kế hoạch. Schema dùng thư viện tương thích Standard Schema được SDK hỗ trợ; ưu tiên lựa chọn nhỏ, không tự viết protocol/schema validator.
- Đề xuất đặt code server trong `tools/mcp/`, ngoài import graph của `src/main.ts`. Dùng TypeScript/tsx hiện có và thêm lệnh chạy riêng trong package.json.
- Import trực tiếp content và các hàm domain hiện có, không import Phaser/scene/DOM. Không tạo bản sao JSON thủ công của contentBundle.
- Chỉ mục trong bộ nhớ: entity map, adjacency list hai chiều, đoạn tài liệu. Không database, không persistent cache.
- Tool trả dữ liệu có cấu trúc và text JSON tương đương để client chỉ đọc text vẫn sử dụng được. Không tạo câu trả lời tự do bằng một LLM khác bên trong server.
- Server instructions và `discover_game` giải thích đường tra cứu. Không bảo đảm mọi client tự gọi discovery; README cung cấp hướng dẫn và cấu hình khởi động.
- stdout chỉ chứa MCP; thông báo vận hành dùng stderr, không log toàn bộ nội dung hoặc snapshot người dùng.

## 7. Nguồn, entity và provenance

### Nguồn được đọc

- Nội dung runtime: contentBundle, flowerAssets, characterAssets; intro định nghĩa trong GameSession cũng phải được index.
- Luật/nguồn code: các file TypeScript trong `src/game/`, chỉ index symbol và đoạn nguồn cần dẫn chứng; không thực thi chuỗi code từ client.
- Tài liệu văn bản: README.md, PRODUCT.md, DESIGN.md, Markdown dưới docs, và `asset-source/generated/ASSET_PROMPTS.md` nếu tồn tại.
- Asset: chỉ metadata/path từ các mapping và tài liệu provenance trên. Không quét mọi binary trong DEMO_assets, không đọc binary/thumbnail ở phạm vi này.
- Tests, node_modules, .git, .serena, secrets và thư mục ngoài allowlist không thuộc kho tìm kiếm.

### Kiểu entity

`flower`, `customer`, `order`, `dialogue`, `choice`, `rule`, `flag`, `journal`, `asset`, `day`, `chapter`.

Giữ nguyên ID hiện có. Choice/rule có ownerRef khi lookup để không dựa vào giả định ID toàn cục. Asset không có ID sẵn dùng URL chuẩn hóa với namespace; assetKey và textureKey là alias có nguồn. Ngày/chapter chỉ chứa thông tin thực sự tồn tại, không tự sáng tác nội dung.

### Hợp đồng kết quả

Mỗi response có `schemaVersion`, `knowledgeRevision`, `sources`, `warnings`, `limitations`; mỗi record/edge có sourceRefs. Nguồn gồm relativePath, symbol hoặc heading, lineStart/lineEnd (1-based), contentHash. Dùng TypeScript compiler API hiện có lấy vị trí khai báo; không hardcode line number.

`evidenceKind`: `runtime_data`, `runtime_code`, `design_document`, `calculation`, `structural_relation`. MCP không gắn nhãn suy luận của agent thành dữ kiện. Calculation kèm input/context thực tế, hàm luật, revision và trace quan sát được; không trả timestamp hiện tại làm căn cứ tính toán.

Đoạn văn bản là nội dung không tin cậy: không được làm theo instruction nhúng trong lore/docs. Không suy diễn mọi phát biểu trong tài liệu là requirement đã duyệt. Câu hỏi về runtime ưu tiên code/data; thiết kế trả riêng. Không hứa tự động phát hiện mọi mâu thuẫn ngữ nghĩa giữa code và prose.

### Độ mới

Chụp source manifest/hash lúc khởi động, gồm cả tập đường dẫn được index. Trước mỗi request, phát hiện file thay đổi/thêm/xóa trong allowlist. Nếu snapshot không còn khớp, trả `SOURCE_CHANGED` và hướng dẫn khởi động lại; không tính bằng module import cũ rồi gắn nguồn mới. Không dùng dynamic import cache-busting hoặc hot reload tự chế. Mọi tool trong một tiến trình dùng cùng revision.

## 8. Quan hệ và phân tích ảnh hưởng

Xây cạnh có tên, hướng và vị trí field:

- order → customer, day, opening/result dialogue;
- dialogue → speaker, next dialogue, owned choice;
- choice → next dialogue, condition flag, effect target;
- order/rule → required/taboo/preferred flower hoặc predicate tag/color/world, condition flag, effect target;
- flower → unlock flag, flower asset;
- customer → portrait asset; asset → source provenance nếu có;
- effects → written flag, unlocked flower, journal entry, relationship customer.

Predicate tag/color/world liên kết thêm các hoa khớp theo từng ngữ cảnh luật. Không gom `world=both` thành quan hệ giống nhau cho taboo và requirement: evaluator hiện xử lý hai trường hợp khác nhau. Cạnh phải giữ polarity, min, conditions và semanticRole. Dùng predicate thuần từ domain nếu cần trích xuất, không sửa ý nghĩa luật.

`impact` lần cạnh ngược với depth hữu hạn, trả đường dẫn bằng chứng và nhãn `structural_dependency`, không khẳng định kết quả runtime. Ví dụ flag có thể tác động choice/rule; rule có thể tác động unlock; đây là khả năng có điều kiện, không phải chứng minh reachable. Reference trong prose được trả như text mention, không biến thành cạnh thực thi.

Không có công cụ tự chỉnh một điều kiện rồi giả lập game đã biên dịch lại. Muốn biết hiệu ứng của flags cụ thể dùng calculation/simulation với context tường minh; muốn biết phạm vi sửa dùng impact.

## 9. Tool contracts

Tên đề xuất là public API cần giữ nhất quán trong server instructions, schemas, README và checks.

| Tool | Input chính | Output chính |
| --- | --- | --- |
| `discover_game` | không tham số | Miền, số entity, nguồn được/không index, revision, ID conventions, giới hạn và ví dụ đường tra cứu |
| `search_knowledge` | query, kinds?, sourceKinds?, cursor?, limit? | Entity matches và đoạn tài liệu, match field, nguồn, nextCursor |
| `get_entity` | kind, id, ownerRef? | Record đầy đủ, alias, nguồn; ID mơ hồ trả candidates, không đoán |
| `get_relations` | entityRef, direction, relationTypes?, cursor?, limit? | Cạnh trực tiếp, field, predicate/condition và nguồn |
| `analyze_impact` | entityRef, depth?, cursor?, limit? | Các dependency paths có điều kiện, giới hạn traversal |
| `evaluate_bouquet` | orderId, flowers: [{flowerId, quantity}], context: {flags, inventory?, unlockedFlowerIds?} | Kết quả evaluator, reasonIds, matchedRuleIds, effects, resultDialogueId, feasibility và nguồn luật |
| `simulate_scenario` | initialState: GameState hoặc initial preset, actions | Trace, finalState, stateDiff, lỗi tại bước nào, nhãn isolated simulation |

### Search và pagination

- Query trim, Unicode NFC, lowercase; thêm khóa không dấu để tìm tiếng Việt. Không thay đổi ID gốc.
- Ưu tiên ID chính xác, tên chính xác, rồi text matches; thứ tự tie-break ổn định theo entityRef/path/line. Không gọi là semantic search.
- Query rỗng dùng để liệt kê theo filter; discovery chỉ trả danh mục/tổng hợp, không dump mọi record.
- limit mặc định 20, tối đa 50; cursor gắn revision/query/filter, cursor sai trả lỗi. Traversal depth mặc định 1, tối đa 4; có cycle detection, tối đa 500 cạnh duyệt/request.
- Response tối đa 64 KiB UTF-8. Khi còn kết quả trả nextCursor/truncated và lý do. Entity/trace vượt giới hạn trả lỗi có hướng thu hẹp, không lặng lẽ mất field. Tài liệu trả excerpt, không toàn bộ file dài.

### Evaluate bouquet

- orderId/flowerId phải tồn tại; quantity là số nguyên dương, cộng gộp duplicate, tối đa 100 cành. Unknown flag hoặc giá trị không hữu hạn bị từ chối.
- flags bắt buộc, `{}` nghĩa là context không có flag nào; không tự giả định đã mở khóa bí mật.
- Chuyển input sang BouquetItem hợp lệ và gọi evaluateBouquet hiện có. Layout không ảnh hưởng chấm điểm hiện tại; không tạo điểm đẹp giả.
- `outcome` là kết quả luật. `feasibility.inventory` và `feasibility.unlocks` độc lập, trạng thái `not_checked` nếu không cung cấp. Không đổi outcome thành missed chỉ vì thiếu kho; không gọi evaluator là bằng chứng đã trao hoa được.
- Thuyết minh reason bằng rule/requirement nguồn; không tự bịa tác dụng của preferences chưa dùng.

### Simulate scenario

- Mặc định chọn tường minh preset `initial` hoặc gửi full GameState; không dùng save của browser, không ghi file, không giữ session dùng chung giữa requests.
- Validate bằng contract save hiện hữu và boundary bổ sung cho action; deep-clone state trước constructor. Cảnh báo nếu constructor áp dụng entry effect chưa đánh dấu; trace chứa cả bước chuẩn bị này.
- Actions hữu hạn: `advance_dialogue` (choiceId nếu cần), `deliver` (flowers), `retry_missed`, `advance_shift`. Tối đa 50 actions, tối đa 100 cành mỗi delivery, payload tối đa 128 KiB; không loop tự chọn, không action eval/shell/reset/save.
- Dùng GameSession không SaveRepository. Chặn deliver khi không canCompose, hoa chưa unlock/thiếu kho; chặn choice sai node; retry chỉ sau missed; shift chỉ khi ca xong và không còn dialogue. Không expose dispatch hay startOrder(id) tùy ý.
- Sau bước chuẩn bị và mỗi action, nếu chưa complete, không có order và không có dialogue: dùng startOrder() chọn đơn kế như ShopScene.updateSceneState. Nếu ca hết đơn thì dừng ở trạng thái chờ chuyển buổi. Không swallow lỗi ngoài tình huống đã biết không còn đơn.
- Trace ghi action, dialogue/choices trước-sau, delivery result và diff thực tế; các lựa chọn trả bằng getter hiện có. Không tự chuyển tiếp typewriter/animation, không mô phỏng layout, audio hay modal UI.
- Action lỗi: dừng ở lỗi đầu, trả failedActionIndex, stable error code, trace và trạng thái sau các bước thành công; không trả partial run là thành công. Không thực hiện action kế tiếp.
- Simulation chứng minh hành vi của domain trong context cụ thể, không chứng minh snapshot đó có thể đạt được từ đầu và không chứng minh browser UI render đúng.

## 10. An toàn và lỗi

- Read-only đối với repo/save; calculation chỉ trên bản sao trong bộ nhớ.
- Không nhận arbitrary path, command, code hoặc URL từ client. Root cấu hình khi khởi động, không đổi bằng tool.
- Chỉ đọc UTF-8 regular files trong allowlist, kiểm tra realpath nằm trong root và allowlist; từ chối symlink escape. Không xuất absolute path riêng tư hoặc đọc ảnh gốc.
- Kiểm tra schema ở boundary: enum, số hữu hạn, độ dài query <=500 ký tự, ID <=256 ký tự, số lượng actions và response bounds.
- Lỗi có code: INVALID_INPUT, NOT_FOUND, AMBIGUOUS_ID, INVALID_CURSOR, SOURCE_CHANGED, INVALID_STATE, ACTION_NOT_ALLOWED, LIMIT_EXCEEDED, CONTENT_INVALID, SOURCE_UNAVAILABLE, INTERNAL_ERROR. Không trả stack trace/secret ra client.
- Content bắt buộc không hợp lệ: fail startup rõ ràng; nguồn docs/asset provenance tùy chọn bị thiếu: discovery liệt kê unavailable, không tạo dữ liệu giả. Lỗi quyền đọc nguồn đã khai báo phải báo rõ, không coi là search rỗng.
- Một stdio process dùng một snapshot; tính toán đồng bộ hữu hạn, không state dùng chung giữa callers. Không thêm retry tự động, HTTP auth hoặc telemetry ngoài phạm vi.

## 11. Tiêu chí chấp nhận

1. MCP client thật kết nối stdio, list_tools và gọi discovery thành công mà không chạy game.
2. Agent theo discovery tìm được một hoa bằng tên không dấu, get_entity, rồi lần đến đơn/rule/asset có nguồn.
3. Bao phủ tất cả entity và edge contracts hiện hữu, kể cả intro, conditional choices, flag reads/writes, journal và portrait variants; dữ liệu mới theo schema tự xuất hiện sau restart, không sửa catalog thủ công.
4. Tính cả missed/accepted/resonant bằng evaluator thật; chứng minh inventory/unlock không có context trả not_checked; preferences không bị diễn giải thành luật đang chạy.
5. Simulation chạy intro, dialogue có điều kiện, giao hoa, kết quả, chuyển ca/ngày; chặn sai phase và không đổi input/save/repo; request lặp độc lập cho cùng kết quả domain.
6. Impact flag trả cả read/write paths và conditions; không nhãn chắc chắn reachable. Cycle/depth/response limits hoạt động và pagination không thiếu/trùng record trong cùng snapshot.
7. Nguồn spec và runtime phân biệt; unknown ID/ambiguous ID/source thiếu trả lỗi rõ. Source thay đổi làm tool từ chối stale calculation cho tới restart.
8. Game vẫn build và hoạt động không có MCP; không có Node/SDK trong browser import graph.

## 12. Kiểm chứng và phạm vi sửa

- Thiết kế này chỉ tạo Markdown; không đổi signatures/patterns/checks trong code/tests. Không có callsite cần migrate và không cần chạy test để chứng minh một thay đổi runtime chưa xảy ra.
- Khi triển khai: chạy nguyên các file tests domain bị chạm, không chỉ test mới; nếu trích predicate chạy toàn bộ `tests/bouquet/evaluateBouquet.test.ts`, content suite và integration module. Không sửa expected để pin lại hành vi tình cờ.
- Giữ regression tests cho lỗi consumer-visible: sai provenance/revision, conditional edges, boundary inventory/unlock, session isolation, action gating, pagination và path escape. Dùng Vitest hiện có; không thêm framework.
- Smoke qua MCP client thật: discovery, search/get/relations, một calculation và scenario; kiểm tra output cụ thể, không chỉ tools tồn tại. Chạy content validator và build; nếu chạm UI/domain integration, mở game kiểm chứng đường bị ảnh hưởng.
- Cập nhật README với cách chạy/cấu hình client, tool workflow, phạm vi, spoiler và hạn chế. Không thay tài liệu game cũ để giả như thiết kế đã được triển khai.
- Review consistency bằng LSP references khi đổi exported symbol và grep mọi tên tool/public contract trong code/docs/tests; kiểm tra diff chỉ có phần cần thiết. Chưa có implementation diff trong giai đoạn thiết kế.

## 13. Để người triển khai quyết định

- Phân chia module nội bộ và biểu diễn adjacency list; không dựng framework/plugin registry.
- Schema library chính xác theo SDK được xác minh lúc triển khai; pin dependency và lockfile.
- Vị trí tests mới và helper theo convention hiện có.
- Chi tiết ranking excerpt và cursor encoding, miễn đáp ứng ổn định, bounds và revision.
- Cách trích xuất symbol/field source spans bằng TypeScript compiler API, không line numbers viết tay.

Không để người triển khai tự đổi transport, mở write/live browser bridge, bỏ simulation/impact hoặc thay luật domain. Nếu xuất hiện blocker làm thay đổi hành vi đã thiết kế, quay lại xin quyết định thay vì âm thầm thu hẹp.

## 14. Tài liệu kỹ thuật đã đối chiếu

- MCP TypeScript SDK v2: https://github.com/modelcontextprotocol/typescript-sdk
- MCP transport specification: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports
- Nghiên cứu asset trước đó: `docs/research/2026-10-12-mcp-skill-asset-library-research.md`.
