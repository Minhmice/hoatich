# Tiệm Hoa Tích (Hoa Tích)

Bản chơi thử tường thuật (narrative vertical slice demo) chạy trực tiếp trên trình duyệt web. Trò chơi kết hợp giữa cơ chế visual novel phân nhánh và bàn cắm hoa tương tác, đưa người chơi vào vai người quản lý tiệm hoa chuyển tiếp giữa hai bờ sinh tử.

## Phạm vi dự án (Project Scope)

- **Hình thức**: Bản narrative demo hoàn chỉnh thử nghiệm cơ chế trên trình duyệt web, không phải bản phát hành thương mại trên Steam.
- **Cấu trúc nội dung**: 6 ngày làm việc hoàn chỉnh, 24 đơn hàng hoạt động với 48 biến thể phân nhánh, 288 nút đối thoại, hệ thống lưu trữ schema 2.
- **Nhịp độ**: Trải nghiệm chậm rãi, suy ngẫm, hoàn toàn không có đồng hồ đếm ngược (no timer / countdown).
- **Chu trình ca làm việc**: Đan xen giữa buổi sáng đón tiếp khách cõi trần (living) và buổi tối đón tiếp linh hồn cõi âm (spirits / deceased).
- **Không yêu cầu dịch vụ mạng**: Chạy hoàn toàn phía máy khách (client-side), không cần API key, tài khoản hoặc máy chủ backend.

## Công nghệ & Thư viện cốt lõi (Tech Stack)

- **Nền tảng ứng dụng:** Next.js 16 (App Router, static export `output: 'export'`) + React 19 + TypeScript.
- **Đồ họa 3D / 2.5D Diorama:**
  - `three` (0.186): WebGL render engine cho quầy cắm hoa, diorama ánh sáng/bóng đổ và nhân vật billboard.
  - `@react-three/fiber` (v9) & `@react-three/drei` (v10): Tích hợp Three.js theo mô hình React Declarative Component, đồng bộ vòng đời với React 19.
- **Âm thanh:** `howler` + `@types/howler`: Quản lý audio web chuyên dụng, tự động mở khóa autoplay trên mobile web, audio sprite và cross-fade nhạc nền hai cõi Ngày / Đêm.
- **Định hướng mở rộng kịch bản:** Hỗ trợ kịch bản phân nhánh theo chuẩn narrative DSL (Yarn Spinner / Ink) khi mở rộng cốt truyện.
- **Kiểm thử & Chất lượng:** Vitest 3, Zod validation cho dữ liệu hoa & đơn hàng, Model Context Protocol (MCP) server nội bộ.
---

## Cài đặt & Khởi chạy

Yêu cầu môi trường Node.js (khuyến nghị phiên bản LTS).

```bash
# Cài đặt các gói phụ thuộc
npm install

# Khởi chạy máy chủ phát triển Next.js (port 5173 giữ nguyên origin localStorage)
npm run dev

# Chạy bộ kiểm thử tự động (Vitest độc lập)
npm test

# Kiểm tra tính toàn vẹn của dữ liệu nội dung (hoa, khách hàng, đơn hàng, lời thoại)
npm run validate:content

# Kiểm tra kiểu dữ liệu TypeScript, xác thực nội dung và xuất bản tĩnh (Next.js static export -> out/)
npm run build

# Khởi chạy MCP Server (Model Context Protocol qua stdio)
npm run mcp

# Chạy kiểm chứng smoke test tích hợp MCP client - server
npm run mcp:smoke
```
> **Địa chỉ truy cập**: Sử dụng đường dẫn URL `http://127.0.0.1:5173/` khi chạy lệnh `npm run dev` để giữ trọn vẹn dữ liệu `localStorage` từ các phiên trước.

---

## Điều khiển & Thao tác (Input Controls)

Trò chơi hỗ trợ song song chuột và bàn phím:

### 1. Phân cảnh hội thoại (Dialogue)
- **Chuột**: Nhấp vào bảng thoại hoặc nhấn nút `Tiếp tục` để chuyển câu.
- **Bàn phím**:
  - `Space` hoặc `Enter`: Hiện đầy đủ câu thoại ngay lập tức nếu đang hiển thị từng ký tự, hoặc chuyển tiếp sang câu tiếp theo.
  - Phím số `1`, `2`, `3`...: Chọn trực tiếp phương án đối thoại tương ứng.
  - Mũi tên `Up`, `Down`, `Left`, `Right`: Di chuyển tiêu điểm giữa các lựa chọn.

