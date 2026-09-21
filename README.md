# Nainne

A cozy personal portfolio and photo gallery, Yuru Camp themed. Static site served by GitHub Pages at https://kabosuneko.github.io/.

## Tech

Plain HTML, CSS, and vanilla JavaScript. No build step, no frameworks, no package.json.

## Structure

- `index.html` - landing page with projects and contact
- `gallery.html` - photo gallery with a lightbox
- `404.html` - themed error page
- `robots.txt`, `sitemap.xml` - crawler basics
- `assets/css/styles.css` - day/night theme via CSS variables
- `assets/css/gallery.css` - gallery grid and lightbox
- `assets/js/app.js` - shared logic (theme, clock, toast, corner characters)
- `assets/js/gallery.js` - gallery rendering
- `assets/img/` - logos and character art
- `assets/gallery/` - the photos

## How to add photos

1. Drop a `.webp` file into `assets/gallery/`.
2. Push - the gallery renders the list in `assets/js/gallery.js` right away, then refreshes it from the folder via the GitHub API.

## Run locally

Serve the folder with a static server:

```bash
python3 -m http.server
```

Then open http://localhost:8000/.

## Deploy

Push to the `main` branch. GitHub Pages serves the site automatically from the repo root.
