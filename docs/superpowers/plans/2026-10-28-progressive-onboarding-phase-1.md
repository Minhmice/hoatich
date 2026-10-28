# Progressive Onboarding — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a coherent lobby → customer counter → working table → delivery reaction flow with real camera movement and no automatic full-screen tutorial overlay.

**Architecture:** Reuse the existing React views and Three.js scene. Let `GameRuntime` own presentation/navigation guards while `GameSession` continues to own orders, dialogue, inventory and persistence. React and WebGL both consume the same active view; navigation must not change domain data by itself.

**Tech Stack:** Existing Next.js 16 App Router static export, React 19, TypeScript, Three.js 0.186.1, Vitest; no new packages or stack migration.

**Spec:** `docs/superpowers/specs/2026-10-28-hoatich-progressive-onboarding-and-emotional-orders-design.md` — approved by user 2026-10-28.

## Global Constraints

- Không sửa stack hoặc thêm package; kiến trúc client-side React/Three.js được giữ nguyên.
- Lobby riêng trước ngày chơi; quầy và workspace là các góc riêng, camera trượt khi chuyển việc.
- Không dựng toàn bộ UI rồi phủ hướng dẫn modal lên trên.
- Một ngày có nhiều khách. Không tự gán lịch mở tính năng/hoa trong phase này.
- Sửa không giới hạn, hoàn toàn miễn phí trước khi trao. Phase này không đổi scoring/inventory semantics.
- Slot, nhiều góc hoa, nơ/thiệp và quan hệ NPC là các phase tiếp theo, không giả lập bằng UI không có tác dụng.
- Nhánh quan hệ tương lai chỉ mở từ ngày/chapter kế tiếp; không tự đặt phần trăm hoặc điểm bắt đầu.
- Giữ palette và identity hiện tại; không bắt chước toàn bộ visual của game tham chiếu.
- Không tự commit/push; chỉ commit khi người dùng yêu cầu.
- Trước đổi exported symbol: Graphify query, đọc source, LSP references; graph lỗi/stale phải báo và đối chiếu source.
- MCP Hoa Tích đang trả `SOURCE_CHANGED`: thử khôi phục kết nối bằng công cụ sẵn có trước execution; không dùng revision cũ. Nếu không restart được, dùng source/runtime và ghi rõ giới hạn.
- Trước UI edit đọc `impeccable/reference/craft-floor.md`; dùng playbook onboard, audit nếu có lỗi responsive/a11y. Launcher context đã chạy trong phiên, không chạy lại như bước kiểm tra.
- Đọc Next.js bundled guide liên quan tại `node_modules/next/dist/docs/` trước code; client APIs trong client boundary.
- Sau mỗi task: kiểm chứng file/module test đầy đủ khi logic thay đổi, smoke hành vi thật. Không chạy suite/build giữa các tác vụ đang sửa song song; một lượt cuối sau tích hợp.

## Staged Delivery Map

Mỗi phase có plan riêng và một deliverable dùng được; bản này chỉ triển khai Phase 1 theo yêu cầu làm dần, không tuyên bố hoàn tất toàn bộ spec.

1. **Phase 1 — Navigation & actual camera:** plan này; hoàn thiện vòng vào tiệm và di chuyển giữa quầy/bàn, giữ gameplay hiện có.
2. **Phase 2 — Vessel/count/slot arrangement:** chọn cấu hình, khóa trước khi cắm, bấm điền từng slot, nhấc trước khi thay, kho không nhân đôi/mất hoa. Tính số thực tế và asset nhiều góc + rotation. Cần chốt danh sách vật chứa/cỡ và asset inventory trước plan.
3. **Phase 3 — Content-led onboarding:** nhiều khách/ngày, một loài ngày đầu, mỗi ngày thêm một loài, một câu hỏi optional, ghi chú điều đã nghe và hướng dẫn gắn thao tác. Cần chốt lịch mở ngày; kiểm tra orders không đòi tính năng/hoa còn khóa.
4. **Phase 4 — Finishing:** menu giấy/nơ/thiệp; ba nhịp nơ, undo/free revision và submit cuối. Cần chốt cách nhập/chọn thiệp.
5. **Phase 5 — Emotion & relationship branches:** nguyên nhân lỗi đa dạng, phản ứng theo ngữ cảnh, yêu thích riêng NPC, quy mô khoảng ba lần trao; nhánh chờ ngày/chapter sau. Cần chốt công thức và ngưỡng, không mặc định biểu đồ phần trăm từng được đề xuất.