### 2. Bàn cắm hoa (Bouquet Workstation)
- **Khởi tạo bố cục**: Chọn dáng vật chứa (bó hoa, bình gốm, lọ thủy tinh) và số lượng cành (hỗ trợ từ 1 đến 24 cành, gợi ý theo đơn: 3–5, 6–9, 12–15). Cấu hình khóa cố định trong suốt lượt cắm; đổi bình yêu cầu xác nhận.
- **Thêm hoa vào vị trí**: Bấm chọn cành hoa trong "Danh mục hoa có sẵn"; hoa sẽ tự động điền vào vị trí trống (slot) đầu tiên theo thứ tự quét từ trên xuống dưới, từ trái sang phải.
- **Chọn cành hoa trên bàn**: Nhấp chuột trái trực tiếp vào cành hoa trên bàn cắm; hoặc chọn từ danh sách thả xuống "Chọn cành hoa"; dùng nút "Cành trước" / "Cành tiếp"; hoặc phím `N` (kế), `P` (trước), `Tab`.
- **Xoay cành**: Phím `Q` hoặc `<` (xoay trái 15°), phím `E` hoặc `>` (xoay phải 15°); hoặc nút bấm `↺ Xoay trái`, `↻ Xoay phải` trong biên độ tự nhiên (±25° so với góc gốc của slot).
- **Nhấc cành ra (Thay hoa)**: Để đổi hoa, người chơi nhấc cành cũ ra bằng phím `Delete` / `Backspace` hoặc nút `Nhấc cành ra`, sau đó bấm chọn loài hoa mới để điền vào vị trí vừa giải phóng. Không dùng cơ chế kéo thả tự do hay chỉnh lớp thủ công (vị trí và độ sâu lớp được slot xác định tự động).
- **Hoàn tác & Làm sạch**: Phím `Ctrl+Z`, `Cmd+Z`, hoặc `U` (hoặc nút `Hoàn tác`) để lùi từng thao tác; nút `Nhấc hết hoa` để dọn sạch hoa mà vẫn giữ cấu hình bình; nút `Đổi bình khác` để thiết lập lại từ đầu.
- **Hoàn thiện sản phẩm (Gói & Nơ & Thiệp)**: Chuyển sang thẻ "Gói & Nơ" khi đã cắm đủ số cành:
  - *Giấy gói* (mở từ Ngày 2): Không gói, Giấy kraft, Giấy kem (2 loại giấy).
  - *Ruy-băng & Thắt nơ* (mở từ Ngày 3): Không nơ, Xanh sage, Hồng rose (2 màu nơ). Thao tác thắt nơ gồm 3 bước bấm tuần tự có hoạt họa (`Nút thắt` -> `Cánh nơ` -> `Vuốt đuôi`).
  - *Thiệp chúc* (mở từ Ngày 4): 4 mẫu thiệp chúc cảm xúc (`Kính trọng`, `Ấm áp`, `Tưởng nhớ`, `An ủi`).
- **Trao hoa hoàn thiện**: Nhấn nút `💐 Trao hoa` khi đã lấp đầy toàn bộ slot và thắt nơ hoàn tất (nếu có chọn ruy-băng).

### 3. Thanh công cụ & Bảng trợ giúp
- **Sổ hoa (`JournalPanel`)**: Tra cứu ý nghĩa hoa, mùa nở, nguồn gốc cõi trần / âm / lưỡng giới và nhật ký khách hàng.
- **Cài đặt (`AccessibilitySettings`)**: Điều chỉnh tốc độ chữ, phông chữ dễ đọc, độ tương phản cao, giảm chuyển động hoạt họa (tự động bỏ animation thắt nơ) và âm lượng.
- **Giấy ghi chú đơn hàng (`OrderNote`)**: Hiển thị các dữ kiện thu nhận từ lời khách tại quầy (kèm dữ kiện chi tiết nếu người chơi đã hỏi câu hỏi tùy chọn). Không hiển thị checklist đáp án hay phán xét đúng/sai.
- **Chuyển buổi / Kết ngày**: Chuyển ca làm việc (`advanceShift`) khi hoàn thành toàn bộ khách trong ca.

