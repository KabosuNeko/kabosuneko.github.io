# Design direction

A quiet, typographic personal page on a Gruvbox palette. Warm surfaces, one accent, and two
Yuru Camp mascots as the only ornament.

Dial: ENERGY 1 / RHYTHM 1 / MOTION 1

## Palette (2 core + 1 accent)

- Core: warm paper surfaces (background, card) and ink text, in light and dark Gruvbox.
- Accent: Gruvbox orange, reserved for section labels, hover, focus rings, and the dark-mode glow.
- The palette mirrors the owner's Linux desktop theme.

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
- Transitions live on interactive elements only (links and buttons). Switching theme adds a
  one-frame `no-transition` class, so the ground and the text flip together instead of the text
  cross-fading over a background that already switched; that also keeps computed styles honest when
  measuring contrast.
- The star beside a star count is an SVG from the sprite, not the ★ character: Nunito's latin subset
  has no U+2605, so a text glyph would be drawn by whichever symbol font the visitor happens to have.

## Decisions and reasons

- Project rows are links, not cards: one full-row target over 44px tall, with a ↗ glyph marking
  that the link leaves the site.
- Contact entries are chips with icon plus label, each opening a real destination.
- Sections use a label and a hairline rule instead of colored slabs: hierarchy comes from type.
- Paper grain (4%) and the night sky stars (dark mode) support the camping identity; they carry
  no information.
- Glow is limited to two dark-mode elements (section labels, name) so headings do not sink into
  the background.
- Nadeshiko is a button that greets by time of day; Rin is a plain link to the gallery.
- Rin is the only route to the gallery. A photos chip was tried in the contact list and dropped:
  a second path to the same page is noise, and the mascot already carries it.
- Star counts come from the GitHub API, with the last known values in the HTML as fallback.

## Constraints

- Auto theme follows the clock (06:00 to 18:00 day, otherwise night), like Nadeshiko's greeting.
  The toggle overrides it and the explicit choice is remembered.
- The theme toggle keeps its 34px circle but carries a 44px hit area, so the row stays quiet without
  a small touch target.
- The 404 page carries the same header, theme toggle and mascots, so an error never lands the
  visitor on a page that looks like a different site.
- WCAG AA contrast in both themes, keyboard reachable, visible focus.
- No invented content: no fake numbers, no testimonials, no placeholder sections.
