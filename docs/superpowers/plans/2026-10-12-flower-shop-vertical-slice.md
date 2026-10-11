# Hoa Tích Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-playable vertical slice of Hoa Tích that demonstrates living/dead shifts, data-driven flower orders, bouquet composition, narrative consequences, local save/load, and content validation.

**Architecture:** Use Phaser with TypeScript and Vite for the 2D layered game surface. Keep pure state transitions, bouquet evaluation, content validation, and persistence outside scene classes. Browser runtime has no Steam dependency; Steam packaging remains a later adapter task.

**Tech Stack:** TypeScript, Phaser, Vite, browser `localStorage`; optional Ink/inkjs is excluded from first implementation unless content branching outgrows typed fixtures.

**Spec:** `docs/superpowers/specs/2026-10-12-flower-shop-narrative-game-design.md`

## Global Constraints

- Web is the primary platform; Steam is a later release path.
- 2.5D means hand-drawn 2D layered interaction, not a 3D world.
- No countdown timer for reading, dialogue, or bouquet work.
- Morning serves living customers; afternoon/evening serves dead-world customers.
- Bouquet evaluation supports `missed`, `accepted`, and `resonant` outcomes.
- Browser runtime must not import Steam or Electron modules.
- Save data uses a versioned local JSON envelope and must not silently discard progress.
- Content IDs are stable and validated before build.
- MCP/skill asset tooling is a separate research project, not a game dependency.
- No full voice acting, backend, account system, multiplayer, open world, or real 3D in this slice.

## Review Focus

1. A bouquet that meets explicit requirements but misses hidden context must be `accepted`, not `missed`; test in Task 4.
2. A taboo flower must override a preference and return `missed`; test in Task 4.
3. A malformed or old save must recover or migrate without crashing or silently deleting progress; test in Task 5.
4. A missing content reference must fail validation before runtime; test in Task 3.
5. Browser build must remain free of Steam/Electron imports; test in Task 6.

---

### Task 1: Scaffold browser runtime

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/game/createGame.ts`
- Create: `src/game/scenes/BootScene.ts`
- Create: `src/game/scenes/ShopScene.ts`
- Create: `public/assets/.gitkeep`
- Test: `tests/smoke/runtime.test.ts`

**Interfaces:**
- `createGame(parent: HTMLElement): Phaser.Game` starts the browser game.
- `BootScene` loads the minimal placeholder visual and starts `ShopScene`.
- `ShopScene` exposes a visible living/dead shift indicator and a clickable “next shift” control for smoke testing.

- [ ] **Step 1: Add package metadata and scripts**

Use Phaser, Vite, TypeScript, and Vitest. Define scripts `dev`, `build`, `test`, and `validate:content`. Do not add Electron, Tauri, Steamworks or Ink dependencies in this task.

- [ ] **Step 2: Add game bootstrap and minimal scenes**

Configure Phaser with `Phaser.AUTO`, a fixed logical resolution, responsive scale mode, and `BootScene`/`ShopScene`. Use placeholder vector/text visuals so the first build has no binary art dependency.

- [ ] **Step 3: Add runtime smoke test**

Test the pure bootstrap contract without requiring a real browser GPU: assert that `createGame` is exported and scene keys are registered. Keep browser visual verification for the dev-server smoke in Task 6.

- [ ] **Step 4: Run checks**

Run: `npm test`
Expected: PASS.

Run: `npm run build`
Expected: Vite creates `dist/` successfully.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src public tests
git commit -m "feat: scaffold browser game runtime"
```

### Task 2: Define state and content contracts

**Files:**
- Create: `src/game/state/GameState.ts`
- Create: `src/game/state/stateReducer.ts`
- Create: `src/game/content/types.ts`
- Create: `src/game/content/flowers.ts`
- Create: `src/game/content/customers.ts`
- Create: `src/game/content/orders.ts`
- Create: `src/game/content/dialogue.ts`
- Test: `tests/state/stateReducer.test.ts`
- Test: `tests/content/contentFixtures.test.ts`

**Interfaces:**
- `GameState` contains `schemaVersion`, chapter/day/shift, inventory, unlocked flowers, completed orders, relationships, flags, journal entries, and settings.
- `reduceGameState(state: GameState, event: GameEvent): GameState` returns a new state and never mutates its input.
- `FlowerDefinition`, `OrderDefinition`, `DialogueNode`, and `CustomerDefinition` use stable string IDs.
- `createInitialGameState(): GameState` returns a fresh default state.

- [ ] **Step 1: Write state transition tests**

Cover `completeOrder`, `unlockFlower`, `setFlag`, `adjustRelationship`, and `advanceShift`. Assert input state remains unchanged and output contains expected values.

- [ ] **Step 2: Implement state contracts and reducer**

Use discriminated event types. Reject impossible negative inventory in reducer logic. Keep evaluator and scene code out of this task.

- [ ] **Step 3: Add representative content fixtures**

