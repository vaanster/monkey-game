## Goal
Add a second "VIP" carousel below the main one. Both carousels coexist — the main one never disappears. The VIP section (title + carousel) stays completely hidden until a specific unlock id is granted by the sheet. Once unlocked, it starts with 3 visible slides and grows one slot at a time as further answers unlock more.

## Changes

**`src/data/artifacts.ts`**
- Export a new array `vipArtifacts: Artifact[]` alongside `artifacts`.
- Contents (id namespace `v01`, `v02`, …):
  - `v01`, `v02`, `v03` — initially visible once VIP is unlocked (real title/caption/lore; placeholder images for now).
  - `v04`–`v08` — pre-configured `hidden: true` slots (same "???" pattern as the main carousel's `06`–`10`). Add more later by appending.
- Main carousel keeps its `01`–`10` ids untouched.

**`src/components/ArtifactCarousel.tsx`**
- Accept an optional prop `source: Artifact[]` (defaults to the existing `artifacts`). All filtering, unlocking, custom-artifact merging, indicators, and dialog logic stays exactly the same — it just operates on whichever list is passed in.
- The shared `unlocked` ids from localStorage drive both instances; ids never collide because of the `v` prefix.

**`src/App.tsx`**
- Track `unlocked` ids from `loadProgress()` with the existing `nightshade:progress-updated` + `storage` listeners.
- Define `const VIP_UNLOCK_ID = "vip"` (the value the sheet's `unlocks` column returns to reveal the section).
- Always render the main `<ArtifactCarousel />`.
- Below it, conditionally render a VIP section only when `unlocked.includes(VIP_UNLOCK_ID)`:
  - A "VIP" heading styled with the existing display font + primary accent and a thin divider.
  - `<ArtifactCarousel source={vipArtifacts} />`
- When locked, render nothing — no placeholder, no hint.

**No changes** to `submitAnswer.ts`, `config.ts`, or the Apps Script contract. Everything flows through the existing `unlocks` array.

## Sheet configuration
- One answer row with `unlocks = vip` → reveals the VIP section with its 3 starting slides.
- Additional answer rows with `unlocks = v04`, `v05`, … → grow the VIP carousel one slot at a time.
- Same pattern as the main carousel (`unlocks = 06`, `07`, …) continues to work independently.

## Behavior after change
- Fresh visit → only the main carousel is visible; no sign of VIP exists.
- Correct answer returns `unlocks: ["vip"]` → "VIP" title + VIP carousel appear with `v01`–`v03`. Main carousel is unchanged.
- Subsequent correct answers returning `v04`, `v05`, … extend the VIP carousel; ids like `06`, `07`, … continue to extend the main one. Both can grow indefinitely.
- All state persists in localStorage via the existing `unlockedArtifacts` array.