### 4. Quy luật mở khóa & Cân bằng (Progression & Balance)
*(Lưu ý: Các giá trị số dưới đây là lựa chọn cân bằng triển khai - implementation choices, có thể tùy chỉnh)*
- **Mở khóa hoa theo ngày**: Mỗi ngày mở thêm đúng một loài hoa mới:
  - Ngày 1: Cúc trắng (`hoa-cuc-trang`)
  - Ngày 2: Hồng đỏ (`hoa-hong-do`)
  - Ngày 3: Hướng dương (`hoa-huong-duong`)
  - Ngày 4: Sen hồng (`hoa-sen-hong`)
  - Ngày 5: Thủy tiên (`hoa-thuy-tien`)
  - Ngày 6: Lưu ly (`hoa-luu-ly`)
- **Bổ sung kho hoa**: Khi chuyển ca, toàn bộ hoa đã mở khóa có tồn kho dưới 12 cành sẽ được tự động bù về mức an toàn tối thiểu (12 cành) để chống kẹt tiến trình (softlock). Hoa mới mở được cấp 30 cành.
- **Mức độ gắn kết khách hàng (NPC Affinity)**:
  - Điểm khởi điểm: 50 điểm (thang 0–100).
  - Biến động theo kết quả trao hoa: Đồng điệu (`resonant`) +15 điểm, Tiếp nhận (`accepted`) +8 điểm, Lệch ý (`missed`) -12 điểm.
  - Phân nhánh quan hệ: Sau tối thiểu 3 lần phục vụ cho cùng một NPC, nếu điểm >= 70 sẽ xếp hàng nhánh Thuận hòa (`good`), nếu điểm <= 30 sẽ xếp hàng nhánh Xa cách (`strained`).
  - Kích hoạt phân nhánh trễ: Nhánh xếp hàng chỉ chính thức kích hoạt khi bước sang ngày tiếp theo (Next Day Gate), mở ra các đơn hàng và đối thoại độc quyền ở Ngày 4, 5, 6.

## Hệ thống lưu trữ & Xử lý lỗi (Save System)

- **Lược đồ dữ liệu Schema Version 2**:
  - Hệ thống tự động di chuyển dữ liệu tương thích ngược từ bản lưu cũ (Schema 0 và 1) lên Schema 2 thông qua `migrateSave`.
  - Lưu trữ đầy đủ: ngày/ca hiện tại, tiến trình NPC (`npcProgress`: điểm gắn kết, số lần phục vụ, nhánh hoạt động, nhánh đang chờ), cờ sự kiện (`flags`), kho hoa, đơn hàng đã hoàn tất và cài đặt trợ năng.
- **Thông báo cắm hoa dở dang (Unsaved Bouquet Notice)**:
  - Trạng thái cắm hoa đang thao tác là session-only (nằm trong bộ nhớ phiên làm việc, không lưu vào `localStorage` cho đến khi trao hoa thành công).
  - Khi có cành hoa trong bình, giao diện hiển thị thông báo trạng thái rõ ràng: *"Đã lưu câu chuyện; bó đang cắm chưa được lưu"*.
  - Khi bấm đổi bình hoa hoặc làm lại, hệ thống hiển thị hộp thoại xác nhận để tránh mất bố cục ngoài ý muốn.
- **Vị trí lưu trữ & Dự phòng**:
  - Khóa chính: `hoatich.save.v1` (chứa dữ liệu Schema 2), bản sao lưu tự động tại `hoatich.save.backup`.
- **Cơ chế khôi phục khi bản lưu lỗi (Invalid Save Recovery)**:
  - Khi bản lưu chính hỏng cấu trúc, tự động khôi phục từ bản sao lưu dự phòng.
  - Nếu cả hai đều lỗi, hiển thị màn hình phục hồi với hai lựa chọn: *Chơi ván mới (Xóa lưu lỗi)* hoặc *Giữ nguyên bản lưu lỗi*.
