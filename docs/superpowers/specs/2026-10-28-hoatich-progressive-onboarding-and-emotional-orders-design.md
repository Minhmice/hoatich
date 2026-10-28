# Hoa Tích — Progressive Onboarding, Slot Bouquet & Emotional Orders

## Trạng thái

- **Loại:** design specification đã được người dùng duyệt; hoàn tất triển khai toàn diện toàn bộ 6 ngày làm việc.
- **Trạng thái:** Toàn bộ các cơ chế cốt lõi (slot 1..24, mở khóa theo ngày, giấy gói/nơ/thiệp, phân nhánh quan hệ trễ sau 3 lần phục vụ, lược đồ lưu trữ Schema 2) đã được tích hợp hoàn chỉnh vào runtime và kiểm chứng tự động.
- **Phạm vi hoàn tất:** lobby, quầy tiếp khách, bàn cắm hoa theo slot, biến thể góc asset (center, left, right, down), hoàn thiện giấy/nơ 3 bước/thiệp, hệ thống gắn kết 50 +8/+15/-12, phân nhánh 24 đơn hàng / 48 biến thể trên 6 ngày, và thông báo bản nháp chưa lưu.
## Ý định sản phẩm

Hoa Tích là game narrative shopkeeping chữa lành. Người chơi giúp khách nói điều họ không thể tự nói bằng hoa. Onboarding phải dạy qua nhịp làm việc thật, không dựng toàn bộ UI rồi phủ modal hướng dẫn lên bàn chơi.

Mục tiêu trải nghiệm:

1. Người chơi hiểu cửa tiệm và ngày làm việc trước khi bị yêu cầu thao tác.
2. Mỗi ngày có nhiều khách; mỗi khách dạy hoặc dùng một phần mới của vòng lặp.
3. Người chơi tự đối chiếu giấy ghi chú để nhận ra cách làm chưa hợp.
4. Sai sót nhẹ có thể sửa miễn phí trước khi trao; kết quả chỉ khóa khi trao hoa.
5. Hoa đẹp và đúng kỹ thuật không thay thế việc hiểu tâm ý; bó chưa hoàn hảo nhưng đúng câu chuyện vẫn có giá trị.
6. Quan hệ tích lũy qua khoảng ba lần trao hoa cho cùng NPC; nhánh mới chỉ mở từ ngày/chapter kế tiếp.

## Đã chốt: flow tổng thể

```text
LOBBY
  -> chọn chapter/ngày
  -> mở ngày làm việc
QUẦY TIẾP KHÁCH
  -> khách mở lời
  -> người chơi chọn nhận order hoặc hỏi thêm một câu optional
  -> giấy ghi chú ghi đúng dữ kiện đã nghe
BÀN CẮM (camera trượt sang góc riêng)
  -> chọn vật chứa/cách trình bày: bó, bình, lọ...
  -> chọn số lượng cành trong khoảng khách cho phép
  -> hệ thống tạo đúng số slot
  -> bấm loài hoa để tự điền slot trống theo thứ tự
  -> nhấc cành cũ ra trước khi thay loài khác
  -> hoàn thiện: giấy gói, nơ, thiệp khi tính chất sản phẩm cho phép
  -> trao hoa
QUẦY TIẾP KHÁCH
  -> khách phản ứng cảm xúc và mở nhánh ngắn nếu điều kiện phù hợp
  -> hoàn thành order
  -> tiếp khách kế tiếp trong cùng ngày
KẾT NGÀY / MỞ NGÀY KẾ
```

### Progression theo ngày

- **Đã chốt:** một ngày làm việc có nhiều khách.
- **Đã chốt:** tính năng mở dần qua nhiều ngày, không dồn hết vào ngày đầu.
- **Đã chốt:** mỗi ngày mở thêm một loài hoa mới; hoa chưa mở không thể dùng.
- **Chưa chốt:** ngày cụ thể mở giấy ghi chú/hỏi chi tiết, gói, nơ, thiệp. Không tự gán ngày hoặc thứ tự mở khóa.
- **Đề xuất:** tính năng mới xuất hiện trong một order có lý do tự nhiên, sau đó trở thành công cụ bình thường ở các order sau. Content chỉ yêu cầu vật liệu/tính năng mà người chơi đã mở.

## Quầy và onboarding không xâm lấn

### Lobby

Lobby là màn hình vào game, không phải gameplay overlay. Đã chốt có lobby, vào câu chuyện/ngày chơi và cài đặt; bố cục chi tiết dưới đây là đề xuất:

- tên tiệm/logo Hoa Tích;
- chapter và ngày hiện tại;
- nút mở ngày;
- tiếp tục ngày đang lưu;
- cài đặt;
- hướng dẫn/cẩm nang nếu đã mở.

### Quầy tiếp khách

Chỉ render những gì cần cho hội thoại và nhận order. Không hiện kệ hoa, bàn cắm, bộ công cụ xoay hoặc nút trao trước khi đến lượt dùng. Camera giữ ở quầy; dialogue là một phần của cảnh, không phải modal phủ toàn bộ game.

Mỗi bước onboarding dùng một NPC/order thật. Có thể dùng bàn tay chỉ dẫn hoặc highlight nhỏ gắn với vật thể đang được giới thiệu; không khóa toàn cảnh bằng spotlight overlay.

### Chuyển camera

- Sau khi nhận order, camera trượt từ quầy sang workspace riêng.
- Sau khi hoàn thiện và bấm trao, camera trượt về quầy.
- Chuyển cảnh không tạo deadline đọc hoặc cắm hoa.
- Reduced-motion thay camera slide bằng fade/crossfade ngắn.

## Nhận order và giấy ghi chú

### Một câu hỏi optional

NPC mở đầu bằng yêu cầu ngắn. Người chơi chọn một trong hai dạng lời nói tự nhiên:

- nhận order ngay;
- hỏi thêm một câu chi tiết.

Mỗi order chỉ có tối đa một lượt hỏi chi tiết ở phiên bản đầu. Câu trả lời bổ sung có thể nói về sở thích, dịp tặng, người nhận hoặc điều cần tránh. Nếu không hỏi, người chơi vẫn hoàn thành được order hợp lý; không hỏi không phải lỗi.

### Giấy ghi chú

Sau khi nhận order, giấy ghi chú xuất hiện tại workspace. Nó chỉ chứa dữ kiện NPC đã nói. Người chơi có thể mở lại để tự đối chiếu:

- yêu cầu rõ;
- sở thích;
- ngữ cảnh tặng;
- điều cần tránh;
- vật chứa/cỡ đã nói;
- thiệp hoặc lời nhắn nếu khách yêu cầu.

Giấy không hiện đáp án hay checklist báo sai. Nếu NPC nói rõ “mẹ chị thích hồng phấn” thì phải ghi nguyên thông tin này; không giấu dữ kiện đã nghe. Phân biệt sở thích với yêu cầu bắt buộc: không hỏi thêm không bị phạt vì chi tiết chưa có cách biết.

## Luật cắm hoa chính

### Vật chứa và số slot

- Sau order, người chơi chọn dạng sản phẩm: bó, bình, lọ hoặc loại tương đương đã mở.
- NPC nêu nhu cầu dạng/cỡ; người chơi có quyền chọn cấu hình trước khi cắm, không bị ép vào một số bông duy nhất. Ví dụ bó nhỏ 3–5 cành; lọ lớn 12 hoặc 15 cành. Những ví dụ này không khóa toàn bộ danh sách cỡ hoặc giới hạn runtime.
- Sau khi chốt vật chứa và số lượng, hệ thống tạo đúng số slot. Vật chứa và số slot khóa trước khi cắm, không đổi giữa lượt cắm. Quy trình hủy/làm lại cấu hình chưa chốt; không tự xóa hoa người chơi đã cắm.
- Đánh giá theo cấu hình và số cành thực tế; vật chứa/cỡ thực tế có thể khác lời khách gợi ý và được đánh giá theo ngữ cảnh, không vô hiệu hóa lựa chọn chỉ vì khác mẫu. Không so với mẫu số bông cố định; 15 không tự tốt hơn 12.

### Bấm hoa để điền slot

- Bấm một loài hoa một lần: thêm một cành vào slot trống đầu tiên.
- Thứ tự mặc định: trái sang phải trong hàng, từ hàng trên xuống hàng dưới; template thực tế có thể phân lớp để tạo bó tự nhiên.
- Bấm tiếp cùng loài: thêm cành tiếp theo.
- Chọn loài khác: điền vào slot trống kế tiếp; không ghi đè slot đã có hoa.
- Muốn đổi một cành: nhấc cành cũ ra trước, rồi bấm hoa mới. Việc nhấc/đặt trước khi trao không tốn phí; cơ chế dự trữ/trừ kho chỉ là chi tiết implementation chưa khóa, nhưng không được mất hoặc nhân đôi nguyên liệu.
- Khi đầy slot: không thêm và không ghi đè.

