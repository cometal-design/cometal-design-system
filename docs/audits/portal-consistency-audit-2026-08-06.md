# Cometal Design System portal consistency audit

Date: 2026-08-06
Scope: local documentation portal (`apps/docs`)
Viewports: desktop, tablet, mobile
Publication: forbidden until explicit approval

## Audit rules

- A separator belongs either to the page section or to the nested block, never to both at one boundary.
- Page hierarchy is always `eyebrow → h1 → description → metadata/actions → content`.
- Section hierarchy is always `h2 → description → content`.
- Repeated structures are fixed through a shared component or shared rule.
- A page-only exception receives an explicit modifier; shared selectors are not changed without checking every use.
- Data-driven inline values used to demonstrate a token are allowed. Fixed visual values must come from Cometal tokens.
- CSS media-query breakpoints and accessibility-only clipping values are documented implementation exceptions because CSS custom properties cannot safely replace them in these contexts.

## Route inventory and first-pass findings

| Route | Structure | Desktop | Tablet | Mobile | Engineering / tokens | Initial status |
|---|---|---|---|---|---|---|
| `/` | Hero | No separator issue | Primary nav switches to menu | Two-line title depends on forced line break | Reactive Grid and portal layout contain fixed local dimensions | Fix |
| `/documentation/` | Page header → 2 sections | Lifecycle end divider is intentional | Process becomes one column | Same order preserved | Shared five-step process is tied to a fixed five-column CSS rule | Fix shared process rule |
| `/releases/` | Page header → release metadata → releases | Release metadata divider order is coherent | No structural issue found | Metadata stacks | Primary “Документация” is not active on `/releases/`; eyebrow naming is inconsistent | Fix |
| `/foundation/` | Page header → metadata → 3 sections | Duplicate boundary after metadata; four items use a five-column process grid | Process stacks | Metadata becomes 2×2 | Page-only separator exception is encoded indirectly | Fix |
| `/foundation/color/primitives/` | Category header + tabs → section | Group headings fall back to browser `h2` style | Grid remains responsive | Two-column swatches | CSS targets `h3`, markup uses `h2` | Fix shared selector |
| `/foundation/color/semantic/` | Category header + tabs → section | Group headings fall back to browser `h2` style | Table scrolls horizontally | Horizontal technical table retained | CSS targets `h3`, markup uses `h2` | Fix shared selector |
| `/foundation/typography/web/` | Category header → section | Order and dividers coherent | Two-column specimen layout | Single-column specimens | Inline specimen styles are token data, not local decoration | Pass with documented exception |
| `/foundation/layout/spacing/` | Category header + tabs → metric section | Coherent | Two columns collapse | Rows reflow | Dynamic bar width visualizes token value | Pass with documented exception |
| `/foundation/layout/size/` | Category header + tabs → metric section | Coherent | Two columns collapse | Rows reflow | Dynamic bar width visualizes token value | Pass with documented exception |
| `/foundation/layout/radius/` | Category header + tabs → metric section | Coherent | Two columns collapse | Rows reflow | Dynamic radius visualizes token value | Pass with documented exception |
| `/foundation/layout/stroke/` | Category header + tabs → metric section | Coherent | Two columns collapse | Rows reflow | Dynamic bar width visualizes token value | Pass with documented exception |
| `/foundation/layout/grid/` | Category header + tabs → section | Coherent | Presets remain two columns | Presets collapse | Inline columns/gap visualize source data | Pass with documented exception |
| `/foundation/themes/default/` | Category header → 2 sections | Coherent | Sample becomes one column | Roles become one column | Inline color is token preview | Pass with documented exception |
| `/foundation/icons/catalog/` | Category header → 3 sections | Coherent | Coherent | All statistics collapse | Code icon library is explicitly not approved; no invented icons | Pass with product exception |
| `/foundation/motion/` | Category header → 5 sections | Motion mock duplicates Select trigger and uses a text chevron | Three-column groups persist until mobile | Groups collapse | Custom trigger/popover duplicates an existing component | Fix or document demo boundary |
| `/components/` | Header + statistic → metadata → card grid | Metadata band intentionally has both edges | Cards become one column | Metadata becomes 2×2 / last item spans | Card previews use React components; status is documentation metadata | Pass after shared header check |
| `/components/button/` | Component header → 6 sections | Order coherent; local inline arrow SVG has no approved icon source | Size board uses container query | Boards collapse | Inline icon is not sourced from an approved code icon library | Document exception |
| `/components/fields/` | Component header → 5 sections | Order coherent | Family rows collapse | State boards collapse | Demos use React components | Pass |
| `/components/date-picker/` | Component header → 4 sections | Order coherent | Family row collapses | Code block stacks | Demos use React component | Pass |
| `/components/checkbox/` | Shared selection detail | Coherent | Coherent | Boards collapse | Shared React component and shared page | Pass |
| `/components/radio-button/` | Shared selection detail | Coherent | Coherent | Boards collapse | Shared React component and shared page | Pass |
| `/components/switch/` | Shared selection detail | Coherent | Coherent | Boards collapse | Shared React component and shared page | Pass |
| `/patterns/` | Page header → metadata → empty state | One boundary is supplied by empty-state border | Coherent | Metadata becomes 2×2 / last item spans | Documentation-only empty state uses Cometal tokens | Pass |
| `/templates/` | Page header → metadata → empty state | One boundary is supplied by empty-state border | Coherent | Metadata becomes 2×2 / last item spans | Documentation-only empty state uses Cometal tokens | Pass |

