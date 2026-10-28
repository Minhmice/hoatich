# Thiết kế Kiến trúc Game 3D (Three.js) & Bộ Trang Debug Cô lập

- **Ngày lập:** 2026-10-25
- **Trạng thái:** Đã được người dùng phê duyệt; triển khai theo kế hoạch cùng ngày.
- **Quy mô:** Dự án (Project)
- **Dự án liên quan:** Hoa Tích (`hoatich`)

---

## 1. Bối cảnh & Mục đích (Intent & Why)

Trò chơi *Hoa Tích* hiện tại sử dụng Phaser 3.90 để dựng đồ họa 2D phẳng trong một Scene duy nhất (`ShopScene.ts`). Mặc dù toàn bộ logic nghiệp vụ (State machine, Bouquet evaluator, Save repository, Content registry, DOM UI panels) đã được thiết kế hoàn toàn không phụ thuộc vào Phaser, việc gom toàn bộ hiển thị, input và tương tác vào một scene 2D gây khó khăn khi muốn:
1. Đưa không gian tiệm hoa lên chiều sâu 3D (ánh sáng, đổ bóng, góc nhìn phối cảnh diorama, xoay và xếp lớp cành hoa trên không gian 3 chiều).
2. Kiểm thử và gỡ lỗi (debug) độc lập từng phân hệ riêng biệt (thoại, cắm hoa, lưu trữ, âm thanh) mà không cần chơi tuần tự toàn bộ luồng game.

Thiết kế này xác định kiến trúc chuyển đổi lớp hiển thị sang Three.js theo mô hình **Hybrid 2.5D Diorama**, đồng thời thiết lập hệ thống **Vite Multi-Page App (MPA)** với các trang debug HTML chuyên biệt chạy độc lập.

---

## 2. Mục tiêu, Phi mục tiêu & Chống mục tiêu

### Mục tiêu (Goals)
- **Tách rời tuyệt đối Model & View:** Giữ nguyên 100% logic nghiệp vụ cốt lõi trong `src/game/` (State, Reducer, Content, Save, Bouquet, UI panels), bảo đảm không có bất kỳ import nào từ Three.js lọt vào tầng logic.
- **Dựng lớp hiển thị Three.js 2.5D Diorama:** Phòng tiệm hoa, bàn cắm hoa, ánh sáng ca ngày/ca tối và bóng đổ theo không gian 3D; hoa và nhân vật được thể hiện dưới dạng thẻ/plane sprite 3D sắc nét từ asset 2D hiện có.
- **Hệ thống Multi-Page Debug của Vite:** Cấu hình `vite.config.ts` để sinh các trang debug HTML độc lập trong `debug/`:
  - `debug/index.html`: Bảng điều khiển trung tâm (Hub) liên kết các trang debug.
  - `debug/bouquet3d.html`: Môi trường kiểm thử bàn cắm hoa 3D (raycast, drag-drop, xoay, lớp z-index, ánh sáng).
  - `debug/dialogue.html`: Trình duyệt và chạy thử 29 node hội thoại, cảm xúc nhân vật và hiệu ứng rẽ nhánh.
  - `debug/state.html`: Bảng điều khiển state, kho hoa, chuyển ca sống/chết và tiêm/khôi phục save.
  - `debug/audio.html`: Trình kiểm thử Web Audio synth (chuyển đổi tần số drone nền, sfx cắm/giao hoa).
- **Bảo toàn chất lượng:** 100% test suite hiện tại (72 tests) tiếp tục chạy đạt mà không bị sửa đổi ngoài phạm vi.

### Phi mục tiêu (Non-goals)
- Không dựng full 3D mesh đa giác phức tạp cho nhân vật hoặc hoa (giữ asset 2D chất lượng cao map lên thẻ 3D).
- Không thay đổi luật chơi hay cơ chế chấm điểm hoa (`evaluateBouquet`).
- Không xuất bản các trang debug ra môi trường công khai của người chơi (chỉ kích hoạt trong môi trường phát triển / test).

