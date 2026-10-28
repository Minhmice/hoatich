# PRODUCT.md — Hoa Tích

## Định vị sản phẩm
- **Tên:** Hoa Tích — Chuyện của hoa
- **Thể loại:** Cozy narrative shopkeeping, visual novel nhẹ kết hợp sáng tạo cắm hoa 2.5D.
- **Nền tảng:** Web-first (Next.js App Router static export + React 19 UI + Three.js WebGL hybrid 2.5D diorama), hoàn toàn chạy máy khách (client-side), không cài đặt backend/tài khoản.
- **Lời hứa sản phẩm (Product Promise):** "Làm một bó hoa để giúp ai đó nói điều họ không thể tự nói."

## Khán giả mục tiêu & Bối cảnh chơi
- Người yêu thích game tự sự, không gian hoài niệm, chữa lành, không áp lực thời gian.
- Phiên chơi linh hoạt: có thể dừng lại sau mỗi đơn hoa hoặc khi hết một ca (buổi).

## Vòng lặp trải nghiệm cốt lõi (Core Loop)
1. **Lắng nghe (Listen):** Tiếp đón khách tại quầy, đọc hội thoại để nhận diện nhu cầu bề mặt và nỗi niềm u ẩn. Có tối đa một câu hỏi chi tiết tùy chọn (`optional detail`) để khai thác thêm sở thích hoặc tâm ý người nhận.
2. **Tra cứu Sổ hoa & Giấy ghi chú (Journal & Order Note):**
   - Tra cứu ý nghĩa biểu tượng, mùa nở, nguồn gốc cõi trần / âm / lưỡng giới và điều kiêng kỵ trong Sổ hoa.
   - Đối chiếu Giấy ghi chú ở bàn cắm: ghi nhận trung thực các dữ kiện đã nghe từ khách (không hiển thị checklist đáp án hay chỉ dẫn đúng/sai).
3. **Cắm hoa (Compose):**
   - Chọn dáng vật chứa (bó, bình, lọ) và cấu hình số cành (từ 1 đến 24 cành; gợi ý theo đơn: 3–5, 6–9, 12–15 cành). Cấu hình khóa cố định trong suốt lượt cắm; đổi bình yêu cầu xác nhận.
   - Bấm loài hoa trong danh mục để tự động điền vào vị trí trống (slot) đầu tiên theo thứ tự quét từ trên xuống dưới, trái sang phải.
   - Bố cục kết hợp hướng cành chuyên biệt (`center`, `left`, `right`, `down`) và biên độ xoay tự nhiên (±25°).
   - Thay hoa bằng cách nhấc cành cũ ra (`lift-to-replace`) trước khi chọn hoa mới. Không sử dụng cơ chế kéo thả tự do hay phân lớp thủ công (thứ tự lớp do slot quy định).
   - Hoàn thiện sản phẩm (khi cắm đủ cành): Giấy gói (kraft, cream), Ruy-băng (sage, rose) kèm tương tác thắt nơ 3 bước bấm tuần tự (`quấn nút` -> `tạo cánh` -> `siết nơ`), Thiệp nhắn (4 mẫu lời nhắn).
   - Trạng thái cắm dở dang hiển thị biểu ngữ thông báo rõ ràng: *"Đã lưu câu chuyện; bó đang cắm chưa được lưu"* (draft là session-only).
4. **Trao gửi (Deliver):** Trao sản phẩm hoàn chỉnh cho khách, hệ thống chấm điểm đa chiều (đúng loài, số lượng, tỷ lệ, dáng bình, kiêng kỵ, cảm xúc thiệp) và trả về phản hồi cảm xúc:
   - Đồng điệu (`resonant`): Chạm đúng tâm ý sâu kín.
   - Tiếp nhận (`accepted`): Đáp ứng yêu cầu cơ bản.
   - Lệch ý (`missed`): Phạm điều kiêng kỵ hoặc sai lệch mong muốn.
5. **Luân chuyển Âm Dương & Chuyển ngày (Shift & Day Transition):**
   - **Ban ngày (Cõi trần):** Khách sống với ước nguyện trần thế hoặc tưởng nhớ người khuất.
   - **Buổi tối (Cõi âm):** Khách linh hồn với tâm nguyện chưa dứt, sử dụng hoa cõi âm và hoa lưỡng giới.
   - **Chuyển ngày (Next Day Gate):** Khi hoàn tất ca tối, chuyển sang ngày làm việc mới; mở khóa loài hoa mới, bổ sung kho hoa an toàn và kích hoạt các phân nhánh quan hệ đang xếp hàng.

