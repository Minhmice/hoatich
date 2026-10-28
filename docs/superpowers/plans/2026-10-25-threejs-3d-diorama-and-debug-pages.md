# Three.js Diorama & Isolated Debug Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển Hoa Tích sang Three.js hybrid 2.5D, camera cố định; cung cấp hub và bốn trang HTML debug độc lập dùng chung hệ thống thật.

**Architecture:** Giữ `src/game/` làm nơi sở hữu gameplay/content/save, không chuyển hàng loạt thư mục. Controller sở hữu session, audio và DOM; renderer chỉ dựng hình và chuyển input tới controller. Debug khởi tạo cùng module bằng dữ liệu được kiểm tra và storage sandbox, không sao chép luật chơi.

**Tech Stack:** TypeScript 5.7.2 strict, Vite 6.3.1 MPA, Three.js WebGLRenderer, HTML/CSS, Web Audio, Vitest 3.0.8 hiện có.

**Spec:** `docs/superpowers/specs/2026-10-25-threejs-3d-diorama-and-debug-pages-design.md`

## Global Constraints

- Three.js (`three` và `@types/three`); không React, router, physics engine hay GUI dependency mới.
- Camera phối cảnh diorama cố định; không OrbitControls. Hoa/nhân vật dùng texture 2D hiện có; backdrop ngày/tối phía sau bàn 3D.
- Giữ luật, schema `GameState`, hình dạng `BouquetItem`, content ID, progression, save keys và UI panels hiện có.
- Không import Three.js vào core state/bouquet/content/save/session; renderer được phép import type/data core.
- Mỗi debug page có HTML và script riêng; không query-param routing.
- Không xuất bản debug pages trong build production. Debug không được đọc/ghi/xóa save hoặc onboarding keys thật.
- Không thay test để ghim renderer mới hoặc để vượt lỗi. Con số 72 là baseline khảo sát cũ, không phải trần số test; giữ mọi test hiện có hợp lệ, kể cả thay đổi mới của người dùng.
- Giữ các tools/MCP và thay đổi đồng thời ngoài phạm vi; không nâng Vite/TypeScript hoặc tái cấu trúc core.
- Mọi lỗi load asset, WebGL, save phải hiện rõ, không fake fallback hoặc nuốt lỗi để trông như game chạy.

## Review Focus

1. Resize/DPR và canvas lệch khỏi viewport: raycast vẫn chọn đúng hoa, backdrop không kéo giãn.
2. Drag ra ngoài canvas, pointercancel, modal hoặc đổi focus: kết thúc gesture, không kẹt pointer và không kéo hoa xuyên UI.
3. Corrupt save/schema tương lai/storage không khả dụng trong debug: báo đúng kết quả bằng repository thật; save người chơi không đổi.
4. Dispose khi texture đang tải hoặc mount lại: không loop/listener/audio kép, tài nguyên đến muộn được giải phóng.
5. Production/deep links: tải trực tiếp từng debug HTML ở dev/debug preview; production không phát hành hoặc chạy debug.

Các mục trên có bước kiểm chứng ở Task 1–5; geometry invariant có test ở Task 2, storage isolation ở Task 4. Không dựng bộ browser test mới chỉ để kiểm tra wiring; dùng browser thật và ghi bằng chứng.

---

## Căn cứ code & quyết định kỹ thuật

