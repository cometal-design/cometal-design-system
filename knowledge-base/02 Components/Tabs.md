# Tabs

`navigation.tabs` — public navigation compound for switching related persistent
page content. Status: `specified`; this is a local knowledge candidate, not an
implementation, QA or production claim.

## Что зафиксировано

- Figma source: internal `Sources/Tab Item` `1572:100`, public `Tabs` `1572:181`,
  page `1018:21` in DS Core `KKNGucImxFAtQLBhPy8tLs`.
- `Tab Item` is internal. Public React surface after implementation is exactly
  `Tabs`, `TabList`, `Tab`, `TabPanel`.
- Nested `Button / Inverse Ghost` `857:1477` owns content and native button
  behavior. Outer Tab Item Label does not exist; four Figma items are example
  content, not a count prop.
- API is controlled/uncontrolled with `value`, `defaultValue`, `onValueChange`
  and `size` `l|m|s`; panels remain mounted.
- Activation is MANUAL: arrows/Home/End move focus; Enter/Space/click commit
  selection. No orientation, activation-mode, routing, lazy-mount, count,
  arbitrary slots or overflow-control API.
- Tablist is a one-line intrinsic horizontal row; consumer owns any horizontal
  overflow and keeps its 4px focus envelope visible.
- Button L/M/S `48/40/32px` plus persistent indicator produce Tab Item
  `56/48/40px`; item gap `4px`, Button-to-indicator gap `6px`, indicator `2px`.

## Источники и границы

- Figma: [Tabs `1572:181`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1572-181) and internal source `1572:100`.
- Architecture: `tabs-role35-engineering-design-2026-09-07.md`,
  `ARCHITECTURE_APPROVED`, MANUAL contract.
- Specification: [[../../specifications/components/tabs]].
- Registry: `navigation.tabs`, status `specified`.
- Planned React source: `packages/react/src/Tabs/Tabs.tsx`; planned Storybook ID:
  `components-tabs--overview`; planned portal: `/components/tabs/`. None exists
  or is published at this stage.

## Неподтверждённое

No implementation, rendered Storybook/portal, tests, visual parity,
accessibility verification, CODE_APPROVED, QA_PASSED or release evidence exists
for this knowledge commit. Those require the separate Role30/35/40 delivery
steps on one exact future candidate SHA.
