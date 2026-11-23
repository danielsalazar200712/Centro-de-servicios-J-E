---
name: Technical Precision Workshop System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#414943'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#717973'
  outline-variant: '#c1c8c1'
  surface-tint: '#3d6751'
  primary: '#002718'
  on-primary: '#ffffff'
  primary-container: '#133e2b'
  on-primary-container: '#7da990'
  inverse-primary: '#a3d1b6'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#002530'
  on-tertiary: '#ffffff'
  tertiary-container: '#003c4c'
  on-tertiary-container: '#58aac8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bfedd2'
  primary-fixed-dim: '#a3d1b6'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#254f3a'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#b9eaff'
  tertiary-fixed-dim: '#81d1f0'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#004d62'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: '0'
  code-tech:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the ethos of master mechanical engineering: calibrated, durable, and uncompromisingly precise. Designed for small agricultural and forestry power equipment servicing (chainsaws, brushcutters, high-pressure sprayers, and motor pumps), the interface rejects decorative clutter in favor of utilitarian clarity and industrial dignity.

The aesthetic fuses Swiss graphic minimalism with industrial workbench rigor. High information density is managed through strict structural alignment, clear spatial grouping, and unmistakable visual hierarchy. The emotional target is absolute confidence, field-grade reliability, and institutional authority suitable for both fast-paced workshop mechanics and certified fiscal oversight (DIAN validation).

## Colors

The chromatic structure relies on deep botanical iron tones anchored by stark slate neutrals and high-visibility mechanical status accents:

- **Primary (`#133E2B`):** Deep technical forest green. Used for authoritative structural elements, primary command buttons, primary brand marks, and foundational navigation bars. Deepened to `#0E2E20` on active states.
- **Secondary (`#D97706`):** Technical amber / aged bronze. Reserved strictly for tactical emphasis, critical attention callouts, active repair flags, and interactive focal points. Accentuated to `#B45309` for accessible text contrast.
- **Tertiary (`#0E7490`):** Technical cyan/teal. Dedicated to diagnostic diagnostics, technical spec annotations, telemetry data, and system-level telemetry.
- **Neutral Surface Palette:**
  - `Base Canvas`: `#F8FAFC` (Slate 50)
  - `Card / Modal Surface`: `#FFFFFF`
  - `Subtle Field Inset`: `#F1F5F9` (Slate 100)
  - `Dividers & Calibrated Borders`: `#E2E8F0` (Slate 200)
- **Neutral Typography Palette:**
  - `Primary Text`: `#0F172A` (Slate 900) — delivers exceptional 14.5:1 contrast against pure white.
  - `Secondary / Metadata Text`: `#334155` (Slate 700) — guarantees >7:1 contrast on all surfaces.
  - `Muted / Field Annotations`: `#64748B` (Slate 500) — strictly reserved for non-essential placeholder copy, retaining a minimum of 4.6:1 contrast against white backgrounds.
- **Semantic Status Signals:**
  - `Success / Certified / Validated DIAN`: `#15803D` text on `#DCFCE7` tint.
  - `Warning / Awaiting Parts`: `#B45309` text on `#FEF3C7` tint.
  - `Critical / Blocked / Motor Seized`: `#B91C1C` text on `#FEE2E2` tint.
  - `Operational / Diagnostic`: `#0E7490` text on `#E0F2FE` tint.

## Typography

Typographic discipline provides clarity when dealing with dense technical manuals, complex parts inventories, and electronic tax records.

- **Primary Typeface:** `Inter` is deployed universally across headlines, body copy, and UI controls for its geometric neutral clarity, tabular numeral support (`tnum`), and optical neutrality.
- **Monospace Technical Typeface:** `JetBrains Mono` is assigned to equipment serial numbers, motor displacement values, DIAN CUFE/CUDE cryptographic hashes, and SKU barcodes.
- **Tabular Figures:** All tables, repair estimates, hour meters, and inventory tallies must force OpenType `tnum` (tabular figures) to ensure precise vertical alignment down decimal borders.
- **Hierarchy Rules:** High-contrast weights (400 for structural text, 600/700 for data labels and headings) eliminate ambiguity. All-caps treatments are strictly limited to `label-sm` with widened letter-spacing (`0.04em`) for metadata headers and micro status chips.

## Layout & Spacing

The layout is built upon a balanced 12-column grid system (desktop), 8-column system (tablet), and 4-column system (mobile), calibrated through an 8-point geometric baseline scale.

- **Layout Grid Philosophy:** Fluid horizontally within a rigid max-width boundary of `1440px`. Workshop floor tablets and widescreen diagnostic benches scale seamlessly between breakpoints.
- **Gestalt Grouping:** Spacing tokens reflect physical proximity relationships:
  - Form field labels sit `space-xs` (4px) above input boxes.
  - Component internal padding uses `space-md` (16px) or `space-lg` (24px).
  - Unrelated industrial modules and section groupings are isolated by `space-xl` (40px) to prevent cognitive interference during high-throughput repair intake.
