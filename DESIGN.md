# DESIGN.md — Hệ thống thiết kế Hoa Tích

## 1. Bản sắc thị giác (Visual Identity)
- **Phong cách chủ đạo:** Cổ phong Á Đông thanh nhã, ấm áp, kết hợp chất liệu giấy xuyến chỉ (rice paper) và mộc bản.
- **Cảm xúc gợi mở:** Bình yên, lắng đọng, thoáng chút bảng lảng sương khói của ranh giới âm dương.

## 2. Bảng màu (Color Tokens)
### Ca Ngày — Cõi Trần (Light / Parchment)
- Nền trang / Background: `#ede6ce` (giấy mộc ủ màu thời gian)
- Mực chữ / Text ink: `#2b3020` (mực trà sẫm, độ tương phản cao)
- Nền panel / Surface: `#f4edd6` viền `#c7bb94`
- Màu chủ đạo / Primary Accent: `#566546` (xanh lá rêu)
- Nút bấm / Button: `#efe9cf`, hover `#e2dbba`, viền `#889073`
- Điểm nhấn / Highlight: `#e0a020` (vàng hổ phách)

### Ca Đêm — Cõi Âm (Dark / Spectral)
- Nền trang / Background: `#24202d` (tím xám sương đêm)
- Mực chữ / Text ink: `#fff8ec` (trắng ngà dịu mắt)
- Nền panel / Surface: `#343345` viền `#978ba0`
- Màu chủ đạo / Primary Accent: `#798d6a` (xanh ngọc sương)
- Sắc thái linh hồn / Ghost tint: `#9fc5e8` (lam khói mờ ảo)
- Nút bấm / Button: `#4b4b60`, hover `#5c566e`, viền `#a093aa`

## 3. Typography
- **Font:** Serif hoài niệm (`Georgia`, `'Times New Roman'`, serif)
- **Hierarchy:**
  - Tiêu đề chính / Header: `clamp(1.15rem, 2vw, 1.6rem)`, font-weight 700, letter-spacing -0.02em
  - Tiêu đề modal: `clamp(1.35rem, 2.4vw, 2rem)`, letter-spacing -0.03em
  - Thân bài / Body: `clamp(1rem, 1.25vw, 1.15rem)`, line-height 1.65–1.7
  - Chú thích / Metadata: `0.85rem` – `0.92rem`

## 4. Đặc tả giao diện & Tương tác (UI & Interaction Spec)

### 4.1. Cấu trúc màn hình & Luồng di chuyển (Scene & Navigation)
- **Sảnh tiệm (Lobby)**: Màn hình đón tiếp riêng biệt với phong cách cổ phong, bảng hiệu Hoa Tích, thông tin ngày/buổi hiện tại, nút mở ca làm việc và nút mở cài đặt. Không tự ý hiển thị tour hướng dẫn bao phủ.
- **Quầy tiếp khách (Counter)**: Góc camera trực diện khách hàng với tranh nền ngày/đêm và nhân vật billboard 2.5D. Khung thoại thanh nhã, câu hỏi chi tiết tùy chọn (`optional detail`) giúp người chơi khai thác thêm thông tin mà không tạo áp lực.
- **Bàn cắm hoa (Workspace)**: Camera trượt mượt mà 500ms từ quầy sang bàn cắm (hỗ trợ chuyển cảnh tức thời ở chế độ giảm chuyển động `reducedMotion`). Khóa mọi tương tác cắm hoa khi đang di chuyển camera hoặc mở modal.

### 4.2. Bàn cắm hoa & Bố cục vị trí (Slot Arrangement)
- **Khởi tạo cấu hình**:
  - Chọn loại vật chứa: Bó hoa (`bouquet`), Bình gốm (`vase`), Lọ thủy tinh (`jar`).
  - Chọn số lượng cành: Từ 1 đến 24 cành (phù hợp với các dải gợi ý 3–5, 6–9, 12–15 cành).
  - Cấu hình khóa cố định sau khi xác nhận; đổi bình hoa yêu cầu hộp thoại xác nhận để tránh mất bố cục ngoài ý muốn.