### Góc nhìn và rotate

- Hướng và góc nhìn là hai thuộc tính khác nhau.
- Người dùng đồng ý hướng nhiều asset góc nhìn kết hợp rotation. Bộ nghiên cứu gồm chính diện, hơi trái/phải, nghiêng trái/phải khoảng 45 độ, hướng lên/xuống, góc nghiêng cao/thấp, mặt sau; nụ là trạng thái sinh trưởng riêng, không dùng giả một góc nhìn. Đây là inventory ứng viên, chưa khóa số ảnh mỗi loài.
- Slot cung cấp pose, điểm neo và layer; rotation phải giữ cành hội tụ hợp lý thay vì xoay quanh tâm bông như đồng xu. **Đề xuất:** xoay nhẹ trong biên tự nhiên và chọn asset phù hợp. Biên góc, nấc snap và quyền người chơi chỉnh góc chưa chốt, không mặc định cấm hoặc bật xoay 360 độ.
- Từng slot có thể có angle, depth, pose riêng. Nhiều slot hơn không kéo dài một hàng; hệ thống thêm vòng/tầng và giữ điểm hội tụ của bó hoặc miệng lọ.
- Mục tiêu là bó nhìn giống hoa thật trước khi người chơi tinh chỉnh, không phải ép mọi loài vào cùng một hình học.

### Nguyên tắc bố cục

- Bó: thân/cành hội tụ về điểm buộc.
- Lọ/bình: cành tỏa từ miệng vật chứa với độ cao và góc khác nhau.
- Slot trung tâm thường là anchor; slot ngoài có pose hướng vào hoặc tỏa ra tùy loài và loại vật chứa.
- Không đánh giá “đẹp” chỉ bằng đối xứng; ưu tiên đáp ứng order, tính tự nhiên và ý đồ cảm xúc.

## Hoàn thiện sản phẩm

### Menu

Sau khi đủ slot, menu hoàn thiện mở theo loại sản phẩm và tiến trình đã mở:

- giấy gói/vật liệu;
- kiểu hoặc màu nơ;
- thao tác buộc nơ;
- thiệp/lời nhắn;
- xác nhận trao.

**Đề xuất:** lọ/bình bỏ qua giấy gói và nơ nếu không phù hợp; bó dùng các bước theo order và tính năng đã mở. Không yêu cầu tính năng còn khóa.

### Buộc nơ ba nhịp

**Đã chốt:** chọn phụ kiện bằng menu, bấm vào nơ khoảng ba lần để chạy ba animation. **Đề xuất:** không QTE, không giới hạn thời gian, không phạt phản xạ; ba pha dưới đây là choreography ứng viên:

1. Quấn ruy-băng quanh điểm buộc và bắt chéo.
2. Tạo hai tai nơ.
3. Siết nút, thả đuôi và hoàn tất.

**Đề xuất trợ năng:** vùng bó/nút lớn nhận thao tác; hỗ trợ Space/Enter, auto-tie và reduced-motion crossfade. Không tự thêm haptics hay setting chưa có runtime.

### Thiệp

- **Đã chốt:** có thêm thiệp và lựa chọn hoàn thiện; nội dung thiệp có thể ảnh hưởng cảm xúc và nhánh thoại theo order.
- **Đề xuất:** thiệp tùy chọn khi khách không yêu cầu; thư viện câu viết sẵn hoặc ghép câu. Người dùng chưa chốt giữa viết sẵn, ghép câu và tự nhập; không mặc định cắt bỏ tính năng nào.
- **Đề xuất:** nhóm câu theo ngữ cảnh như cảm ơn, xin lỗi, động viên, chúc mừng, yêu thương, ký ức, tâm nguyện. Không mặc định mọi linh hồn muốn từ biệt/siêu thoát.
- Không dùng quy tắc văn hóa toàn cục để suy ra mọi NPC thích hay ghét cùng một thông điệp. Cần manh mối trong content.

## Lỗi nhẹ, cảm xúc và nhánh thoại

### Nguyên tắc

