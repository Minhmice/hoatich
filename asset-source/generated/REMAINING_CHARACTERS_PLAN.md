# Remaining characters: source-preserving generation

## Scope
User requests customer-one and passerby cloned from their hand-drawn01–02 references, identity prompts extracted, remaining character designs generated in the same drawing style. No gameplay or customer mapping changes in this asset-only pass.

## Ownership and sequence
- CustomerOne worker: inspect originals01–02, document identity/style/expression prompt blocks, regenerate03 sad /04 touched /05 surprised using original01 as identity reference. Originals01–02 remain bit-identical. Archive old03–05 PNG/WebP, individually request9Router, inspect every result and export max-height1200 WebP quality90/method6. May produce separate clone-controls for01–02; do not replace authored originals.
- Passerby worker: same contract, original02 neutral reference, regenerate03 happy /04 angry /05 surprised; preserve dark curled bob, pink T-shirt, jade necklace/bracelet, hands-at-hips pose. Originals01–02 unchanged.
- Parent: Bác Ba, Hồn Thi Sĩ and Chú Tư, three expressions each (neutral/sad-or-worried/peaceful-or-happy). Generate new neutral design using original customer-one01 ONLY as a drawing-style reference, explicitly forbid copying that person's identity/outfit. Further expressions reference each character's approved neutral output directly. Archive old assets before replacement; no changes to player.

## Generation contract
Endpoint `https://9router.minhmice.com/v1/images/generations`, model `cx/gpt-image-2.5`, one sprite per request, transparent background, image data URL reference. Credentials resolved from configured env / existing agent env file; never logged or stored. Exact prompts and sanitized reference path/SHA-256 in per-run JSON manifests. Observe actual returned size rather than assuming requested size.

## Art direction
Coarse imperfect graphite contours, simple stylized2D/anime faces, opaque muted matte color planes, sparse restrained flat shadows, low detail. No realistic pores/hair fibers, no glossy3D, no elaborate watercolor portraiture. New identities follow existing customers.ts descriptions; invented wardrobe/age choices recorded as design decisions, not canonical lore.

## Acceptance
Original customer-one/passerby01–02 and player untouched. All named replacement/new sprites decoded as RGBA with visible transparent pixels and visually inspected. Existing URLs and emotion numbering remain unchanged. Do not claim pixel-locked geometry or perfect alpha edges from neural regeneration. Preserve archived originals and document observed defects. Run full existing suite and content validator once after integration. Source/app signatures unchanged; grep all relevant portrait paths/moods for consistency.
