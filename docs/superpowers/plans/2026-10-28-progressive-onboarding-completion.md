# Progressive Onboarding Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Read the approved design and your owned task; checkbox steps record progress.

**Goal:** Finish the approved slot-arrangement, progressive narrative day loop, wrapping/ribbon/cards and per-NPC delayed relationship branches; verify, commit, merge main and push as user requested.

**Architecture:** Keep React + GameRuntime + GameSession + Three.js. BouquetModel owns draft configuration/slots/finishing; GameSession owns calendar/content/notes/affinity and atomic delivery/save. UI consumes actual contracts, not local fake scores. Separate model/render and narrative/persistence ownership; join at runtime/UI after both finish.

**Tech Stack:** Existing Next.js/React/TypeScript/Three.js/Vitest only; no new packages.

**Spec:** `docs/superpowers/specs/2026-10-28-hoatich-progressive-onboarding-and-emotional-orders-design.md` approved; user authorized finishing remaining implementation then merge main/push. User rejected worktrees: current branch only.

## Global Constraints

- No package/stack changes. Preserve all pre-existing project changes; publish required runtime/assets/content/docs only, not local credentials, caches or .omp/.serena/scratch.
- Slot is primary mechanic, not optional free drag. Configure vessel/count after order, lock once configured until explicit clear/restart. Click fills earliest vacancy, row-major top/left. Lift before replace; revisions free, stock only consumed by final delivery.
- Render actual existing directional flower variants with coherent anchor/pivot/layer and mild rotation. Bud != viewpoint. No invented missing URLs, no external image generation.
- One optional detail question/order, no repeat asking. Note contains only heard facts, no automatic error-answer list.
- One species day1, add one each subsequent day. Several customers/day. Feature schedule is implementation choice: paper day2, ribbon day3, cards day4. Basic notes/detail available from day1; guided prompts teach actions contextually without tour overlay.
- All pre-delivery revisions free/unlimited; full slots required to finish. Bow has three intentional click animations, no QTE/time pressure. Cards chosen from authored messages (implementation choice), optional except explicit order request, reversible before delivery. All submitted draft metadata participates evaluation where relevant.
- NPC affinity starts50%, clamped0..100. Accepted +8, resonant +15, missed -12 (implementation balance choice, configurable). Minimum3 completed deliveries/NPC; good >=70, strained <=30. Qualification queues branch, activates next day's opening only. Neutral stays neutral; no forced branch merely third delivery. Repeated delivery/reload cannot apply twice. Real branch-specific order/dialogue choices, not a badge alone.
- Six authored working days with four recurring NPCs/day, living morning and spirit evening. Daily flower sequence: cúc trắng, hồng đỏ, hướng dương, sen hồng, thủy tiên, lưu ly. Keep existing canonical IDs for original orders and support historical saves; reauthor impossible early requirements rather than unlock prohibited species silently. Other catalog species remain later unlock content, not falsely said usable.
- Save schema change requires validation/migration from0/1, preserve old progress, no silent reset/corrupt overwrite. Reject malformed/newer saves. Model draft can remain session-only but UI must state if draft is not saved (or domain owner persist safely); no promise reload preserves unsaved bouquet.
- Graphify/LSP before exported symbol edits; MCP SOURCE_CHANGED currently, source fallback stated. Tools code/API guidance from local Next docs. Mobile smoke landscape844x390 and667x375, actual innerWidth/innerHeight checked.
- No checks while implementation slices still editing; run full affected files once after each integration gate. Agents do not spawn subagents/commit/push. Parent owns final tests/build/smoke/review/commit/merge/push.

## Shared interfaces (binding across owners)

`src/game/bouquet/BouquetModel.ts` exports:

- `VesselKind = 'bouquet' | 'vase' | 'jar'`.
- `BouquetConfiguration { vessel: VesselKind; stemCount: number }`.
- `FlowerPose = 'center' | 'left' | 'right' | 'down'`.
- `BouquetSlot { index: number; position: {x:number;y:number}; rotation:number; layer:number; pose:FlowerPose }`.
- `BouquetItem`: current identity/flower/position/layer/rotation plus `slotIndex:number`, `pose:FlowerPose`.
- `BouquetFinish { paper: 'none'|'kraft'|'cream'; ribbon: 'none'|'sage'|'rose'; bowStep:0|1|2|3; cardId:string|null }`.
- `BouquetSubmission { configuration: BouquetConfiguration; items: readonly BouquetItem[]; finish:BouquetFinish }`.
- `configure(configuration):void`, getters `configuration:Readonly<BouquetConfiguration>|null`, `slots:readonly BouquetSlot[]`, `finish:Readonly<BouquetFinish>`, `isFull:boolean`, `submission:BouquetSubmission` (throws until configured/full), `add(flowerId):BouquetItem`, `remove(id):void`, `rotate(id,delta):void` (bounded natural variation), `clear():void` (lifts all while keeps config), `reset():void` (new order removes config/finish/history), `undo():void`, `setPaper(value)`, `setRibbon(value)`, `advanceBow():void`, `setCard(cardId:string|null):void`.
- Constructor can restore submitted initial items only when supplied matching config (debug/callers migrated, no unconfigured editing shim). No free move/reorder in actual gameplay; migrate caller APIs rather than silent no-ops.
- Draft changes invalidate bow only when ribbon/paper changes or structural content changes; card edits do not destroy a tied bow. Changing ribbon resets bow0; ribbon none bow0. All mutations are undoable with bounded valid snapshots.