Không thêm setting, telemetry, retry API, save migration hoặc asset generation chỉ để chuẩn bị cho phase sau. Khi phase tương ứng làm thay đổi data persisted, lập plan migrations/callers/MCP riêng trước chỉnh.

## Current Source Evidence

- `src/app/GameClient.tsx:25-100,260-355`: local `activeView` + automatic old onboarding overlay; global navigation and overlay mounted for every screen.
- `src/components/views/LobbyView.tsx:111-143`: start button routes counter; auxiliary button routes straight to workspace.
- `src/components/views/CounterView.tsx:82-88`: workspace route is not guarded by dialogue completion.
- `src/components/views/WorkspaceView.tsx:24-79`: current memo and composition controls.
- `src/components/views/viewTypes.ts`: `ActiveView` currently declared here; move canonical type to domain-facing runtime module without compatibility re-export.
- `src/game/GameRuntime.ts:12-20,73-108,176-226`: auto-start orders, action/subscriber methods and delivery semantics.
- `src/components/ThreeViewport.tsx`: creates scene per runtime, but subscription closure captures initial input-block state.
- `src/render3d/ThreeShopView.ts:38-54`: resize resets camera to same pose, render loop has no transitions.
- `src/render3d/RoomEnvironment.ts:27-35`: background plane follows camera; moving a fullscreen texture alone does not create another workspace.
- `src/render3d/DioramaCamera.ts`: only one initial camera pose.
- `tests/game/gameRuntime.test.ts`: existing runtime test suite. Some fixtures mutate bouquet during dialogue; update those scenarios to lawful transitions, not implementation assertions.

## File Structure & Ownership

### Navigation/domain integration
- Modify `src/game/GameRuntime.ts`: canonical `ActiveView`, active-view snapshot/getter, guarded navigation, reset and delivery routing.
- Modify `src/components/views/viewTypes.ts`: import canonical type, keep `ViewContextProps` if still used; no duplicate alias/re-export.
- Modify affected callers found by LSP: `GameClient.tsx`, view components, `GameHeader.tsx`, `ViewSwitcher.tsx` and debug consumers.
- Extend `tests/game/gameRuntime.test.ts` with consumer-visible flow cases.

### Existing scene/camera
- Modify `src/render3d/DioramaCamera.ts`: camera-pose definitions and deterministic interpolator.
- Modify `src/render3d/ThreeShopView.ts`: active camera target, visibility/input guard, animate in existing render loop; no second RAF loop.
- Modify `src/render3d/RoomEnvironment.ts` only if needed to keep framing coherent with distinct views.
- Modify `src/components/ThreeViewport.tsx`: propagate active view, reduced motion and live input block without stale closure.
- Create `tests/render3d/dioramaCamera.test.ts`: endpoint/interruption/resize behavior without WebGL.

### UI and documentation
- Modify existing views/header/navigation and `src/style.css`; preserve layout conventions and art assets.
- Remove automatic old overlay caller from `GameClient`. Delete old onboarding component/manager/types/tests only after references prove no remaining consumer; migrate any replay/help caller to a usable existing help path, not a no-op.
- Update `PRODUCT.md`, `DESIGN.md` and approved spec with exactly what Phase 1 exercised; leave remaining phases explicitly unimplemented.
- Refresh affected Graphify sources; never replace code graph with design nodes.

## Review Focus

1. Saved mid-dialogue or after delivery: lobby never silently starts/finishes a dialogue; opening the game resumes the valid counter/workspace state.
2. Keyboard bypass: lobby/counter and an open dialog cannot mutate bouquet through global shortcuts or WebGL clicks.
3. Rapid input: repeat navigation/Enter cannot submit twice or jump over a dialogue; interrupted camera transition heads from current pose, not stale start.
4. Resize and reduced motion: target view survives resize, no snap to original generic camera; reduced motion stops travel immediately.
5. Async viewport lifecycle: modal state changed while textures load must still block input after mount; disposed scene cannot update selection/state.

---

### Task 1: Runtime-owned navigation and action guards

**Files:** `src/game/GameRuntime.ts`, `src/components/views/viewTypes.ts`, all ActiveView/navigation consumers found with references; `tests/game/gameRuntime.test.ts`.