- **Điền cành vào slot**:
  - Bấm loài hoa trong danh mục sẽ tự động đặt một cành vào slot trống đầu tiên theo thứ tự quét (từ trên xuống dưới, từ trái sang phải).
  - Mỗi slot mang thông số tọa độ, độ sâu lớp (`layer`), góc cắm cơ sở và hướng cành chuyên biệt (`pose`: `center`, `left`, `right`, `down`).
  - Xoay cành: Cho phép tinh chỉnh góc cành trong biên độ tự nhiên (±25° so với góc gốc của slot).
  - Nhấc cành ra (Thay thế): Nhấc cành cũ ra khỏi bình bằng nút hoặc phím bấm trước khi chọn hoa mới. Không sử dụng cơ chế kéo thả tự do hay điều chỉnh thứ tự lớp thủ công.
- **Thông báo bản nháp chưa lưu (Unsaved Bouquet Notice)**:
  - Biểu ngữ trạng thái nổi bật phía trên bàn cắm: *"Đã lưu câu chuyện; bó đang cắm chưa được lưu"*.
  - Nhấn mạnh rằng bản nháp cắm hoa chỉ tồn tại trong phiên làm việc (`session-only`), tiến trình chỉ được lưu vĩnh viễn vào bộ nhớ trình duyệt khi hoàn tất trao hoa.

### 4.3. Bảng hoàn thiện sản phẩm (Finishing Controls)
- **Thẻ Cắm hoa & Thẻ Hoàn thiện**: Tách biệt rõ ràng giữa thao tác bố cục hoa và các khâu trang trí.
- **Giấy gói (Paper)** *(Mở từ Ngày 2)*: Không gói, Giấy kraft, Giấy kem.
- **Ruy-băng & Nơ (Ribbon & Bow)** *(Mở từ Ngày 3)*:
  - Lựa chọn màu sắc: Không nơ, Xanh sage, Hồng rose.
  - Quy trình thắt nơ 3 bước: Bấm nút tuần tự để trải nghiệm từng công đoạn thủ công (`Bước 1: Nút thắt` -> `Bước 2: Cánh nơ` -> `Bước 3: Vuốt đuôi`).
  - Khóa chống bấm đúp khi đang chạy hoạt họa thắt nơ (350ms); tự động hoàn tất tức thì ở chế độ `reducedMotion`.
- **Thiệp chúc (Message Cards)** *(Mở từ Ngày 4)*:
  - 4 mẫu thiệp chúc giàu biểu cảm: `Kính trọng`, `Ấm áp`, `Tưởng nhớ`, `An ủi`.
  - Lựa chọn thiệp được phản ánh trực tiếp vào đánh giá độ đồng điệu cảm xúc của đơn hàng.

### 4.4. Trợ năng & Phản hồi ngữ cảnh (Accessibility & Contextual Hints)
- **Giấy ghi chú đơn hàng (`OrderNote`)**: Đặt ở góc bàn cắm, tóm tắt các dữ kiện đã nghe từ khách hàng tại quầy; không tiết lộ đáp án hay checklist kiểm tra.
- **Chỉ dẫn ngữ cảnh (`ContextualHint`)**: Hiển thị gợi ý thao tác phù hợp với trạng thái hiện tại (chọn bình, chọn hoa, nhấc cành, hoàn thiện nơ) mà không che khuất không gian làm việc.
- **Điều khiển bàn phím & Cảm ứng**:
  - Phím `Tab`, `N`, `P` chọn cành hoa; phím `Q`, `E`, `<`, `>` xoay cành; phím `Delete`, `Backspace` nhấc cành; phím `U`, `Ctrl+Z` hoàn tác.
  - Phím `Enter` trao hoa khi đã đủ điều kiện.
  - Tương thích tốt trên màn hình cảm ứng di động xoay ngang (mobile landscape 844x390 và 667x375).
