## Goal
Wire the uploaded `ex2.png` (tall "CHEF" card) into fragment **02** so it appears in the pop-up when the user clicks the second carousel item.

## Changes

1. **Add the image to the project**
   - Copy `user-uploads://ex2.png` to `src/assets/artifacts/chef_card.png`.
   - (This is a one-off art asset that should live with the other artifact images; no CDN migration needed for a single ~1MB file.)

2. **Update `src/data/artifacts.ts`**
   - Add import: `import chefCard from "@/assets/artifacts/chef_card.png";`
   - On the fragment with `id: "02"` (The Crooked Cottage), set `detailImage: chefCard`. Leave `image` (carousel thumbnail) as the existing `chef_avatar.png` — only the pop-up image changes.

## Not changed
- `ArtifactDialog.tsx` — already renders `detailImage` at 9:16 with `object-contain`, which fits the uploaded card perfectly.
- Other artifacts — their `detailImage` stays equal to `image` until you provide tall cards for them.

## Result
Clicking the 2nd carousel circle still shows the chef avatar thumbnail, but the pop-up now displays the full "CHEF" portrait card.
