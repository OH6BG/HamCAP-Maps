# VOACAP DX Charts — HamCAP Maps

This is a lightweight client-side viewer for propagation prediction coverage maps made by HamCAP. It shows multiple frequency-band maps for three time slots (previous / now / next UTC) per band, supports lazy-loading, an in-memory LRU image cache, keyboard accessibility, theme toggle, and a simple magnify-in-new-tab feature.

The use of VOACAP hours is enforced; in other words, an hour spans from xx:30 to yy:30. For example, 07 UTC spans from 06:30 UTC to 07:30 UTC.

## Files
- `index.html` — main single-file application (HTML/CSS/JS).
- `hamcap-sw.js` (optional) — service worker (registered if present).

## Features (user-facing)
- Grid of maps from 3.5 MHz to 28 MHz by band and time (prev/now/next).
- Hover highlight for each map tile; clicking the highlighted tile opens a magnified view in a new tab.
- Keyboard support: tiles are focusable and Enter/Space opens the magnified view.
- Theme toggle (dark/light).
- Hour selection strip to pick UTC hour; images update accordingly.
- Lazy-loading with IntersectionObserver to defer downloads until near-visible.
- In-memory LRU cache to avoid refetching recently used images.
- Small UI hint explaining click behavior.

## Developer / Configuration notes
- Image URL prefix:
  - Configured via `const URL = 'https://<url to image directory>/';` in `hamcap.html`.
  - Image template: `${URL}__TIME__UT-${bandId}MHz.gif`. `__TIME__` is replaced with `HH` strings (e.g. `00`, `13`).
- Bands list:
  - Edit the `bands` array in the script to change which frequency panels are shown.
- Cache size / TTL:
  - `CACHE_LIMIT` (count) and `CACHE_TTL_MS` (milliseconds) are defined near the top of the script. Tune for memory/network constraints.
- Lazy-load tuning:
  - IntersectionObserver uses `rootMargin: '360px'` and `threshold: 0.02`. Reduce `rootMargin` to delay loading further.
- Slot aspect:
  - Map tiles use `aspect-ratio: 16 / 9` and `min-height` values. Adjust `img.width/img.height` hints to match real image dimensions.
- Magnify scale:
  - The magnified page uses `transform: scale(2)` — change this scale value in `openMagnified()` if a different zoom is desired.
- Filename title:
  - The magnified tab uses the image filename (without extension) as the page title.

## How to run / test locally
1. In `index.html`, set up the URL to the map directory.
2. Open `index.html` in any modern browser.

Notes:
- Service worker registration requires HTTPS or `localhost`.
- Pop-up blockers can prevent the magnified tab from opening; the code falls back to opening the raw image if writing the magnified wrapper fails.

## Accessibility & UX
- Map tiles are keyboard-focusable (`tabindex=0`) and have `role="link"` with an accessible label updated when times are set.
- The hint text (`.map-hint`) informs users about hover/click and keyboard controls.
- Images use `decoding="async"` and a neutral SVG fallback on error.

## Performance considerations & improvements
- Large images (400–500 KB each) will still be fetched when a tile becomes visible; consider:
  - Providing server-side thumbnails (small variant) and swapping to hi-res when needed.
  - Using `srcset`/`<picture>` for responsive images.
  - Restricting cache by byte size, not just count.
  - Implementing retry/backoff for transient failures.
- Preconnect to the image host is included (`<link rel="preconnect" href="https://<host>" crossorigin>`).

## Troubleshooting
- Images not loading:
  - Verify `URL` prefix and that generated image paths exist on the server.
  - Check console for CORS errors from the image host.
- Magnified tab blank or blocked:
  - Browser popup blocker may have blocked the new tab. Allow pop-ups for localhost or the site.
  - If magnified HTML write fails, the raw image URL is opened as fallback.
- Service worker not registering:
  - Ensure serving over `localhost` or HTTPS.
