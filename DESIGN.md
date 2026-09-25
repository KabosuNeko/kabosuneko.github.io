# Design direction

A personal page that borrows the Yuru Camp portal's language: a white ground, orange and cyan as
the brand pair, a rounded gothic, flat colour instead of shadows, and two Yuru Camp mascots as the
only ornament.

Dial: ENERGY 2 / RHYTHM 2 / MOTION 1

## Reference

[yurucamp.jp](https://yurucamp.jp/) sets the direction. What was taken, read off its CSS:

- Type: `M PLUS Rounded 1c`, body 16px at line-height 1.8. Rounded, airy, no display face.
- Brand pair: orange `#f18e43` and cyan `#81cddb`, with pink `#fca5c6` as the sticker colour. The
  portal leans on orange (18 declarations) and cyan (8) and keeps everything else neutral.
- Shape: big rounded rectangles, `border-radius: 1.3333vw` on its panels, 10px and 7px on smaller
  pieces. The radius scales with the viewport, so it is capped here at 16px.
- Zero `box-shadow` in either of its stylesheets. Depth comes from flat colour and white borders.
- Section labels are colour slabs, tags are stickers.

## Palette (white ground + orange and cyan)

- Ground: white. Ink `#222222` at 15.91:1, muted `#556a70` at 5.70:1.
- Surfaces: project rows and gallery tiles sit on a pale cyan `#f2fafb`, hover `#dbedf3`.
- Slabs: section labels are cyan with `#222` ink (8.86:1). Tags are pink with `#222` ink (8.59:1).
- Orange `#f18e43` is a surface colour, never text: `#222` on it is 6.58:1, white on it is 2.42:1.
  Stickers, the toast and the availability button use it with dark ink.
- Text accents and focus rings use the darkened orange `#be5a0e` (4.51:1 on white), because the
  brand orange cannot carry text. The portal itself fails here: its cyan headings on white are
  1.80:1 and its orange bar with white text is 2.42:1. Neither failure is copied.
- Night is invented, since the portal has no dark mode: a camp-at-night blue `#16202a` with near
  white ink (15.15:1) and the lightened orange `#ffab6b` for accents (8.86:1). The mid-tone slabs
  stay identical in both themes, which is why they keep dark ink everywhere.

## Type

- One family, M PLUS Rounded 1c, self-hosted: latin and vietnamese subsets at 400, 700 and 800.
  The family has no 600, so the rules that ask for 600 resolve to 700.
- Size and weight carry the hierarchy; colour carries the sections.
- A pixel font was tried earlier (DotGothic16 on labels, Pixelify Sans and Silkscreen on display)
  and declined: the pixel voice fought the calm the page is after.

## Decisions and reasons

- Project rows are links, not cards: one full-row target over 44px tall, with a ↗ glyph marking
  that the link leaves the site.
- Contact entries are chips with icon plus label, each opening a real destination. A photos chip was
  added and then dropped: Rin already links to the gallery, and a second route to the same place is
  noise.
- Sections are named by a cyan slab instead of a label plus a hairline rule: the slab carries the
  colour, so no rule is needed.
- Rows are flat tiles on a pale cyan surface, separated by 10px of space rather than a hairline.
- Night keeps the star field; the paper grain was dropped with the paper palette, since the
  reference ground is flat white.
- Nadeshiko is a button that greets by time of day; Rin is a plain link to the gallery. Both float
  in the page corners at every width, hovering over the content by design.
- Star counts come from the GitHub API, with the last known values in the HTML as fallback.

## Constraints

- Auto theme follows the clock (06:00 to 18:00 day, otherwise night), like Nadeshiko's greeting.
  The toggle overrides it and the explicit choice is remembered.
- The theme toggle keeps its 34px circle but carries a 44px hit area, so the row stays quiet without
  a small touch target.
- WCAG AA contrast in both themes, keyboard reachable, visible focus.
- No invented content: no fake numbers, no testimonials, no placeholder sections.
