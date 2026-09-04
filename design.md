---
name: Monastic Intellect
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd5ff'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f1ff'
  surface-container: '#f0ebff'
  surface-container-high: '#eae5ff'
  surface-container-highest: '#e4dfff'
  on-surface: '#1a1442'
  on-surface-variant: '#424a35'
  inverse-surface: '#2f2a58'
  inverse-on-surface: '#f3eeff'
  outline: '#727a62'
  outline-variant: '#c1caaf'
  surface-tint: '#446900'
  primary: '#446900'
  on-primary: '#ffffff'
  primary-container: '#a0ea18'
  on-primary-container: '#426600'
  inverse-primary: '#93db00'
  secondary: '#7d5707'
  on-secondary: '#ffffff'
  secondary-container: '#fdc973'
  on-secondary-container: '#775301'
  tertiary: '#9521bf'
  on-tertiary: '#ffffff'
  tertiary-container: '#f4c5ff'
  on-tertiary-container: '#921dbc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#adf82c'
  primary-fixed-dim: '#93db00'
  on-primary-fixed: '#121f00'
  on-primary-fixed-variant: '#324f00'
  secondary-fixed: '#ffdeab'
  secondary-fixed-dim: '#f1be69'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5f4100'
  tertiary-fixed: '#fad7ff'
  tertiary-fixed-dim: '#eeb1ff'
  on-tertiary-fixed: '#330045'
  on-tertiary-fixed-variant: '#76009c'
  background: '#fcf8ff'
  on-background: '#1a1442'
  surface-variant: '#e4dfff'
typography:
  display:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.03em
  body-lg:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  label-md:
    fontFamily: Anybody
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
---

## Brand & Style

This design system is built for focused, distraction-free knowledge practice and deep intellectual recall. It sits at the intersection of Swiss typographic rigor, physical stationery craft, and austere editorial software. 

The aesthetic is ultra-minimalist, monastic, and cerebral. It eschews modern decorative tropes—delivering zero gradients, zero glassmorphism, zero ambient glows, and zero drop shadows. Instead, it relies on structural integrity, generous macro-whitespace, hair-thin geometric boundaries, and crisp typographic hierarchy.

The emotional resonance is quiet competence: an environment that lowers cognitive load, invites reflection, and treats thought with archival permanence.

## Colors

The color architecture is uncompromisingly restrained. The palette draws from tactile book stock and ink, favoring high contrast readability over sensory stimulation.

### Functional Roles
- **Base Canvas (`#fbf8ff` / Dark: `#121212`):** A warm, unbleached paper off-white that prevents screen fatigue. It is neither clinical `#FFFFFF` nor sepia.
- **Ink Primary (`#a0ea18` / Dark: `#E4E4E7`):** Used for primary headings, body copy, active states, and structural dividers.
- **Muted Ink (`#dbab58` / Dark: `#A1A1AA`):** Used strictly for metadata, system labels, secondary descriptors, and keyboard shortcuts.
- **Accent (`#a02fc9` / Dark: `#EA580C`):** A warm, vibrant accent used with surgical restraint. It signals deliberate intentionality: active recording indicators, key focal points, prompt tags, or error thresholds. It must never coat large surface areas or background containers.
- **Architectural Rules (`#0c0534` / Dark: `#27272A`):** 1px hairline borders that compartmentalize thoughts without disrupting visual flow.

## Typography

The type system balances Swiss modernist precision with literary cadence. 

- **Headers & Interface (Be Vietnam Pro):** Clean, striking display typography that structures the application with mathematical clarity, structural rhythm, and bold delivery.
- **Reading & Intellectual Content (Newsreader):** A contemporary literary serif tuned for long-form synthesis, prompts, and active writing. Its inclusion grounds the tool in bookmaking culture.
- **System Labels & Metadata (Anybody Upper/Small):** Micro-type is rendered in uppercase Anybody with deliberate letter tracking (+0.06em) to evoke archival cataloging and index cards.

## Layout & Spacing

Layouts follow a disciplined single-column editorial spine or an asymmetric 2-column layout (Index / Canvas) reminiscent of traditional monograph layouts.

### Composition Rules
- **Narrow Focus Column:** Core writing and prompt interaction is constrained to `container-narrow` (704px / 44rem) to maintain optimal reading line length (60–75 characters).
- **Macro Whitespace:** Sections breathe via `space-3xl` and `space-4xl`. Cramming is strictly avoided; emptiness is utilized as a cognitive buffer.
- **Hairline Division:** Content separation relies primarily on vertical cadence. When horizontal rules are used, they must be 1px solid `#0c0534` edge-to-edge rules without paddings or rounded caps.
- **Responsive Adaptations:** 
  - Desktop (>1024px): Prompts anchor on the left rail while response canvases open symmetrically on the center-right.
  - Mobile (<768px): Margins drop to `gutter-mobile` (20px), headers scale down, and secondary metadata collapses behind hairline drawer accordions.

## Elevation & Depth

This design system is strictly non-skeuomorphic and non-optical. It operates in a flat 2D plane:

- **Zero Shadows:** No box-shadows, drops, or glows exist anywhere in the interface.
- **Hairline Outlines:** Depth is articulated strictly through 1px boundaries (`border-subtle` #0c0534) or high-contrast structural borders (`border-strong` #0c0534) when an element is focused or active.
- **Tonal Stepping:** Overlays, floating utility palettes, and modal contexts do not blur the background. They introduce flat, opaque container tiers (`#fbf8ff` with a 1px solid border), offset cleanly against the canvas.
- **State Changes:** Hover and focus states never elevate in Z-space; they toggle fill tones to `#efedf4` or transition border color from subtle to ink-black.

## Shapes

The shape philosophy is **Pill-shaped (`3`)**. 

All buttons, inputs, tags, dialogs, and cards feature pill-shaped roundedness, adding soft geometry while maintaining precision.

## Components

### Buttons
- **Primary:** Solid `#a0ea18` fill, `#1b1b20` text, pill-shaped radius, 12px vertical / 20px horizontal padding, Anybody Medium 14px. Hover transitions background to `#3F3F46`.
- **Secondary / Outline:** Transparent fill, 1px solid `#a0ea18` border, `#a0ea18` text, pill-shaped radius. Hover shifts background to `#efedf4`.
- **Tertiary / Ghost:** Text-only with an underline that appears solely on hover.

### Input Fields & Textareas
- Clean pill-shaped fields with 1px solid `#0c0534` borders.
- Background defaults to transparent or `#fbf8ff`.
- Focus state instantly snaps border to 1px solid `#a0ea18` with zero shadow ring.
- Writing textareas employ `Newsreader` font for deliberate, notebook-like synthesis.

### Chips & Metadata Tags
- Pill-shaped tags with 1px solid `#0c0534` border.
- Text rendered in `label-sm` (uppercase, tracking +0.06em, `#dbab58`).
- Active or highlighted tag swaps border to `#a02fc9` with text in `#a02fc9`.

### Lists & Prompts
- Separated by top-and-bottom hairline dividers (`#0c0534`).
- Hovering over a list row applies a subtle `#efedf4` flat fill without borders shifting.
- Left-aligned indicator accents in `#a02fc9` reveal themselves only on active keyboard selection.

### Cards & Knowledge Blocks
- Defined by a single 1px solid `#0c0534` perimeter with pill-shaped roundedness.
- No box shadow. Padding is generous (`space-lg` to `space-xl`).
- Internal sections are partitioned using crisp 1px internal divider rules.