- Sửa hoa hoàn toàn miễn phí và không giới hạn trước khi trao.
- Chỉ bấm “Trao hoa” mới khóa đánh giá.
- Không game over, không khóa chapter vì lỗi thông thường.
- Người chơi tự nhận ra lỗi qua ghi chú, sổ hoa và ngữ cảnh; NPC không hiện checklist đáp án.
- Nhấc/đặt, thay hoa và đổi phụ kiện trước khi trao không tự giảm yêu thích; không chấm số lần sửa, tốc độ bấm hoặc việc đọc hướng dẫn. Chỉ lịch sử đối thoại đã được content thiết lập mới là bằng chứng riêng, không suy đoán thái độ người chơi.

### Tách các lớp đánh giá

1. **Vật phẩm:** đúng yêu cầu rõ, vật chứa, cỡ, hoa, thiệp, cấm kỵ.
2. **Ý định:** có khớp điều người chơi đã biết về người nhận và dịp tặng không.
3. **Cảm xúc tức thời:** nhẹ lòng, vui, ngập ngừng, hụt hẫng, khó xử, tổn thương hoặc xúc động.
4. **Quan hệ:** mức yêu thích riêng của từng NPC.
5. **Nhánh tương lai:** content đủ điều kiện ở ngày/chapter kế tiếp.

Một bó đẹp nhưng thiệp sai tâm ý có thể làm NPC thích tay nghề nhưng chưa tin người chơi. Một bó chưa hoàn hảo nhưng hiểu đúng câu chuyện có thể tăng yêu thích tốt hơn.

### Taxonomy lỗi

Content nên phân biệt ít nhất:

- sai yêu cầu tường minh;
- thiếu thành phần được yêu cầu;
- sai sắc thái thiệp;
- vượt ranh giới quan hệ;
- trái ý định người tặng;
- chạm ký ức nhạy cảm;
- thiện ý nhưng áp đặt;
- hoa và thiệp không nhất quán;
- nhiều lỗi cùng lúc;
- lỗi đã sửa trước khi trao.

Nếu có nhiều lỗi, chọn lỗi nổi bật nhất với NPC làm phản ứng chính; không đọc checklist. Các lỗi còn lại có thể nằm trong metadata để chọn câu nối hoặc ảnh hưởng đánh giá nhẹ.

### Phản ứng dạng storylet/salience

Không tạo một cây nhánh dài cho mọi tổ hợp. Mỗi kết quả gồm:

- phản ứng quan sát được;
- một câu phản ứng đặc thù theo lỗi/ý định;
- lựa chọn đối đáp nếu content cần;
- đoạn nhập lại tuyến chính;
- tùy trường hợp, một ký ức/quality nhỏ cho lần gặp sau.

Giữ `accepted / resonant / missed` làm trục tương thích với runtime hiện tại là **Đề xuất**, nhưng mở rộng nguyên nhân và phản ứng thay vì dùng một thoại chung cho mọi `missed`. Nguồn tham khảo: Emily Short về quality/salience-based narrative và Failbetter về parsimony.

## Quan hệ NPC và mở nhánh

- Mỗi NPC có mức yêu thích riêng, biểu diễn phần trăm hoặc giá trị tương đương ở UI/runtime.
- Mức tăng/giảm dựa trên món hoa cuối cùng và ngữ cảnh đã biết: yêu cầu, loài/tỉ lệ hoa, cỡ, vật chứa, thiệp và ý nghĩa. Hỏi chi tiết giúp có dữ kiện, không tự được cộng điểm; sửa trước khi trao không tự cộng/trừ điểm. Các lựa chọn bố cục tự động hoặc phụ kiện thuần thẩm mỹ không bị chấm như lỗi nếu content chưa có manh mối.
- Không dùng “đẹp” làm điểm duy nhất. Sự đồng điệu cảm xúc có thể quan trọng hơn kỹ thuật.
- Ngưỡng quan hệ vào khoảng **ba lần trao hoa cho cùng NPC** — cách diễn giải để review của “khoảng 3 phát”; không phải đúng ba đơn bất kể chất lượng, không phải ba mức yêu thích. Công thức, điểm xuất phát, ngưỡng phần trăm và cách reset chưa chốt.
- Nhánh không mở giữa ngày hiện tại. Kết quả trao hoa cập nhật mức yêu thích và có thể tạo điều kiện chờ; chỉ kích hoạt ở mốc ngày/chapter kế tiếp phù hợp với lịch truyện. Mỗi nhánh phải có mốc mở rõ, không tự chờ cả hai hoặc kích hoạt hai lần.
- Nhánh có thể tích cực hoặc kém thuận lợi tùy kết quả tích lũy. Người dùng muốn rẽ sang nhánh chơi khác, không chỉ đổi một câu chào hoặc giảm điểm. NPC gặp lại có thể có order, thông tin, lựa chọn và sự kiện khác.
- **Chưa chốt:** ngưỡng tốt/xấu, hồi phục quan hệ, nhánh có đảo lại được hay không và ảnh hưởng ending. Không tự áp bảng 0–24/25–49/50–74/75–89/90–100 đã đề xuất trước đây.

