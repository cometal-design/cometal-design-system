# Widget deletion / replacement ledger

Baseline: `6d16ed8e3b5d5b84d5d3d8e9bacc4f40f94c9a67` in isolated worktree `cometal-design-system-table-2026-08-21`.

| Legacy surface | Action | Canonical replacement / compatibility |
|---|---|---|
| `packages/react/src/Widget/Widget.tsx` | Replaced | One generic named-region implementation with `toolbar`; deprecated `actions` alias retained. |
| `packages/react/src/Widget/widget.css` | Replaced | Global/Widget tokens, Raised surface, 32/24/16/8 geometry, no clipping. |
| Widget exports | Replaced | Same public `Widget` identity plus `WidgetToolbar`, `WidgetContent`, docs manifest. |
| `Templates/Widget` stories | Removed | `Components/Widget` stories consume only `@cometal/react`. |
| `/templates/widget/` | Replaced | Explicit compatibility redirect to `/components/widget/`. |
| Templates catalog Widget card | Removed | Widget is now one family card in Components. |
| `specifications/components/widget.md` | Replaced | Exact source/API/token/behavior contract. |
| `knowledge-base/04 Templates/Widget.md` | Removed | Canonical passport at `knowledge-base/02 Components/Widget.md`. |
| Registry ID `template.widget` | Preserved intentionally | Compatibility identity only; links/classification point to Component surfaces. |
| Shared Button/Table/tokens/icons | Preserved | Dependencies are untouched by replacement. |

No second Widget API, canonical route or CSS implementation is retained.
