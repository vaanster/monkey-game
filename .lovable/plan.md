## Goal
Update the artifact pop-up to display the new **tall portrait card images** (~9:16) cleanly, keeping the existing colors/fonts. The image now becomes the hero, with title/caption/lore as text below.

## Changes

### `src/components/ArtifactDialog.tsx`
Restructure the dialog to a vertical, image-first layout:

1. **DialogContent sizing**
   - Replace `max-w-2xl` with a narrower portrait-friendly width: `max-w-md` (≈448px) with `max-h-[95vh]` and `overflow-y-auto`.
   - Keep existing border/bg/foreground tokens (unchanged colors/fonts).

2. **Image block (new — replaces the circular framed image)**
   - Remove the `size-48 rounded-full` circular crop and dashed ring.
   - Render the `detailImage` as a full-bleed rectangle at the top of the dialog, preserving the card's natural 9:16 ratio.
   - Container: `w-full aspect-[9/16] max-h-[70vh]` (mobile-first), centered, with a subtle `ring-1 ring-primary/20` and `rounded-md` so the card edges don't fight the dialog edges. No object cropping — use `object-contain` so the full card with its built-in border art is always visible.

3. **Text block (below the image)**
   - Keep the existing header order but move it **below** the image: small "Fragment {id}" eyebrow, `DialogTitle` (Caveat display font), `DialogDescription` caption (italic), then the lore paragraph.
   - Wrap in a `space-y-3 pt-4 text-center sm:text-left` block.
   - Remove the old side-by-side `flex md:flex-row` layout.

4. **Header behaviour**
   - The Radix `DialogHeader` (which carries `DialogTitle`/`DialogDescription` for a11y) stays in the DOM, but is rendered visually after the image by placing the image first in JSX and using normal flow (no absolute positioning).

### Files NOT changed
- `src/data/artifacts.ts` — already has `detailImage` field; user will swap in the new tall card images themselves.
- `src/components/ArtifactCarousel.tsx` — carousel circular thumb stays as-is.
- `src/components/ui/dialog.tsx` — no changes; we only override className on DialogContent.
- `src/styles.css` — colors, fonts, animations unchanged.

## Visual result
```
┌─────────────────────┐
│  [tall card image]  │  ← 9:16, fills width, up to 70vh
│  [tall card image]  │
│  [tall card image]  │
├─────────────────────┤
│ FRAGMENT 02         │
│ The Crooked Cottage │  ← Caveat display
│ A polaroid that…    │  ← italic caption
│                     │
│ Lore paragraph…     │
└─────────────────────┘
```

## Technical notes
- `aspect-[9/16]` + `object-contain` guarantees the card's painted border isn't cropped even if a future image deviates slightly from 9:16.
- `max-h-[95vh] overflow-y-auto` on `DialogContent` handles short laptop screens — image shrinks via `max-h-[70vh]`, text scrolls if needed.
- No new dependencies. No business-logic changes.
