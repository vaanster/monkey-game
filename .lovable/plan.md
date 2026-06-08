## Goal
Hidden carousel slots should not appear at all until they are unlocked. On first visit, only the 5 visible artifacts are shown. Each unlock (via the sheet today, other triggers later) appends a new element to the carousel.

## Changes

**`src/components/ArtifactCarousel.tsx`**
- After merging base + custom artifacts and applying `unlocked`, filter out any entry still marked `hidden`.
- Result: sealed slots are completely absent from the carousel, the title row, and the indicator dots until their id is unlocked.
- Keep the index safe: if `index >= artifacts.length` after a refresh, clamp to the last item (no-op normally, just defensive).

**`src/components/ArtifactDialog.tsx`** (and the "Sealed" lock UI in the carousel)
- No longer reachable for hidden items, but leave the `Lock` branch in place as a harmless fallback. No behavior change needed.

**`src/data/artifacts.ts`**
- No structural change. `hiddenArtifacts` (ids `06`–`10`) stays as the pre-configured pool. They simply won't render until unlocked by the sheet's `unlocks` value or by a `newArtifact` payload.
- Document at the top of the file: "Hidden entries are invisible in the carousel until their id appears in `unlockedArtifacts` (localStorage) — set the sheet's `unlocks` column to that id."

**No changes** to `submitAnswer.ts`, `config.ts`, or the Apps Script contract. Unlocks already drive `unlockedArtifacts`; we're just changing how the carousel renders that state.

## Behavior after change
- Fresh visit → carousel shows 5 dots, 5 artifacts (`01`–`05`).
- Correct answer returns `unlocks: ["06"]` → carousel grows to 6 dots, 6 artifacts; the new one appears at the end.
- Same applies to sheet-defined `newArtifact` payloads (id auto-added to unlocks).
- localStorage continues to persist unlocks across reloads.