## Tiến trình trải nghiệm & Nội dung (Progression & Narrative Content)
Trò chơi bao gồm **6 ngày làm việc hoàn chỉnh**, phục vụ 4 lượt khách mỗi ngày (tổng cộng **24 đơn hàng hoạt động** với **48 biến thể phân nhánh** tùy theo mức độ gắn kết) cùng **288 nút đối thoại**.

### 1. Lịch trình mở khóa tính năng & Loài hoa
*(Lưu ý: Các mốc mở khóa tính năng và giá trị cân bằng là lựa chọn triển khai - implementation choices)*
- **Ngày 1**: Mở đầu với Cúc trắng (`hoa-cuc-trang`), hướng dẫn nhận diện nhu cầu qua hội thoại, hỏi câu hỏi chi tiết tùy chọn và ghi chép giấy note.
- **Ngày 2**: Mở khóa Hồng đỏ (`hoa-hong-do`) và tính năng **Giấy gói** (Không gói, Giấy kraft, Giấy kem).
- **Ngày 3**: Mở khóa Hướng dương (`hoa-huong-duong`) và tính năng **Ruy-băng & Thắt nơ 3 bước** (Không nơ, Xanh sage, Hồng rose).
- **Ngày 4**: Mở khóa Sen hồng (`hoa-sen-hong`) và tính năng **Thiệp chúc** (4 mẫu thiệp: Kính trọng, Ấm áp, Tưởng nhớ, An ủi). Bắt đầu kích hoạt các đơn hàng phân nhánh theo quan hệ.
- **Ngày 5**: Mở khóa Thủy tiên (`hoa-thuy-tien`), đơn hàng kết hợp đa dạng cõi trần và cõi âm.
- **Ngày 6**: Mở khóa Lưu ly (`hoa-luu-ly`), ngày đỉnh điểm kết nối ký ức và hoàn tất các tuyến truyện nhân vật.

### 2. Hệ thống gắn kết khách hàng (NPC Affinity & Branching)
*(Lưu ý: Công thức điểm và ngưỡng nhánh là lựa chọn triển khai - implementation choices)*
- **Điểm gắn kết cơ sở**: Khởi đầu ở mức 50 điểm (thang 0–100) cho mỗi NPC.
- **Biến động điểm sau mỗi đơn hoa hoàn tất**:
  - Kết quả Đồng điệu (`resonant`): **+15 điểm**.
  - Kết quả Tiếp nhận (`accepted`): **+8 điểm**.
  - Kết quả Lệch ý (`missed`): **-12 điểm**.
- **Ngưỡng xét phân nhánh**: Sau tối thiểu **3 lần phục vụ** cho cùng một NPC:
  - Nếu điểm gắn kết đạt từ **70 điểm trở lên**: Xếp hàng nhánh Thuận hòa (`good`).
  - Nếu điểm gắn kết từ **30 điểm trở xuống**: Xếp hàng nhánh Xa cách / Căng thẳng (`strained`).
  - Trong khoảng 31–69 điểm: Giữ nhánh Trung tính (`neutral`).
- **Kích hoạt phân nhánh trễ (Next Day Gate)**:
  - Phân nhánh không thay đổi ngay trong ngày hiện tại mà được xếp hàng (`queuedBranch`).
  - Khi chuyển sang ngày kế tiếp (`advanceShift` sang ca sáng ngày mới), nhánh xếp hàng chính thức chuyển thành nhánh hoạt động (`activeBranch`).
  - Từ Ngày 4 trở đi, các NPC xuất hiện lại sẽ mang đơn hàng và phân cảnh đối thoại chuyên biệt theo nhánh (`good`, `strained`, hoặc `neutral`), tạo ra lộ trình tường thuật thực sự khác biệt thay vì chỉ thay đổi chỉ số.

### 3. Hệ thống lưu trữ dữ liệu (Save System Schema 2)
- Sử dụng cấu trúc dữ liệu **Schema Version 2** với cơ chế di chuyển tự động (`migrateSave`) từ các phiên bản Schema 0 và Schema 1.
- Lưu trữ bền vững tiến trình cốt truyện, cờ sự kiện, điểm gắn kết và trạng thái phân nhánh (`npcProgress`), kho hoa và đơn hàng đã hoàn tất.
- Trạng thái cắm hoa dở dang là session-only, có thông báo *"Đã lưu câu chuyện; bó đang cắm chưa được lưu"*, chống mất mát bằng hộp thoại xác nhận khi đổi bình hoa hoặc làm lại.
