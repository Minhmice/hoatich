# Next.js Static Export & React UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Hoa Tích from Vite + manual DOM manipulation to Next.js App Router (static export) with a declarative React UI, preserving Three.js diorama rendering, core narrative rules, save persistence, and all debug tooling.

**Architecture:** Next.js App Router with `output: 'export'` serves as the application shell without requiring a server runtime. A headless `GameRuntime` orchestrates `GameSession`, `BouquetModel`, `AudioManager`, and `SaveRepository` with subscription callbacks, decoupling game logic from rendering. React components manage DOM overlays and accessible dialogs, while `ThreeShopView` handles WebGL rendering in a dedicated client container with strict lifecycle management.

**Tech Stack:** Next.js (App Router, static export), React 19, TypeScript 5.7, Three.js 0.186, Vitest 3.0, Model Context Protocol Server SDK 2.4.

**Spec:** `docs/superpowers/specs/2026-10-25-nextjs-react-game-migration-design.md`

## Global Constraints

- Static export only (`output: 'export'`), no server runtime or Node.js server dependencies in client bundles.
- Keep dev server origin on `http://127.0.0.1:5173` to preserve existing browser `localStorage` saves.
- Game rules (`GameSession`, `stateReducer`, `BouquetModel`, `evaluateBouquet`) must remain pure and identical to existing contracts used by MCP tools.
- Save schema version 1 (`hoatich.save.v1`, `hoatich.save.backup`) must remain fully compatible.
- Three.js render loop must mutate scene objects directly; no React `setState` inside `requestAnimationFrame` or pointer drag loops.
- Production export must completely exclude debug tooling and routes.
- Vitest must remain functional for unit/integration testing without depending on `vite.config.ts`.
- MCP server in `tools/mcp/` must continue running via `npm run mcp` and pass `npm run mcp:smoke`.

## Review Focus

- React StrictMode double-mount in development must not create duplicate WebGL canvases, AudioContexts, or event listeners.
- Asynchronous save loading must not race with component unmount or trigger state overwrites.
- Dialogue typewriter effect and keyboard navigation must handle `prefers-reduced-motion` and modal focus containment without leaking keys to workstation 3D.
- Debug build separation must verify that production `out/` artifact contains zero debug route HTML or JavaScript chunks.
- Font scale CSS variable `--font-scale` and night/day shift visual tokens must synchronize seamlessly between React state and the Three.js viewport.

---

### Task 1: Package Dependencies, Next.js Config, and Vitest Setup

**Files:**
- Create: `next.config.mjs`
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`

**Interfaces:**
- Consumes: None
- Produces: Next.js static build configuration, standalone Vitest runner config, updated build scripts.

- [ ] **Step 1: Write the failing test**

Create `tests/build/config.test.ts` to assert that `next.config.mjs` exports `output: 'export'` with `trailingSlash: true`, and `vitest.config.ts` resolves path aliases without Vite config.

```typescript
import { describe, expect, it } from 'vitest';

