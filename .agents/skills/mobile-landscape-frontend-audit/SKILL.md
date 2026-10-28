---
name: mobile-landscape-frontend-audit
description: Use when auditing, inspecting, testing, or fixing frontend UI and responsiveness on mobile devices for Hoa Tich, especially when checking layout, crafting table, dialogs, or control buttons.
---

# Mobile Landscape Frontend Audit

## Tổng quan & Nguyên tắc cốt lõi

Hoa Tích là game kết hợp hình ảnh, cốt truyện và tương tác cắm hoa tại quầy (crafting table). Giao diện được thiết kế xoay quanh tỉ lệ ngang (landscape): quầy làm hoa ở trung tâm, khách hàng và nhân vật đứng hai bên, thanh công cụ và khay hoa trải rộng theo chiều ngang.

**Quy tắc bất biến:**
```
KHI AUDIT/DEBUG/FIX FRONTEND TRÊN MOBILE:
BẮT BUỘC DÙNG MÀN HÌNH NGANG (LANDSCAPE: WIDTH > HEIGHT)
TUYỆT ĐỐI KHÔNG DÙNG MÀN HÌNH DỌC (PORTRAIT: WIDTH < HEIGHT)
```

Kiểm tra bằng màn hình dọc (như `390x844`) sẽ bóp nghẹt quầy cắm hoa, làm đè chồng hàng nút thao tác (`Bình hoa`, `Cành trước`, `Cành tiếp`, `Xoay`, `Trao hoa`) và đẩy nhân vật ra khỏi tầm nhìn.

---

## Bảng kích thước chuẩn (Standard Viewports)

Khi kiểm thử giao diện mobile, luôn dùng kích thước landscape tương ứng:

| Thiết bị mô phỏng | Sai (Portrait) | **Đúng (Landscape)** | Tỉ lệ | Mục đích kiểm thử |
|---|---|---|---|---|
| **iPhone chuẩn (12/13/14/15)** | `390x844` | **`844x390`** | ~19.5:9 | Baseline chuẩn cho thiết bị iOS |
| **iPhone Plus / Pro Max** | `430x932` | **`932x430`** | ~19.5:9 | Màn hình lớn iOS |
| **iPhone SE / Compact** | `375x667` | **`667x375`** | 16:9 | Baseline màn hình nhỏ, kiểm tra tràn viền nút |
| **Android phổ biến** | `360x800` | **`800x360`** | 20:9 | Baseline Android tầm trung |
| **Android cao cấp (Pixel/Galaxy)**| `412x915` | **`915x412`** | ~20:9 | Android tỉ lệ dài |

---

## Cấu hình công cụ kiểm thử

### 1. Chrome DevTools MCP Tool
Khi dùng DevTools MCP để resize và chụp snapshot/screenshot:

```json
// Bước 1: Đổi kích thước cửa sổ sang landscape (VD: iPhone 13/14)
resize_page({
  "width": 844,
  "height": 390
})

// Bước 2: Thiết lập thông số mô phỏng thiết bị di động
emulate({
  "viewport": {
    "width": 844,
    "height": 390,
    "deviceScaleFactor": 3,
    "isMobile": true,
    "hasTouch": true,
    "isLandscape": true
  }
})
```

### 2. Browser Tab / JavaScript Runtime
Nếu chạy script kiểm thử trong browser:

```javascript
// Kiểm tra viewport hiện tại đã đúng landscape chưa
const isLandscape = window.innerWidth > window.innerHeight;
if (!isLandscape) {
  console.error(`LỖI: Viewport đang là portrait (${window.innerWidth}x${window.innerHeight}). Phải đổi sang landscape!`);
}
```

### 3. Playwright / Puppeteer
```typescript
await page.setViewportSize({ width: 844, height: 390 });
```

---

## Checklist Audit Frontend Giao Diện Quầy Cắm Hoa

Mỗi lần audit frontend mobile landscape, kiểm tra đủ 5 khu vực:

- [ ] **1. Header & Menu trên:** Các nút điều khiển (`Sơ đồ`, `Cài đặt`, `Hướng dẫn`, `Chuyển buổi`, `Lưu`, `Chơi lại`) nằm gọn 1 hàng, không che nền cảnh quan.
- [ ] **2. Nhân vật & Quầy lễ tân:** Nhân vật bên trái và khách bên phải hiển thị cân đối 2 bên bàn thao tác, không bị co giật tỉ lệ.
- [ ] **3. Bàn thao tác cắm hoa (Crafting Canvas):** Nằm chính giữa, không bị che bởi khay hoa bên dưới.
- [ ] **4. Khay hoa (Flower Tray):** Thẻ hoa hiển thị đủ tên, ý nghĩa, số lượng còn lại; lướt ngang mượt mà.
- [ ] **5. Hàng phím thao tác (Action Controls):**
  - Các nút: `[Chọn bình]`, `Cành trước`, `Cành tiếp`, `Xoay trái`, `Xoay phải`, `Lên lớp`, `Xuống lớp`, `Xóa cành`, `Hoàn tác`, `Xóa hết`, `Trao hoa`.
  - Không bị đè chữ lên nhau.
  - Chiều cao chạm cảm ứng tối thiểu `44px` (Apple Human Interface Guidelines).
  - Nút `Trao hoa` và `Hoàn tác` nổi bật, không bị thanh điều hướng ảo của điện thoại che mất (safe area inset).

---

## Bảng chống ngụy biện (Rationalization Counters)

| Ngụy biện thường gặp | Sự thật & Hành động |
|---|---|
| "Điện thoại cầm dọc là phổ biến nhất nên cứ test dọc." | Game dạng visual novel & crafting quầy lễ tân như Hoa Tích tối ưu trải nghiệm ngang. Audit phải phản ánh đúng cách game hiển thị. |
| "Resize 390x844 rồi xoay sau." | Sai ngay từ lúc đo layout DOM và CSS query. Phải set `width: 844, height: 390` ngay từ đầu. |
| "Thấy vỡ giao diện dọc thì code lại CSS cho vừa màn dọc." | Lãng phí công sức làm hỏng bố cục ngang gốc. Hãy đảm bảo giao diện khóa hướng ngang hoặc cảnh báo xoay ngang (`Please rotate your device`). |
| "Màn hình ngang 667x375 quá hẹp nút bị nhảy hàng, bỏ qua." | 667x375 là mốc kiểm tra cực tốt cho responsive wrap; nút phải wrap 2 hàng gọn gàng hoặc có scrollbar ngang, không được tràn đè lên canvas. |

---

## Dấu hiệu cảnh báo đỏ (Red Flags)

Dừng lại ngay nếu phát hiện:
- Ảnh chụp màn hình có thông số `Dimensions: 390x844` hoặc bất kỳ kích thước nào có `width < height`.
- Thanh nút bấm bị đè lấn 4-5 tầng che mất bình hoa trên bàn.
- Code kiểm thử dùng preset mobile mặc định mà quên gán `isLandscape: true` hoặc không đảo chiều dài/rộng.
