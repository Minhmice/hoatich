# Hoa Tích Asset Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and verify seven project-local Hoa Tích skills for 9Router asset prompting, batch orchestration, review, provenance, and safe promotion.

**Architecture:** `.agents/skills/hoatich-*` holds seven discoverable SKILL.md files. Director owns shared references under its `references/`; provenance owns manifest schema. Prompt specialists link to those references rather than copying policy. No generation client, package, runtime mapping, or gameplay code is added.

**Tech Stack:** Markdown skill files, YAML frontmatter, local project references, existing 9Router `cx/gpt-image-2.5` JSON contract.

**Spec:** `docs/superpowers/specs/2026-10-28-hoatich-asset-skills-design.md`

## Global Constraints

- Project-local skills live under `.agents/skills/` and names use `hoatich-` prefix.
- Project identity comes from `PRODUCT.md`, `DESIGN.md`, source IDs, and authored reference images.
- One visible asset per 9Router request; no sprite-sheet shortcut.
- Maximum four total in-flight requests; worker maximum two; parent allocates explicit slots.
- Authored originals stay immutable until archive/hash and approved promotion.
- Prompt-only/plan-only/skill-only work makes no API calls, installs, framework code, or runtime mutations.
- Backgrounds default to opaque; isolated sprites/elements require transparency only when the brief says so.
- No secret, base64 bytes, authenticated request, or personal host is written to skill/repo/log.
- No gameplay mapping or renderer change is part of this plan.

## Review Focus

- Project-local discovery: every frontmatter name/description and relative reference resolves.
- Style/identity separation: character/flower prompts do not copy reference subjects accidentally.
- Direction/state fidelity: exact IDs remain `left`, `right`, `down` and no aliases are invented.
- Alpha by category: opaque background passes; all-opaque isolated sprite fails.
- Failure safety: 429/timeout retry limits, unknown timeout state, cancellation, collisions, and no-paid-API plan-only mode.

---

### Task 1: Shared references and orchestration

**Files:**
- Create: `.agents/skills/hoatich-asset-director/SKILL.md`
- Create: `.agents/skills/hoatich-asset-director/references/art-direction.md`
- Create: `.agents/skills/hoatich-asset-director/references/batch-contract.md`
- Create: `.agents/skills/hoatich-asset-director/references/ninerouter-api.md`
- Test: pressure scenarios in `asset-source/generated/skill-suite-verification/` (plan-only evidence)

**Interfaces:**
- Produces reference paths and batch brief fields consumed by Tasks 2–7.
- Produces worker ownership, slot allocation, cancellation and retry contract.

- [ ] **Step 1: Write baseline scenario record** — capture the observed failure modes already established: unauthorized scaffolding, generic style drift, state aliasing, skipped alpha review, and plan-only API side effects.
- [ ] **Step 2: Author director SKILL.md** — frontmatter trigger mentions Hoa Tích asset batches, 9Router, subagents, staging, and promotion; require `PRODUCT.md`/`DESIGN.md` and exact IDs before dispatch; define `prompt-only`, `generate-staging`, and `promote` modes.
- [ ] **Step 3: Author `art-direction.md`** — cite project source paths, rough graphite/opaque matte style, character authorities, sprite-vs-background alpha, and day/night constraints without duplicating full prompts.
- [ ] **Step 4: Author `batch-contract.md`** — define brief/worker/manifest fields, explicit total slot allocation, family ownership, two transient retries, unknown timeout, cancellation flush, and immutable originals.
- [ ] **Step 5: Author `ninerouter-api.md`** — document configured base URL resolution, sanitized payload shape, reference image field, response-size hint behavior, unsupported assumptions, and credential rules.
- [ ] **Step 6: Run static scenario check** — each scenario must choose no API/write in plan-only, preserve exact IDs, and allocate slots whose sum ≤4.

### Task 2: Flower prompt skill

**Files:**
- Create: `.agents/skills/hoatich-flower-prompts/SKILL.md`

**Interfaces:**
- Consumes Task 1 art-direction/batch-contract references.
- Produces per-species prompt blocks with identity, style, direction/state, composition, and exclusions.

- [ ] **Step 1: Write failing retrieval/application scenarios** — include an unknown flower ID, `down` vs `center`, mirrored left/right, and a request for a sheet.
- [ ] **Step 2: Author prompt skill** — require source lookup, botanical identity, exact content IDs, direction separate from camera, one asset/request, transparent isolation where brief requires, and project style precedence.
- [ ] **Step 3: Run scenarios** — expected: unknown ID blocks dispatch, IDs stay exact, mirror is not accepted as a generated variant, and sheet is rejected.

### Task 3: Character prompt skill

**Files:**
- Create: `.agents/skills/hoatich-character-prompts/SKILL.md`

