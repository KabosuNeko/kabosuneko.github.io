# Nainne

Personal page and photo gallery, served as static files by GitHub Pages at
https://kabosuneko.github.io/.

No build step, no dependencies, no framework. Plain HTML, CSS, and JavaScript.

## Files

    index.html          projects, photos link and contact
    gallery.html        photo gallery
    404.html            error page
    robots.txt          crawler policy
    sitemap.xml         indexable URLs
    DESIGN.md           design direction, dials, and the reason for each decision
    assets/css/         styles.css (shared, theme tokens, font faces), gallery.css (grid, lightbox)
    assets/js/          app.js (theme, clock, toast, greeting, star counts), gallery.js (lightbox)
    assets/fonts/       M PLUS Rounded 1c subsets, self-hosted
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

## Running

    python3 -m http.server

Open http://localhost:8000/.

## Deploying

Push to `main`. GitHub Pages serves the repository root as is.

## Notes

- The pages content works without JavaScript. JavaScript adds the theme toggle, the clock, the
  Nadeshiko greeting, updated star counts, and the gallery lightbox.
- The Email chip copies the address and says so; without a working clipboard it opens the mail client
  instead of doing nothing.
- Themes: auto follows the clock (06:00 to 18:00 is day, otherwise night) and is re-checked while a
  tab stays open; the toggle cycles auto, day, night and the explicit choice is remembered. Both
  themes are verified against WCAG AA contrast: the coloured slabs carry near-black ink, and text
  accents use a darkened orange because the brand orange cannot carry text. DESIGN.md lists the
  ratios.
- Star counts and the lightbox use platform features first: numbers come from one GitHub API call
  with the last known values written in the HTML as fallback, and the lightbox is a native
  `<dialog>`.
- Type is `M PLUS Rounded 1c`, the rounded gothic the Yuru Camp portal uses, self-hosted from
  `assets/fonts/` (latin and vietnamese subsets at 400, 700 and 800). No request leaves the site for
  fonts; only latin 400 is preloaded, and the vietnamese subsets load only when a page contains
  those characters. The family ships no 600, so the rules that ask for 600 resolve to 700.
- `theme-color` tracks the theme: the head ships the day colour and `applyTheme()` in `app.js`
  rewrites it from the `--bg` token when the theme changes.
- `404.html` uses root-relative paths (`/`, `/assets/...`) because GitHub Pages serves that file for
  missing paths at any depth; the other pages only exist at the site root and stay relative.
- Each page sets `data-theme` from a small inline script in `<head>`, before the stylesheets load, so
  the correct theme paints on the first frame. Keep that rule in sync with `getAutoTheme()` in
  `assets/js/app.js`.