- `src/main.ts:10` gọi `createGame(parent)`; LSP references trả về duy nhất caller này cùng declaration/import. Đọc references lại tại cutover, vì repository có thể đổi.
- `src/game/createGame.ts` hiện tạo Phaser + BootScene/ShopScene. `ShopScene.ts` đang sở hữu gameplay orchestration, DOM, keyboard, audio, onboarding và graphics.
- `GameSession` không có subscription API. Controller gọi `refresh()` sau mỗi command, không thêm event bus hay poll state mỗi frame.
- `BouquetModel.items` tạo snapshot: chỉ đọc khi dữ liệu đổi, không đọc/copy ở mỗi animation frame.
- `BouquetItem` là `{ id, flowerId, position: {x,y}, layer, rotation }`; rotation đang là độ. Không flatten hoặc đổi đơn vị core.
- `GameSession.advanceShift()` chặn ca chưa hoàn thành; debug jump phải dựng state hợp lệ riêng, không bỏ guard gameplay.
- `createBrowserSaveRepository(storage?)` đã cho tiêm `getItem/setItem/removeItem`; dùng adapter ánh xạ keys vào Map riêng của trang debug để chạy chính repository/migrations thật, không sửa repository chỉ để có namespace.
- Tách HTML không tự cô lập localStorage cùng origin; sandbox là bắt buộc.
- Backdrop dùng unlit material để giữ màu tranh; bàn/hoa dùng vật liệu nhận ánh sáng. Độ lệch layer theo **Y** khi bàn nằm trên XZ; không dùng Z làm chiều cao.
- Full game view nhận session theo thiết kế nhưng không tạo/ghi session; phần bàn dùng `Workstation3D` độc lập để debug bouquet không phải dựng cả game.
- Build thường chỉ `index.html`; build `--mode debug` mới có sáu HTML. Ví dụ config trong spec là sơ đồ MPA, không được chép nguyên thành production inputs.

## File ownership map

| Files | Trách nhiệm |
|---|---|
| `src/game/createGame.ts`, `src/main.ts` | Khởi tạo/load, entrypoint async, teardown/error surface |
| `src/game/ShopController.ts`, `src/game/ui/ShopOverlay.ts` | Gameplay commands/refresh; chuyển DOM toolbar/catalog/notices/settings/journal/onboarding từ ShopScene, không đổi luật |
| `src/render3d/ThreeShopView.ts` | Renderer, scene, resize, loop, sync, dispose; ghép các thành phần dưới |
| `src/render3d/DioramaCamera.ts`, `DioramaLighting.ts`, `RoomEnvironment.ts` | Camera cố định, preset ngày/tối, backdrop + bàn hình học thật |
| `src/render3d/FlowerCard3D.ts`, `CharacterBillboard.ts`, `Workstation3D.ts` | Texture/card/selection, nhân vật, bàn có thể mount độc lập |
| `src/render3d/WorkstationInteraction.ts`, `tableCoordinates.ts` | Pointer/raycast; đổi tọa độ model ↔ world |
| `debug/{index,bouquet3d,dialogue,state,audio}.html` | Năm entrypoint debug, HTML tiếng Việt, script riêng |
| `src/debug/{hub,bouquet3dPage,dialoguePage,statePage,audioPage}.ts` | Mount và controls từng trang |
| `src/debug/debug.css`, `sandboxStorage.ts` | CSS debug riêng, storage adapter trong bộ nhớ |
| `vite.config.ts`, `package.json`, `package-lock.json` | MPA có mode, scripts, thêm Three.js, bỏ Phaser cuối cutover |
| `tests/render3d/tableCoordinates.test.ts`, `tests/debug/sandboxStorage.test.ts` | Invariant hình học và chống phá save thật |
| `README.md`, `src/style.css` | Hướng dẫn mới và canvas/DOM layout tương thích |

Các file `src/game/scenes/BootScene.ts`, `ShopScene.ts` bị xóa khi chuyển xong; không giữ renderer cũ hoặc alias tương thích. Không sửa docs thiết kế lịch sử chỉ để xóa từ Phaser.

## Task 1: Debug hub MPA, build boundary và hai harness DOM/audio

**Files:** Create `debug/index.html`, `debug/dialogue.html`, `debug/audio.html`, `src/debug/hub.ts`, `dialoguePage.ts`, `audioPage.ts`, `debug.css`. Modify `vite.config.ts`, `package.json`. Read `DialoguePanel.ts`, `audio.ts`, `content/`, `GameSession.ts` và style hiện có.

**Interfaces:**
- Entry scripts mount vào `#debug-root`; mỗi trang đăng ký teardown cho page lifecycle và `import.meta.hot.dispose`.
- `GameSession(initialState?, saveRepo?, onSaveError?)`, `advanceDialogue(choiceId?)`, `currentChoices`, `dialogue` dùng nguyên API hiện có.
- `DialoguePanel.show(payload: DialogueShowPayload): void`, `destroy(): void`; `AudioManager` dùng API public hiện có, không expose private AudioContext.

