# Hoa Tích — chuyển Next.js static export và React UI

## Trạng thái

- Ngày: 2026-10-25. Chờ duyệt thiết kế chi tiết trước khi triển khai.
- Người dùng đã chọn: chỉ phát triển hệ thống/nội dung game; bỏ Vite và các HTML entry viết tay; Next.js + React UI; giữ Three.js và game core.
- Quy mô: chuyển nền tảng ứng dụng và toàn bộ UI hiện hữu, không chỉ bọc controller cũ trong React.
- Các quyết định cụ thể dưới đây là đề xuất của người thiết kế. Không thêm tính năng gameplay mới.

## 1. Mục tiêu và giới hạn

Mục tiêu: thêm màn hình, panel và hệ thống game mà không tiếp tục mở rộng một controller dựng DOM thủ công; giữ nguyên nội dung, luật chơi, điều khiển, giao diện hiện tại và save cũ.

Không làm: backend, tài khoản, cloud save, dashboard, CMS, database, multiplayer, thay renderer bằng React Three Fiber, thay narrative engine bằng Ink, đổi package manager, monorepo hoặc thêm state library.

Không hứa: Next.js tự làm scene nhanh hơn, tự làm game offline hoặc giúp nội dung tự mở rộng. Static export không cần server khi chơi nhưng không tự cache offline; không thêm service worker trong chuyển đổi này.