Redirect-only routes (`/foundation/color/`, `/foundation/layout/`, `/foundation/icons/`, `/foundation/themes/`, `/foundation/typography/`) contain no visual UI and are checked only for canonical destination correctness.

## Systemic issue register

| ID | Severity | Area | Finding | Planned resolution | Regression scope |
|---|---|---|---|---|---|
| SYS-01 | High | Separators | A first content section can redraw the lower edge of a preceding metadata strip. | Add an explicit section modifier for a continuation without its own top divider; use it only where the preceding block owns the boundary. | Foundation, Components, Patterns, Templates |
| SYS-02 | High | Layout | `.process-line` is hard-coded to five columns while Foundation has four stages. | Use content-driven equal columns; keep the one-column responsive rule. | Documentation, Foundation |
| SYS-03 | High | Typography | Color-family headings are `h2`, but the shared token typography selector targets `h3`. | Correct the shared selector after checking Primitive and Semantic uses. | Primitive Color, Semantic Color |
| SYS-04 | Medium | Navigation | `/releases/` is outside the `/documentation/` prefix, so the primary Documentation item is inactive. | Declare active sections in navigation data and use one active-state helper for desktop/mobile nav. | All primary routes; focus on Documentation/Releases |
| SYS-05 | Medium | Page hierarchy | Overview and component headers use parallel markup/classes, which can drift vertically. | Introduce shared header primitives or a shared internal copy block without changing page-specific toolbar/stat layout. | Documentation, Foundation, Components, Patterns, Templates, all component detail pages |
| SYS-06 | High | Tokens | `globals.css` contains 105 fixed `px` occurrences. Some are valid implementation exceptions, but reusable portal dimensions are not yet documentation tokens. | Move reusable portal layout dimensions to code-owned Cometal Documentation tokens; retain only breakpoints, accessibility clipping, and source-data previews as documented exceptions. | All routes |
| SYS-07 | Medium | Components | Motion playground recreates a Select-like trigger/listbox and uses a glyph chevron. | Prefer the actual React component where the demo goal permits; otherwise mark the mock as a motion diagram and remove component semantics. | Motion |
| SYS-08 | Medium | Components | Code example uses a raw source anchor and raw tab buttons. | Use Cometal InlineLink for the source; keep semantic tab buttons as a documented exception until Tabs is approved. | All component detail pages |
| SYS-09 | Medium | Icons | Button documentation uses a local inline arrow SVG; code icon library is not approved. | Do not invent a new icon. Record as an explicit source gap until the icon library is released. | Button |
| SYS-10 | Low | Maintainability | Releases page is compressed into one JSX line, making hierarchy and regression review error-prone. | Reformat only; no visual change. | Releases |

