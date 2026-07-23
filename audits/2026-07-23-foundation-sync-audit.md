# Foundation sync audit — 2026-07-23

## Scope

Figma DS Core → token source → Storybook → documentation portal.

Проверены primitive colors, semantic colors, typography, spacing, size, radius,
stroke, responsive grid, icons, shadows/effects и инженерные метаданные.

## Verified inventory

- Figma variables: 542 total.
- Foundation collections: Primitive 399 + Semantic 132 = 531.
- Component collections: Button 1 + Input 7 + Option 3 = 11.
- Types: 462 color + 80 float.
- Aliases: 143.
- Variables with scopes: 542.
- Variables with WEB code syntax: 527.
- Local styles: 18 text, 0 paint, 0 grid, 0 effect.
- Grid: 4 documented presets; no local Grid Styles.
- Icons: 2,810 component records; assets/API not approved.
- Shadows: no approved variables or effect styles.

## Implemented

- Storybook Foundation now reads DTCG source tokens instead of selected hardcoded examples.
- Primitive and semantic color catalogs are separated.
- Semantic catalog shows role, alias and resolved value.
- Typography renders all 18 styles with exact metrics and local font files.
- Spacing, size, radius and stroke show primitive and semantic layers separately.
- Grid exposes viewport, columns, margins and gutters for all presets.
- Engineering passport records collections, modes, aliases, scopes, code syntax and local styles.
- Documentation portal acts as the readable index; Storybook remains the complete technical catalog and Playground.
- Catalog rows expose table, row, column-header and cell semantics to assistive technology.
- Foundation documentation styling consumes the published token variables instead of maintaining a parallel raw-color palette.
- Portal navigation exposes Radius and Stroke as separate technical destinations.
- Conflicting token/group paths use DTCG `$root`, preserving both the base token and its child token.
- Semantic token source now contains all 132 Figma semantic variables.

## Source conflicts

### BLOCKER — Spacing

Approved page `4:33` contains a wider legacy/documentation scale than the
Primitive collection. Page-only names include `Spacing/10`, `175`, `240`,
`500`, `600`, `800` and four negative values.

Decision applied: do not publish page-only values as runtime tokens until the
Design System Lead aligns the page and the variable collection.

### BLOCKER — Radius

Approved page `4:32` contains `none`, `300`, `400`, `700`, `round` and semantic
aliases that do not exist in the Primitive/Semantic collections.

Decision applied: do not publish page-only values as runtime tokens until the
Design System Lead aligns the page and the variable collection.

## Verification

- `pnpm validate`: passed.
- Unit tests: 14 passed.
- Storybook tests, including accessibility: 38 passed.
- Storybook production build: passed.
- Documentation static build: passed.
- Source validation: 5 logical sources and 9 registered components passed.
- Secret validation: passed.
- Independent post-deployment Visual QA covered all 11 Foundation stories at
  1440, 768 and 390 px. The three implementation defects found in that pass
  (table semantics, raw documentation colors and the missing Stroke link) were
  corrected and the full validation suite passed again.

## Completion rule

Foundation implementation and documentation are verified. Foundation can be
marked fully matched only after the two Figma page conflicts are resolved.
