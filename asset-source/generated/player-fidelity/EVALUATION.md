# Player prompt evaluation

## Deliverables
- Plan: `../PLAYER_FIDELITY_PLAN.md`
- Character identity prompt: `../player-identity-prompt.md`
- Independent style prompt: `../player-style-prompt.md`
- Reference / repository research: `../player-reference-research.md`
- Exact tested prompts and request fields: adjacent `*.payload.json`. The `image` entry records reference path/hash instead of embedding megabytes of base64. To replay, replace that entry with `data:image/png;base64,` plus the file's base64 bytes. Credentials are not stored.

## Actual experiments
Seven separate image-generation requests succeeded through `https://9router.minhmice.com/v1/images/generations`, model `cx/gpt-image-2.5`. Each request generated one image, not a sheet. All requested `1024x1024` with `background: transparent`; all returned PNG RGBA `1254x1254`. Alpha extrema `(0,255)` prove transparency exists, not that edges are production-clean.

| Trial | Observed identity and style | Expression | Decision |
|---|---|---|---|
| `text-sad.png` | Slate hair, flower and outfit concept retained; proportions, silhouette, crop and polished line rendering differ | Sad readable | Reject as exact player reproduction |
| `controlled-reference-sad.png` | Same prompt as text baseline, only added original image; hair, accessories and pencil style closer, but body reframed and details redrawn | Sad readable | Reference improves this comparison; reject exact pose/canvas preservation |
| `reference-sad.png` | Edit-oriented wording plus original reference; distinctive hair, headband, daisy, vest, waist apron, spray bottle and rough contours retained visually | Restrained sadness | Preferred trial workflow, not production-ready sprite |
| `reference-angry.png` | Same original anchor and edit template; core design retained visually | Brows furrowed, mouth tightened | Expression candidate, edge/alignment QA required |
| `reference-surprised.png` | Same original anchor and edit template; core design retained visually | Raised brows, small open mouth | Expression candidate, edge/alignment QA required |
| `reference-neutral.png` | Same original anchor; core design retained visually | Gentle closed smile | Reproduction control, original02 remains canonical |
| `reference-happy.png` | Same original anchor; core design retained, hair highlight detail changes | Open smile | Reproduction control, original03 remains canonical |

These are qualitative visual judgements, not percentage similarity scores. One text/reference controlled pair is not a statistical benchmark. Edit-template trials also change wording, so they do not isolate reference conditioning as the sole variable. No seed/repeatability guarantee was established.

## Recommended prompt usage
Use **original `02.png` as image input plus the exact edit prompt from `reference-sad.payload.json`**, replacing only the expression clause. Keep identity and style docs as reusable specifications; verbose reconstruction wording alone still permits redesign. All five reference-expression trials anchored the original directly, not a generated predecessor. Keep normal/happy originals rather than replacing them with regenerated duplicates.

## Concrete remaining limitations
- Whole sprite is regenerated and reframed. Directly swapping raw trials with originals can cause visual jitter.
- Visible colored/white edge flecks and alpha noise remain in several outputs. Do not call these clean runtime assets merely because they decode as RGBA.
- Original body immutability was measured only for original01–03: exact RGBA changes confined to union `(733,347,1052,657)` on `1800x1800`; 02vs01 changes6307px, 02vs03 changes2610px. Outside that rectangle original pixels match.
- To obtain identical bodies, an explicitly registered face composite or validated local edit workflow is needed. Not implemented or claimed here; raw generated faces cannot be pasted into original coordinates without alignment.
- No runtime assets or mappings were replaced during this earlier player-fidelity experiment. In the subsequent requested redo, source/runtime04–07 were replaced; failed originals are archived under `../player-redo/previous/`, with new request metadata in `../player-redo/manifest.json`.

## Verification and scope
All seven PNGs fully decoded using Pillow; format/mode/alpha asserted, paired payloads checked, model/background checked. SHA-256 rechecks confirm original01–03 unchanged. Controlled pair JSON differs only by `image` input. No shared function signature or application code changed in this task; generator callers intentionally unchanged. Full affected repository test run is recorded in the delivery after execution, not inferred from prior runs.

## Primary sources
- 9Router image reference fields: https://raw.githubusercontent.com/decolua/9router/master/skills/9router-image/SKILL.md — codex row documents `image`, `images[]`, `image_detail`, `output_format`, `background`. Current single-reference behavior also exercised here.
- Alternative only: https://github.com/tencent-ailab/IP-Adapter — image prompting / inpainting demos require a diffusion pipeline and model weights. Not installed, not invoked, not a proven improvement for this player and not a replacement for user-required 9Router generation.