- [ ] Đọc lại files/config và ghi inventory phím tắt, panels, node IDs thật. Chọn phiên bản `three`/`@types/three` tương thích TS hiện tại theo registry tại thời điểm thực thi, pin exact và lockfile; chưa cần cài trong task này.
- [ ] Cấu hình `defineConfig(({ mode }) => ...)` với đường dẫn ESM `fileURLToPath(new URL(..., import.meta.url))`. Production input chỉ main; mode debug thêm các HTML đã tồn tại. Giữ server host/port và build target.
- [ ] Thêm `build:debug`: `tsc --noEmit && npm run validate:content && vite build --mode debug --outDir dist-debug`. `npm run build` tiếp tục chỉ production. Không ghi debug build vào dist production.
- [ ] Viết hub liên kết rõ game chính và bốn công cụ; chỉ hiển thị link tới page khi task sở hữu đã cung cấp page thật, hoàn thiện đủ bốn ở Task 4. CSS debug chỉ được import từ debug entries; tab/focus/labels truy cập bằng bàn phím.
- [ ] Dialogue page: liệt kê nodes từ `contentBundle.dialogue`; chọn node tìm order sở hữu bằng duyệt graph content, tạo initial state cùng chapter/day/shift hợp lệ và flags, rồi dùng session thật + DialoguePanel. Recreate session khi đổi node/flags/reset, không tự viết bộ chạy condition/effects. Hiện trước/sau flags và choices; node không thuộc order cũng được inspect với session preview riêng, không bịa order ID.
- [ ] Dùng settings `textSpeed` enum thực tế (không số ms tùy tiện); preview thoại dài/choice/speaker portrait và tình huống tiếp tục kết thúc node. Journal/AccessibilitySettings có phần preview trên trang này để kiểm tra UI hiện hữu độc lập.
- [ ] Audio page: nút Start gọi `startAmbient()` trong gesture; ca gọi `setShift`, placement/success/failure dùng method thật. Master slider lưu ở page và nhân với hai gain sliders trước `setMusicVolume/setSfxVolume`; không thêm master API vào core. Có reset/destroy trước tạo lại.
- [ ] Browser smoke ba HTML: tải trực tiếp/reload, đổi node, chọn choice ảnh hưởng flags đúng một lần, dùng Tab/Enter/Esc; audio start/shift/volume/SFX và reset. Kiểm tra console/network, chụp actual UI. Nếu browser automation không phát âm thanh ra thiết bị, báo giới hạn nghe; không tuyên bố đã nghe.
- [ ] Run full modules: `npm test -- tests/audio/audioManager.test.ts tests/integration/verticalSlice.test.ts`. Run `npm run build` và `npm run build:debug`; assert production không có debug HTML, debug output có đúng ba page hiện hành. Đây là expected checks, không phải kết quả đã chạy.

## Task 2: Bàn cắm hoa Three.js tái sử dụng và debug bouquet

**Files:** Create `src/render3d/{tableCoordinates,DioramaCamera,DioramaLighting,FlowerCard3D,Workstation3D,WorkstationInteraction}.ts`, `debug/bouquet3d.html`, `src/debug/bouquet3dPage.ts`, `tests/render3d/tableCoordinates.test.ts`. Modify dependencies/lock, config debug inputs, hub.

**Interfaces:**
- `modelToWorld(position: Readonly<{x:number;y:number}>, layer: number, target: THREE.Vector3): THREE.Vector3` và `worldToModel(point: Readonly<{x:number;z:number}>): {x:number;y:number}` trong `tableCoordinates.ts`.
- Model domain giữ `[380,900] × [410,710]`; world X `[-4,4]`, Z `[-2.5,2.5]`, bàn Y=0. Model Y tăng theo world Z. Layer Y=`0.03 + layer * 0.02`; rotation độ đổi radian đúng một lần tại view.
- `Workstation3D(scene: THREE.Scene)`; `load(): Promise<void>`, `sync(items: readonly BouquetItem[], selectedId: string|null): void`, `dispose(): void`; public readonly `pickables: readonly THREE.Object3D[]` cho interaction, mỗi mesh có item ID. Scene owner sở hữu renderer/loop; bàn không tự tạo session/audio.
- `WorkstationInteraction(canvas: HTMLCanvasElement, camera: THREE.Camera, workstation: Workstation3D, bouquet: BouquetModel, options: { enabled: () => boolean; onChange: (selectedId: string|null) => void })`; `dispose(): void`.