## Approved implementation exceptions

| Exception | Why it remains |
|---|---|
| Media-query and container-query thresholds | CSS custom properties cannot be consumed reliably in query conditions; thresholds remain centralized in `globals.css`. |
| `.visually-hidden` one-pixel clipping recipe | Accessibility implementation, not a visual design decision. |
| Inline color, width, radius, grid and typography values on Foundation specimens | Values are read from the token/source data being demonstrated; replacing them with static CSS would make the documentation inaccurate. |
| Motion easing SVG coordinates | Data visualization geometry, not a reusable product icon or component. |
| Button arrow sample | Temporary known gap: the approved React icon package does not exist yet. No substitute icon will be invented locally. |
| Semantic tab buttons in `CodeExample` | The approved Cometal Tabs component has not been released yet. The source link and copy action already use Cometal components; the tabs remain native semantic buttons until Tabs exists. |

## Systemic remediation result

| ID | Result | Applied rule | Regression result |
|---|---|---|---|
| SYS-01 | Fixed | `MetadataStrip` now owns its top and bottom boundaries explicitly through `topDivider` and `bottomDivider`. Foundation owns only the lower boundary; Components, Patterns and Templates own both. Empty states following metadata use the local `empty-state--after-metadata` spacing modifier instead of manufacturing another separator. | Foundation, Components, Patterns and Templates retain one boundary per transition. |
| SYS-02 | Fixed | `.process-line` uses content-driven equal columns on wide viewports and one row per step below the shared breakpoint. It is no longer tied to five stages. | Four-step Foundation and five-step Documentation processes share one rule without empty columns. |
| SYS-03 | Fixed | Primitive and Semantic color group typography now targets the actual `h2` markup. | Both color routes use the same Cometal heading tokens. |
| SYS-04 | Fixed | Primary navigation accepts explicit active sections, so Releases activates Documentation without relying on a URL prefix accident. | Desktop and mobile navigation use the same active-state helper. |
| SYS-05 | Fixed | `PageHeader`, `ComponentPageHeader`, `FoundationCategoryHeader` and `SelectionDetail` own the repeated page hierarchy. | Every non-home canonical page uses one of these structures; the only direct page-level `h1` left outside them is the intentional home hero. |
| SYS-06 | Fixed | Reusable portal widths and heights moved to `documentation.tokens.json`. | The only raw `px` values left in `globals.css` are query thresholds and the accessibility clipping recipe. |
| SYS-07 | Fixed | The Motion playground now renders the actual Cometal `Select`; only its motion surface is decorated by the documentation layer. | No duplicate Select trigger, listbox or chevron remains in the portal demo. |
| SYS-08 | Fixed with exception | The source action uses Cometal `InlineLink`; native tab buttons remain until Cometal Tabs is approved. | All component code examples share one implementation. |
| SYS-09 | Open product dependency | No local icon replacement was invented. | Button remains the only known inline sample icon exception. |
| SYS-10 | Fixed | Releases markup was reformatted without changing its information architecture. | Route builds and keeps the same content order. |

## Second-pass engineering audit