- **Cảnh báo dữ liệu trình duyệt**: Dữ liệu gắn liền với URL origin. Xóa dữ liệu web trình duyệt sẽ làm mới toàn bộ tiến trình.
---

## Cấu trúc thư mục mã nguồn (Project Architecture)

- `src/game/content/`: Dữ liệu tĩnh của trò chơi gồm danh mục hoa (`flowers.ts`), khách hàng (`customers.ts`), đơn hàng (`orders.ts`), nhánh hội thoại (`dialogue.ts`), ánh xạ tài nguyên (`flowerAssets.ts`, `characterAssets.ts`) và kịch bản xác thực nội dung (`validateContent.ts`).
- `src/game/state/`: Quản lý mô hình trạng thái (`GameState.ts`) và máy trạng thái xử lý logic thuần túy (`stateReducer.ts`).
- `src/game/bouquet/`: Mô hình đối tượng cắm hoa (`BouquetModel.ts`) và quy tắc chấm điểm đơn hoa theo biểu tượng học (`evaluateBouquet.ts`).
- `src/game/save/`: Lớp trừu tượng kho lưu trữ (`SaveRepository.ts`), bộ điều hợp `localStorage` trình duyệt (`browserSaveRepository.ts`) và bộ quy tắc di chuyển lược đồ dữ liệu (`migrations.ts`).
- `src/app/`: Next.js App Router shell (`layout.tsx`, `page.tsx`) nạp `GameClient.tsx` dưới dạng Client Component (`ssr: false`) để chạy hoàn toàn phía trình duyệt.
- `src/components/`: Các React components giao diện (`ui/`: Header, Toolbar, Catalog, Controls, DialogueBox, Journal, Settings, Onboarding, Recovery) và khung canvas 3D (`ThreeViewport.tsx`).
- `src/components/debug/`: Bộ công cụ thử nghiệm React độc lập (StateDebugPanel, Bouquet3dDebug, DialogueDebug, AudioDebug, DebugHub), tách biệt hoàn toàn khỏi bản xuất bản phát hành.
- `src/game/GameRuntime.ts`: Lớp điều phối gameplay, âm thanh, cắm hoa và phát thông báo qua mô hình subscription, hoàn toàn không phụ thuộc DOM.
- `src/render3d/`: Three.js WebGLRenderer, camera phối cảnh cố định, tranh nền ngày/tối, nhân vật billboard và bàn cắm hoa có ánh sáng/bóng đổ. Hoa dùng texture 2D trên mặt bàn XZ; layer nâng theo Y. Không có camera xoay tự do hoặc model nhân vật full 3D.
---

## Quản lý & Xuất xứ tài nguyên (Asset Provenance)

- **Tài nguyên gốc (`DEMO_assets/`)**: Lưu trữ các tệp phác thảo nhân vật gốc từ họa sĩ. Thư mục này được giữ nguyên vẹn cấu trúc ban đầu và được khai báo bỏ qua trong `.gitignore` để đảm bảo kho mã nguồn nhẹ và sạch.
- **Kho nguồn tài nguyên (`asset-source/`)**: Lưu trữ các bản vẽ gốc PNG (`characters/`), sprite sheets và ảnh raw tạo sinh AI (`generated/flowers/`), crops dự phòng và nhật ký prompt chi tiết (`generated/ASSET_PROMPTS.md`). Thư mục này nằm ngoài `public/` để tránh tăng kích thước bản dựng `dist/`.
- **Tài nguyên chạy thực tế (`public/assets/characters/`)**: Các bản sao chân dung nhân vật định dạng WebP tối ưu hóa kích thước cho runtime, lưu trữ băm SHA-256 tham chiếu đến tệp gốc `DEMO_assets` tại `characterAssets.ts`.
- **Tài nguyên tạo sinh AI thực tế (`public/assets/generated/`)**: Hình nền không gian tiệm hoa sáng/tối (`shop/`) và bộ sprite 10 loài hoa (`flowers/crops/`). Toàn bộ nguồn gốc, mô hình tạo ảnh (`cx/gpt-image-2.5`), tham số kích thước và prompt văn bản được lưu lại chi tiết tại `asset-source/generated/ASSET_PROMPTS.md`.

---
---

## Máy chủ tri thức MCP (Model Context Protocol Server)