- [ ] Cài `three` và `@types/three` exact đã chọn; không nâng dependencies khác.
- [ ] Viết test trước: round-trip ba điểm góc/tâm dùng `toBeCloseTo`, layer thay Y nhưng không thay X/Z, world ngoài bounds clamp model về biên, input không finite bị từ chối. Run toàn file để thấy fail trước implementation.
- [ ] Implement tọa độ, camera FOV 45°, fixed lookAt; viewport resize cập nhật aspect/projection và renderer size theo container, cap pixel ratio 2. Không allocation/copy core snapshots trong render loop.
- [ ] FlowerCard3D dùng PNG crop manifests thật, SRGBColorSpace, giữ tỉ lệ ảnh. Chọn alpha-cutout nhận shadow (`transparent:false`, `alphaTest:0.5`, depthWrite bật) làm default; kiểm chứng mép ảnh và chồng thẻ trước khi đổi material. Mesh nằm trên XZ, layer theo Y; không sort theo ID ngẫu nhiên. Share texture/geometry theo owner, dispose mỗi resource đúng một lần.
- [ ] Interaction dùng canvas bounding rect để tính NDC, raycast bàn ở Y=0. Pointer capture khi drag, begin/endGesture để một Undo hoàn tác cả drag; xử lý up/cancel/lost capture/modal giữa drag. Không lấy keyboard nếu target input/select/textarea/contenteditable; phối hợp DOM UI, không binding window pointerdown.
- [ ] Debug page mount renderer + bàn thật; controls cho 10 hoa, select/rotate/layer/delete/undo/reset, ánh sáng ngày/tối và cường độ. Evaluation chọn cả bốn orders và flags context, hiện outcome/reasonIds/matchedRuleIds từ `evaluateBouquet` thật. Không trừ inventory trong sandbox bouquet.
- [ ] Run `npm test -- tests/render3d/tableCoordinates.test.ts tests/bouquet/evaluateBouquet.test.ts`; không chỉ chạy case mới.
- [ ] Browser smoke: thêm/chồng/xoay hai hoa, chọn hoa trên cùng, drag từng góc và ngoài canvas, Undo cả gesture, cancel và reset, resize desktop/màn hình hẹp, đổi ánh sáng. Quan sát shadow/alpha/selection và bốn evaluation. Mount/dispose/mount không tạo loop kép; tài nguyên load xong sau dispose không được gắn lại. Run `npm run build:debug` với page mới.

## Task 3: Cutover game chính sang fixed-camera diorama

**Files:** Create `src/render3d/{ThreeShopView,RoomEnvironment,CharacterBillboard}.ts`, `src/game/ShopController.ts`, `src/game/ui/ShopOverlay.ts`. Modify `createGame.ts`, `main.ts`, `style.css`, dependencies/lock. Remove `src/game/scenes/{BootScene,ShopScene}.ts` sau smoke.

**Interfaces:**
- `createGame(parent: HTMLElement): Promise<{ dispose(): void }>` thay `Phaser.Game`; duy nhất main caller đã thấy, nhưng bắt buộc LSP references lại trước sửa.
- `ShopController(parent: HTMLElement, session: GameSession, audio: AudioManager)`; `mount(): Promise<void>`, `refresh(): void`, `dispose(): void`. Startup/load do createGame sở hữu; controller không tự tải save lần hai.
- `ThreeShopView(parent: HTMLElement, session: GameSession, bouquet: BouquetModel, onBouquetChange: (selectedId: string|null) => void)`; `mount(): Promise<void>`, `sync(selectedId: string|null, inputEnabled: boolean): void`, `dispose(): void`.
- `ShopOverlay(parent: HTMLElement)` gom DOM từ scene; controller dùng method cùng trách nhiệm hiện hữu (header/toolbar/catalog/controls/notices/panels), không giữ Phaser object. UI callbacks gọi controller, controller mutate session/model rồi `refresh()`.
- `RoomEnvironment`/`CharacterBillboard` sở hữu object và resources riêng; renderer owner gọi load/sync/dispose. Workstation được dùng nguyên từ Task 2.