### Chống mục tiêu (Anti-goals)
- Không viết lại hay sao chép (duplicate) logic game vào các trang debug. Mọi trang debug phải dùng trực tiếp code thật từ `src/game/`.
- Không tạo một "God class" 3D tương tự `ShopScene.ts`; lớp 3D phải chia nhỏ theo trách nhiệm (Environment, Workstation, Interaction, Lighting).

---

## 3. Ràng buộc kỹ thuật (Constraints)

- **Runtime & Build:** Vite 6.3.1, TypeScript 5.7.2 (`strict: true`), Node ESNext module resolution.
- **Thư viện 3D:** Three.js (`three` và `@types/three`).
- **Tương thích UI:** Toàn bộ UI panels (`DialoguePanel`, `JournalPanel`, `AccessibilitySettings`) tiếp tục render dạng HTML DOM overlay phủ lên canvas 3D.
- **Chính sách âm thanh:** Tuân thủ trình duyệt (chỉ mở Web Audio Context sau cử chỉ người dùng).

---

## 4. Các phương án kiến trúc & Lựa chọn (Approaches)

### A. Phương án định dạng hiển thị 3D

| Tiêu chí | Phương án A: Hybrid 2.5D Diorama (ĐƯỢC CHỌN) | Phương án B: Full 3D Mesh (.glb) |
|---|---|---|
| **Mô tả** | Phòng, bàn, camera, ánh sáng 3D thật. Hoa và nhân vật dùng thẻ phẳng (`PlaneGeometry` + alpha texture). | Toàn bộ hoa, nhân vật, đạo cụ dựng bằng 3D mesh polygon trong Blender. |
| **Ưu điểm** | Tận dụng ngay 17 asset vẽ tay sẵn có; lên 3D ngay lập tức; không nghẽn khâu dựng hình. | Chiều sâu hình học chi tiết ở mọi góc quay 360 độ. |
| **Nhược điểm** | Nhân vật và hoa phẳng khi nhìn từ góc nghiêng quá hẹp (cần khóa góc camera diorama). | Tốn thời gian làm asset 3D; dung lượng tải lớn; nguy cơ mất chất mỹ thuật nguyên bản. |
| **Lý do chọn** | Phù hợp tuyệt đối với phong cách mỹ thuật narrative của game và tài nguyên hiện tại. |

### B. Phương án kiến trúc trang Debug

| Tiêu chí | Phương án 1: Query Routing (`?debug=...`) | Phương án 2: Vite Multi-Page (ĐƯỢC CHỌN) |
|---|---|---|
| **Mô tả** | 1 file `index.html`, `main.ts` kiểm tra URL search param để tải harness. | Cấu hình `rollupOptions.input` tạo từng file `.html` riêng trong thư mục `debug/`. |
| **Ưu điểm** | Cấu hình Vite đơn giản, không cần thêm file HTML. | Cô lập hoàn toàn DOM, CSS, script bundle; mở độc lập nhiều tab không xung đột. |
| **Nhược điểm** | Dễ rò rỉ CSS hoặc listener giữa chế độ game chính và debug harness. | Cần thêm entrypoint HTML và cấu hình build Rollup. |
| **Lý do chọn** | Người dùng đã chọn phương án tách file HTML riêng biệt để bảo đảm tính độc lập tối đa. |

---

## 5. Chi tiết triển khai đã quyết định (The Decided "How")

### 5.1. Cấu trúc thư mục mục tiêu