describe('Build Configuration', () => {
  it('configures Next.js for static export with trailingSlash', async () => {
    const configModule = await import('../../next.config.mjs');
    const config = configModule.default;
    expect(config.output).toBe('export');
    expect(config.trailingSlash).toBe(true);
    expect(config.distDir).toBe('out');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/build/config.test.ts`
Expected: FAIL with missing `next.config.mjs`.

- [ ] **Step 3: Install dependencies and configure Next.js**

Install `next`, `react`, `react-dom`, `@types/react`, `@types/react-dom`.
Create `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: { unoptimized: true },
};
export default nextConfig;
```
Create `vitest.config.ts` to keep testing independent of Vite application config.
Update `package.json` scripts:
- `"dev": "next dev -p 5173 -H 127.0.0.1"`
- `"build": "tsc --noEmit && npm run validate:content && next build"`
- `"test": "vitest run"`
Update `tsconfig.json` to include `"jsx": "preserve"` and Next.js plugin types.

- [ ] **Step 4: Run test to verify it passes**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/build/config.test.ts`
Expected: PASS.

- [ ] **Step 5: Verify existing tests still pass**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/bouquet/evaluateBouquet.test.ts tests/mcp/`
Expected: All tests pass.

---

### Task 2: Headless GameRuntime and Subscription Model

**Files:**
- Create: `src/game/GameRuntime.ts`
- Create: `tests/game/gameRuntime.test.ts`

**Interfaces:**
- Consumes: `GameSession`, `BouquetModel`, `AudioManager`, `SaveRepository`, `GameState`.
- Produces: `GameRuntime` class with subscribe/dispatch API, selection tracking, and precondition validation.

- [ ] **Step 1: Write the failing test**

Write tests covering:
1. State snapshot retrieval and subscriber notification upon dialogue advancement.
2. Selection synchronization with bouquet item addition, removal, and cycling.
3. Audio shift synchronization and settings propagation.
4. Validation that delivery and shift advancement respect phase preconditions.

```typescript
import { describe, expect, it } from 'vitest';
import { GameRuntime } from '../../src/game/GameRuntime';
import { GameSession } from '../../src/game/GameSession';
import { BouquetModel } from '../../src/game/bouquet/BouquetModel';
import { AudioManager } from '../../src/game/audio';

describe('GameRuntime', () => {
  it('notifies subscribers when dialogue or bouquet changes', () => {
    const session = new GameSession();
    const bouquet = new BouquetModel();
    const audio = new AudioManager();
    const runtime = new GameRuntime(session, bouquet, audio);

    let notifications = 0;
    const unsub = runtime.subscribe(() => { notifications++; });

    runtime.advanceDialogue('choice-intro-start');
    expect(notifications).toBeGreaterThan(0);
    expect(runtime.snapshot.currentOrderId).toBe('order-01-bac-ba');

    unsub();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/game/gameRuntime.test.ts`
Expected: FAIL with `GameRuntime not defined`.

- [ ] **Step 3: Implement GameRuntime**

Implement `GameRuntime` decoupling session mutation, audio triggers, bouquet modifications, and subscriber dispatch:
- Maintains `selectedItemId: string | null`.
- Method `addFlower(flowerId: string, position?: { x: number; y: number })`.
- Method `cycleSelection(delta: number)`.
- Method `deliverCurrentBouquet()`.
- Method `advanceDialogue(choiceId?: string)`.
- Method `advanceShift()`.
- Method `applySettings(settings: Partial<GameSettings>)`.
- Method `subscribe(listener: () => void): () => void`.

- [ ] **Step 4: Run test to verify it passes**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/game/gameRuntime.test.ts`
Expected: PASS.

---

### Task 3: ThreeShopView React Container Component

**Files:**
- Create: `src/components/ThreeViewport.tsx`
- Create: `tests/render3d/threeViewport.test.ts`
- Modify: `src/render3d/ThreeShopView.ts` (if needed for idempotent mount/dispose)

**Interfaces:**
- Consumes: `ThreeShopView`, `GameRuntime`.
- Produces: `<ThreeViewport runtime={runtime} />` React component managing canvas lifecycle.

- [ ] **Step 1: Write the failing test**

Verify component lifecycle:
1. Appends canvas to container upon mount.
2. Disposes Three.js renderer and resources upon unmount.
3. Supports React StrictMode simulated remount without memory leak or canvas duplication.

```typescript
import { describe, expect, it } from 'vitest';
import { ThreeViewport } from '../../src/components/ThreeViewport';

describe('ThreeViewport', () => {
  it('exports a valid React component', () => {
    expect(typeof ThreeViewport).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/render3d/threeViewport.test.ts`
Expected: FAIL with missing module.

- [ ] **Step 3: Implement ThreeViewport**

Implement `ThreeViewport.tsx`:
- Accepts `runtime: GameRuntime`.
- Uses `useRef<HTMLDivElement>(null)` for mounting container.
- Instantiates `ThreeShopView` in `useEffect`, listens to runtime changes, calls `view.sync(runtime.selectedItemId, runtime.canCompose)`.
- Returns cleanup function calling `view.dispose()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/render3d/threeViewport.test.ts`
Expected: PASS.

---

### Task 4: Declarative React UI Components

**Files:**
- Create: `src/components/ui/GameHeader.tsx`
- Create: `src/components/ui/Toolbar.tsx`
- Create: `src/components/ui/FlowerCatalog.tsx`
- Create: `src/components/ui/BouquetControls.tsx`
- Create: `src/components/ui/DialogueBox.tsx`
- Create: `src/components/ui/JournalDialog.tsx`
- Create: `src/components/ui/SettingsDialog.tsx`
- Create: `src/components/ui/OnboardingOverlay.tsx`
- Create: `src/components/ui/NoticeBanner.tsx`
- Create: `src/components/ui/RecoveryDialog.tsx`
- Create: `tests/ui/reactComponents.test.ts`

**Interfaces:**
- Consumes: `GameRuntime`, design tokens from `style.css`.
- Produces: Self-contained, accessible React components with keyboard navigation and focus management.

- [ ] **Step 1: Write the failing test**

Test React UI behavior:
1. `DialogueBox` renders speaker, typing progression, keyboard shortcuts (1, 2, Space, Enter).
2. `FlowerCatalog` disables out-of-stock and dialogue-blocked flowers.
3. `BouquetControls` reflects item layers and triggers runtime actions.
4. `JournalDialog` and `SettingsDialog` trap focus and close on `Escape`.

```typescript
import { describe, expect, it } from 'vitest';
import { DialogueBox } from '../../src/components/ui/DialogueBox';
import { FlowerCatalog } from '../../src/components/ui/FlowerCatalog';

describe('React Game UI Components', () => {
  it('exports all required UI components', () => {
    expect(DialogueBox).toBeDefined();
    expect(FlowerCatalog).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/ui/reactComponents.test.ts`
Expected: FAIL with unexported components.

- [ ] **Step 3: Implement React UI Components**

Implement each component matching existing DOM styles in `src/style.css`:
- `DialogueBox`: respects `settings.textSpeed` and `settings.reducedMotion`. Space/Enter fast-forwards typewriter or continues.
- `SettingsDialog`: controls font scale (sets `--font-scale` on document root), text speed, volumes, reduced motion.
- `JournalDialog`: lists known journal notes and unlocked flower meanings.
- `OnboardingOverlay`: computes target element coordinates dynamically via `getBoundingClientRect` and renders spotlight.
- `RecoveryDialog`: explicit options for "Chơi ván mới" or "Giữ nguyên bản lưu".

- [ ] **Step 4: Run test to verify it passes**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/ui/reactComponents.test.ts`
Expected: PASS.

---

### Task 5: Next.js App Router Shell and GameClient Integration

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/GameClient.tsx`
- Test: `tests/app/page.test.ts`

**Interfaces:**
- Consumes: `GameRuntime`, `ThreeViewport`, React UI components, `browserSaveRepository`.
- Produces: Root Next.js application page with client-only execution.

- [ ] **Step 1: Write the failing test**

Test that:
1. Root `page.tsx` dynamically imports `GameClient` with `{ ssr: false }`.
2. `GameClient` initializes `createBrowserSaveRepository()`, loads state safely, and mounts without throwing on browser environment.

```typescript
import { describe, expect, it } from 'vitest';

describe('App Router Integration', () => {
  it('defines root page and layout', async () => {
    const layout = await import('../../src/app/layout');
    expect(layout.default).toBeDefined();
    const page = await import('../../src/app/page');
    expect(page.default).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/app/page.test.ts`
Expected: FAIL with missing `src/app/layout.tsx`.

- [ ] **Step 3: Implement App Router shell and GameClient**

1. `src/app/layout.tsx`: HTML `lang="vi"`, viewport, title "Tiệm Hoa Tích", imports `src/style.css`.
2. `src/app/page.tsx`:
```tsx
'use client';
import dynamic from 'next/dynamic';

const GameClient = dynamic(() => import('./GameClient'), { ssr: false });

export default function Page() {
  return <GameClient />;
}
```
3. `src/app/GameClient.tsx`:
- Initializes `SaveRepository` and `GameRuntime`.
- Mounts `<ThreeViewport />` and DOM overlays.
- Binds global keyboard shortcuts (Mũi tên, W/A/S/D, Q/E, Tab, N/P, Delete, Ctrl+Z).

- [ ] **Step 4: Run test to verify it passes**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/app/page.test.ts`
Expected: PASS.

---

### Task 6: Debug Suite Migration & Release Build Isolation

**Files:**
- Create: `tools/debug-app/` with Next.js debug configuration or `src/app/debug/` route with build isolation.
- Create: `src/components/debug/StateDebugPanel.tsx`
- Create: `src/components/debug/Bouquet3dDebug.tsx`
- Create: `src/components/debug/AudioDebug.tsx`
- Create: `src/components/debug/DialogueDebug.tsx`
- Test: `tests/debug/reactDebug.test.ts`

**Interfaces:**
- Consumes: Domain content, sandbox storage, `AudioPlayer`, `BouquetModel`.
- Produces: Isolated debug pages accessible during development; strictly excluded from production `out/` export.

- [ ] **Step 1: Write the failing test**

Test that sandbox storage keeps save state in-memory without touching `hoatich.save.v1` in `localStorage`, and all 5 debug tools mount properly.

```typescript
import { describe, expect, it } from 'vitest';
import { createSandboxStorage } from '../../src/debug/sandboxStorage';
import { createBrowserSaveRepository, PRIMARY_SAVE_KEY } from '../../src/game/save/browserSaveRepository';

describe('Debug Sandbox Isolation', () => {
  it('does not touch primary localStorage keys when using sandbox storage', async () => {
    const sandbox = createSandboxStorage();
    const repo = createBrowserSaveRepository(sandbox);
    await repo.save({ ...createInitialGameState(), currentChapter: 'thang-mot' });
    expect(sandbox.getItem(PRIMARY_SAVE_KEY)).toBeDefined();
    expect(window.localStorage.getItem(PRIMARY_SAVE_KEY)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/debug/reactDebug.test.ts`
Expected: Initial failure or verification of sandbox contracts.

- [ ] **Step 3: Implement React Debug Suite & Build Script**

1. Port 5 debug surfaces to React components using `sandboxStorage`.
2. Configure `"build:debug"` command in `package.json` to generate debug artifact separately.
3. Ensure default `"build"` produces production export without debug routes.

- [ ] **Step 4: Run test to verify it passes**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/debug/reactDebug.test.ts`
Expected: PASS.

---

### Task 7: Clean Cutover of Legacy Vite and DOM Artifacts

**Files:**
- Delete: `vite.config.ts`
- Delete: `index.html`
- Delete: `debug/*.html`
- Delete: `src/main.ts`
- Delete: `src/vite-env.d.ts`
- Delete: `src/game/ShopController.ts`
- Delete: `src/game/ui/ShopOverlay.ts`
- Delete: `src/game/ui/DialoguePanel.ts`
- Delete: `src/game/ui/JournalPanel.ts`
- Delete: `src/game/ui/AccessibilitySettings.ts`
- Delete: `src/game/ui/onboarding/OnboardingOverlay.ts`
- Modify: `package.json` (remove unused `vite` dependency)

**Interfaces:**
- Consumes: All callers migrated to Tasks 2–6.
- Produces: Clean repository without dual UI implementations.

- [ ] **Step 1: Check LSP references for legacy symbols**

Verify that no production files or tests still import `ShopController`, `ShopOverlay`, or legacy DOM classes.

- [ ] **Step 2: Remove legacy files**

Delete obsolete files. Update `package.json` and `package-lock.json`.

- [ ] **Step 3: Run TypeScript compiler check**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/typescript/bin/tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Run full Vitest suite**

Run: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run`
Expected: All test suites pass.

---

### Task 8: Production Static Export, MCP Smoke, and Documentation

**Files:**
- Modify: `README.md`
- Modify: `PRODUCT.md`
- Test: Static export inspection and `npm run mcp:smoke`

**Interfaces:**
- Consumes: Complete migrated Next.js project.
- Produces: Verified production static build, passing MCP smoke, updated documentation.

- [ ] **Step 1: Run production build and verify static export**

Run: `npm run build`
Verify `out/index.html` exists and that `out/` contains no debug HTML or debug chunks.

- [ ] **Step 2: Run MCP smoke verification**

Run: `npm run mcp:smoke`
Verify that MCP server communicates via stdio, computes bouquet evaluations, and runs scenario simulations accurately.

- [ ] **Step 3: Run browser smoke verification**

Serve `out/` or launch `npm run dev` at `http://127.0.0.1:5173`.
Verify dialogue intro, bouquet addition, delivery, settings modal, and save persistence.

- [ ] **Step 4: Update Documentation**

Update `README.md` and `PRODUCT.md`:
- Document Next.js App Router architecture and static export.
- Document `npm run dev` (running on port 5173), `npm run build`, and debug commands.
- Confirm zero Vite runtime dependencies.