- [ ] Trước sửa, LSP references createGame, BootScene, ShopScene và grep toàn callsites/imports Phaser; ghi mapping mọi handler và onboarding selectors từ scene. Không bỏ phím tắt/chức năng vì chưa có chỗ trong renderer mới.
- [ ] Dựng bàn khối thật, plane hoa, fixed perspective, portrait cards và backdrop ngày/tối đúng tỉ lệ. Camera cố định không đồng nghĩa orthographic/isometric tuyệt đối; không thêm OrbitControls. Điều chỉnh framing để không vẽ đè bàn 3D không khớp bàn trong tranh; giữ gameplay usable trên viewport hẹp.
- [ ] Di chuyển orchestration và DOM thay vì viết lại luật: auto-start order, dialogue/choices, inventory, delivery/retry, advance shift, journal, settings, onboarding, recovery notice/reset và demo-complete reset. `refresh` sync view/audio/UI sau commands, không thêm subscription vào session.
- [ ] InputEnabled là `session.canCompose && !modal && !onboardingBlocking`; modal mở giữa drag kết thúc gesture. Keyboard giữ shortcuts và text-field exclusion; không để DOM overlays chặn toàn canvas hoặc click xuyên modal.
- [ ] createGame load repository thật, handle loaded/recovered/error riêng; không biến exception thành empty. Main await mount, hiện lỗi load/WebGL rõ và teardown khi HMR/page lifecycle. Dispose dừng `setAnimationLoop(null)`, interaction/resize observer/timers/DOM/panels/audio, geometry/material/textures và renderer. Không tạo state snapshots mỗi frame.
- [ ] Browser smoke game thật: mở intro, chọn thoại, thêm/kéo/xoay/layer/undo hoa, giao order, thử missed/retry và accepted/resonant, journal/settings/onboarding, chuyển ca sống/chết sau hoàn thành, tải lại để resume, reset demo. Lưu ảnh desktop và màn hình hẹp, console/network không lỗi asset. Dùng browser storage sandbox cho smoke phá save, không xóa dữ liệu người dùng.
- [ ] Sau smoke mới xóa BootScene/ShopScene, bỏ dependency Phaser, cập nhật mọi caller. Không giữ scene cũ làm tài liệu production hoặc shim trả Phaser.Game.
- [ ] Run full `npm test`, `npm run build`, `npm run build:debug`; chạy tools smoke hiện có `npm run mcp:smoke` nếu core imports chạm dependency graph tools. Không sửa tools không liên quan.

## Task 4: State/save inspector cô lập, hoàn thiện hub

**Files:** Create `debug/state.html`, `src/debug/{statePage,sandboxStorage}.ts`, `tests/debug/sandboxStorage.test.ts`. Modify debug inputs và hub. Core save/migrations/reducer không đổi.

**Interfaces:**
- `createSandboxStorage(): Pick<Storage,'getItem'|'setItem'|'removeItem'>` dùng Map trong closure; không truy cập global storage.
- State page gọi `createBrowserSaveRepository(createSandboxStorage())`, `migrateSave(input:unknown)`, `validateSave(state:GameState)` và session thật. Khi thay state, dựng lại session sau validate; không đột nhập private `_state`.

- [ ] Viết test trước: hai sandboxes không chia sẻ data; primary corrupt + backup valid cho `load()` trả `loaded,recovered:true`; cả hai corrupt trả error; migration future version không bị nhận. Dùng repository thật với adapter, không duplicate test implementation.
- [ ] Implement Map storage tối thiểu và state page JSON viewer + JSON import/export/reset. Nhảy ca bằng validated fixture bắt đầu từ createInitialGameState, đồng bộ chapter/day/shift/order/dialogue; hiển thị đây là debug jump, không đổi guard của `advanceShift`.
- [ ] Nút inventory 99/mở khóa hoa dựng validated state mới, giữ flags/unlocks/inventory nhất quán. Nút corrupt primary/backup và legacy/future schema chỉ ghi Map sandbox, gọi repository thật để hiện kết quả và raw lỗi. Reset không gọi `localStorage.clear()` hoặc xóa onboarding thật.
- [ ] Hoàn thiện hub đủ bốn link; mỗi page có Back to hub và Reset. Không để link stub hoặc page rỗng. Dữ liệu node/order/flower counts được lấy runtime, không hardcode 29/4/10 vào điều kiện chạy.
- [ ] Run full files `npm test -- tests/debug/sandboxStorage.test.ts tests/save/browserSaveRepository.test.ts tests/save/migrations.test.ts tests/state/stateReducer.test.ts`.
- [ ] Browser smoke: ghi nhận save keys thật trước/sau (không công bố raw save), import invalid JSON/future/legacy, corrupt primary/backup, jump sáng/tối và đổi kho; tất cả chỉ tác động sandbox. Hai tab không chia sẻ state. Reload/reset khởi tạo sandbox sạch.
- [ ] Run `npm run build:debug`; preview bằng `npx vite preview --outDir dist-debug --host 127.0.0.1`, mở trực tiếp/reload đủ năm debug HTML và game main. Production build `npm run build`: output không có debug HTML/scripts, không main import debug; URL debug không được chạy công cụ debug dù server SPA fallback trả index.

