---
name: generating-9router-assets
description: Use when generating game flowers, character sprites, expressions, poses, directions, or reference-conditioned assets through 9Router, especially when batching independent images with subagents, preserving source assets, or resuming after API failures.
---

# Generating 9Router Assets

## Core contract

Generate one visible asset per request. Keep source artwork, generated staging files, runtime exports, prompts, and hashes separate. Review actual images before promotion. A successful HTTP response is not visual approval.


**Execution mode:** A plan-only, prompt-only, or evaluation-only assignment produces that artifact only: no API calls, installs, generator code, or runtime writes. A skill-creation request does not authorize a new paid image batch. In generation mode, stop dispatch on user cancellation; finish recording in-flight outcomes and do not promise infinite or unmonitored background execution.
**Never replace authored sources or runtime assets before archiving and inspection. Never log API keys, bearer tokens, base64 image data, or full authenticated requests. Never claim style or identity fidelity from prompt text alone.**

When the project already has a canonical style artifact, that style is the default style block. Do not replace it with `semi-realistic`, `photorealistic`, `watercolor`, or another look merely to fill a prompt. A direct user request for a different style is a deliberate scope change; record it in the batch brief before generating.

Preserve the user's exact output IDs and state vocabulary. Do not silently rename `down` to `center`, `left` to `viewer-left`, or a requested state to a more convenient label. If an output set is ambiguous, resolve it in the batch brief before dispatch.

## Choose batch boundaries

Split work by independent output family:

- one character with several expressions;
- one flower species with several directions/states;
- one independent character design set.

Give each subagent one family and exclusive output directory. Do not have two agents write the same manifest, source file, runtime file, or archive. Parent owns shared manifests and final promotion. Dispatch independent families in one parallel wave; cap API concurrency conservatively (default: 2 in-flight requests per family, 4 total) and lower it after a 429/5xx.

Parent allocates explicit request slots before dispatch, whose sum never exceeds4 (for example2+1+1 across three workers). A worker cannot raise its allocation. Queue excess families into later waves; a per-worker cap alone does not enforce the global cap.

Each subagent receives:

1. exact reference paths and which originals are immutable;
2. exact output IDs, moods/directions, and target staging paths;
3. identity block, style block, expression/state block, and plain negative clauses;
4. API model/endpoint and retry limits;
5. acceptance checks and the instruction to report defects, not hide them.

If the assignment is plan-only, parent runs no builds/tests/API calls to validate that plan. In generation mode, workers likewise skip project builds/tests; parent runs affected checks once after integration.

## Prompt contract

Build every prompt from these ordered blocks:

```text
[REFERENCE / EDIT INSTRUCTION]
[IDENTITY OR BOTANICAL SUBJECT]
[STYLE]
[EXPRESSION / DIRECTION / STATE]
[COMPOSITION AND ALPHA]
[PLAIN EXCLUSIONS]
```

For a clone or expression variant, use a fixed reference. If authored artwork exists, reference it for every variant. For a new design without authored artwork, first inspect and accept one neutral master, then freeze its path/hash for all variants. Never chain one expression into the next. Keep style-reference and identity-reference roles distinct; do not copy the style reference person's face/outfit.

Keep expressions/directions local: `change only eyebrows, eyes, mouth`; `stem leans viewer-left`; `closed bud`. Explicitly freeze pose, hands, clothing, silhouette, prop, camera, and canvas when they must remain fixed. Do not use a generic identity prompt for multiple characters.

