---
id: navigation.tabs
name: Tabs
status: specified
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1572-181"
storybook: "http://localhost:6006/?path=/story/components-tabs--overview"
---

# Tabs

## Назначение и граница

Tabs переключает связанные persistent content panels в пределах текущего
контекста страницы. Это не router/link navigation, не вертикальный control и не
контейнер с собственной прокруткой, стрелками, fade или menu overflow.

Письменный contract создан для delivery candidate. Figma — визуальный source,
а API, keyboard behavior и ownership утверждены в
`tabs-role35-engineering-design-2026-09-07.md`. React, Storybook и portal route
пока отсутствуют; этот документ не является claim об их готовности или
публикации.

## Stable identity и источники

- Registry ID: `navigation.tabs`.
- Figma file: `KKNGucImxFAtQLBhPy8tLs`, page `1018:21`.
- Internal source set: `1572:100` `Sources/Tab Item` (24 visual variants).
- Public compound set: `1572:181` `Tabs` (L/M/S); four items — example content,
  не API count constraint.
- Nested Button dependency: `857:1477` `Inverse Ghost`. `Button` владеет
  содержимым и native button behavior; outer `Label` отсутствует.
- Planned local Storybook ID: `components-tabs--overview`; planned portal route:
  `/components/tabs/`. Эти two implementation surfaces не опубликованы.

## Public exports и API

`@cometal/react` после implementation exports four components: `Tabs`,
`TabList`, `Tab`, `TabPanel`. `Tab Item` — internal implementation detail, не
отдельный export, stable registry record или content API.

```ts
export const tabSizes = ['l', 'm', 's'] as const;
export type TabSize = (typeof tabSizes)[number];

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: TabSize;
  children: React.ReactNode;
}

export type TabListProps =
  Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'aria-orientation'> &
  ({ 'aria-label': string; 'aria-labelledby'?: never } |
   { 'aria-label'?: never; 'aria-labelledby': string });

export interface TabProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface TabPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>,
    'id' | 'role' | 'hidden' | 'aria-labelledby'> {
  value: string;
  children: React.ReactNode;
}
```

All four exports forward refs. `Tab` owns neither Button `variant`, `size`,
`loading`, icon slots, `role`, `type`, `tabIndex`, relation IDs nor ARIA
selection props. Visible text is passed once as `Tab.children` into the native
Button children channel. First delivery accepts text-only content; icons and
interactive descendants are excluded.

## Selection, state и keyboard

- `value` is the sole controlled selection source. `defaultValue` initializes
  uncontrolled selection; otherwise the first enabled Tab is selected.
- User activation calls `onValueChange(nextValue)` only for an enabled value
  different from current selection. Controlled Tabs never mutate owner value.
- Panels remain mounted; inactive panels use `hidden`, preserving panel state.
- Manual activation: Left/Right, Home and End move roving focus only. Enter,
  Space and pointer activation select the focused/enabled Tab. Up/Down remains
  native page scrolling; Tabs never traps Tab/Shift+Tab.
- Right/Left follow visual direction in RTL; Home/End use logical DOM order.
- Exactly one enabled Tab is the roving sequential entry. Disabled native
  buttons cannot receive focus. Disabled + selected remains valid and preserves
  its panel, but no fabricated Disabled + Focus runtime state exists.
- Values are unique and non-empty. Missing counterparts, duplicate values or
  panels are development diagnostics and blocking tests.
- Uncontrolled removal selects the nearest enabled successor, then predecessor;
  when none exists selection becomes empty. Controlled removal stays owner-owned
  and does not synthesize an `onValueChange` fallback.

## DOM и accessibility

- `Tabs` is the selection owner; `TabList` is one horizontal named `tablist`.
- Each native Button is adapted to `role="tab"`, with `aria-selected`,
  `aria-controls`, a stable `useId()`-derived ID and roving `tabIndex`.
- Each persistent `tabpanel` has `aria-labelledby`; only the active panel has
  `tabIndex=0`. Hidden panels leave sequential focus and accessibility traversal.
- The Button wrapper and 2px indicator are non-interactive. Nested buttons or
  links are forbidden.
- Pointer activation does not create a keyboard ring; `:focus-visible` is the
  modality gate.

## Visual composition и layout

- `Tab` composes existing `Button variant="inverse-ghost" size={size}` without
  modifying Button, Button tokens or Figma Button source.
- L/M/S Button heights are `48/40/32px`; complete Tab Item heights are
  `56/48/40px`. A persistent `2px` indicator is transparent when unselected.
- Item gap is existing `4px`; Button-to-indicator gap is existing-token
  composition `4px + 2px = 6px`, not a raw value or new token.
- Selected indicator uses existing brand default/hover/pressed roles; disabled
  selected uses global text disabled. Selection does not restyle Button internals.
- The Tabs-owned focus layer uses existing 2px focus stroke/ring and an external
  4px envelope. List and wrappers keep `overflow: visible`.
- The tablist is one intrinsic horizontal no-wrap row. Labels remain Button-owned
  and are not truncated or equalized. Consumer layout owns horizontal overflow
  and reserves the 4px focus envelope.

## Evidence and current limits

- Figma visual coverage: accepted source sets `1572:100` and `1572:181`; their
  24 internal visual combinations are design evidence, not runtime props.
- Architecture: `ARCHITECTURE_APPROVED`; latest MANUAL activation contract
  supersedes the earlier automatic-activation callback.
- This local knowledge candidate has no React implementation, Storybook story,
  portal page, visual comparison, test, accessibility or release evidence yet.
- No new token is authorized. A missing source-backed binding requires a new
  Role35 decision before scope expands.

## Implementation acceptance evidence (pending)

- Controlled/uncontrolled selection, persistent panels, dynamic collection,
  SSR/ref behavior and no fixed four-item assumption.
- Keyboard/manual activation, RTL direction, roving focus, native disabled and
  exact `tablist`/`tab`/`tabpanel` relationships.
- L/M/S geometry, 4/6/2px composition, full 4px focus envelope, state colors,
  no clipping, and long count at 320/768/1440.
- Focused React/Storybook tests, `pnpm validate:sources`, CSS-variable check,
  direct visual comparison and later exact-SHA independent review/QA.
