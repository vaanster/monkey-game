## Goal
Replace the cloned carousel in the VIP section with a **horizontal coverflow filmstrip**: all unlocked VIP relics visible at once in a single row, the active one enlarged and centered, the others smaller / dimmer / slightly tilted on either side. Clicking a side relic makes it the new center; clicking the centered one opens the inspect dialog. Visually distinct from the main carousel's single-large-relic-with-arrows pattern.

## Why this layout
- Main carousel = one huge relic + arrows. VIP filmstrip = many relics visible simultaneously → reads as a "private shelf" not "more of the same."
- Showing every unlocked relic at once rewards the player and makes the collection feel tangible.
- Scales naturally as more `v##` ids unlock — strip just grows wider, side relics get progressively smaller / more faded.

## Changes

**`src/components/VipFilmstrip.tsx`** (new)
- Accepts `source: Artifact[]` (defaults to `vipArtifacts`).
- Subscribes to the same `unlocked` ids + `loadCustomArtifacts()` with `nightshade:progress-updated` + `storage` listeners. Same merge/override logic as `ArtifactCarousel`.
- Only renders currently-unlocked entries (hidden VIP slots don't appear at all — VIP already telegraphs scarcity).
- Local `activeIndex` state, defaults to the middle of the unlocked list.
- Layout:
  - Single horizontal row, centered, `overflow-hidden`, no scrollbars.
  - Each relic is a circular medallion (consistent with the world) but sized by distance from `activeIndex`:
    - Center (distance 0): `size-48 sm:size-64`, full opacity, thin gold ring + soft glow, no tilt.
    - Distance 1: `size-32 sm:size-44`, opacity ~0.8, slight rotateY (±12°), small translateX overlap.
    - Distance 2: `size-24 sm:size-32`, opacity ~0.5, rotateY (±20°), larger overlap.
    - Distance ≥3: `size-20`, opacity ~0.25, rotateY (±25°). Still rendered (always show whole collection).
  - All sizing/opacity/transform transitions animated with `transition-all duration-300`.
- Interaction:
  - Click a side relic → it becomes the new center (`setActiveIndex`).
  - Click the centered relic → opens existing `ArtifactDialog`.
  - Keyboard: ←/→ shift active index; Enter opens dialog (only when dialog isn't already open).
  - Touch swipe: same threshold logic as `ArtifactCarousel` (40px) shifts active index.
- Caption beneath the strip: `font-display` title + italic caption of the **active** relic, same typographic treatment as the main carousel for continuity.
- No arrow buttons, no dot indicators — the strip itself is the navigation.

**`src/App.tsx`**
- Swap the second `<ArtifactCarousel source={vipArtifacts} />` for `<VipFilmstrip />`.
- Keep the existing `unlocked.includes(VIP_UNLOCK_ID)` gate and the "VIP" heading + divider unchanged.

**No changes** to:
- `src/data/artifacts.ts` — same `vipArtifacts`, same `v##` id scheme, same hidden-slot mechanism.
- `src/components/ArtifactCarousel.tsx` — main carousel untouched.
- `ArtifactDialog.tsx`, `submitAnswer.ts`, `config.ts`, Apps Script contract — all unchanged.

## Visual distinction summary
| | Main carousel | VIP filmstrip |
|---|---|---|
| Items visible | One huge relic | Entire unlocked collection at once |
| Navigation | Arrows + swipe + dots | Click any side relic, or swipe/keys |
| Decoration | Dashed spinning ring, heavy frame | Tilted/faded side relics, soft center glow |
| Growth | Reveals one slot in place | Strip widens, side relics shrink further |
| Feel | "Spin the wheel" | "Shelf of trophies" |

## Behavior after change
- Locked → nothing rendered (unchanged).
- `unlocks: ["vip"]` → "VIP" heading + filmstrip with `v01`, `v02`, `v03`. `v02` centered by default.
- `unlocks: ["v04"]` → strip now shows 4 relics; the new one slots in and the perspective scaling absorbs the extra width.
- Clicking the centered relic opens the same `ArtifactDialog` used by the main carousel.

## Risks
- On very narrow viewports a deep strip (6+ unlocked) may visually clip. Mitigation: distance-3+ relics use the smallest size + high overlap; container is `overflow-hidden` so any extreme overflow is cropped, not breaking layout.

## Out of scope
- Adding new VIP relic art.
- Auto-advance / autoplay.
- Changes to the main carousel.
