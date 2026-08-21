# Design System

## Direction

Bright editorial landing page with a soft, human warmth: white space and charcoal typography carry clarity while a confident coral-pink accent marks action. Image placeholders use varied, quiet gradients so the structure remains credible before real photography arrives.

## Colors

```css
--bg: oklch(1 0 0);
--surface: oklch(0.975 0.006 20);
--surface-strong: oklch(0.94 0.015 20);
--ink: oklch(0.18 0.018 20);
--muted: oklch(0.48 0.018 20);
--line: oklch(0.88 0.012 20);
--primary: oklch(0.63 0.2 8);
--primary-dark: oklch(0.5 0.19 8);
--accent: oklch(0.78 0.14 88);
--forest: oklch(0.27 0.06 148);
```

## Typography

Use a system grotesk stack: `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Display headings are tight but never below `-0.04em` letter-spacing. Body copy is 16px with a 1.55 line-height.

## Components

- Primary buttons: coral fill, white text, 12px radius, minimum 48px height.
- Secondary buttons: white/transparent fill with a full 1px line, no decorative shadow.
- Media placeholders: 16px radius, subtle border, no fake photography.
- Section labels: used sparingly; only the hero has a tracked all-caps label.
- FAQ: native `details` rows with visible focus and a simple plus icon.

## Layout

Max content width is 1180px. Sections use generous but controlled rhythm (clamp 72px–128px). Grids collapse to one column below 760px. Media is never the sole carrier of meaning; every important idea has readable text in the DOM.

## Motion

Use small, 180–240ms ease-out transitions for controls and a slow ambient hero glow. All non-essential motion is disabled for `prefers-reduced-motion: reduce`.
