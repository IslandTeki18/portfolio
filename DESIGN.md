# Portfolio Design System

The visual language for the redesigned portfolio (`Portfolio Redesign.dc.html`). Source app: `apps/portfolio` in `IslandTeki18/portfolio`.

## Direction

Warm, quiet, professional. The previous design was a terminal emulator: near-black background, hard 2px borders, four competing accent colors, and every string written as shell output. The redesign keeps the developer character but demotes it — monospace survives as a labeling voice, not as body copy.

Audience is small business owners hiring for contract work, so the page leads with outcomes in plain language rather than stack lists.

## Color

Warm neutrals, one accent. No per-section colors.

| Token             | Value     | Use                                            |
| ----------------- | --------- | ---------------------------------------------- |
| Base              | `#1B1A18` | Page background                                |
| Surface           | `#221F1D` | Cards, panels                                  |
| Surface (sheet)   | `#201E1B` | Resume modal panel                             |
| Input well        | `#1D1B19` | Form fields                                    |
| Hover fill        | `#262421` | Nav items, ghost buttons                       |
| Border            | `#302E2A` | Card and section dividers                      |
| Border (raised)   | `#3A3732` | Pills, inputs, outline buttons                 |
| Border (hover)    | `#4A4136` | Card hover                                     |
| Text              | `#EFEBE5` | Headings, primary copy                         |
| Text secondary    | `#C9C3BB` | Long-form body in detail views                 |
| Text muted        | `#A9A29A` | Supporting copy, labels                        |
| Text dim          | `#8E877F` | Mono metadata, dates, eyebrows                 |
| Text faint        | `#857E76` | Footer                                         |
| Placeholder label | `#5C564F` | Text inside image placeholders only            |
| Accent            | `#C98A6A` | One accent: CTAs, eyebrows, active dots, rails |

Accent is `oklch(0.70 0.10 40)` — a warm clay. It is tweakable on the root component; alternates share the same lightness and chroma at different hues (`#8FA9A0`, `#A99A6A`, `#9A8FA9`).

Rules:

- Accent is for one thing at a time: a primary action, a status dot, a section eyebrow, a quote rail. Never for large fills or body text.
- Status is communicated with a neutral pill plus an accent dot, not with a green/amber/red palette.
- Muted grays must clear 4.5:1 at 12px. `#8E877F` on surface and `#857E76` on base are the floor.

## Type

- **Instrument Sans** — headings, body, buttons. Weights 400/500/600.
- **JetBrains Mono** — labels, eyebrows, dates, metadata, tech pills, placeholder captions. Weights 400/500. Carried over from the old design; this is where the developer identity lives now.

| Role               | Size               | Weight | Tracking               |
| ------------------ | ------------------ | ------ | ---------------------- |
| Hero               | 58px / 1.06        | 600    | -0.03em                |
| Detail page title  | 44px / 1.1         | 600    | -0.03em                |
| Section heading    | 30px               | 600    | -0.02em                |
| Contact heading    | 32px / 1.15        | 600    | -0.02em                |
| Feature card title | 26px               | 600    | -0.02em                |
| Card title         | 21px               | 600    | -0.015em               |
| Lede               | 19px / 1.6         | 400    | —                      |
| Body               | 15–16px / 1.6–1.75 | 400    | —                      |
| Mono label         | 12px               | 400    | 0.06–0.08em, uppercase |

Headings and paragraphs use `text-wrap: pretty`. Copy is sentence case. No `[bracket_buttons]`, no `//` comment prefixes, no `snake_case` project names.

## Shape and depth

- Cards and panels: `16px` radius. Large panels (contact, resume sheet): `20px`.
- Buttons and inputs: `12px`. Pills and nav items: `999px`.
- Borders are `1px`. The old `2px` accent borders survive in one place only: the `2px` left rail on a pulled quote or a resume role.
- One shadow, used on card hover and the resume sheet: `0 18px 40px -24px rgba(0,0,0,0.8)` / `0 40px 80px -40px rgba(0,0,0,0.9)`.
- Sticky nav and modal headers use `backdrop-filter: blur(10–14px)` over a translucent base.

## Layout

- Page max width `1120px`, `32px` gutters. Content max width for reading is `620–760px`.
- Section rhythm: `96px` top padding, heading block, `1px` divider, `28px`, content.
- Work and Ventures are two-column grids with `20px` gaps. The lead project spans both columns as a horizontal feature card with the image on the right.
- Background: `1.3fr / 1fr` — narrative on the left, stack and history on the right.
- Contact is a single panel split `1fr / 1.15fr`: pitch on the left, form on the right.

## Motion

Easing is `cubic-bezier(0.2, 0.8, 0.2, 1)` everywhere. Nothing bounces.

| Interaction      | Behavior                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Scroll reveal    | Below-fold `[data-reveal]` elements fade up 22px over 700ms, once, via IntersectionObserver |
| Card hover       | `translateY(-3px)`, border to `#4A4136`, shadow in, 320ms                                   |
| Button hover     | `translateY(-2px)` + `brightness(1.08)`, 220ms                                              |
| Input focus      | Border to accent, well lightens to `#211E1B`, 200ms                                         |
| Gallery hover    | `scale(1.03)`, 320ms                                                                        |
| Page transition  | Detail view enters with `viewIn` — fade + 14px rise, 420ms                                  |
| Resume sheet     | Backdrop `fadeIn` 260ms; panel `sheetIn` — 24px rise from `scale(0.985)`, 420ms             |
| Availability dot | 2.6s opacity pulse                                                                          |
| Background wash  | Two large radial gradients drifting on 42s and 56s loops at 7–10% opacity                   |

Reveals are only applied to elements below the fold at mount, so above-the-fold content paints immediately. Motion can be disabled with the `reveals` prop.

## Content patterns

**Project card.** Index number, status, sentence-case title, two-sentence problem statement, one bolded outcome line, tech pills, `Case study →`. The outcome line is the point — it is what a business owner reads.

**Case study.** Eyebrow, title, lede, hero image, two body paragraphs (the situation, then the solution), a pulled outcome quote on an accent rail, stack and role in a sidebar, three-up gallery.

**Placeholders.** Images are `repeating-linear-gradient(135deg, #262320 0 10px, #211E1B 10px 20px)` with a mono caption naming what belongs there. Never hand-drawn illustration.

## Mapping to the source app

| Redesign element   | Original                                                   |
| ------------------ | ---------------------------------------------------------- |
| Hero + sticky nav  | (new — the old page opened on a header and a projects box) |
| Work grid          | `Landing.tsx` projects section, `ProjectCard.tsx`          |
| Case study view    | `ProjectDetail.tsx`                                        |
| Ventures grid      | `Landing.tsx` businesses section, `BusinessCard.tsx`       |
| Background section | `ResumePreview.tsx`                                        |
| Resume sheet       | `ResumeModal.tsx`                                          |
| Contact panel      | `Landing.tsx` contact form (was `#EF4444`-bordered)        |

Shared primitives in `packages/ui` (`button.tsx`, `card.tsx`, `modal.tsx`) already use CVA variants and `rounded-*` classes; the redesign's radii and one-accent palette map onto `--color-primary` / `--radius` in `packages/ui/src/styles.css` rather than needing per-page hex values.