Create 8–12 flowers including living flowers and at least one fictional dead-world flower. Add three orders: living customer buying for deceased recipient, living-to-living gift, and an order with contradictory context. Add 3–5 customers and dialogue nodes for opening, accepted, missed, and resonant results.

- [ ] **Step 4: Run full state/content tests**

Run: `npm test -- tests/state/stateReducer.test.ts tests/content/contentFixtures.test.ts`
Expected: PASS with all sibling tests in both files executed.

- [ ] **Step 5: Commit**

```bash
git add src/game/state src/game/content tests/state tests/content
git commit -m "feat: add game state and content contracts"
```

### Task 3: Add content validator

**Files:**
- Create: `src/game/content/validateContent.ts`
- Modify: `package.json`
- Test: `tests/content/validateContent.test.ts`

**Interfaces:**
- `ContentBundle` contains `flowers`, `customers`, `orders`, `dialogue`, and `flags` arrays/maps with the IDs referenced by those entities.
- `validateContent(content: ContentBundle): ValidationIssue[]` checks duplicate IDs and every flower, customer, dialogue, flag, order and result reference.
- `assertValidContent(content: ContentBundle): void` throws an error containing all issues when validation fails.

- [ ] **Step 1: Write validator tests**

Cover a valid fixture, missing flower ID, missing dialogue ID, missing result dialogue, duplicate content ID, and missing unlock flag. Assert issue codes and IDs, not just issue count.

- [ ] **Step 2: Implement validator**

Build indexes once per validation call. Return deterministic issue ordering by entity type then ID. Do not load assets or access the filesystem from validator core.

- [ ] **Step 3: Wire `validate:content` script**

Run the validator against the checked-in content bundle and exit non-zero for any issue. Keep production build independent from Steam/MCP tooling.

- [ ] **Step 4: Run the entire validator test file**

Run: `npm test -- tests/content/validateContent.test.ts`
Expected: PASS for every valid and invalid fixture case.

Run: `npm run validate:content`
Expected: PASS for checked-in content.

- [ ] **Step 5: Commit**

```bash
git add package.json src/game/content/validateContent.ts tests/content/validateContent.test.ts
git commit -m "feat: validate narrative content references"
```

### Task 4: Implement bouquet model and evaluation

**Files:**
- Create: `src/game/bouquet/BouquetModel.ts`
- Create: `src/game/bouquet/evaluateBouquet.ts`
- Test: `tests/bouquet/evaluateBouquet.test.ts`

**Interfaces:**
- `BouquetItem` contains `flowerId`, `layer`, `rotation`, and `position`.
- `BouquetModel` supports add, remove, reorder and undo without mutating prior snapshots.
- `evaluateBouquet(order: OrderDefinition, bouquet: BouquetModel, context: EvaluationContext): BouquetResult` returns `missed | accepted | resonant` plus stable reason/effect IDs.

- [ ] **Step 1: Write evaluator tests**

Cover:

```ts
// explicit requirements missing => missed
// explicit requirements met, hidden context unknown => accepted
// explicit requirements and resonance rule met => resonant
// taboo flower present => missed even if preference matches
// alternate valid arrangement => same result when order-insensitive
```

Also assert evaluator does not mutate `GameState`, inventory, or bouquet input.

- [ ] **Step 2: Implement immutable bouquet model**

Keep arrangement operations separate from scoring. Support keyboard-equivalent operations through the same methods used by pointer input.

- [ ] **Step 3: Implement deterministic evaluator**

Evaluate taboos first, then explicit requirements, then resonance rules. Do not infer undisclosed hidden context. Return reasons suitable for result dialogue selection.

- [ ] **Step 4: Run the complete bouquet test file**

Run: `npm test -- tests/bouquet/evaluateBouquet.test.ts`
Expected: PASS for all sibling cases, including taboo precedence and non-mutation.

- [ ] **Step 5: Commit**

```bash
git add src/game/bouquet tests/bouquet
git commit -m "feat: evaluate multi-outcome bouquets"
```

### Task 5: Add versioned local save

**Files:**
- Create: `src/game/save/SaveRepository.ts`
- Create: `src/game/save/browserSaveRepository.ts`
- Create: `src/game/save/migrations.ts`
- Test: `tests/save/browserSaveRepository.test.ts`
- Test: `tests/save/migrations.test.ts`

**Interfaces:**
- `SaveRepository.load(): Promise<LoadResult>`
- `SaveRepository.save(state: GameState): Promise<void>`
- `SaveRepository.clear(): Promise<void>`
- `migrateSave(envelope: UnknownSaveEnvelope): GameState`

- [ ] **Step 1: Write save and migration tests**

Cover round-trip state, malformed JSON, missing storage, current schema, one older schema, and migration failure. Assert malformed data returns a recovery result and never throws through the public `load` method.

- [ ] **Step 2: Implement version envelope and browser repository**

Use namespaced `localStorage` keys. Keep a backup key before overwriting the primary save. Catch `SecurityError` and quota errors; return typed failure details.

