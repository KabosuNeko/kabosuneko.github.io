# Design direction

A quiet, typographic personal page on flat Gruvbox dark, with two Yuru Camp mascots as the only
ornament.

Dial: ENERGY 1 / RHYTHM 1 / MOTION 1

## Palette (one theme, dark)

- Core: Gruvbox dark surfaces (#1d2021 ground, #32302f cards) with #ebdbb2 ink; muted #a89984.
- Accent: Gruvbox orange (#fe8019) for section labels, hover and focus rings. It is the only
  saturated colour on the page.
- One theme, no switch: there is no light palette to keep in sync, so every contrast pair is
  verified once. The palette mirrors the owner's Linux desktop theme.

## Type

- Nunito for everything: one family, with size and weight doing the hierarchy work.
- No display font. Options tried and declined: DotGothic16 on labels (read as a different site),
  Pixelify Sans and Silkscreen on the display roles (pixel voice fought the quiet, warm page).
  A single family keeps the page calm, which is the point.

## Shape

- Three radii, all tokens: 10px for tags and tooltips, 12px for rows, chips, back links, the toast
  and the lightbox caption, 16px for cards and photos. Circles stay 50%, because avatars and icon
  buttons are round. Nothing is a 999px pill.
- Shadows belong to what floats above the page: the toast, the tooltips and the greeting bubble.
  Static cards use a hairline border instead of a shadow.
- Transitions live on interactive elements only (links and buttons), named property by property,
  at 150ms: hover is a high-frequency interaction and a longer fade reads as lag. Nothing else on
  the page animates.
- The star beside a star count is an SVG from the sprite, not the ★ character: Nunito's latin subset
  has no U+2605, so a text glyph would be drawn by whichever symbol font the visitor happens to have.

## Decisions and reasons

- Project rows are links, not cards: one full-row target over 44px tall, with a ↗ glyph marking
  that the link leaves the site.
- Contact entries are chips with icon plus label, each opening a real destination.
- Sections use a label and a hairline rule instead of colored slabs: hierarchy comes from type.
- The ground is flat: one colour, no gradient, no texture, no background image, nothing animating
  behind the text. Skies, glows and grain were all tried here and each one cost legibility more than
  it paid back.
- Text glows were dropped with them: a `text-shadow` on a flat dark ground only fuzzes the edges of
  the type.
- Secondary text is #b8ab9c rather than Gruvbox's #a89984. The original pair measured 4.72:1 on a
  card, which passes AA and still reads thin; the lighter tone measures 5.84:1 there and 7.29:1 on
  the ground.
- Body copy is 15.2px with 1.6 line height, and rows carry 18px of padding: the page is read, not
  scanned.
- Nadeshiko greets by time of day and links to the camp check; Rin is a plain link to the gallery.
  Neither is navigation furniture: they are the two destinations the page has, drawn as mascots.
- Rin is the only route to the gallery. A photos chip was tried in the contact list and dropped:
  a second path to the same page is noise, and the mascot already carries it.
- Star counts come from the GitHub API, with the last known values in the HTML as fallback.
- The camp check is a page, not an overlay: as a panel it covered the project rows on a phone and had
  nowhere to put a forecast or a radius switch. Nadeshiko links to `/camp/` from every page, and on
  that page she is a button that looks the location up again.
- That page is the only place besides the star counts that talks to a third party. It asks for a
  location on load and on demand, waits 2.5 s at most, paints the forecast the moment it arrives
  instead of holding it for the slower camp list, remembers which Overpass instance answered last,
  and caches by coordinate and radius (20 minutes for weather, 24 hours for camp sites).
- Weather comes from Open-Meteo and sites from OpenStreetMap, both keyless. Their licences require
  attribution, so the page carries "© OpenStreetMap contributors · Weather: Open-Meteo.com", not
  decoration: a condition of using the data.

## Constraints

- Dark only. A light theme was tried and dropped: two palettes meant two contrast checks, a toggle to
  explain, a pre-paint script to avoid a flash, and a one-frame transition guard for the flip. The
  page is a night camp, so it stays night.
- The 404 page carries the same header and mascots, so an error never lands the visitor on a page
  that looks like a different site.
- The camp check never pretends: it names the place it fell back to ("Hanoi (default)") when there is
  no location permission, and says so when a service does not answer.
- A page that cannot work without JavaScript says so in a `<noscript>` line, unlike the rest of the
  site, which reads fine with scripts off.
- WCAG AA contrast, verified once because there is one theme: ink 11.95:1, muted 7.29:1 on the
  ground and 5.84:1 on cards, the orange accent 6.49:1. Nothing sits behind the text.
- Keyboard reachable, visible focus.
- No invented content: no fake numbers, no testimonials, no placeholder sections.
