## Goal

Deploy the app as a static SPA to GitHub Pages at `https://<user>.github.io/monkey-game/` via GitHub Actions.

## Approach

The current stack (TanStack Start + nitro) is SSR-first and targets Cloudflare Workers — not compatible with GitHub Pages. Since the app is effectively one page with all logic client-side, the cleanest path is to **replace TanStack Start with plain Vite + React** (a true SPA build that emits static `index.html` + assets to `dist/`).

## Changes

### 1. Convert to plain Vite + React SPA
- Replace `vite.config.ts` to use `@vitejs/plugin-react` + `@tailwindcss/vite` + `vite-tsconfig-paths`, with `base: '/monkey-game/'`.
- Add `index.html` at project root with the head meta tags, Google Fonts links, and `<div id="root">`.
- Add `src/main.tsx` that mounts `<App />` into `#root` and imports `./styles.css`.
- Create `src/App.tsx` containing the current home page content (moved from `src/routes/index.tsx`).
- Remove TanStack Start bootstrap files: `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `src/routes/index.tsx`, and the `src/routes/` folder.
- Update `package.json`: remove `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`, `nitro`, `@lovable.dev/vite-tanstack-config`. Keep `@tanstack/react-query` (unused but harmless) or remove it — will remove since nothing uses it after the migration.
- Components (`ArtifactCarousel`, `ArtifactDialog`, `SubmitAnswerDialog`) and data (`artifacts.ts`) stay unchanged.

### 2. GitHub Pages SPA fallback
- Copy `dist/index.html` to `dist/404.html` during the workflow so deep links / refreshes work (GitHub Pages serves `404.html` for unknown paths). For this single-page app it's mainly a safety net.
- Add empty `public/.nojekyll` so Pages doesn't strip underscore-prefixed asset folders.

### 3. GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Trigger: push to `main` + manual `workflow_dispatch`.
- Jobs:
  - **build**: checkout, setup Bun, `bun install`, `bun run build`, `cp dist/index.html dist/404.html`, upload `dist/` as Pages artifact.
  - **deploy**: `actions/deploy-pages@v4` with proper `pages: write` / `id-token: write` permissions and `github-pages` environment.

### 4. Notes
- After first deploy, the user must enable Pages in repo settings: **Settings → Pages → Source: GitHub Actions**.
- If they later use a custom domain or a user/organization site (`<user>.github.io`), the `base` in `vite.config.ts` needs to change to `/`.

## Files touched

- replace: `vite.config.ts`, `package.json`
- create: `index.html`, `src/main.tsx`, `src/App.tsx`, `public/.nojekyll`, `.github/workflows/deploy.yml`
- delete: `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/` (and `src/lib/lovable-error-reporting.ts` if unused after cleanup — will verify)
