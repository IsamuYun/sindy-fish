# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`sindyfish-inner-court`（内庭 / "云端之燏"）is a single-page promotional site for a
psychotherapist. It is a React 18 + Vite 8 static site with no router, no backend, and no
test suite. All user-facing copy is in Simplified Chinese — preserve tone and language when
editing text.

## Commands

```bash
npm install        # install deps (or `npm ci` for clean/CI installs)
npm run dev        # Vite dev server on 127.0.0.1
npm run build      # production build into dist/
npm run preview    # serve the built dist/ on 127.0.0.1
```

Node `^20.19.0 || >=22.12.0` is required (Vite 8). There is no lint or test command.
Deployment details (Vercel, Netlify, Nginx, GitHub Pages) live in `docs/deploy.md`.

## Architecture

### View switching without a router
`src/App.jsx` is the single stateful root. It holds a `view` string (`'home'` |
`'tea-room'` | `'pavilion'`) and renders all three pages simultaneously, each wrapped in a
`PageFrame` that toggles `data-active`, `aria-hidden`, and `inert`. CSS (`src/styles.css`)
handles the visual transition between frames. "Navigation" is just `setView` callbacks
passed down as props (`onHome`, `onOpenTeaRoom`, `onOpenPavilion`) — there are no URLs or
history entries.

### The consultation dialog lives at the root
The booking modal (`ConsultationDialog`) and all its form state (`form`, `invalidFields`,
`status`, `submitting`) live in `App.jsx`, not in any page. Every page receives an
`onOpenConsult` callback. The form does **not** submit anywhere — `submitConsult` validates
client-side and simulates success with a `setTimeout`. The modal implements its own focus
trap, Escape-to-close, `prefers-reduced-motion` handling, and `body.modal-open` toggling.

### Home page = a three-"page" walk toward the sea
`HomePage.jsx` is more than a landing page. It composes a scroll-driven parallax world
built around `useParallaxScene.js`:
- `journeyLayers` in `HomePage.jsx` is the source of truth for the journey: three stacked
  background images (`assets/img/home/hero-seaside-1|2|3.webp` = 裂隙 → 途中 → 岸边) that read
  as walking closer to the shore. `useParallaxScene(journeyLayers.length)` drives them.
- The hook takes a `pageCount`, hands out `registerLayer(i)` / `registerScene(i)` callback
  refs, and runs a `requestAnimationFrame` loop that interpolates `pageProgress` (0 →
  pageCount-1) toward the active page. Per layer it computes `distance = pageProgress - i`:
  a layer still ahead sits slightly smaller, a layer already passed scales up and fades out,
  which is what produces the dolly-forward "walking" feel. Opacity, transform,
  `pointerEvents`, and `inert` are set directly on DOM nodes inside the tick — not via React
  state — for performance.
- Scene `i` pairs with layer `i`: `HeroScene` (0), `SeasideWalkPage` (1, the 「海就在前面」
  interstitial), `ConsultProcessPage` (2, the "咨询是怎么进行的" guide). Scene copy fades
  faster than the background so two pages' text never overlaps.
- One gesture = one page. Wheel steps are gated by a `WHEEL_LOCK_MS` window (inertia during
  that window is swallowed, `preventDefault`ed, so it can't skip a page or leak into the next
  page's inner scroll). `canScrollWithin` lets a genuinely scrollable region (e.g.
  `.cta-wrap`) consume the wheel first; on every page change the incoming scene's scroll
  positions are reset to the top. Arrow/PageUp/PageDown/Home/End and touch swipes step too.
- `jumpToPage(index)` snaps to a page; `Navigation.jsx` and `PageDots.jsx` both use it with
  page indices (not fractional progress).
- All three scenes' text panels (`.hero-left`, `.walk-wrap`, `.cta-wrap`) share one look via
  the `--panel-*` custom properties in `:root` (border/bg/heading/kicker/text colors, radius,
  padding, title & body sizes). Restyle the panels there, not per-panel.
- Wheel handling is suppressed whenever `body` has `modal-open`.

When changing parallax/scroll behavior, the source of truth is `useParallaxScene.js` plus
the matching `#stage`, `.world-layer`, `#scene1`, `#scene2`, `#scene3` rules in `styles.css`.
The element IDs/classes in the hook, the JSX, and the CSS must stay in sync, and scene `i`
must keep the id `#scene{i+1}`.

### Pages and assets
- `src/pages/` — `HomePage` (parallax), `SeasideWalkPage` (scene 2 content),
  `ConsultProcessPage` (scene 3 content), `TeaRoomPage`, `PavilionPage` (standalone
  `.space-page` views).
- `src/components/` — `Navigation`, `PageDots`, `Chevrons`, `StarMark` (inline SVGs).
- `src/sceneAssets.js` — central import point for shared scene images; import images as ES
  modules so Vite fingerprints them into `dist/assets/`. Do not hardcode `dist/` paths.
- `src/styles.css` — one global stylesheet (~1100 lines) for the entire app; there are no
  CSS modules or component-scoped styles.

### Multi-entry build (standalone slides)
`vite.config.js` defines three Rollup inputs: the main app (`index.html`) plus two
standalone HTML slide decks in `src/slide/` (`sand-game-1.html`, `sand-game-2.html`). These
are self-contained presentations linked from the home page via `import.meta.env.BASE_URL`
and are NOT part of the React tree. If deploying under a sub-path, set `base` in
`vite.config.js` (see `docs/deploy.md`) so both the app and the slide links resolve.

## Conventions
- `.jsx` for all React files; ES module imports throughout; `import.meta.env.BASE_URL` for
  any link to static/public assets so sub-path deploys keep working.
- Accessibility is a deliberate concern in existing code (focus trapping, `aria-*`, `inert`,
  reduced-motion branches) — match that bar when adding interactive UI.
