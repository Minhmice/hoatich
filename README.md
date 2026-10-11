# Tiệm Hoa Tích (Hoa Tích)

Bản chơi thử tường thuật (narrative vertical slice demo) chạy trực tiếp trên trình duyệt web. Trò chơi kết hợp giữa cơ chế visual novel phân nhánh và bàn cắm hoa tương tác, đưa người chơi vào vai người quản lý tiệm hoa chuyển tiếp giữa hai bờ sinh tử.

## Phạm vi dự án (Project Scope)

- **Hình thức**: Bản narrative demo thử nghiệm cơ chế trên trình duyệt web, không phải bản phát hành đầy đủ hay bản thương mại trên Steam.
- **Nhịp độ**: Trải nghiệm chậm rãi, suy ngẫm, hoàn toàn không có đồng hồ đếm ngược (no timer / countdown).
- **Chu trình ca làm việc**: Đan xen giữa buổi sáng đón tiếp khách cõi trần (living) và buổi tối đón tiếp linh hồn cõi âm (spirits / deceased).
- **Không yêu cầu dịch vụ mạng**: Chạy hoàn toàn phía máy khách (client-side), không cần API key, tài khoản hoặc máy chủ backend.

---

## Cài đặt & Khởi chạy

Yêu cầu môi trường Node.js (khuyến nghị phiên bản LTS).

```bash
# Cài đặt các gói phụ thuộc
npm install

# Khởi chạy máy chủ phát triển nội bộ
npm run dev

# Chạy bộ kiểm thử tự động
npm test

# Kiểm tra tính toàn vẹn của dữ liệu nội dung (hoa, khách hàng, đơn hàng, lời thoại)
npm run validate:content

# Kiểm tra kiểu dữ liệu TypeScript, xác thực nội dung và biên dịch bản đóng gói
npm run build
```

> **Địa chỉ truy cập**: Sử dụng đường dẫn URL được thông báo trên màn hình terminal khi chạy lệnh `npm run dev` (mặc định cấu hình Vite phục vụ tại `http://127.0.0.1:5173/`).

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
- **Thêm hoa vào bàn**: Nhấp chọn cành hoa trong mục "Danh mục hoa có sẵn".
- **Chọn cành hoa trên bàn**: Nhấp chuột trái vào cành hoa muốn điều chỉnh; chọn từ danh sách thả xuống "Chọn cành hoa"; dùng nút "Cành trước" / "Cành tiếp"; hoặc phím `N` (cành kế), `P` (cành trước), `Tab` trên bàn cắm; nhấp ra ngoài bàn cắm để hủy chọn. Hoa vừa thêm từ danh mục sẽ tự động được chọn.
- **Di chuyển cành hoa**: Kéo thả trực tiếp bằng chuột trong phạm vi mặt bàn, hoặc sử dụng cụm phím `Mũi tên` / `W`, `A`, `S`, `D`.
- **Xoay cành**: Phím `Q` hoặc `<` (xoay trái 15°), phím `E` hoặc `>` (xoay phải 15°); hoặc nút bấm `⟲ Xoay trái`, `⟳ Xoay phải`.
- **Độ sâu lớp (Layer ordering)**: Phím `]` hoặc `PageUp` (đưa lên trên), phím `[` hoặc `PageDown` (hạ xuống dưới); hoặc nút bấm `▲ Lên lớp`, `▼ Xuống lớp`.
- **Xóa cành hoa**: Phím `Delete` hoặc `Backspace`; hoặc nút bấm `🗑️ Xóa cành`.
- **Hoàn tác bước cắm**: Phím `Ctrl+Z`, `Cmd+Z`, hoặc `U`; hoặc nút bấm `↩ Hoàn tác`.
- **Làm sạch bàn cắm**: Phím `C`; hoặc nút bấm `🧹 Xóa hết`.
- **Trao hoa hoàn thiện**: Phím `Enter` (khi không trong trạng thái đối thoại) hoặc nút bấm `💐 Trao hoa`.

### 3. Thanh công cụ & Bảng trợ giúp
- **Sổ hoa (`JournalPanel`)**: Nhấn nút `Sổ hoa` trên thanh công cụ để tra cứu ý nghĩa hoa và nhật ký khách hàng. Nhấn `Esc` hoặc nút `Đóng (Esc)` để thoát.
- **Cài đặt (`AccessibilitySettings`)**: Nhấn nút `Cài đặt` để điều chỉnh tốc độ chữ, phông chữ dễ đọc, độ tương phản cao, giảm chuyển động hoạt họa và âm lượng. Đóng bằng phím `Esc` hoặc nút `Đóng (Esc)`.
- **Chuyển buổi**: Nhấn nút `Chuyển buổi` trên thanh công cụ khi đã hoàn tất các đơn hàng của ca làm việc hiện tại.

### 4. Cơ chế bổ sung kho hoa (Restock Behavior)
- **Bổ sung hoa định kỳ giữa ca**: Khi chuyển ca làm việc (`advanceShift`), toàn bộ các loài hoa đã mở khóa (`unlockedFlowerIds`) có số lượng tồn kho dưới 12 cành sẽ được tự động bù đắp về mức tối thiểu an toàn là 12 cành.
- **Đảm bảo không nghẽn tiến trình (Softlock Prevention)**: Cơ chế này đảm bảo người chơi có thể sử dụng hết số hoa trong ca đầu (ví dụ: dùng trọn 12 đóa hoa hồng đỏ cho đơn hàng 1) mà vẫn đủ nguyên liệu bắt buộc cho các đơn hàng ở ngày 2.