**Interfaces:**
- Consumes Task 1 references and authored source paths.
- Produces identity/style/expression blocks and reference provenance.

- [ ] **Step 1: Write failing scenarios** — authored customer-one/passserby clone, new NPC neutral master, chained expression, generic female prompt conflict.
- [ ] **Step 2: Author skill** — freeze authored identity, use same original reference for each variant, review neutral master before expressions, freeze pose/hands/clothes, and keep user style changes explicit.
- [ ] **Step 3: Run scenarios** — expected: no authored overwrite, no generated-reference chain, no expression before neutral approval, and corrected male/female identity.

### Task 4: Element prompt skill

**Files:**
- Create: `.agents/skills/hoatich-element-prompts/SKILL.md`

**Interfaces:**
- Consumes Task 1 art direction and caller placement brief.
- Produces isolated element prompt with anchor, scale, orientation, alpha and no-text constraints.

- [ ] **Step 1: Write failing scenarios** — vase vs UI icon, element with no anchor, accidental text/logo, element request requiring background.
- [ ] **Step 2: Author skill** — separate sprite from UI, require intended placement and relative scale, preserve transparent isolation, and forbid unrequested labels/panels.
- [ ] **Step 3: Run scenarios** — expected: missing anchor asks for brief, no text is included, and opaque output is accepted only for an explicitly opaque element/background.

### Task 5: Background prompt skill

**Files:**
- Create: `.agents/skills/hoatich-background-prompts/SKILL.md`

**Interfaces:**
- Consumes Task 1 art direction and scene layout/camera brief.
- Produces opaque background prompt/reference edit constraints.

- [ ] **Step 1: Write failing scenarios** — day-to-evening edit, open bouquet table, accidental character/UI/text, forced transparent alpha.
- [ ] **Step 2: Author skill** — fixed camera/layout, preserve shop geometry and work surface, day/night palette, no people/UI/text unless asked, opaque background default.
- [ ] **Step 3: Run scenarios** — expected: background uses opaque acceptance, preserves table, and rejects accidental characters/text.

### Task 6: Review skill

**Files:**
- Create: `.agents/skills/hoatich-asset-review/SKILL.md`

**Interfaces:**
- Consumes Task 1 brief, candidate paths, and canonical references.
- Produces `approved|rejected|needs-cleanup`, reasons, measured dimensions/bounds and visual defects.

- [ ] **Step 1: Write failing scenarios** — HTTP200 malformed image, all-opaque sprite, halo/fringe, wrong character identity, valid opaque background.
- [ ] **Step 2: Author skill** — decode/mode/alpha/bounds checks plus actual image inspection; distinguish request outcome from review; forbid similarity percentages without measurement; never promote rejected/needs-cleanup.
- [ ] **Step 3: Run scenarios** — expected statuses and category-specific alpha decisions match the spec.

### Task 7: Provenance skill and migration

**Files:**
- Create: `.agents/skills/hoatich-asset-provenance/SKILL.md`
- Create: `.agents/skills/hoatich-asset-provenance/references/manifest-contract.md`
- Create: `docs/superpowers/specs/2026-10-28-hoatich-asset-skills-verification.md`
- Archive: old `~/.agents/skills/generating-9router-assets/SKILL.md` bytes to project migration evidence before deletion
- Remove: old global `~/.agents/skills/generating-9router-assets/SKILL.md` only after all seven local skills pass checks

**Interfaces:**
- Consumes review outcomes from Task 6 and records from Task 1.
- Produces sanitized manifest/archive/export contract and cutover evidence.

- [ ] **Step 1: Write failing scenarios** — secret in payload, collision, archive hash mismatch, resume after pending, runtime path not wired.
- [ ] **Step 2: Author provenance skill/reference** — define sanitized request metadata, SHA-256, archive-before-promotion, resume by ID, runtime export by category, and explicit “generated but not wired” reporting.
- [ ] **Step 3: Run scenarios** — expected secrets are absent, collisions do not overwrite, hashes gate promotion, and runtime wiring is not inferred.
- [ ] **Step 4: Write verification evidence** — record baseline/guided scenario results and known catalog-refresh limitation; do not claim global discovery until checked.
- [ ] **Step 5: Archive and remove old skill** — compute hash, copy exact bytes into migration evidence, verify seven local files and references, then remove only the old global entry. No commit/push unless requested.

## Final verification

- [ ] Read every local SKILL.md and every relative reference.
- [ ] Verify all seven frontmatter names/descriptions, no duplicate policy conflicts, and no unexpected files.
- [ ] Run the existing project test/validator command only once after skill files are complete; skill writing itself does not alter app behavior.
- [ ] Run fresh discovery/read smoke; report whether current runtime catalog sees local skills.
- [ ] Perform independent whole-suite skill review before claiming cutover.