## Task 5: Acceptance liên hệ thống, consistency và bàn giao

**Files:** Modify `README.md` (run/build/debug links, architecture, controls/limits, teardown) và tài liệu ghi chú triển khai trong spec nếu cần; không sửa tools/docs lịch sử ngoài phạm vi.

- [ ] Run full `npm test`, `npm run validate:content`, `npm run build`, `npm run build:debug` sau khi các task xong; báo đúng số test hiện tại, không lấy số cũ làm bằng chứng.
- [ ] Browser actual-surface smoke game và đủ debug pages với dev/debug preview; production preview chỉ game. Không lấy unit tests thay cho visual proof. Lỗi service exit trước đây đã được báo, không tuyên bố đã xem game từ readiness log. Nếu browser profile bị khóa, dùng isolated browser qua công cụ có sẵn; không kill browser người dùng.
- [ ] Consistency: grep `Phaser|phaser|BootScene|ShopScene|createGame` ở src/tests/tools/README/config/manifest, LSP references signatures thay đổi; rà mọi namespace storage và debug entry. Không sửa lockfile bằng tay. Thu gọn diff bỏ alias/import/comment chết của cutover, không dọn code người dùng.
- [ ] Scope: giữ core tests hợp lệ và content/rules/save schema không đổi; manual progression bảo toàn morning living / afternoon-evening spirits trong hai shift hiện có, không tự thêm shift mới. Không cam kết bảo toàn ảnh pixel-perfect, phải có ảnh framing thật để đối chiếu.
- [ ] Verification: chạy nguyên module cho mọi logic đổi, không filter test duy nhất. Permanent test chỉ pin consumer-visible coordinate/storage invariants; không test source text/wiring/copies. Không thêm framework browser mới.
- [ ] Sau smoke cập nhật README lệnh mới và giới hạn hybrid/camera cố định, bỏ throwaway smoke scripts. Không tạo changelog riêng nếu repository không có convention.
- [ ] Xin code review độc lập theo workflow trước hoàn tất feature. Chỉ commit khi người dùng yêu cầu; chưa ghi nhận commit hoặc test chưa chạy là đã xong.

## Nguồn API đối chiếu

- [Vite 6 Multi-Page App](https://v6.vite.dev/guide/build.html#multi-page-app): HTML riêng, Rollup inputs, ESM paths.
- [Three.js renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer): lifecycle/setAnimationLoop/resize.
- [Three.js cleanup](https://threejs.org/manual/en/cleanup.html): geometry/material/texture disposal có owner.
- [Three.js picking](https://threejs.org/manual/en/picking.html): canvas-relative coordinates và raycaster.

## Trạng thái kiểm chứng của kế hoạch

Đây là kế hoạch, chưa triển khai renderer hoặc trang debug. Tài liệu API và code signatures ở trên đã đối chiếu; các checkbox chỉ được đánh dấu sau khi thực thi và quan sát kết quả. Lượt planning đã chạy `npm test`: **11 files, 115 tests passed**, exit 0; baseline này gồm các test MCP mới có trong repository. Chỉ tài liệu thiết kế/kế hoạch được thay đổi trong lượt này; không đổi runtime, dependency, test hoặc verification assets. Grep đã đối chiếu các caller/duplicate và thiết kế; không tuyên bố đã chạy visual smoke Three.js hay build:debug chưa tồn tại.