---

## Hệ thống lưu trữ & Xử lý lỗi (Save System)

- **Vị trí lưu trữ**: Tiến trình được tự động lưu vào `localStorage` của trình duyệt dưới khóa `hoatich.save.v1` và tạo bản sao lưu dự phòng tại `hoatich.save.backup`.
- **Cơ chế khôi phục khi bản lưu lỗi (Invalid Save Recovery)**:
  - Khi bản lưu chính gặp sự cố (sai cấu trúc hoặc lỗi phân tích cú pháp), hệ thống sẽ tự động khôi phục dữ liệu từ bản sao lưu dự phòng an toàn.
  - Trường hợp cả hai bản lưu đều hỏng, trò chơi hiển thị bảng thông báo lỗi tường minh kèm hai tùy chọn:
    - *Chơi ván mới (Xóa lưu lỗi)*: Đặt lại trạng thái ban đầu và làm sạch bản lưu bị hỏng.
    - *Giữ nguyên bản lưu lỗi*: Không ghi đè ngay lập tức để người chơi có thể trích xuất hoặc sửa lỗi thủ công.
- **Cảnh báo dữ liệu trình duyệt**:
  - Bộ nhớ `localStorage` gắn liền với origin của trình duyệt (ví dụ: `http://127.0.0.1:5173`). Việc đổi cổng phát triển hoặc đổi tên miền sẽ truy cập vào một không gian lưu trữ khác biệt.
  - Hành động xóa dữ liệu duyệt web (Clear browsing data / Clear site storage) sẽ xóa toàn bộ tiến trình chơi.

---

## Cấu trúc thư mục mã nguồn (Project Architecture)

- `src/game/content/`: Dữ liệu tĩnh của trò chơi gồm danh mục hoa (`flowers.ts`), khách hàng (`customers.ts`), đơn hàng (`orders.ts`), nhánh hội thoại (`dialogue.ts`), ánh xạ tài nguyên (`flowerAssets.ts`, `characterAssets.ts`) và kịch bản xác thực nội dung (`validateContent.ts`).
- `src/game/state/`: Quản lý mô hình trạng thái (`GameState.ts`) và máy trạng thái xử lý logic thuần túy (`stateReducer.ts`).
- `src/game/bouquet/`: Mô hình đối tượng cắm hoa (`BouquetModel.ts`) và quy tắc chấm điểm đơn hoa theo biểu tượng học (`evaluateBouquet.ts`).
- `src/game/save/`: Lớp trừu tượng kho lưu trữ (`SaveRepository.ts`), bộ điều hợp `localStorage` trình duyệt (`browserSaveRepository.ts`) và bộ quy tắc di chuyển lược đồ dữ liệu (`migrations.ts`).
- `src/game/ui/`: Các bảng giao diện DOM tương tác gồm bảng thoại (`DialoguePanel.ts`), sổ tay ghi chép (`JournalPanel.ts`) và tùy chọn hỗ trợ tiếp cận (`AccessibilitySettings.ts`).
- `src/game/scenes/`: Cảnh game Phaser 3, gồm nạp tài nguyên (`BootScene.ts`) và cảnh tiệm hoa chính (`ShopScene.ts`).

---

## Quản lý & Xuất xứ tài nguyên (Asset Provenance)

- **Tài nguyên gốc (`DEMO_assets/`)**: Lưu trữ các tệp phác thảo nhân vật gốc từ họa sĩ. Thư mục này được giữ nguyên vẹn cấu trúc ban đầu và được khai báo bỏ qua trong `.gitignore` để đảm bảo kho mã nguồn nhẹ và sạch.
- **Kho nguồn tài nguyên (`asset-source/`)**: Lưu trữ các bản vẽ gốc PNG (`characters/`), sprite sheets và ảnh raw tạo sinh AI (`generated/flowers/`), crops dự phòng và nhật ký prompt chi tiết (`generated/ASSET_PROMPTS.md`). Thư mục này nằm ngoài `public/` để tránh tăng kích thước bản dựng `dist/`.
- **Tài nguyên chạy thực tế (`public/assets/characters/`)**: Các bản sao chân dung nhân vật định dạng WebP tối ưu hóa kích thước cho runtime, lưu trữ băm SHA-256 tham chiếu đến tệp gốc `DEMO_assets` tại `characterAssets.ts`.
- **Tài nguyên tạo sinh AI thực tế (`public/assets/generated/`)**: Hình nền không gian tiệm hoa sáng/tối (`shop/`) và bộ sprite 10 loài hoa (`flowers/crops/`). Toàn bộ nguồn gốc, mô hình tạo ảnh (`cx/gpt-image-2.5`), tham số kích thước và prompt văn bản được lưu lại chi tiết tại `asset-source/generated/ASSET_PROMPTS.md`.

---

## Tài liệu tham khảo & Thiết kế

- Kế hoạch triển khai Vertical Slice: `docs/superpowers/plans/2026-10-12-flower-shop-vertical-slice.md`
- Tài liệu thiết kế trò chơi (GDD): `docs/specs/2026-10-12-flower-shop-narrative-game-design.md`
- Nghiên cứu tài nguyên và thư viện: `docs/research/2026-10-12-mcp-skill-asset-library-research.md`
- Nhật ký prompt tài nguyên tạo sinh: `asset-source/generated/ASSET_PROMPTS.md`
