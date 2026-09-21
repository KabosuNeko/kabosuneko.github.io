# Design direction

A quiet, typographic personal page on a Gruvbox palette. Warm surfaces, one accent, and two
Yuru Camp mascots as the only ornament.

Dial: ENERGY 1 / RHYTHM 1 / MOTION 1

## Palette (2 core + 1 accent)

- Core: warm paper surfaces (background, card) and ink text, in light and dark Gruvbox.
- Accent: Gruvbox orange, reserved for section labels, hover, focus rings, and the dark-mode glow.
- The palette mirrors the owner's Linux desktop theme.

## Type

- Nunito for everything readable.
- DotGothic16 (pixel) for section labels and the clock only: it matches the owner's Japanese
  game and camping references. Held at 16px so the pixel grid stays sharp; no wide tracking.

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
- Star counts come from the GitHub API, with the last known values in the HTML as fallback.

## Constraints

- WCAG AA contrast in both themes, keyboard reachable, visible focus.
- No invented content: no fake numbers, no testimonials, no placeholder sections.
