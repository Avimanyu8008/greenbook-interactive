# GreenBook Interactive — Design Direction

## Concept
Inspired by the physical Green Book (Xinfeng Zhou) + Scula-style educational platform.
Clean, academic, and focused — not flashy. The "green" comes from the book, used as a precise accent.

## Typography
- **Display**: `DM Serif Display` — for headings, big statements (academic weight)
- **Body**: `Poppins` — clean, modern, very readable
- **Mono**: `JetBrains Mono` — for math expressions, code, simulation output

## Color Palette
```
--bg:           #f9faf7   (off-white, slight green tint)
--surface:      #ffffff
--surface-2:    #f2f5ef   (light sage)
--border:       #d8e4d0
--text:         #1a1f16   (near-black with green warmth)
--text-muted:   #5a6b52
--accent:       #3a7d44   (forest green — primary brand)
--accent-light: #e8f4eb   (light green fill)
--accent-mid:   #5da668   (mid green for hover)
--easy:         #3a7d44
--medium:       #d97706
--hard:         #dc2626
--tag-bg:       #e8f4eb
--tag-text:     #2d6035
```

## Layout Philosophy
- Inspired by Scula: clean sections, generous whitespace, card-based problem layout
- Left sidebar navigation (category filters)
- Main content: problem cards in a clean grid
- Problem detail: full-width with simulation panel
- No heavy shadows — use borders and subtle bg shifts

## Components
- Cards: white bg, `border border-[--border]`, slight radius (8px), hover: border turns accent
- Difficulty badges: pill-shaped, color-coded
- Sim panel: dark bg (`#1a1f16`) with green terminal aesthetic
- Charts: Recharts, accent-green primary color
- Math: KaTeX rendered inline and block
- Sliders: styled with accent-green track

## Motion
- Page transitions: fade in (150ms)
- Cards: stagger reveal on load
- Simulation: count-up animation for results
- Sliders: debounced at 100ms, smooth chart update