- **Breakpoints:**
  - `Mobile (0 - 639px)`: 4 columns, `margin-mobile` (16px), stacked data tables become card sheets.
  - `Tablet (640px - 1023px)`: 8 columns, `margin` (32px), optimized for handheld workshop check-in tablets.
  - `Desktop (1024px+)`: 12 columns, `margin` (32px), persistent diagnostic sidebars, split-pane split invoice/repair workorders.

## Elevation & Depth

To sustain the ultra-clean Swiss industrial aesthetic, depth is established via low-contrast structural outlines and stacked tonal layers rather than simulated drop shadows.

- **Ghost Borders (Structural Definition):** Elevation Tier 0 and Tier 1 surfaces rely on razor-sharp `1px solid #E2E8F0` outlines to define discrete mechanical modules. 
- **Subtle Ambient Grounding:** Floating elements (dropdown menus, contextual popovers, active modal dialogs) employ high-diffusion, tinted ambient drop shadows that simulate soft overhead inspection lighting:
  - `Focus / Overlay`: `0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)` with a concurrent `1px solid #CBD5E1` border.
- **Tonal Stepping (Depths):**
  - `Layer 0 (Canvas Background)`: `#F8FAFC`
  - `Layer 1 (Card & Module Baselines)`: `#FFFFFF` with `1px #E2E8F0` border.
  - `Layer 2 (Inset Data Wells & Technical Readouts)`: `#F1F5F9` nested directly within Layer 1.

## Shapes

The design system enforces a strictly disciplined **Soft (Level 1)** geometric language. Rounding is intentionally restrained to preserve the feel of calibrated instruments, milled steel housings, and official compliance documentation.

- Standard interactive components (buttons, input boxes, status chips, form controls) use `0.25rem` (4px) corner radii.
- Structural cards, diagnostic viewports, and fiscal data tables use `0.5rem` (8px) (`rounded-lg`).
- Fully circular radii (`rounded-full`) are banned except for numeric counter badges, avatar fallbacks, and circular radio toggles.
- Under no circumstances should pill-shaped buttons be used; all interactive touchpoints must present firm, architectural boundaries.

## Components

### Buttons
- **Primary:** Background `#133E2B`, text `#FFFFFF`, border `none`, corner radius `4px`, padding `10px 18px`. Hover: `#0E2E20`. Focus: `2px solid #FFFFFF` with outer ring `2px solid #133E2B`.
- **Secondary / Technical:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #CBD5E1`. Hover: `#F1F5F9` with border `#94A3B8`.
- **Accent / High Priority Action:** Background `#D97706`, text `#FFFFFF`, border `none`. Hover: `#B45309`. Focus: ring `2px solid #D97706`.

### Status Chips (DIAN & Repair Workflow)
- **Geometry:** Height `24px`, padding `2px 8px`, typography `label-sm`, uppercase, radius `4px`.
- **States:**
  - `DIAN Validada`: Background `#DCFCE7`, text `#15803D`, border `1px solid #86EFAC`.
  - `En Diagnóstico`: Background `#E0F2FE`, text `#0369A1`, border `1px solid #BAE6FD`.
  - `Esperando Repuesto`: Background `#FEF3C7`, text `#B45309`, border `1px solid #FDE68A`.
  - `Garantía / Crítico`: Background `#FEE2E2`, text `#B91C1C`, border `1px solid #FECACA`.

### Cards & Industrial Diagnostic Panels
- Background `#FFFFFF`, border `1px solid #E2E8F0`, radius `8px`.
- Header zone partitioned by a `1px solid #F1F5F9` bottom divider, containing machine category icon, model number, and fiscal/repair badge.
- Internal telemetry readouts (compression ratio, operating hours, spark test) placed inside `#F1F5F9` inset wells.

### Inputs & Inspection Selectors
- Background `#FFFFFF`, text `#0F172A`, border `1px solid #CBD5E1`, radius `4px`, height `40px`, padding `8px 12px`.
- Focus state: border `#133E2B`, box-shadow `0 0 0 1px #133E2B` (sharp, zero-blur outline).
- Monospace variant assigned to serial number lookups and DIAN resolution fields with built-in instant validation icons.

### Checkboxes & Radios
- Size `18px x 18px`, border `1.5px solid #64748B`, radius `3px` (checkbox) or circular (radio).
- Checked state: background `#133E2B`, checkmark `#FFFFFF`. Focus indicator: outer offset ring `2px solid #133E2B`.

### Domain-Specific Components
- **Machine Spec Grid:** A dual-column technical key-value matrix featuring alternating row tints (`#FFFFFF` / `#F8FAFC`), right-aligned tabular metrics, and direct link triggers to OEM exploded-parts diagrams.
- **Fiscal DIAN Receipt Status Strip:** A high-visibility audit band across the header of work orders, verifying digital transmission state, electronic signature stamp, and CUFE hash with one-click clipboard copying.