| Check | Result | Evidence |
|---|---|---|
| Canonical route inventory | Pass | 24 visible routes and 5 redirect-only routes are represented; the production build emitted 31 static pages including framework routes. |
| Repeated page hierarchy | Pass | All non-home canonical pages use shared page/category/component structures. Home remains a deliberate hero exception. |
| Separator ownership | Pass by source | Metadata, content sections, process rows and empty states have explicit owners/modifiers; no shared selector relies on incidental adjacency. |
| Cometal CSS variables | Pass | Static comparison found no referenced CSS custom property without a definition in portal, Storybook foundation, tokens or React component styles. |
| Fixed local visual values | Pass with documented exceptions | `globals.css` contains raw pixels only in media/container queries and `.visually-hidden`. |
| Raw local colors | Pass | No fixed hex/RGB/HSL visual colors remain in portal components or portal CSS. The RGBA helper is source-data rendering for token specimens. |
| Inline styles | Pass with documented exceptions | Six sites remain, all data-driven Foundation specimens: typography, metric dimensions, primitive/semantic/theme colors and grid presets. |
| React component reuse | Pass with known gaps | Interactive demos use Cometal components. Known gaps are the unreleased Tabs and icon package described above. |
| Type, unit, Storybook and production builds | Pass | `pnpm validate` completed: 5 unit files / 22 tests, 8 Storybook files / 52 tests, token build, React build, Storybook build and docs build. |
| Git hygiene | Pass | `git diff --check` returns no whitespace errors. No commit, push or deployment was performed. |

## Visual verification matrix

The full source and build audit is complete. The final visual audit is not marked complete: the available browser session allowed a live desktop inspection of Foundation, but blocked the automated localhost route loop by security policy. No alternate browser-control workaround was used.

| Viewport | Routes visually rechecked | Result |
|---|---:|---|
| Desktop | Foundation overview live; remaining routes source/build only | Pending full-route visual pass |
| Tablet | Responsive rules and builds checked; live route sweep unavailable | Pending full-route visual pass |
| Mobile | Responsive rules and builds checked; live route sweep unavailable | Pending full-route visual pass |

Until this matrix is completed visually, the task does **not** receive the requested final “zero discrepancies” status.

## Regression log

This section is updated after every systemic change.

| Change | Routes rechecked | Desktop | Tablet | Mobile | Engineering |
|---|---|---|---|---|---|
| Initial audit | All canonical routes by source; live browser capture pending | Issues recorded | Issues recorded | Issues recorded | Source inventory complete |
| SYS-01…04 shared rules | Foundation, Documentation, Components, Patterns, Templates, Releases, both color pages, primary nav on every route | Source regression passed | Responsive selectors retained | Responsive selectors retained | `@cometal/docs` typecheck and `git diff --check` passed |
| SYS-05, SYS-08, SYS-10 shared markup | All overview/category headers, all seven component detail routes, Releases, every code example | Shared DOM order retained | Existing responsive classes retained | Existing responsive classes retained | Typecheck, production build (31 static pages) and `git diff --check` passed |
| SYS-01, SYS-02 separator and process ownership | Foundation, Documentation, Components, Patterns, Templates | Explicit boundaries verified by source | One-column process rule retained | One-column process rule retained | Typecheck and full build passed |
| SYS-06, SYS-07 tokens and component reuse | All portal routes; Motion; Storybook Foundation stylesheet | Reusable dimensions resolved through tokens | Responsive documentation dimensions use tokens | Responsive documentation dimensions use tokens | No unresolved CSS variables; no raw portal colors |
| Final engineering regression | All workspaces and canonical routes | Build passed | Responsive source rules passed | Responsive source rules passed | `pnpm validate` passed: 22 unit tests, 52 Storybook tests, all package and app builds |

## Remaining exceptions and blockers

| Item | Status | Reason |
|---|---|---|
| Full desktop/tablet/mobile visual route sweep | Blocked in current browser session | Localhost multi-route automation was rejected by the browser security policy. This is the only blocker to a final visual PASS. |
| Query thresholds and visually-hidden clipping | Accepted implementation exception | These values cannot be represented safely by runtime custom properties in their CSS contexts. |
| Data-driven Foundation specimen styles | Accepted documentation exception | The values must reflect live token/source data rather than a static presentation token. |
| Button arrow sample | Open product dependency | The approved code icon package is not released. |
| Code example tabs | Open product dependency | The approved Cometal Tabs component is not released. |
| Storybook large-chunk warning | Follow-up, not a consistency defect | Storybook builds successfully, but its generated bundle reports a chunk-size warning that should be handled as performance work. |
