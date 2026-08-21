# Widget source-to-delivery coverage

Baseline inspected: local checkout at `6d16ed8e3b5d5b84d5d3d8e9bacc4f40f94c9a67` plus uncommitted/unverified downstream edits present on 2026-08-21. This matrix describes current evidence, not desired status.

Legend: `MATCH`, `PARTIAL`, `MISSING`, `EXTRA`, `CONFLICT`, `BLOCKED`.

| Figma source | Node ID | Tokens | React | Storybook | Portal/spec/registry | Tests |
|---|---|---|---|---|---|---|
| Toolbar Actions | `2702:3` | PARTIAL: nested Button tokens exist, exact Widget composition not revalidated | PARTIAL: generic `actions` slot can express it, no toolbar contract/helper | PARTIAL: only one/two text actions, approved 3 Secondary icon + 1 Primary example absent | PARTIAL | PARTIAL: tab order only |
| Content Slot | `2702:21` | PARTIAL: exact Global roles exist | CONFLICT: runtime wrapper always clips overflow; placeholder is story CSS | PARTIAL: local placeholder approximation | PARTIAL | MISSING overlay/focus escape test |
| Table Content Payload | `2702:23` | BLOCKED by Table handoff reconciliation | CONFLICT/PARTIAL: separate post-QA `WidgetTablePattern` is uncommitted and not approved evidence | CONFLICT/PARTIAL: separate story exists but is not tied to accepted Table handoff | PARTIAL | PARTIAL, not independent live-Figma QA |
| Main Widget | `2702:2173` | CONFLICT: shell consumes Table-owned border/text/file tokens and wrong surface role | CONFLICT: legacy implementation must be replaced | PARTIAL: reduced shell stories, no exact source manifest | CONFLICT: Template/Component classification diverges; checks are false | MISSING complete structural, a11y and visual evidence |
| Table Review evidence | `2702:2265` | BLOCKED by Table | PARTIAL | PARTIAL | PARTIAL | MISSING independent comparison |
| Compact evidence | `3116:25403` | BLOCKED by Table | PARTIAL | MISSING exact evidence story | MISSING | MISSING |

## Current overall verdict

`CONFLICT`.

The existing generic API direction is reusable, but the visual/token implementation and delivery evidence are not the approved Figma contract. Because Vadim explicitly rejected the old build, the downstream task must replace the Widget-specific implementation rather than preserve it as the base of a cosmetic patch.

## Legacy surfaces in replacement scope

- `packages/react/src/Widget/Widget.tsx`
- `packages/react/src/Widget/widget.css`
- Widget-specific exports in `packages/react/src/index.ts`
- `apps/storybook/stories/Widget.stories.tsx`
- `apps/docs/app/components/widget/`
- compatibility route `apps/docs/app/templates/widget/`
- Widget-specific portal demo styles and previews
- `specifications/components/widget.md`
- Widget registry/usage records
- Widget knowledge files and indexes
- Widget-specific portions of `WidgetTablePattern` after the Table contract is accepted

The files above must be inventoried before replacement. Shared Button, Table, Field, Date Picker, Context Menu, Tooltip, Badge, icon and token implementations are dependencies and are not deletion targets.

## Proven conflicts

1. `.cometal-widget` uses `--cometal-component-table-cell-border-divider` instead of the Global border role.
2. `.cometal-widget__title` and description use Table-owned text/file variables.
3. Widget background uses Canvas instead of Raised.
4. `.cometal-widget__content` forces `overflow: hidden`, which can clip focus and overlays and does not match the unclipped shell.
5. Header geometry omits the approved 16 px vertical padding and uses a different gap contract.
6. The current story omits the approved toolbar composition and exact source anatomy.
7. Registry ID/classification says Template while current navigation and Storybook say Component.
8. Registry correctly reports visual, test and accessibility checks as false, so no MATCHED claim exists.
9. The checkout contains uncommitted post-QA Widget/Table work and is not immutable release evidence.

## Acceptance rule

No row becomes `MATCH` from a similar screenshot alone. It requires the rebuilt package, exact token ownership, shared documentation, local tests, immutable preview and independent comparison against the live Figma nodes in this package.