Resolve the existing configured 9Router base URL and secret without printing them. Send `POST <base>/images/generations` when base ends in `/v1`, with `Authorization: Bearer <secret>` and `Content-Type: application/json`. Do not hardcode a personal host or install a provider. `cx/gpt-image-2.5` is the exercised model, not a guarantee of permanent availability. Read current [9Router image API](https://raw.githubusercontent.com/decolua/9router/master/skills/9router-image/SKILL.md) if provider support is unclear.

9Router image-generation payload:

```json
{
  "model": "cx/gpt-image-2.5",
  "prompt": "<all blocks; exclusions are plain text>",
  "size": "1024x1024",
  "background": "transparent",
  "image": "data:image/png;base64,<reference bytes>"
}
```

`image` is for reference-conditioned requests. Do not assume `negative_prompt`, masks, seeds, or pixel-preserving edits work on this route unless the current provider documentation and a live response establish them. The response may use a different canvas size than requested; measure it.

Concrete `rose-left` prompt (pair with a visually inspected rose reference, never a guessed filename):

```text
Keep the supplied red rose's botanical design; change direction only. One crimson rose bloom, thorny green stem and serrated leaves. Match the project's rough graphite contours and opaque flat matte colors. Bend the stem and bloom toward viewer-left, not a mirrored copy. Show the full stem with comfortable margins on transparent background. No other flower, vase, text, sheet, glossy lighting or realistic hair-like petal texture.
```

## File safety and manifest

Before any replacement, archive the exact old bytes under a batch-specific directory and record SHA-256. Stage new files outside runtime, for example:

```text
asset-source/generated/<batch>/<asset-id>.png
asset-source/generated/<batch>/<asset-id>.payload.json
asset-source/generated/<batch>/manifest.json
```

A record includes: asset ID, mood/state, reference path and reference SHA-256, model, HTTP status, prompt hash, output path, output SHA-256, byte size, returned dimensions, attempt count, timestamp, and review status. Payload metadata may replace base64 with `{path, sha256, encoding}`; never write credentials or raw base64 to disk.

Collision policy: existing authored/runtime files are immutable until explicit promotion. If a target exists, stage a new candidate or stop for parent review; do not overwrite for convenience. Resume by manifest ID, not by rerunning every successful item.

## Retry and failure policy

Retry transient HTTP429/5xx, timeout, or transport failures at most twice: 2s,4s plus jitter; honor a longer valid `Retry-After`. Validation failures are rejected, not retried unchanged. Invalid JSON, absent image data, invalid raster, missing required transparency, or zero bytes fail validation. Returned size differing from a requested hint requires review; reject only if it violates an explicit deliverable size constraint.

After one rate-limit response, reduce concurrency for that family. After repeated failures, leave the item pending and continue independent work; report the exact blocker.

## Review gate before promotion

For each candidate:

1. Decode with an image library; verify PNG/WebP format and RGBA mode.
2. Verify alpha has both transparent and opaque pixels where isolation is required.
3. Record returned dimensions and visible alpha bounds; do not assume requested size.
4. Open/read the actual image and inspect identity, style, pose, expression/state, composition, edge halos, colored fringe, and accidental text/props.
5. Compare against the supplied reference or canonical style artifact. Qualitative review is not a similarity percentage.
6. Mark `approved`, `rejected`, or `needs-cleanup` in the manifest with a reason.

Promote only approved candidates. Export runtime WebP with the project’s existing convention (RGBA, max height 1200, Lanczos, quality 90, method 6) and re-decode the export. Keep rejected candidates and their reasons; do not silently delete useful evidence.

## Subagent coordination

Use one subagent per genuinely independent family, in parallel. An agent may edit only its assigned staging/archive directory and prompt document. It must not edit shared source indexes, runtime mappings, shared manifests, or another agent’s files. Parent integrates after all agents return, checks collisions, reads every claimed artifact, and runs the complete affected test/validation command once.

## Common failure traps

| Temptation | Required correction |
|---|---|
| “Make one sheet to save requests” | One request and one output per asset; sheets are not individual runtime assets. |
| “Overwrite; originals are backed up later” | Archive bytes and hashes first; stage candidates separately. |
| “Use the last generated image as reference” | Reuse the authored reference for each variant to prevent identity drift. |
| “HTTP 200 means done” | Decode, inspect, record alpha/bounds, and gate promotion. |
| “The prompt says same style, so it matches” | Open the output and report observed mismatch. |
| “Add a reusable pipeline framework first” | Use the existing generator and smallest scripts; add abstraction only when a real repeated failure requires it. |
| “Parallel means everyone edits the same queue” | Partition by family and exclusive paths; parent owns shared state. |
| “Keep retrying forever” | Two transient retries, then record pending and continue independent work. |

## Completion report

Report: generated/approved/rejected/pending counts; exact staging/runtime paths; archive and manifest paths; model/request status; visual defects; tests/validators actually run; and any unpromoted assets. Say explicitly when assets are generated but not wired into gameplay. 
