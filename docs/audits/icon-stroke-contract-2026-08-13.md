# Outline icon stroke contract

Date: 2026-08-13  
Figma: `KKNGucImxFAtQLBhPy8tLs`  
Decision: every Cometal outline icon renders with a `1.4px` stroke regardless of its frame size.

## Source of truth

- Figma variable: `Primitive / Stroke/140 = 1.4px`.
- Figma id: `VariableID:2448:189`.
- Figma key: `b3d90386ec762f1395d0e2b375a5507e65cb4e2b`.
- WEB syntax: `--cometal-primitive-stroke-140`.
- DTCG token: `Primitive.Stroke.140`.

## Figma application

- `875/875` canonical `Outline/*` icon masters resolve to `1.4px` and bind `strokeWeight` to `Stroke/140`.
- `12/12` local Checkbox checkmark vectors resolve to and bind the same token.
- Button, Fields, Checkbox, Date Picker and Tables inherit the source binding with no residual `1.6px` outline icon paths in the audited pages.
- Filled icons and multicolor feature/logo artwork remain geometry assets; they are not converted into outline icons.

## Runtime application

- Built-in Button loader, Field chevron/search/remove, Checkbox mark and Date Picker calendar/chevrons use the token directly.
- Component SVG stroke nodes are guarded by shared CSS with `vector-effect: non-scaling-stroke`; changing an icon frame from 20px to 16px or 14px cannot thin the rendered line.
- Storybook tests read `getComputedStyle(path).strokeWidth`, not only the icon container size or source attribute.

## Acceptance evidence

- React unit tests: `28/28`.
- Storybook interaction tests: `57/57`.
- Computed stroke checks: Button L/M/S, Select, Combobox, Checkbox and Date Picker all equal `1.4px`.
- Figma geometry audit: `875/875` outline masters, `297` Button paths, `127` Fields paths, `34` Checkbox paths, `39` Date Picker paths and `127` Table paths resolve to `1.4px` with zero residuals in those audited scopes.
