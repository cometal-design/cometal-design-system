# Cometal Design System — source match matrix

Date: 2026-08-06
Scope: Figma DS Core → token/React source → Storybook → documentation portal → Obsidian.
Rule: a row is `MATCH` only when identity, values, states, behavior, links and documentation agree. A registry flag is not evidence by itself.

## Foundation

| Layer | Figma DS Core | Git source | Storybook | Portal | Obsidian | Status / gap |
|---|---|---|---|---|---|---|
| Primitive color | `4:29`, frame `668:15032` | `primitive.tokens.json` | `foundation--primitive-colors` | `/foundation/color/primitives/` | `01 Foundations/Index.md` | Match candidate; requires visual repeat pass |
| Semantic color | `4:29`, map `1341:1852` | `semantic.tokens.json` | `foundation--semantic-colors` | `/foundation/color/semantic/` | `01 Foundations/Index.md` | Match candidate; requires visual repeat pass |
| Typography | `4:30`, frame `668:14643` | `typography.styles.json` | `foundation--typography` | `/foundation/typography/web/` | `01 Foundations/Index.md` | Match candidate; requires metric and font-load repeat pass |
| Spacing | `4:33`, frame `668:17255` | primitive + semantic token source | `foundation--spacing` | `/foundation/layout/spacing/` | `01 Foundations/Index.md` | **BLOCKED:** Figma page contains page-only values absent from variables |
| Size | Foundation variables | primitive + semantic token source | `foundation--size` | `/foundation/layout/size/` | `01 Foundations/Index.md` | Match candidate; requires repeat pass |
| Radius | `4:32`, frame `668:17711` | primitive + semantic token source | `foundation--radius` | `/foundation/layout/radius/` | `01 Foundations/Index.md` | **BLOCKED:** Figma page contains page-only values absent from variables |
| Stroke | Foundation variables | primitive + semantic token source | `foundation--stroke` | `/foundation/layout/stroke/` | `01 Foundations/Index.md` | Match candidate; requires repeat pass |
| Grid | `1026:3600`, frame `1611:2` | `grid.presets.json` | `foundation--grid` | `/foundation/layout/grid/` | `01 Foundations/Index.md` | Documentation-only match candidate; no Figma Grid Styles |
| Icons | `381:25439` | `icons.inventory.json` | `foundation--icons` | `/foundation/icons/catalog/` | `01 Foundations/Index.md` | **PARTIAL:** no approved SVG/React API |
| Motion | no page or variables | `motion.tokens.json`: 5 durations + 3 easings; shared by React controls | `foundation--motion` + computed-style assertions | `/foundation/motion/` | `01 Foundations/Index.md` | **PARTIAL:** Git, React, tests, Storybook and portal match locally; static Figma documentation board still requires approval |
| Shadows | no approved values | no source | explicit gap only | no dedicated page | `01 Foundations/Index.md` | **NOT STARTED:** design decision required |

## Components

| ID | Figma public node | React source | Storybook | Portal | Registry state | Match state |
|---|---|---|---|---|---|---|
| `action.button` | `835:3693` | `Button/Button.tsx` | `components-button--overview` | `/components/button/` | `visualMatch: false` | Full architecture repeat pass required |
| `input.text-field` | `1102:8230` | `Field/Field.tsx` | `components-fields--text-field-playground` | `/components/fields/` | `visualMatch: false` | Exact Storybook route repaired locally; repeat pass required |
| `input.text-area` | `1102:8399` | `Field/Field.tsx` | `components-fields--text-area-playground` | `/components/fields/` | `visualMatch: false` | Exact Storybook route repaired locally; repeat pass required |
| `input.select` | `1103:535` | `Field/Field.tsx` | `components-fields--select-playground` | `/components/fields/` | `visualMatch: false` | Interaction + responsive listbox repeat pass required |
| `input.combobox` | `1104:661` | `Field/Field.tsx` | `components-fields--combobox-playground` | `/components/fields/` | `visualMatch: false` | Filtering/keyboard/hover repeat pass required |
| `input.multi-select` | `1106:1005` | `Field/Field.tsx` | `components-fields--multi-select-playground` | `/components/fields/` | `visualMatch: false` | Tag overflow/keyboard repeat pass required |
| `input.date-picker` | `1764:10502` | `DatePicker/DatePicker.tsx` | `components-date-picker--overview` | `/components/date-picker/` | `visualMatch: true` | Recheck Motion and portal/Storybook parity after current changes |
| `selection.checkbox` | `1571:521` | `Selection/Selection.tsx` | `components-checkbox--overview` | `/components/checkbox/` | `visualMatch: false` | Mixed state and full architecture repeat pass required |
| `selection.radio-button` | `1571:8954` | `Selection/Selection.tsx` | `components-radio-button--overview` | `/components/radio-button/` | `visualMatch: false` | Group semantics and full architecture repeat pass required |
| `selection.switch` | `1571:9673` | `Selection/Selection.tsx` | `components-switch--overview` | `/components/switch/` | `visualMatch: false` | State/label/full architecture repeat pass required |

## Local verification — 2026-08-06

- Portal checked at `1440×900` and `430×932`: no horizontal overflow, no console warnings/errors, Grtsk Peta is loaded for the shell and embedded React components.
- Direct Storybook canvas checked at desktop and mobile widths for Motion, Button, Fields, Checkbox, Radio Button, Switch and Date Picker: all target stories render without horizontal overflow.
- Portal `Playground` actions now route to executable stories, not overview pages. Fields has a dedicated shared playground for all five public field components.
- `Inverse Ghost` now uses inverse text on the required dark surface; the Storybook accessibility gate passes.
- Full local gate passes: source routes `5 / 10 / 52`, secrets, TypeScript, `22` unit tests, `52` Storybook tests, token/React/Storybook/portal production builds.
- This evidence proves local engineering parity. It does **not** flip component `visualMatch` flags because a fresh fixed-viewport Figma pixel comparison and independent repeat audit are still required.

## Current decisions

1. Figma remains the visual and composition source; it does not need fake motion variables.
2. Git token source owns duration and easing values; React owns executable behavior.
3. Storybook is the executable technical reference. The portal explains and routes to the exact story.
4. Obsidian stores context, ownership, gaps and recovery instructions; it does not duplicate executable code as another authority.
5. `visualMatch` remains `false` until a fixed-viewport visual pass, interaction pass, accessibility pass and independent repeat pass are clean.

## Open decisions requiring Design System Lead approval

1. **Motion in Figma:** create a static documentation board linked to `motion.tokens.json` and `foundation--motion`; do not create Figma variables.
2. **Spacing and Radius:** either remove/mark legacy page-only values in documentation or publish them as approved variables. Until this is decided, both rows remain blocked.
3. **Icons:** approve export pipeline, naming and React API before declaring the source matched.
4. **Shadows:** explicitly approve an empty state or introduce a real shadow scale; do not invent values in code.

## Verification gate

- `pnpm validate:sources`
- `pnpm typecheck`
- component unit tests
- Storybook interaction tests
- portal + direct Storybook canvas at desktop and mobile widths
- keyboard, focus, reduced motion and console checks
- one clean repeat pass before changing registry match flags
