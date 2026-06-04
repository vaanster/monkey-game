## Scope (Task 1 — design only)

Build the static landing page in the chosen "Occult Archivist" direction, retuned **lighter / more playful** (whimsical-mystery, not horror). No backend, no hashing, no Sheets wiring yet.

## Vibe adjustments

- **Typography**: swap `Almendra` (gothic-horror) for a playful display face. Use **"Silver Charm Duo"** for headings, with `Caveat` as a safe Google Fonts fallback if Silver Charm Duo isn't loadable from a public CDN (it's a paid Adobe font, so I'll attempt to load it from a `@font-face` URL if you provide one, otherwise fall back). Body stays clean — `Space Mono` swapped for **`Nunito`** for a warmer, rounder read.
- **Palette retune** (lighter, still moody but cartoonish):
  - background `#1a1622` (deep plum, not black)
  - foreground `#f5ecd9` (warm cream)
  - muted `#8a7fa3`
  - primary `#e89b3c` (warm amber — friendly accent instead of blood red)
  - secondary `#7ec4a6` (soft mint for the "correct answer" / reveal hint)
  - border `#3a3148`
- **Motion**: keep gentle `bob`; soften `flicker` (no horror-strobe — just a slow lantern glow pulse); keep `ink-spread` reveal.
- Drop the `[!]` decorative accent; keep a faint `?` watermark in a playful tilt.

## What gets built

1. **Design tokens** in `src/styles.css`
   - Add the lighter palette as semantic tokens (oklch).
   - Load fonts in `__root.tsx` head links (Silver Charm Duo via Adobe URL if provided, plus Caveat + Nunito from Google Fonts as fallback chain).
   - Add keyframes `bob`, `glow-pulse`, `ink-spread` and utility classes.

2. **Artifact data file** `src/data/artifacts.ts` — **single source of truth, easy to edit**
   ```ts
   export const artifacts = [
     { id: "01", title: "...", image: artifact01, caption: "...", lore: "...", hidden: false },
     ...
   ];
   ```
   To swap an image later you just drop a new file in `src/assets/artifacts/` and change one import line. 6 entries (5 visible + 1 hidden slot).

3. **Home route** `src/routes/index.tsx`
   - Header ("Case File #88-Alpha" + H1 "Archive of Unspoken Echoes"), centerpiece carousel, dot indicators, floating amber "SUBMIT ANSWER" seal, footer, soft `?` watermark.
   - Update `head()` meta for the ARG site.

4. **Carousel component** `src/components/ArtifactCarousel.tsx`
   - **Circular artifact frame** — the clickable artifact is rendered inside a circular container (`rounded-full`, `aspect-square`, `overflow-hidden`) with a double-ring decorative border and the bob animation. Images render with `object-cover` so circular source art fits cleanly and square placeholders still look intentional.
   - Big left/right chevron buttons, dot indicators reflecting active index.
   - Keyboard arrow-key navigation + basic touch swipe.
   - Hidden slot renders as a locked silhouette (preview of reveal behavior coming later).

5. **Artifact modal** `src/components/ArtifactDialog.tsx`
   - Shadcn `Dialog`. Large circular artifact image + title + lore text, themed to match.

6. **Submit dialog (visual only)** `src/components/SubmitAnswerDialog.tsx`
   - Triggered by the floating amber seal. Name + Answer fields, "Transmit" button, placeholder status line. No logic yet.

7. **Placeholder artwork** (5 images via `imagegen`, saved under `src/assets/artifacts/`)
   - Generated **on a transparent background, centered, fitting a circle** so they preview well in the circular frame and your replacements (also circular) will drop in seamlessly. Whimsical hand-drawn cartoon style.

8. **Responsiveness**
   - Carousel arrows shrink and gaps collapse on mobile; circular artifact scales down; seal becomes a smaller pill at bottom-center on small screens; modals go full-width.

## Out of scope this turn

- Answer hashing & verification (Task 2.1)
- Hidden-slot reveal on correct answer (Task 2.2)
- Sheets / Formspree submission wiring (Task 2.3)
- Sub-routes for footer links (kept as `#` placeholders)

## Notes on the font

If you have a hosted URL or Adobe Fonts kit ID for **Silver Charm Duo**, paste it and I'll wire it directly. Otherwise the heading will render in `Caveat` (a similar playful handwritten Google font) until you provide the file/kit — this keeps the build green and the swap is one CSS line later.