```
hoatich/
├── index.html                           # Game chính
├── debug/                               # Thư mục trang debug (Multi-Page)
│   ├── index.html                       # Hub chọn trang debug
│   ├── bouquet3d.html                   # Debug cắm hoa 3D
│   ├── dialogue.html                    # Debug hội thoại
│   ├── state.html                       # Debug state & save
│   └── audio.html                       # Debug synth audio
│
├── vite.config.ts                       # Cấu hình Rollup inputs cho MPA
│
└── src/
    ├── game/                            # Core Logic (Engine-agnostic, 0 Three.js)
    │   ├── state/                       # GameState, stateReducer
    │   ├── save/                        # SaveRepository, migrations, browserSaveRepository
    │   ├── bouquet/                     # BouquetModel, evaluateBouquet
    │   ├── content/                     # flowers, orders, customers, dialogue, assets
    │   ├── ui/                          # DialoguePanel, JournalPanel, AccessibilitySettings
    │   ├── audio.ts                     # AudioManager
    │   └── GameSession.ts               # Orchestrator
    │
    ├── render3d/                        # Lớp hiển thị Three.js (Thay thế scenes/ cũ)
    │   ├── ThreeShopView.ts             # Quản lý vòng đời WebGLRenderer, Scene, Animation loop
    │   ├── DioramaCamera.ts             # Camera isometric phối cảnh cố định
    │   ├── DioramaLighting.ts           # Ánh sáng chuyển đổi ca sống / ca chết
    │   ├── RoomEnvironment.ts           # Phòng tiệm hoa 3D, sàn, tường, bàn cắm hoa
    │   ├── FlowerCard3D.ts              # Thẻ hoa 3D (PlaneGeometry + Texture + Depth Offset)
    │   ├── CharacterBillboard.ts        # Chân dung nhân vật 3D trên bàn quầy
    │   └── WorkstationInteraction.ts    # Raycaster chuột (chọn, kéo, xoay cành hoa trên bàn)
    │
    └── debug/                           # Code khởi tạo riêng cho từng trang debug
        ├── hub.ts                       # Script cho debug/index.html
        ├── bouquet3dPage.ts             # Script cho debug/bouquet3d.html
        ├── dialoguePage.ts              # Script cho debug/dialogue.html
        ├── statePage.ts                 # Script cho debug/state.html
        └── audioPage.ts                 # Script cho debug/audio.html
```

