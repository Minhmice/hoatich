# Hoa Tích asset skills — verification

## Delivered
Seven project-local `.agents/skills/hoatich-*/SKILL.md` entries: asset-director, flower-prompts, character-prompts, element-prompts, background-prompts, asset-review, asset-provenance. Director owns three shared references; provenance owns manifest-contract. No image API requests, asset replacement, application code changes, package installs or gameplay rewiring were performed for this implementation.

Spec: `2026-10-28-hoatich-asset-skills-design.md`. Implementation plan: `../plans/2026-10-28-hoatich-asset-skills.md`. User approved design and execution; no additional approval loop used. Project-local `.agents/skills/` takes precedence over generic install-skill `.agent/skills/` suggestion because approved design and existing project convention explicitly use plural `.agents`.

## Behavioral scenarios
Raw baseline/guided outputs: `2026-10-28-hoatich-asset-skills-scenarios.json`.

Seven stateless no-guidance baselines preceded authoring. Five fresh guided model completions per skill tested the same scenario. Element had a second five-sample pass after some first-pass responses still invented camera/size in draft prompts. Final element output shape explicitly lists unresolved fields and geometry-independent subject/style/exclusions only.

Observed baseline problems: flower replaced down with center, mirrored output and built sheet; character merged sad/touched; element invented camera/anchor and glossy3D; background suggested unrelated shader/layer work; reviewer prematurely promoted report-only background; provenance proposed revoking an unexposed secret and converting unknown to failed. Director baseline omitted prompt-only no-API constraint. These are observed samples, not statistical evidence of universal failure.

Guided samples applied exact direction states, fixed identity authority, new-neutral review gate, unresolved-geometry block, category-specific opaque background handling, fringe needs-cleanup block and archive/unknown/no-unverified-wiring gates. Some short review responses were conditional/ambiguous about unseen background approval, so an additional targeted no-image case explicitly returned pending-review/no promotion.

Additional targeted cases exercised private in-memory secret (no unauthorized revoke/dump), archive mismatch (block), unknown timeout (no blind retry), and cancellation with succeeded-but-unreviewed output (no promotion). All returned expected bounded decisions. No live image generation is claimed by these textual checks.

## Independent review and real read smoke
- `SuiteContractReview` reviewer: approved. One minor direct-link omission in flower skill fixed; no open important findings.
- `SuiteDiscoverySmoke`: direct-file routing correctly chose flower, character, element, background, review and provenance skills and their gates.
- Static checks: seven frontmatter names match directories, descriptions start `Use when`, balanced code fences, all Markdown relative links resolve. Entry files each below500 whitespace-separated words at first check; shared references carry policy detail.
- `skill://hoatich-asset-director` returned `Unknown skill: hoatich-asset-director` in this session, while direct `.agents/skills/.../SKILL.md` reads work. Runtime catalog reload/new-session pickup not exercised; no claim that auto-discovery is active, no config edit or service restart made.

## Migration
Archived old global skill byte-for-byte at `archive/2026-10-28-generating-9router-assets.md` before removal. SHA-256: `50fb923c22ee08a35f7a3def912e4de76385e65288f75fc5a42a53d8b3ee24f2`.

Rechecked global original hash and archive equality immediately before removing only `~/.agents/skills/generating-9router-assets/SKILL.md`. Removal succeeded; final existence check false, archive hash matches, seven local directories present. Other global skills untouched; no alias/shim left. Archive is historical evidence, not active policy.

## Repository verification
Executed full `npm test && npm run validate:content` after skill authoring:
-20/20 test files passed,138/138 tests passed.
-Content valid:10flowers,4customers,4orders,37dialogue nodes.
-Exit0; raw tool artifact `artifact://177` for this run.

These tests check repository regressions, not image quality or skill auto-discovery. The skill behavior smoke is the scenario/direct-read evidence above. No commit/push performed.