Dự án tích hợp một máy chủ MCP chạy bằng Node.js qua giao thức `stdio` (định vị tại `tools/mcp/`), hỗ trợ các AI agent tự động khám phá và truy vấn dữ liệu trò chơi:

- **Đặc điểm**: Hoạt động hoàn toàn chỉ đọc (read-only), không chỉnh sửa mã nguồn hay tệp lưu trò chơi, tách biệt khỏi mã đóng gói chạy trên trình duyệt.
- **Công cụ cung cấp**:
  1. `discover_game`: Cung cấp tổng quan cấu trúc dữ liệu, quy ước định danh (ID conventions), số lượng thực thể và các ví dụ tra cứu.
  2. `search_knowledge`: Tìm kiếm thực thể và trích dẫn tài liệu với hỗ trợ tiếng Việt không dấu.
  3. `get_entity`: Lấy chi tiết thực thể kèm vị trí mã nguồn chính xác.
  4. `get_relations`: Truy vấn đồ thị quan hệ trực tiếp (yêu cầu hoa, cấm kỵ, điều kiện cờ, liên kết nhân vật và asset).
  5. `analyze_impact`: Lần theo các phụ thuộc cấu trúc có điều kiện (ví dụ: các nơi đọc/ghi một cờ sự kiện).
  6. `evaluate_bouquet`: Chấm điểm bó hoa theo đúng bộ quy tắc game (hỗ trợ kiểm tra kho và hoa đã mở khóa độc lập).
  7. `simulate_scenario`: Mô phỏng chuỗi hành động trên bản sao trạng thái game cô lập mà không can thiệp vào trình duyệt.


### Đăng ký MCP cấp project (OMP)

`.omp/mcp.json` đăng ký hai server local: `hoatich` (tri thức/luật game) và `graphify` (đồ thị codebase). Cấu hình dùng đường dẫn tuyệt đối trên máy hiện tại; nếu chuyển checkout hoặc máy, cập nhật đường dẫn Node, Graphify và project trong file này. Không thay cấu hình MCP toàn cục.

Sau khi thay cấu hình, reload kết nối MCP hoặc mở lại phiên OMP trong project. Thử `hoatich.discover_game`, sau đó `graphify.graph_stats` và `graphify.query_graph` với `{"question":"GameSession","token_budget":1000}`. Tên hiển thị có thể được client thêm namespace.

### Graphify local

Đã cài gói chính thức `graphifyy[mcp]` phiên bản `0.9.95` bằng uv, cung cấp `graphify` và `graphify-mcp`. Skill cấp project nằm tại `.agents/skills/graphify/`. Graphify có 10 tool; các tool PR có thể dùng GitHub/`gh`, khác với nhóm truy vấn graph local.

```bash
# Cài trên máy mới
uv tool install 'graphifyy[mcp]==0.9.95'

# Tạo/cập nhật graph code local, không gọi LLM hoặc gửi code lên cloud
graphify extract . --code-only --max-workers 2

# Tra cứu nhanh bằng CLI
graphify query 'GameSession' --budget 1000
```

Graph nằm tại `graphify-out/graph.json`, là dữ liệu sinh ra đã được gitignore. `.graphifyignore` loại dependencies, output, asset binary và cấu hình agent khỏi quá trình quét. Chạy lại extraction sau khi đổi code rồi reload MCP nếu cần. Chế độ `--code-only` chưa lập chỉ mục ngữ nghĩa cho Markdown/hình ảnh; không xem graph là toàn bộ tri thức game. Dùng MCP Hoa Tích để tra nội dung có cấu trúc và tài liệu. Không cài git hooks, watcher hay chế độ strict chặn đọc source.

## Tài liệu tham khảo & Thiết kế

- Kế hoạch triển khai Vertical Slice: `docs/superpowers/plans/2026-10-12-flower-shop-vertical-slice.md`
- Tài liệu thiết kế trò chơi (GDD): `docs/specs/2026-10-12-flower-shop-narrative-game-design.md`
- Nghiên cứu tài nguyên và thư viện: `docs/research/2026-10-12-mcp-skill-asset-library-research.md`
- Nhật ký prompt tài nguyên tạo sinh: `asset-source/generated/ASSET_PROMPTS.md`