**Interfaces:**
- Produces canonical `export type ActiveView = 'lobby' | 'counter' | 'workspace'` in `GameRuntime.ts`.
- Produces `get activeView(): ActiveView`, `navigate(view: ActiveView): boolean` (false means rejected without side effects).
- Uses existing `dialogue`, `canCompose`, `currentOrder`, `deliver()`, `advanceDialogue()`, `resetGame()` and `subscribe()`.
- Initial view is lobby. Workspace requires active order and `canCompose`; counter is reachable for intro/order/result. View change alone does not call domain transitions.
- Successful delivery switches counter before notifying subscribers. Reset switches lobby. Completing opening dialogue stays counter until player enters workspace. Saved compose-ready order may be opened to counter then workspace; do not auto-skip story.

- [ ] Write behavioral cases in runtime test file: lobby blocks workspace; intro/order dialogue blocks workspace; ready order allows workspace; rejected action keeps items/inventory/flags unchanged; successful delivery routes counter; reset routes lobby; repeated delivery during result dialogue rejected.
- [ ] Run `npx vitest run tests/game/gameRuntime.test.ts`; new cases must fail on current ungated behavior, not fail because test fixture setup is invalid.
- [ ] Implement navigation getters/method and guard add/move/rotate/reorder/remove/undo/clear/deliver using existing session state plus active view. `selectItem` must not become a bypass. Do not notify/auto-start next order just for failed navigation.
- [ ] Migrate every ActiveView type import, using LSP references first; no stale second source or compatibility alias. Do not touch debug behavior beyond required type/caller change.
- [ ] Run whole affected runtime file plus `tests/integration/verticalSlice.test.ts`; all cases pass. Existing domain simulation tests may call `GameSession` directly and need no view requirement.
- [ ] Smoke using a throwaway `tsx` scenario: construct real session/runtime, progress actual dialogue to compose, reject illegal route, accept legal route and deliver real bouquet. Remove temporary script; retain meaningful runtime regression cases.

### Task 2: Distinct camera poses, transition and live input gate

**Files:** `DioramaCamera.ts`, `ThreeShopView.ts`, `ThreeViewport.tsx`; camera test file; environment/workstation only for scene composition required by this task.

**Interfaces:**
- Consumes `ActiveView` and `runtime.activeView` from Task 1.
- Produces `ThreeShopView.setView(view: ActiveView, reducedMotion: boolean): void` and `get transitioning(): boolean`.
- Keep `sync(selectedId, inputEnabled)` but internally require workspace and !transitioning; notify selection callback only for enabled current workspace.
- Camera definitions expose `getViewPose(view: ActiveView, aspect: number): { position: Vector3; target: Vector3 }`; no browser globals. Use existing Three.js vectors, avoid per-frame allocation.
- Animation duration is builder choice within 400–650ms, cubic ease-in/out; reduced-motion reaches endpoint immediately. Unchanged view must not restart transition.

- [ ] Add camera tests: counter/workspace are genuinely different positions/targets; final interpolation equals desired pose; interrupt starts at actual current pose; resizing retains active target; reduced-motion uses final pose without pending movement.
- [ ] Run `npx vitest run tests/render3d/dioramaCamera.test.ts`; fail before implementation.
- [ ] Define poses after inspecting existing world bounds: keep table at current world origin and frame it in workspace; frame customer/counter separately. Hide table/flower controls in counter as needed; a CSS-only slide or moving background plane is not acceptance. Reuse assets; no new asset batch without user request.
- [ ] Integrate transition into renderer animation loop, updating environment framing while camera moves. Resize recalculates active destination, not original generic pose. Dispose stops render loop and any transition state.
- [ ] Propagate view/reduced-motion and current input gate through `ThreeViewport`. Fix subscription/mount stale closure with refs/effects so modal updates during load remain effective; no listener leak under React remount.
- [ ] Run full camera test file and existing render3d tests. Browser smoke counter → workspace → counter, rapid back navigation, resize while moving, reduced-motion. Observe distinct perspectives and blocked composition while transitioning.

### Task 3: Lobby-first UI and removal of automatic overlay tour

**Files:** `GameClient.tsx`, existing view components/header/navigation, `src/style.css`; old onboarding files only after caller references. Tests touched only if consumer-visible contract changed.

