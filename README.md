# Nainne

Personal page and photo gallery, served as static files by GitHub Pages at
https://kabosuneko.github.io/.

No build step, no dependencies, no framework. Plain HTML, CSS, and JavaScript.

## Files

    index.html          projects and contact
    gallery.html        photo gallery
    404.html            error page
    DESIGN.md           design direction, dials, and the reason for each decision
    assets/css/         styles.css (shared, theme tokens), gallery.css (grid, lightbox)
    assets/js/          app.js (theme, clock, toast, greeting, star counts), gallery.js (lightbox)
    assets/img/         logo, avatar, mascots
    assets/gallery/     photos

## Adding a photo

1. Put a `.webp` file in `assets/gallery/`.
2. Add a `<button class="gallery-item">` with an `<img>` in `gallery.html`, including the real
   `width` and `height` so the grid does not jump while loading.

## Running

    python3 -m http.server

Open http://localhost:8000/.

## Deploying

Push to `main`. GitHub Pages serves the repository root as is.

## Notes

- The pages content works without JavaScript. JavaScript adds the theme toggle, the clock, the
  Nadeshiko greeting, updated star counts, and the gallery lightbox.
- Themes: auto follows the clock (06:00 to 18:00 is day, otherwise night) and is re-checked while a
  tab stays open; the toggle cycles auto, day, night and the explicit choice is remembered. Both
  themes are verified against WCAG AA contrast.
- Star counts and the lightbox use platform features first: numbers come from one GitHub API call
  with the last known values written in the HTML as fallback, and the lightbox is a native
  `<dialog>`.
