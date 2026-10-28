# Game Knowledge MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Deliver read-only structured knowledge MCP with provenance, relations, impact analysis and isolated domain calculations.

**Architecture:** Node stdio server imports content and pure game rules. In-memory catalog uses TypeScript source spans and Markdown sections. Freshness gate rejects changed source snapshots; simulation never touches live saves.

**Tech Stack:** TypeScript, official MCP server SDK, Zod, existing tsx/Vitest/TypeScript compiler API.

**Spec:** docs/superpowers/specs/2026-10-25-game-knowledge-mcp-design.md

## Global Constraints

- Keep user changes to audio, scenes, CSS, onboarding and root product/design files untouched.
- Read-only repository/save; no browser bridge, shell tool, arbitrary file paths or vector DB.
- Node >=20; stdio stdout protocol-only; all server code under tools/mcp, excluded from browser imports.
- Limits: page 20/default 50/max, impact depth 1/default 4/max, 500 visited edges, 100 stems, 50 actions, query 500 chars, IDs 256 chars, input 128 KiB, output 64 KiB.
- Same source revision throughout process; reject SOURCE_CHANGED on add/change/delete.
- Runtime and design evidence distinguished; no claims of guaranteed narrative reachability.

## Review Focus

- Unicode Vietnamese search must handle composed/decomposed text and đ without changing canonical IDs; catalog tests pin this.
- Unknown flags/flowers, nonfinite quantities and omitted feasibility context must not produce false successful predictions; calculation tests pin this.
- Simulation retries/shift transitions must follow actual domain outcomes, not bypass scene gating; simulation tests pin this.
- Source symlinks and stale imports must not leak outside files or attach new citations to old logic; source tests pin this.
- Cycles and pagination must preserve complete stable results within bounds and report truncation; catalog tests pin this.

## File map and interfaces

- `tools/mcp/contracts.ts`: shared refs, sources, records, edges, error and result types.
- `tools/mcp/sources.ts`: source snapshot loader, safe allowlist, compiler spans, Markdown chunks, revision checks.
- `tools/mcp/knowledge.ts`: catalog, search/get/relations/impact. `buildKnowledge(sources: SourceSnapshot): KnowledgeCatalog`.
- `tools/mcp/calculations.ts`: `evaluateInput(input: unknown)` and `simulateInput(input: unknown)`, no repository or source dependency; exported input schemas.
- `tools/mcp/server.ts`: register seven tools, bound responses, freshness gates; exported factory for in-process smoke.
- `tools/mcp/stdio.ts`: runnable entry point.
- `tools/mcp/smoke.ts`: actual client/server stdio smoke, no permanent mock wiring tests.
- `tests/mcp/{sources,knowledge,calculations}.test.ts`: behavioral boundary regressions.
- `package.json`, lockfile, `tsconfig.json`, `README.md`: dependencies, commands, typecheck coverage and usage.

### Task 1: Source-backed catalog

**Interfaces:** contracts define EntityRef `{kind,id,ownerRef?}`, SourceRef `{relativePath,symbol?,heading?,lineStart,lineEnd,contentHash}`, KnowledgeEntity `{ref,data,sourceRefs,evidenceKind}`, KnowledgeEdge `{from,to,type,sourceRefs,details?}`. Catalog consumes source spans via snapshot helpers, returns plain serializable results; parent owns shared contracts/sources.

- [ ] Write failing source/catalog tests for Vietnamese search, conditional flag edges, tag/world predicate context, intro, scoped choices/rules, provenance, stable pagination, cycles, stale file and symlink rejection.
- [ ] Implement source snapshot and catalog extraction from current content exports, asset mappings and bounded Markdown/source excerpts. Prefer compiler spans to guessed line numbers.
- [ ] Validate exact ID lookups, reverse edges and structural impact; preserve predicate min/conditions/semantic role.
- [ ] Run complete sources and knowledge modules after integration; expected no failures.

### Task 2: Pure calculations and scenario simulation

**Interfaces:** `evaluateInput(input: unknown): object`, `simulateInput(input: unknown): object`; schemas exported for server, errors carry stable `code`. Input/output follow spec section 9. No dependency on source/catalog: server supplies evidence envelope.

- [ ] Write failing behavior tests for three outcomes, stock/unlocks/not_checked, unknown inputs and simulation isolation, first-order intro, phase errors, missed retries, auto-order selection and completed-shift transitions.
- [ ] Reuse evaluateBouquet, GameSession and validateSave; clone snapshot, no SaveRepository. Validate action boundary and stop at first error with trace.
- [ ] Run whole calculations module after integration; expected no failures.

### Task 3: MCP stdio integration and consumer proof

**Interfaces:** `createKnowledgeServer(root: string): Promise<McpServer>`; integrate source/catalog and calculations from tasks 1–2.

- [ ] Install pinned official SDK and schema dependency using available Node runtime. Verify installed API, not remembered API.
- [ ] Register discover_game, search_knowledge, get_entity, get_relations, analyze_impact, evaluate_bouquet, simulate_scenario with descriptive schemas; protocol errors remain distinct from bounded domain errors.
- [ ] Enforce source freshness, input/output byte limits, pagination cursor revision and text/structured output equivalence. Add package command `mcp` and smoke command, include tools in typecheck.
- [ ] Run actual MCP client via stdio, exercising discovery, no-diacritic lookup, relationship/impact, bouquet result and simulation trace; assert concrete expected values.
- [ ] Run full tests and build, then consistency search every public tool contract and review scoped changes. Update README usage and limitations after smoke.
- [ ] Fresh independent whole-feature review; fix important findings and run full affected modules and smoke again.

## Execution decisions

User approved design and requested execution without further questions. Execute continuous work; independent catalog and calculation slices may run concurrently under fixed interfaces. Do not auto-commit user changes or switch/reset their branch. Branch/workspace isolation must not discard uncommitted content. Record decisions and results here rather than generating extra process documents.
