# Art direction — Hoa Tích

## Guard và nguồn chuẩn
Chỉ áp dụng khi repo có `PRODUCT.md` định danh **Hoa Tích** và các source asset/content tương ứng. Xác minh project root bằng tools, không hardcode đường dẫn máy. Đọc `PRODUCT.md`, `DESIGN.md`, rồi mở reference ảnh thực tế trước tạo prompt. Đường project trong tài liệu tính từ repo root, không từ thư mục skill.

Nguồn: `src/game/content/flowers.ts`, `flowerAssets.ts`, `characterAssets.ts`, `customers.ts`; ảnh nguồn `asset-source/characters/`; ảnh nền `public/assets/generated/shop/`; provenance `asset-source/generated/ASSET_PROMPTS.md`. Danh sách/file thay đổi được: kiểm tra hiện tại, không suy từ tên hoặc snapshot cũ.

## Style chung
Minh họa game2D giản lược, nét graphite nhám, contour không quá trơn, mảng màu lì opaque, bóng gọn, không sợi tóc/da tả thực, không glossy3D. Palette nền ngày kem–olive, đêm tím xám–lam khói theo DESIGN; không ép màu này lên mọi cánh hoa/trang phục. Nguồn ảnh thật quyết định mức chi tiết từng loại; UI giấy/mộc bản không đồng nghĩa mọi sprite phải có nền giấy.

Prompt style dùng lại:
```text
Hand-drawn 2D storybook game illustration, coarse dry graphite contours, simple graphic shapes, opaque muted matte color fills, sparse restrained flat shadows, modest pencil grain. No photorealistic anatomy, glossy 3D, airbrushed portrait or elaborate wet watercolor washes.
```
Thay đổi style trực tiếp từ user phải ghi scope trong brief; không để một worker tự đổi style cả bộ.

## Identity authority
| Family | Reference gốc / đặc điểm cần kiểm |
|---|---|
| player | `asset-source/characters/player/01.png`–`03.png`: tóc bob xanh chàm vểnh, băng đô/hoa trắng, mắt hổ phách, áo ghi-lê olive, tạp dề ngang eo, bình xịt xanh |
| customer-one | `asset-source/characters/customer-one/01.png`, `02.png`: nam tóc ngắn charcoal, mắt xanh, sơ mi trắng, len navy khoác vai; không dùng prompt nữ cũ |
| passerby | `asset-source/characters/passerby/01.png`, `02.png`: nữ trung niên tóc bob uốn, áo hồng, vòng ngọc xanh, chống hông; không dùng áo bà ba generic |
| NPC mới | Source mô tả vai trò không xác định toàn bộ wardrobe. Ghi phần thiết kế tự chọn; neutral candidate phải review rồi mới đóng băng path/hash làm master |

File trong `public/` hoặc nhật ký HTTP200 không tự là approved master. Các thử nghiệm trước có viền trắng/đốm màu; phải xem ảnh và review lại, không kế thừa tuyên bố sạch alpha.

## Theo loại
- Hoa: canonical ID/species/color từ source, mô tả cấu trúc cánh/thân/lá theo reference. Không tự bịa lore, ID hoặc loài. Tách hướng thân, hướng mặt bông, góc nhìn; nhiều góc có thể kết hợp rotation runtime hiện có, không sửa renderer trong batch.
- Character/flower/element isolated: thường RGBA có vùng trong suốt; camera/anchor/crop theo brief.
- Background: nền kín RGB hoặc RGBA opaque, đủ khung; không bắt có alpha0. Giữ camera/layout/vùng bàn cắm trống khi đổi ca, không thêm khách/UI/chữ.
- UI icon không lấy nguyên sprite đồ vật thu nhỏ: brief phải có kích thước hiển thị, silhouette, padding và contrast context.

Skill chỉ tạo asset/prompt; đổi luật/content/caller tuân thủ Graphify/MCP/references và verification của repo như task riêng. Không coi tạo WebP là đã tích hợp gameplay.