`src/game/content/progression.ts` exports (domain owner):

- `getDayNumber(dayId:string):number`, `getFeatures(dayId:string): { paper:boolean; ribbon:boolean; cards:boolean }`.
- `getAvailableVessels(dayId:string):readonly VesselKind[]`; all three initially available, NPC suggests different shape/size but does not enforce one exclusive product.
- `getCardChoices(orderId:string):readonly {id:string;label:string;message:string;tone:string}[]`.
- `getOrderNote(orderId:string, flags:Readonly<Record<string,boolean|number|string>>):readonly string[]` returns opening facts plus detail facts only if detail flag exists.
- `getOrderArrangement(orderId:string): { suggestedVessel:VesselKind; minStems:number;maxStems:number }` (ranges meaningful3–5/6–9/12–15; actual config choices1..24 supported in model; request mismatch is evaluation, not invalid capacity).

`GameSession.deliver` consumes BouquetModel or readonly item array for MCP evaluation (consumer compatibility at domain boundary, not legacy UI); optional submission metadata for actual gameplay must be evaluated exactly once. Domain owner can overload using `BouquetSubmission` and migrate GameRuntime; scalar-only MCP explicit evaluation remains useful and must label missing metadata as not checked, not fake pass.

## Review Focus

1. Lift-refill-undo invariants preserve slot identities/order and stock; no overwritten/duplicated cands and full capacity exact.
2. Daily content solvable using unlocked flowers/features; neutral/good/strained branch cannot leak unknown detail or run before next day.
3. All failed delivery validation leaves save/inventory/affinity/orders untouched; completed delivery cannot repeat effects on reload.
4. Bow clicks never double-advance during animation; reversible finish edits and reduced-motion remain operable keyboard/touch.
5. v0/v1 migration preserves original completed IDs, flags and valid relationships; bad draft/config/calendar/branch data rejected before mutation.

---

### Task A: Slot model + actual directional renderer

**Own files:** BouquetModel.ts; new bouquet/slotLayout.ts if required; render3d/FlowerCard3D.ts, Workstation3D.ts, WorkstationInteraction.ts, tableCoordinates.ts only as needed; debug/Bouquet3dDebug.tsx; tests/bouquet/slotArrangement.test.ts. Do not edit GameSession/content types/save/runtime/workspace UI.

- [x] Read source/LSP references, implement binding interfaces above, validate integers1..24, known vessel/flower, positions/pose; invalid configure cannot wipe draft.
- [x] Create deterministic rows/layers from count with1center/5center+4 surround; scan order top-left to bottom-right; repeated clicks fill earliest vacancy. Different vessel silhouettes actual rendered, slot rings visible when vacant.
- [x] Remove free dragging/legacy move/reorder from main interaction; selection/lift/rotation only. Migrate debug surface to real slot configuration and update obsolete test contracts with relevant ownership coordination.
- [x] Load all mapped existing center/left/right/down assets, validate URL files before use; select pose per slot and adjust pivot/coherent stems with depth/rotation. Maintain ThreeShopView camera/input gate.
- [x] Render vessel, paper and ribbon/bow states in actual scene using geometry/native SVG surfaces where appropriate (not no-op menu), card visible final attachment. Reuse existing assets/native geometry; no paid generation.
- [x] Tests: capacity1,5,12,15,24; vacancy order after middle removal; full add rejected; replacement cannot overwrite; undo restores config/pose/finish; invalid input leaves state; three bow steps cap3 and reset semantics. Parent runs tests at gate.
- [x] Report exact APIs/files/uncertain assets; no tests/build/formatters mid-flight.

### Task B: Progression, authored orders, emotions, affinity and safe persistence

**Own files:** GameSession.ts; state/GameState.ts, stateReducer.ts; save/migrations.ts; content/types.ts, progression.ts, orders.ts, dialogue.ts, index.ts, validateContent.ts; bouquet/evaluateBouquet.ts; tools/mcp callers/knowledge/calculations impacted; domain/save/content/integration/MCP tests. Do not edit BouquetModel/render/UI/runtime.

