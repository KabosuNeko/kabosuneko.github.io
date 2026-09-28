# Nainne

Personal page and photo gallery, served as static files by GitHub Pages at
https://kabosuneko.github.io/.

No build step, no dependencies, no framework. Plain HTML, CSS, and JavaScript.

## Files

    index.html          projects and contact
    gallery.html        photo gallery
    camp/index.html     camp check: weather and nearby camp sites
    404.html            error page
    robots.txt          crawler policy
    sitemap.xml         indexable URLs
    DESIGN.md           design direction, dials, and the reason for each decision
    assets/css/         styles.css (shared, theme tokens, font faces), gallery.css (grid, lightbox)
    assets/js/          app.js (clock, toast, greeting, star counts, camp check), gallery.js (lightbox)
    assets/fonts/       Nunito subsets, self-hosted
    assets/img/         logo, avatar, mascots
    assets/gallery/     photos and their display variants

## Adding a photo

1. Put a `.webp` file in `assets/gallery/` (the original is the largest candidate each `srcset`
   offers, so keep it at the resolution you are happy to serve on high-DPI screens).
2. Generate the display variants:

       magick assets/gallery/photo.webp -resize '480x>' -strip -quality 75 -define webp:method=6 assets/gallery/photo-480.webp
       magick assets/gallery/photo.webp -resize '700x>' -strip -quality 80 -define webp:method=6 assets/gallery/photo-700.webp

   Skip the `-700` file when the original is narrower than 700px.
3. Add a `<button class="gallery-item">` with an `<img>` in `gallery.html`: real `width` and `height`
   so the grid does not jump, a `srcset` of the variants plus the original with `w` descriptors, and
   the shared `sizes` value.

The `sizes` attribute matches the grid in `gallery.css`, which is one column up to 640px, two up to
1024px, then three columns in a 1052px container:

    sizes="(min-width: 1024px) 333px, (min-width: 640px) calc(50vw - 34px), calc(100vw - 42px)"

The first photo in the grid loads eagerly with `fetchpriority="high"`; the rest stay `loading="lazy"`.

## Camp check

`/camp/` shows the weather and the camp sites mapped in OpenStreetMap around you, sorted by distance,
with a radius switch (10/50/100 km) and a seven day forecast. Nadeshiko links to it from every page
and re-runs the lookup when she is clicked on it.

The page asks the browser for a location when it loads and again if you press "Use my location"; it
waits 2.5 s at most and falls back to `DEFAULT_PLACE` in `assets/js/app.js` (Hanoi), naming the place
it used. The forecast paints as soon as it arrives, so a slow camp list never holds it back.

Two keyless services are involved, and both licences require the attribution the page displays:

- weather: `api.open-meteo.com`, cached 20 minutes per rounded coordinate
- camp sites: `overpass-api.de`, retried on `overpass.openstreetmap.fr` (the first instance 504s under
  load), cached 24 hours per coordinate and radius. The instance that answered last is tried first next
  time, which turns a 7 s stall into a 1.5 s lookup

Every failure is visible: a busy Overpass gets a line plus a link to the same coordinates on
openstreetmap.org, and a dead forecast says so. `CACHE_V` in `assets/js/app.js` prefixes the cache
keys, so changing the shape of a cached object cannot strand an old copy in someone's browser.

## Running

    python3 -m http.server

Open http://localhost:8000/.

## Deploying

Push to `main`. GitHub Pages serves the repository root as is.

## Notes

- The pages content works without JavaScript. JavaScript adds the clock, the Nadeshiko greeting,
  updated star counts, and the gallery lightbox.
- The Email chip copies the address and says so; without a working clipboard it opens the mail client
  instead of doing nothing.
- One theme, dark, on a flat ground: no background image, no texture, nothing animating behind the
  text. Contrast is verified against that single palette (ink 11.95:1, muted 7.29:1 on the ground and
  5.84:1 on cards, accent 6.49:1).
- Star counts and the lightbox use platform features first: numbers come from one GitHub API call
  with the last known values written in the HTML as fallback, and the lightbox is a native
  `<dialog>`.
- Nunito is self-hosted from `assets/fonts/` (latin and vietnamese subsets of the Google variable
  font). No request leaves the site for fonts; only the latin file is preloaded, and the vietnamese
  one is fetched only when a page actually contains those characters. Weights 400 to 800 come from
  one variable file, so `font-weight: 800` renders the real weight instead of a synthesised one.
- `theme-color` tracks the theme: the head ships the day colour and `applyTheme()` in `app.js`
  rewrites it from the `--bg` token when the theme changes.
- `404.html` uses root-relative paths (`/`, `/assets/...`) because GitHub Pages serves that file for
  missing paths at any depth; the other pages only exist at the site root and stay relative.
- Each page sets `data-theme` from a small inline script in `<head>`, before the stylesheets load, so
  the correct theme paints on the first frame. Keep that rule in sync with `getAutoTheme()` in
  `assets/js/app.js`.