### 5.2. Cấu hình Vite Multi-Page App (`vite.config.ts`)

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig(({ mode }) => ({
  server: { host: '127.0.0.1', port: 5173 },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: entry('./index.html'),
        ...(mode === 'debug' ? {
          debugHub: entry('./debug/index.html'),
          debugBouquet3D: entry('./debug/bouquet3d.html'),
          debugDialogue: entry('./debug/dialogue.html'),
          debugState: entry('./debug/state.html'),
          debugAudio: entry('./debug/audio.html'),
        } : {}),
      },
    },
  },
}));
```

### 5.3. Các quy chuẩn kỹ thuật cốt lõi (Technical Contracts)

1. **Hệ tọa độ bàn cắm hoa (Bouquet Coordinates Contract):**
   - `BouquetItem` tiếp tục giữ `{ id, flowerId, position: { x, y }, rotation, layer }`; rotation theo độ. Không đổi shape model.
   - Không sửa đổi schema hay logic chấm điểm của `evaluateBouquet()`.
   - Lớp `WorkstationInteraction.ts` chịu trách nhiệm chiếu (unproject) tia raycast từ chuột xuống mặt phẳng bàn 3D (mặt phẳng $Y = 0$, giới hạn theo trục $X$ và $Z$), sau đó ánh xạ tỉ lệ tương ứng thành tọa độ $(x, y)$ vào `BouquetModel`.

2. **Quyền sở hữu luồng điều phối (Orchestration & View Lifecycle):**
   - `ThreeShopView` là **Passive View**: nhận session/model, không tự tạo hay ghi save. Controller gọi sync sau commands; không thêm subscription API vào session.
   - `src/main.ts` (hoặc module `createGame.ts`) đóng vai trò Controller: khởi tạo `SaveRepository`, nạp `GameSession`, tạo `AudioManager`, mount DOM UI overlays, và truyền `session` vào `ThreeShopView`.
   - Nhờ đó, các trang debug (`debug/*.html`) có thể dễ dàng khởi tạo `GameSession` giả lập (mock state) rồi truyền vào `ThreeShopView` mà không bị ràng buộc luồng khởi động mặc định.

3. **Phân luồng sự kiện chuột giữa DOM UI và 3D Canvas (Input Routing):**
   - Lớp bọc DOM UI (`#ui-container`) sử dụng `pointer-events: none`. Các thành phần tương tác (nút bấm toolbar, bảng lựa chọn hội thoại, menu cài đặt) được bật `pointer-events: auto`.
   - Bộ lắng nghe tương tác 3D (`WorkstationInteraction`) gắn trực tiếp vào phần tử `<canvas>` của Three.js và tự động tạm ngưng raycasting khi cờ `isModalOpen` đang bật.

4. **Góc nhìn camera & Không gian nền (Fixed Diorama & Backdrop Quad):**
   - Camera đặt góc nhìn phối cảnh diorama cố định (`DioramaCamera.ts`), không bật OrbitControls xoay tự do.
   - Nền phòng (`RoomEnvironment.ts`) sử dụng quad phẳng gán texture `shop-day.png` / `shop-evening.png` đặt vuông góc trục nhìn camera phía sau bàn cắm hoa 3D, giữ nguyên vẹn 100% nét vẽ mỹ thuật gốc và tự động chuyển texture theo ca ngày/tối.

   - Khóa góc nhìn không tự bảo đảm ảnh không méo/cắt: giữ đúng tỉ lệ texture, kiểm chứng framing ở desktop và màn hình hẹp. Mặt bàn nằm trên XZ nên `layer` nâng theo Y (pháp tuyến mặt bàn), không dịch Z.

### 5.4. Đặc tả 4 Trang Debug Chuyên biệt

#### 1. Trang Debug Cắm hoa 3D (`debug/bouquet3d.html`)
- **Mục đích:** Kiểm thử dựng hình Three.js, raycast chọn hoa, xoay cành, thứ tự lớp theo chiều cao Y, kéo thả trên mặt bàn, điều chỉnh ánh sáng ca sống/chết.
- **Dữ liệu đầu vào:** Tự do thêm bất kỳ loài hoa nào từ `flowers.ts` vào bàn cắm hoa mà không bị ràng buộc bởi inventory.
- **Công cụ điều khiển:**
  - Bảng nút bấm thêm 10 loài hoa.
  - Phím tắt / Slider: Xoay cành (-180° đến 180°), nâng/hạ layer, xóa cành đang chọn.
  - Nút chuyển chế độ ánh sáng: Day (ấm áp, 5500K) $\leftrightarrow$ Evening/Dead (huyền bí, xanh tím, 7500K + bóng ma).
  - Tích hợp hàm `evaluateBouquet()` kiểm tra tức thì điểm của bó hoa hiện tại với cả 4 đơn hàng.

#### 2. Trang Debug Hội thoại (`debug/dialogue.html`)
- **Mục đích:** Kiểm tra toàn bộ 29 node thoại, hiển thị biểu cảm nhân vật, tốc độ gõ chữ typewriter, các lựa chọn rẽ nhánh có điều kiện flag.
- **Dữ liệu đầu vào:** Nạp `dialogues` từ `src/game/content/dialogue.ts`.
- **Công cụ điều khiển:**
  - Dropdown chọn trực tiếp node thoại bất kỳ (VD: `node_bac_ba_intro`, `node_linh_hon_thi_si_start`).
  - Danh sách toggle bật/tắt cờ (`flags`) để thử nghiệm các lựa chọn bị khóa.
  - Slider chỉnh `textSpeed` (chậm, vừa, nhanh, tức thì).
  - Nút Reset hội thoại.

#### 3. Trang Debug State & Lưu trữ (`debug/state.html`)
- **Mục đích:** Theo dõi trực quan state JSON của game, tua nhanh tiến trình, can thiệp kho hoa, kiểm thử phục hồi lỗi lưu trữ.
- **Dữ liệu đầu vào:** `GameState` qua `browserSaveRepository` thật với storage Map sandbox được tiêm vào; không đọc/ghi/xóa localStorage hoặc onboarding keys người chơi. Import JSON phải qua migrations/validation.
- **Công cụ điều khiển:**
  - JSON viewer hiển thị trực tiếp `session.state`.
  - Nút hành động:
    - Nhảy ca: Chuyển sống $\to$ chết $\to$ ngày hôm sau.
    - Đầy kho hoa: Đặt số lượng tất cả loài hoa lên 99 cành.
    - Mở khóa toàn bộ hoa âm giới.
    - Xóa Save (`clear`).
    - Nạp Save lỗi / schema cũ để kiểm tra cơ chế tự động khôi phục từ bản backup (`validateSave`, `migrateSave`).

#### 4. Trang Debug Âm thanh Synth (`debug/audio.html`)
- **Mục đích:** Kiểm thử synthesizer Web Audio thuần không bị phụ thuộc vào thao tác gameplay.
- **Công cụ điều khiển:**
  - Nút kích hoạt AudioContext (vượt qua chính sách autoplay).
  - Nút phát hiệu ứng âm thanh: `playPlacementSfx()`, `playDeliverySfx(true)`, `playDeliverySfx(false)`.
  - Nút chuyển trạng thái môi trường: `setShift('living')` (drone ấm F3/A3) $\leftrightarrow$ `setShift('dead')` (drone trầm lạnh, bộ lọc lowpass sâu).
  - Sliders điều chỉnh âm lượng tổng, âm lượng nhạc, âm lượng hiệu ứng.

---

## 6. Phần giao cho người thực hiện (What's Left to the Builder)

1. **Thông số hình học & Camera Three.js:**
   - Tự do thiết lập camera FOV (khuyên dùng 45 độ, góc nhìn nghiêng isometric cố định nhìn xuống mặt bàn).
   - Tọa độ bàn cắm hoa (ví dụ: `y = 0`, mặt bàn kích thước `8 x 5` đơn vị Three.js).
2. **Chất liệu 3D cho thẻ hoa (Materials):**
   - Lựa chọn giữa `MeshBasicMaterial` (không bị ảnh hưởng bóng sáng, màu gốc phẳng) hoặc `MeshStandardMaterial` / `MeshLambertMaterial` (nhận ánh sáng và bóng đổ từ phòng diorama) với `alphaTest: 0.1` và `transparent: true`.
3. **Thư viện UI điều khiển cho Debug Harness:**
   - Người thực hiện có thể dùng HTML/CSS native đơn giản hoặc thư viện nhỏ gọn (như `lil-gui` nếu cần tinh chỉnh slider tọa độ ánh sáng nhanh).
4. **Chiến lược chuyển tiếp từ Phaser:**
   - Giữ nguyên thư mục `src/game/scenes/` làm tài liệu tham khảo trong giai đoạn dựng `render3d/`, sau khi lớp Three.js hoàn thiện và kiểm chứng xong thì tháo gỡ an toàn.

---

## 7. Rủi ro & Kế hoạch kiểm chứng

| Rủi ro | Giải pháp kiểm chứng |
|---|---|
| **Lệch logic giữa Game và Trang Debug** | Các trang debug bắt buộc import và gọi trực tiếp `GameSession`, `evaluateBouquet`, `reduceGameState`. Không tự viết mock logic. |
| **Texture 2D bị răng cưa / viền đen khi đưa vào Three.js** | Thiết lập đúng `texture.colorSpace = THREE.SRGBColorSpace`, `alphaTest = 0.5` hoặc cấu hình `blending` chuẩn. |
| **Tốn bộ nhớ do không giải phóng WebGL tài nguyên khi đóng trang** | Viết hàm `dispose()` chuẩn hóa cho Geometries, Materials, Textures trong `ThreeShopView`. |
| **Xung đột build Vite khi thêm nhiều file HTML** | Build thường chỉ chứa game; `build:debug` xuất cả game và năm HTML debug vào `dist-debug`. Không phát hành debug output công khai. |
| **Gãy test suite hiện tại** | Chạy nguyên module bị ảnh hưởng và full suite sau tích hợp; bảo toàn mọi test hợp lệ, không cố định số lượng 72 của khảo sát cũ. |