**Interfaces:**
- Consumes runtime activeView/navigate and scene setView.
- React no longer owns parallel activeView state. `onNavigate` invokes guarded runtime navigation.
- `LobbyView` start action opens counter; no free workspace shortcut before ready order.
- Counter presents dialogue and then an enabled workspace action only when compose-ready.
- Workspace is not mounted/visible in lobby/counter; input in overlays and non-workspace screens cannot mutate bouquet.
- Click and Enter delivery use one guarded handler, including result notice/error route.

- [ ] Read Impeccable craft-floor and mobile-landscape guidance immediately before UI edits; inspect actual app first. Keep current art/palette, reduce lobby clutter rather than redesigning brand.
- [ ] Remove automatic `OnboardingManager.start()` and overlay view-forcing listener from `GameClient`. Remove obsolete old tour caller/imports and dead files only after full references; no temporary old/new tours coexistence.
- [ ] Render view-appropriate navigation. Lobby shows main title/start/settings and truthful continue status, not an always-on gameplay toolbar or unconditional “Đã lưu tự động” claim. Counter has conversation; workspace has actual existing flower controls. Later slot controls are not introduced prematurely.
- [ ] Guard global keyboard with active view, modal and focus target. Native button Enter/Space must not trigger delivery too. Preserve normal Tab focus traversal; do not hijack all Tab presses for bouquet selection.
- [ ] Reset and save recovery return lobby and preserve error handling. Reload must not silently grant progress or erase flags/inventory. Do not add a new save schema for active UI view in this phase.
- [ ] Smoke actual browser at desktop and touch landscape `844x390`, then `667x375`. Verify `window.innerWidth/innerHeight` first, screenshots of lobby/counter/workspace; inspect console. Complete an order using UI, reopen settings, test keyboard and fresh/resumed save in isolated browser context without deleting user's real save.
- [ ] Run mechanical Impeccable detector once for changed UI targets; fix actionable defects in one batch and confirm. New permanent UI tests only if an uncertain user-visible edge needs pinning; no source-text/wiring/default-copy tests.

### Task 4: Integrated verification, docs and graph refresh

**Files:** affected docs, Graphify outputs; no extra runtime abstraction.

**Interfaces:** consumes completed Tasks 1–3; produces complete Phase 1 evidence and later-phase boundary.

- [ ] Run `npm test` and `npm run build` once after integration; content validation is part of build. Do not report passing until observed; warnings reported separately.
- [ ] Run actual built/static-export surface when available; demonstrate lobby start → intro/customer dialogue → workspace camera slide → add flower → delivery → result at counter → next customer/shift as current content supports. Domain result semantics unchanged; missed may follow existing retry flow until Phase 5 replaces it.
- [ ] Independently review scope and all callers with references; ensure no navigation path/shortcut can bypass task guards and no false save indicator remains. Check async viewport mount/dispose and modal closure behavior.
- [ ] Update product/design/spec: label Phase 1 implemented with exercised evidence; retain all Phase 2–5 requirements as pending, not “complete”. Remove temporary smoke scaffolds.
- [ ] Update affected Graphify sources, regenerate graph report/HTML and query runtime/view/camera path to prove changed symbols indexed. Report exact MCP/tool errors and fallback sources separately.
- [ ] Deliver concise evidence, links and remaining design decisions for Phase 2. Do not start next phase automatically while its required content decisions remain open.

## Self-review

- Phase 1 covers approved lobby/counter/workspace separation, real camera movement, no automatic intrusive tour and meaningful input gating.
- Vessel/count, slot fill/multi-angle flowers, daily unlock schedule, optional detail/expanded notes, nơ/thiệp, affinity and delayed branches are explicitly mapped to later plans rather than claimed complete.
- Interfaces match across tasks: ActiveView is runtime-owned; React passes it to ThreeViewport; ThreeShopView setView owns physical transition.
- Review Focus 1/2/3 pinned by runtime tests and UI smoke; 4 by camera tests and actual viewport smoke; 5 by async lifecycle browser scenario.
- Do not normalize or repair unrelated working-tree changes; source inspected here may change before execution, so refresh touched files and references before implementing.

## Execution handoff

Plan ready for review, not code authorization beyond user's requested gradual implementation. Recommend **Native** for Phase 1: tasks share runtime navigation/camera contracts and touch overlapping React entrypoint; inline integration with one independent final reviewer minimizes shared-state conflicts. User can choose subagent-driven execution instead. Review plan and select execution method before implementation, per writing-plans workflow.