## Quyết định triển khai cụ thể (Implementation Choices)

Các câu hỏi thiết kế trước đây đã được xác định cụ thể trong mã nguồn thực tế như sau:
1. **Vật chứa và số lượng cành**: 3 kiểu dáng (`bouquet`, `vase`, `jar`); hỗ trợ từ 1 đến 24 cành với các khoảng gợi ý 3–5, 6–9, 12–15 cành. Cấu hình khóa cố định khi bắt đầu cắm.
2. **Lịch mở khóa tính năng**:
   - Ngày 1: Cúc trắng, giấy ghi chú và câu hỏi chi tiết tùy chọn.
   - Ngày 2: Hồng đỏ, Giấy gói (kraft, cream).
   - Ngày 3: Hướng dương, Ruy-băng & thắt nơ 3 bước (sage, rose).
   - Ngày 4: Sen hồng, Thiệp nhắn cảm xúc (4 mẫu thiệp).
   - Ngày 5: Thủy tiên.
   - Ngày 6: Lưu ly.
3. **Biến thể hướng cành**: 4 hướng cành chuyên biệt (`center`, `left`, `right`, `down`) kết hợp biên độ xoay tự nhiên ±25° quanh góc gốc của slot.
4. **Công thức điểm gắn kết (Affinity)**: Khởi điểm 50 điểm; biến động +15 (`resonant`), +8 (`accepted`), -12 (`missed`).
5. **Phân nhánh sau 3 lần phục vụ**: Sau tối thiểu 3 lần phục vụ một NPC, điểm >= 70 xếp hàng nhánh Thuận hòa (`good`), điểm <= 30 xếp hàng nhánh Xa cách (`strained`).
6. **Kích hoạt nhánh trễ (Next Day Gate)**: Nhánh xếp hàng chuyển thành nhánh hoạt động khi chuyển sang ngày kế tiếp (`advanceShift`), phục vụ các đơn hàng và đối thoại phân nhánh ở Ngày 4–6 (tổng cộng 24 đơn hàng với 48 biến thể phân nhánh, 288 nút đối thoại).
7. **Thiệp nhắn**: 4 lựa chọn soạn sẵn chuẩn mực (`Kính trọng`, `Ấm áp`, `Tưởng nhớ`, `An ủi`) ảnh hưởng trực tiếp đến phản hồi cảm xúc.
8. **Quản lý bản nháp chưa lưu**: Trạng thái cắm dở dang là session-only, hiển thị thông báo *"Đã lưu câu chuyện; bó đang cắm chưa được lưu"* và yêu cầu xác nhận khi đổi bình hoa.
## Hiện trạng source — không phải tính năng mới đã chạy

Đối chiếu ngày 2026-10-28: `src/game/content/types.ts` có `Outcome`, `OrderDefinition.resultDialogueIds` theo ba kết quả và effect `relationship`. `src/game/state/GameState.ts` có `relationshipScores`, ngày/chapter, flags và các order đã hoàn thành. Đây không chứng minh đã có mức yêu thích phần trăm, slot count hay nhánh trì hoãn theo ba lần trao.

Runtime hiện tại đã chuyển sang React/Three.js: điểm vào `src/app/GameClient.tsx`, điều phối `src/game/GameRuntime.ts`, luật `src/game/GameSession.ts`, evaluator `src/game/bouquet/evaluateBouquet.ts`, UI `src/components/ui/`. Không dùng tên `ShopScene`/`ShopController` cũ làm contract implementation. Thiết kế này không cập nhật stack.

MCP Hoa Tích `discover_game` trả `SOURCE_CHANGED` khi đối chiếu. Không có lệnh restart MCP trong toolset phiên này; đã ngừng dùng revision cũ, đọc source trực tiếp. Graphify phải phân biệt các node thiết kế với bằng chứng runtime.

## Phương án và trạng thái duyệt