- [x] Consume TaskA type-only contract; do not change shared model. Make six days/four recurring customers, ensure each day solvable with cumulative species and features; each order has accept vs one optional detail +heard note flag. Preserve canonical original IDs and authored personality; no random dialogue generator.
- [x] Delivery evaluation distinguishes required shape/size, flowers/tone/missing card, taboo and emotion; actual total count used in ratios/minimums. Reasons remain structured; select exact authored reaction for important issue, not generic “missing or taboo”. No automatic checklist hints.
- [x] Actual gameplay `deliver(submission)` finalizes even missed, consumes once, updates affinity and count once; pre-delivery invalid/incomplete/locked feature submissions reject atomically. Domain-only item evaluation for MCP is non-mutating; migrate simulation prepare/deliver to valid metadata or explicit domain route.
- [x] Feature schedule paper2/ribbon3/cards4 gates actual actions at runtime too. Day unlock plus refill enough stock for multiple15-stem orders; consume only at delivery.
- [x] Affinity50 initial and defined deltas; after3 encounters queue good/strained; activate at next day only, persist branch so reload can't retrigger; authored alternative order/dialogue choices on days4–6 produce a real route difference.
- [x] Introduce schema2 if needed, migration0/1 preserving old IDs/flags/relationship data, flag obsolete domain data carefully rather than silently deleting. Strict validate accepted storage and reducer boundaries. Draft restoration optional, unsaved status required UI if not persisted.
- [x] Update knowledge/discovery/simulation to describe current rules and whole affected test modules. Tests on free revision neutrality, atomic bad submit, repeated delivery/reload, boundary affinity values, future activation, migration malformed/future, optional detail not inferred. Parent runs once at gate.
- [x] Report consumer changes for integration owner and no checks mid-flight.

### Task C: Runtime + React integration and tactile finishing

**Own files:** GameRuntime.ts, app/GameClient.tsx, components/views, components/ui, ThreeViewport.tsx if needed, style.css; runtime tests. Consume A/B reports; no domain/model refactor unless integration mismatch real and recorded.

- [x] New order workspace shows config first then slot flower catalog. Use getOrderArrangement as suggestion, allow user different vessel/count1..24 (request mismatch evaluates later); lock config after confirm, lift before refill; no old free-drag control.
- [x] Runtime blocks locked flowers, stock over-draft, finish features before day unlock; model submission full required. All inputs guarded modal/activeView; preserve camera gate.
- [x] Progressive contextual hand/hint tied to real configuration/add/lift/finish action; one species day1, hide or show meaningful locked species without triggering error; never bring old overlay back.
- [x] Counter one optional detail; no ad-hoc extra OK/Sao cơ fiction. Note only heard facts, including explicit flower preference. Customer rendering one identity/mood consistent with living/spirit rather than recipient deceased tinting living NPC ghost. Remove deceptive pre-existing fake economy click affordances touched by new HUD; show real day/order/affinity instead.
- [x] Wrapping menu updates real scene. Three deliberate bow clicks invoke animation (quấn/tạo tai/siết), phase lock prevents rapid duplicates; keyboard large buttons; reduced-motion equivalent endpoint. Edit paper/ribbon/card and undo freely; full submit preview, no fake fill/reward.
- [x] Cards use authored choices; description literal, do not expose correct answer. Affinity and branch state shown from domain, dialogue branch triggers next day. Shift/day navigation accessible from counter/day complete without detour; lobby shows real chapter/day >2.
- [x] Update runtime tests for configure-add-lift-refill-finish-deliver real contracts; no source text/default-export tests. Browser actual desktop and landscape844x390/667x375, fresh and migrated save, complete day1->day4 for nơ/thiệp và next-day branch proof.
- [x] Parent gate npm test/build, detector after final edit, independent review and fix.

### Task D: Verification, graph and Git integration

- [x] Exercise at least one accepted/resonant/missed order and good/strained affinity route through real domain actions, plus UI actual flow; verify not only snapshot components.
- [x] Full tests/build, MCP smoke, static export runtime screenshot+console, fresh/migrated storage. All named gameplay criteria source/runtime evidenced.
- [x] Independent final review on full current task diff, fix all important issues, rerun affected modules. Record any visual/platform limits honestly.
- [x] Update product/design/spec/README with current mechanics, balance choices, migrations and user-facing workflow. Graphify update new/deleted symbols and query slot→delivery→affinity→nextDay references.
- [ ] Audit git candidate files (including existing untracked runtime prerequisites) for secrets/machine config/huge originals; stage needed code/assets/docs/tests/package migration as one coherent project; leave local secrets/caches untouched. No blind git add -A.
- [ ] Fetch origin, verify main/ref state; commit feature, merge into local main without overwriting user changes. If merge conflict, resolve from both sides; no reset --hard/clean/force push.
- [ ] Full tests/build on merged main, push main normally; confirm remote SHA equals merge commit. If protected/rejected, report exact remote error and finish reachable local integration, never force push.

## Execution rulings

User has explicitly requested completion and merge/push; continue execution in current branch, not a new approval loop. Missing balance/content specifics above are implementation choices, not retroactive user decisions. Independent model/render and domain tasks have nonoverlapping files and a binding contract; execute them concurrently, then one integration owner. Parent handles all checks after edit wave, not racing build with changes. No child Git mutation. Model override was previously rejected by tooling; use task/high effort and independent reviewer, no false model claim.