Next.js vẫn sinh HTML, nhưng tác giả chỉ viết React components/routes. Không còn index.html và debug/*.html làm đầu vào ứng dụng.

## 2. Các phương án

| Phương án | Được | Mất/đánh đổi |
| --- | --- | --- |
| React + Vite | Ít thay đổi build, đủ UI lớn | Người dùng đã yêu cầu bỏ Vite |
| Next.js + React + Three.js hiện có | Routing/component rõ, giữ công sức domain/renderer | Cần ranh giới browser-only, lifecycle React và cấu hình static export |
| Đổi cả framework và renderer sang R3F | Mô hình scene React thống nhất | Viết lại scene/input không cần thiết, tăng rủi ro hồi quy |

Chọn phương án 2 theo người dùng. Chuyển sạch: bỏ code UI cũ sau khi mọi caller được migrate, không giữ hai hệ UI chạy song song.

## 3. Hiện trạng cần bảo toàn

- `src/game/createGame.ts` tạo repository → load save → GameSession → AudioManager → ShopController; báo lỗi và dispose khi mount lỗi.
- `src/game/ShopController.ts` điều phối keyboard, bouquet, modal, thao tác game, thông báo và dựng DOM. `ShopOverlay` sở hữu DialoguePanel, JournalPanel, AccessibilitySettings, OnboardingOverlay.
- `src/render3d/ThreeShopView.ts` sở hữu canvas, renderer, resize observer, input và resources; có mount/sync/dispose.
- GameSession, stateReducer, BouquetModel, evaluator, content IDs và save schema là logic dùng chung với MCP; giữ nguyên hành vi.
- Save primary `hoatich.save.v1`, backup `hoatich.save.backup`. Cơ chế lỗi/khôi phục phải giữ.
- Có debug hub, thoại/UI, audio, bouquet3d, state/save sandbox. Debug state dùng storage trong bộ nhớ, không được chạm save người chơi.
- Giao diện giấy/ngày-đêm, font serif, onboarding spotlight, bàn phím và reduced motion theo PRODUCT.md/DESIGN.md; không redesign.

## 4. Next.js shell và xuất bản

- Next.js stable App Router, React/React DOM tương thích peer dependencies, TypeScript; pin phiên bản sau khi kiểm tra registry và engine requirement, dùng Node 24 hoạt động trên máy.
- `src/app/layout.tsx`: lang=vi, metadata, import CSS toàn cục. `src/app/page.tsx`: điểm vào game.
- `GameClient` là Client Component được nạp qua client wrapper với dynamic import `ssr:false`. Mọi GameSession khởi tạo theo save, AudioManager, WebGLRenderer, localStorage, window/document chỉ chạy sau khi client mount, không ở module scope hoặc server render.
- Next config dùng `output:'export'`, trailingSlash=true để static host phục vụ thư mục. Giữ URL asset `/assets/...` và public/; không yêu cầu next/image optimization server, không thêm remote fonts/network dependency.
- Giữ dev origin mặc định `http://127.0.0.1:5173` để save localStorage hiện có còn truy cập được. Deploy giữ origin cũ; đổi domain/port là storage khác và không thể tự đọc save origin khác.
- `npm run dev`: Next dev. `npm run build`: typecheck, content validation và Next static export → out/. `npm run build:debug`: bản game + phòng thử trong artifact riêng; không ghi đè release artifact.
- `npm test` tiếp tục Vitest standalone; Vite không còn direct dependency/build/dev/config, nhưng Vitest hiện dùng Vite nội bộ là dependency test, không phải app stack. Không đổi test runner chỉ để xóa một transitive package.
- Không dùng `next start` cho static export. Tài liệu ghi cách phục vụ out/ bằng static HTTP server.

## 5. Quyền sở hữu state và hành động

- GameSession tiếp tục là nguồn sự thật gameplay; BouquetModel tiếp tục là nguồn sự thật cắm hoa. Không copy inventory/flags/tiến trình thành một store React độc lập.
- Tách phần điều phối khỏi DOM thành GameRuntime hoặc hook/controller nhỏ chỉ chứa session, bouquet, selection, modal, audio và lifecycle. Public actions: chọn thoại, continue, thêm/chọn/move/rotate/reorder/remove/undo/clear bouquet, deliver, advanceShift, settings, save, reset.
- React nhận snapshot theo revision/subscription hoặc state update sau action; snapshot phải ổn định giữa hai thay đổi. Không deep-clone toàn state từng frame.
- Pointer drag và renderer frame loop không dùng React setState mỗi frame. Cập nhật Three.js trực tiếp; chỉ publish thay đổi cần thiết cho selected item/controls và trạng thái đã commit.
- Mọi action UI giữ preconditions hiện hữu: dialogue/modal/onboarding chặn thao tác tương ứng, kho/unlock được tôn trọng, advanceShift sau hoàn tất ca. Không thay rule outcomes hay tiện thể nới điều kiện.
- Auto-start đơn tiếp theo vẫn diễn ra sau bước chuyển trạng thái như hiện tại. Không chạy mutation trong React render.
- Game runtime không chứa JSX/DOM panels; renderer không tạo React UI; components không tự ghi trực tiếp private state của session.

## 6. React UI và hành vi cần migrate

Tách components theo trách nhiệm thực: GameShell, GameHeader/Toolbar, FlowerCatalog, BouquetControls, DialoguePanel, JournalDialog, SettingsDialog, OnboardingOverlay, Notice và recovery/completion dialogs. Có thể gộp components nhỏ cùng file; không framework/plugin registry.

- Giữ text/content, CSS tokens/classes khi hữu ích, portrait assets, mode ngày/đêm và responsive layout; không đổi visual identity.
- Dialogue: typewriter, show-all/continue, choices có điều kiện; Space/Enter, số, arrows, focus; reset timer theo node, dừng/suspend khi modal/onboarding, cleanup khi unmount. Không announce từng ký tự dồn dập cho screen reader.
- Journal/settings: React quản lý open state; label/role/dialog, Escape, focus containment và restore focus, không tác động keyboard bàn cắm khi đang nhập form.
- Settings: tốc độ chữ, fontScale, music/sfx volume, reduced motion và các tùy chọn thực sự đang có; giữ áp dụng audio và persist đúng hành vi.
- Bouquet: danh mục hoa, chọn cành, nút và keyboard, kéo 3D, xoay, layers, xóa, undo, clear, deliver; giữ tính thống nhất selected ID sau undo/xóa.
- Onboarding: dùng lại OnboardingManager/steps/storage semantics nếu còn phù hợp; React thay DOM overlay, spotlight đo vị trí target sau layout/resize, không mất khóa input hoặc cách mở lại hướng dẫn.
- Recovery: giữ lựa chọn chơi mới hoặc giữ save hỏng; không auto-overwrite save hỏng vì React mount lại. Completion giữ chơi lại có xác nhận.
- Alerts hiển thị lỗi khởi động/tải asset/save; không hide exception hoặc fallback giả.

## 7. Lifecycle và khả năng phục hồi

- Mỗi lần mount sở hữu đúng một runtime và ThreeShopView; unmount dọn renderer, resources, pointer/keyboard listeners, resize observer, timers và audio.
- React Strict Mode/HMR có thể mount-cleanup-mount. Cleanup phải idempotent; async mount hoàn tất sau cleanup phải dispose instance cũ, không append canvas hoặc publish state muộn.
- Save load bất đồng bộ không được tạo session thứ hai ghi chồng state. Tách load/recovery khỏi render và có cancellation/liveness guard.
- Không tắt Strict Mode để giấu resource leak. Không tạo AudioContext hoặc âm thanh trước thao tác người dùng nếu browser yêu cầu unlock.
- Page navigation debug/game, reload, back/forward không để lại duplicate keyboard handlers, AudioContext hoặc canvas.

## 8. Debug routes và release isolation

Giữ đủ 5 bề mặt dưới `/debug/`: hub, `/debug/dialogue/`, `/debug/audio/`, `/debug/bouquet3d/`, `/debug/state/`; thay link .html bằng routes Next. Mọi debug UI viết React, không bọc script cũ có innerHTML.

- Thoại: chọn node/đơn, lựa chọn/flags, typewriter/settings preview theo chức năng hiện tại.
- Audio: explicit start/unlock, đổi ca/volume và SFX; cleanup khi chuyển route.
- Bouquet3d: scene và thao tác cắm/đánh giá các đơn bằng domain thật.
- State/save: nhảy đơn/ca, đầy kho, reset, JSON import/export, save/load/clear/corrupt primary/backup, legacy/future schema trong memory sandbox; validation/error messages giữ nguyên.
- Production `out/` không có debug HTML, route payload, debug JS chunks hoặc link tới công cụ. Render null/ẩn menu/notFound phía client không đủ.
- Đề xuất tách Next debug app entry trong `tools/debug-app/app/`, dùng chung React debug components và game modules ở src. Build debug riêng bằng Next project directory, có config output riêng; release src/app không import debug modules. Đây là tách build surface, không tạo backend/microservice/workspace.
- Builder có thể chọn route-exclusion mechanism khác nếu chứng minh cùng invariant bằng artifact inspection; không làm file-copy/delete source tạm thời trong build.

## 9. Nội dung, save và MCP

- Chuyển framework không thay chapter, IDs, schema thoại, hay dữ liệu TS thành CMS/Ink. Tổ chức thêm content packs là giai đoạn khác, không gài vào migration.
- SaveRepository/migrations giữ nguyên API và schemaVersion=1. Không clear localStorage khi nâng app; primary/backup/recovery vẫn chạy.
- MCP tiếp tục Node stdio riêng, không import React/Next/browser modules vào calculations/content. Đường nguồn bị đổi phải cập nhật catalog/provenance và source allowlist nếu cần; graphify build ignore thêm .next/out và debug outputs.
- Không để application bundler bundle MCP hoặc SDK/Node modules vào client.

## 10. Clean cutover và tài liệu

- Bỏ Vite config, main.ts bootstrap, vite-env.d.ts, HTML entries và các DOM UI classes/controllers bị thay thế; migrate mọi import/caller/debug use trước khi xóa. Không xóa bất cứ code ngoài phạm vi hoặc thay đổi đang được người khác thực hiện mà không reconcile.
- Giữ Three.js components, domain, assets và validation hiện tại trừ thay đổi interface tối thiểu để hỗ trợ lifecycle/subscription.
- Cập nhật scripts/dependencies/lockfile/tsconfig/ignore/README/PRODUCT mô tả stack, dev origin, release/debug artifacts và cách build. Các spec lịch sử giữ tính lịch sử, không rewrite mọi nhắc tới Vite trong tài liệu cũ.
- .omp MCP config chỉ sửa nếu đường entry thay đổi; không đổi runtime registration không cần thiết.

## 11. Tiêu chí chấp nhận và bằng chứng

1. Next dev mở game thật, không có hydration/browser API/server-render errors; cold start/reload/Strict Mode chỉ một canvas và không duplicate input.
2. Chơi intro → đơn Bác Ba → compose → delivery → result → đơn kế; keyboard và mouse có hiệu quả như cũ. Three scene, portraits và audio load đúng.
3. Journal/settings/onboarding/recovery/completion có thể mở/đóng, focus đúng và không click-through/keyboard-through vào game. Kiểm tra ít nhất desktop và viewport mobile hiện hỗ trợ; không yêu cầu redesign responsive.
4. Save có sẵn origin 5173 resume đúng, không reset; primary hỏng restore backup, cả hai hỏng vẫn cho giữ nguyên; settings/onboarding persistence không mất.
5. Debug routes chạy các công cụ thật trong artifact debug riêng và không thay primary/backup của người chơi. Release artifact không có debug route/chunks/code và không có Vite app client.
6. Typecheck, content validator, toàn bộ test suite và build release/debug pass; Vitest suites giữ hành vi, không source-text wiring tests hay pin lại defaults tình cờ.
7. MCP smoke vẫn pass và không phụ thuộc Next dev. Static export phục vụ bằng HTTP hoạt động mà không chạy Node backend.
8. Chạy browser smoke trên release và debug; kiểm tra console, interaction, canvas/resource cleanup; tests đơn lẻ không thay thế bằng chứng browser.

## 12. Phần để builder quyết định

- Tên file và cách chia component/hook, miễn trách nhiệm rõ và không giữ DOM implementation song song.
- Subscription tối thiểu hoặc hook local state để publish runtime changes; không thêm store dependency nếu React/native đủ.
- Bản Next/React stable tương thích chính xác và engine floors kiểm tra lúc cài; không canary.
- Cách kiểm tra artifact debug exclusion và script serve static phục vụ smoke, không thêm framework tests ngoài convention hiện có.
- Không đổi gameplay/visual/copy hoặc thêm tính năng hệ thống mới dưới danh nghĩa migration.

## Nguồn kỹ thuật đã đối chiếu

- https://nextjs.org/docs/app/guides/static-exports
- https://nextjs.org/docs/app/guides/lazy-loading
- https://react.dev/learn/creating-a-react-app
- https://r3f.docs.pmnd.rs/advanced/pitfalls (ranh giới render loop và React state; không chọn R3F trong migration)