- [ ] **Step 3: Implement explicit migration**

Migrate only known schema versions. Reject unknown future versions without overwriting them. Never silently initialize a new save when a previous save exists but is invalid.

- [ ] **Step 4: Run both full save test files**

Run: `npm test -- tests/save/browserSaveRepository.test.ts tests/save/migrations.test.ts`
Expected: PASS for every sibling test in both files.

- [ ] **Step 5: Commit**

```bash
git add src/game/save tests/save
git commit -m "feat: add versioned browser saves"
```

### Task 6: Connect scenes, dialogue, bouquet UI, and smoke flow

**Files:**
- Modify: `src/game/createGame.ts`
- Modify: `src/game/scenes/ShopScene.ts`
- Create: `src/game/scenes/DialogueScene.ts`
- Create: `src/game/scenes/BouquetScene.ts`
- Create: `src/game/scenes/ResultScene.ts`
- Create: `src/game/ui/DialoguePanel.ts`
- Create: `src/game/ui/JournalPanel.ts`
- Create: `src/game/ui/AccessibilitySettings.ts`
- Modify: `public/style.css`
- Test: `tests/integration/verticalSlice.test.ts`

**Interfaces:**
- Scenes consume `GameState`, content bundle, `evaluateBouquet`, and `SaveRepository` through explicit constructor/registry dependencies.
- `DialogueScene` emits selected choices/effects to the state reducer.
- `BouquetScene` emits a serializable `BouquetModel`.
- `ResultScene` renders result dialogue and applies reducer events.

- [ ] **Step 1: Write integration test**

Exercise one living order, one dead/evening order, and the contradictory order through the state/content/evaluator/save boundaries. Assert shift, completed order IDs, result class, flags and relationship changes.

- [ ] **Step 2: Implement dialogue and journal UI**

Provide text speed, font scale, music/SFX controls, keyboard focus order, and visible text labels. Do not make color the only state signal.

- [ ] **Step 3: Implement bouquet scene**

Provide click-select fallback plus pointer drag/drop, remove, reorder, undo, preview and deliver. Use placeholder visuals until hand-drawn assets exist.

- [ ] **Step 4: Connect save checkpoints**

Save after order result, flower unlock and shift/chapter transition. Display a non-blocking warning when persistence fails.

- [ ] **Step 5: Run complete integration file**

Run: `npm test -- tests/integration/verticalSlice.test.ts`
Expected: PASS for all three order scenarios and state persistence boundaries.

- [ ] **Step 6: Commit**

```bash
git add src/game public/style.css tests/integration
git commit -m "feat: connect flower shop vertical slice"
```

### Task 7: Browser verification and production build

**Files:**
- Modify: `README.md`
- Create: `tests/fixtures/content-invalid.json` only if validator CLI needs a fixture
- Modify: `package.json` only if final script names differ from earlier tasks

**Interfaces:**
- No new runtime interface. This task verifies the complete browser surface and documents commands.

- [ ] **Step 1: Run all permanent tests**

Run: `npm test`
Expected: every test file passes, including all sibling tests, not only the newly added cases.

- [ ] **Step 2: Run content and production checks**

Run: `npm run validate:content && npm run build`
Expected: content validation passes and `dist/` is generated.

- [ ] **Step 3: Run browser smoke**

Run: `npm run dev -- --host 127.0.0.1`.
Open the reported local URL in a browser. Exercise: enter shop, complete living order, switch to evening, complete dead-world order, reload, verify progress retained, open journal/settings, and use keyboard navigation for dialogue/bouquet controls.

Expected: no console error, no missing content reference, visible result transition, saved progress survives reload.

- [ ] **Step 4: Check browser bundle boundary**

Search built source for `electron`, `steamworks`, `tauri`, and MCP imports.
Expected: no browser runtime import. Desktop integration remains absent.

- [ ] **Step 5: Update README**

Document actual install, dev, test, validation and build commands, plus the current vertical-slice scope and explicit non-goals.

- [ ] **Step 6: Commit**

```bash
git add README.md package.json tests/fixtures
git commit -m "docs: document vertical slice verification"
```

## Plan self-review

- **Spec coverage:** product promise and web-first runtime are covered by Tasks 1 and 6–7; state/content by Tasks 2–3; bouquet behavior by Task 4; save/error handling by Task 5; accessibility by Task 6; Steam boundary and MCP separation by Task 7 and global constraints.
- **Consistency:** `GameState`, content IDs, `evaluateBouquet`, `SaveRepository`, and scene boundaries are named once and reused across tasks.
- **Placeholder scan:** no `TODO`, `TBD`, “implement later”, or undefined “appropriate” steps. Optional Ink is explicitly excluded from first implementation rather than left as an unfinished dependency.
- **Scope:** plan only covers browser vertical slice. Electron, Steamworks, MCP and production skill are excluded and require separate approved work.
- **Full verification:** Task 7 runs the full test suite; Tasks 2–6 also run each complete affected test module/file after changes.