- Overlay tour trên game dựng sẵn: người dùng không chọn; gây ngợp và không tạo màn mở đầu.
- Lobby, quầy, workspace riêng + progressive disclosure: người dùng đã chọn; camera trượt qua góc khác, feature mở dần theo ngày.
- Slot chính xuyên suốt với nhiều góc asset + rotation: người dùng đã chọn; không phải chế độ tập rồi chuyển sang kéo thả tự do.
- Nhánh cây riêng cho mọi tổ hợp lỗi và mô phỏng nhiều thanh cảm xúc: đã cân nhắc trong nghiên cứu, chưa được chọn.
- Reason tags + phản ứng theo ngữ cảnh + nhánh nhập lại tuyến truyện: đề xuất triển khai nội dung, chưa khóa schema hoặc giữ ba `Outcome` hiện tại.

Người dùng đã duyệt tài liệu và chọn triển khai dần bằng subagent-driven trên branch hiện tại, không tạo worktree/commit. Phase 1 có plan tại `docs/superpowers/plans/2026-10-28-progressive-onboarding-phase-1.md`; câu hỏi nội dung còn mở vẫn chưa khóa.

## Bản đồ Graphify

Index tài liệu này vào graph project hiện có; không tạo graph JSON thủ công thay thế Graphify. Các khái niệm cần truy vấn: Lobby, Working Day, Optional Detail, Order Note, Vessel Selection, Slot Fill, Flower Angle Assets, Ribbon Interaction, Greeting Card, Free Revision, NPC Affinity, Three Delivery Scale, Pending Branch, Next Day Chapter Gate và Feature Unlocks.

Quan hệ trong tài liệu là design relations, không phải `calls`. Các node runtime được nhắc tới chỉ là nguồn đối chiếu; chưa có bằng chứng runtime triển khai các flow mới.

## Tiến độ triển khai — Hoàn tất toàn diện (Full Integration)

- **Toàn bộ 6 ngày làm việc**: Đã hiện thực hóa đầy đủ 6 ngày làm việc với chu trình sáng cõi trần / tối cõi âm, 24 đơn hàng hoạt động, 48 biến thể phân nhánh và 288 nút đối thoại.
- **Bàn cắm hoa hướng slot hoàn chỉnh**: Hỗ trợ 1..24 cành, khóa cấu hình, điền slot tự động theo thứ tự quét, nhấc cành thay thế (`lift-to-replace`), xoay cành tự nhiên ±25°, loại bỏ hoàn toàn cơ chế kéo thả tự do cũ.
- **Hoàn thiện sản phẩm**: Thẻ hoàn thiện với giấy gói kraft/cream, ruy-băng sage/rose kèm tương tác thắt nơ 3 bước chống bấm đúp, và 4 mẫu thiệp chúc cảm xúc.
- **Hệ thống lưu trữ Schema 2**: Tích hợp `migrateSave` tự động nâng cấp dữ liệu từ Schema 0/1, bảo toàn lịch sử đơn hàng, cờ sự kiện và cấu trúc `npcProgress` hoàn chỉnh. Bản nháp cắm hoa session-only có thông báo rõ ràng.
- **Kiểm thử tự động & Tích hợp**: Toàn bộ hệ thống vượt qua bộ kiểm thử tự động, kiểm tra tính toàn vẹn nội dung Zod và kịch bản MCP.
## Nguồn nghiên cứu

- Emily Short, *Beyond Branching: Quality-Based, Salience-Based, and Waypoint Narrative Structures*: https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/
- Failbetter Games, *Narrative Snippets: Parsimony*: https://www.failbettergames.com/news/narrative-snippets-parsimony-2
- Game Developer, *A breakdown of the drink choice mechanic in Sukeban games’ VA-11 HALL-A*: https://www.gamedeveloper.com/design/a-breakdown-of-the-drink-choice-mechanic-in-sukeban-games-i-va-11-hall-a-i-
- FiftyFlowers, *Bouquet Ribbon Guide*: https://fiftyflowers.com/blogs/wedding-flowers/how-to-wrap-a-bouquet-with-ribbon-a-step-by-step-guide
- Bloom & Song, *Florist’s Guide to Knot Types*: https://www.bloomandsong.com/hk-flower-delivery-locations/florists-guide-to-knot-types-for-tying-a-bouquet
- Ode à la Rose, *Messages to Write When Sending Flowers*: https://www.odealarose.com/blog/message-when-sending-flowers
- Kremp Florist, *Etiquette for Sending Flowers*: https://www.kremp.com/blogs/the-kremp-florist-blog/etiquette-sending-flowers-dos-and-donts
