# COMETAL DS Preview QA Remediation Report

**Date:** 2026-08-20

**Initial preview SHA:** `71826516bc76126996f5018fa05f41937ba602e0`

**Initial deployment:** `dpl_DunwFDQ1kUKnwm6CP7AE6CtwyAK1`

**Initial preview URL:** `https://cometal-design-system-storybook-pydq9olmg.vercel.app`

**Initial independent verdict:** `QA_FAILED`

**Second preview SHA:** `df379874479bcb7387f30c44cb7ab870ec007809`

**Second deployment:** `dpl_AjhxUp1J3Hqhoc1oUp9f4kssyArJ`

**Second preview URL:** `https://cometal-design-system-storybook-axgbwi2hu.vercel.app`

**Second independent verdict:** `QA_FAILED`

**Current gate:** replacement preview and independent retest required; production prohibited.

## Initial independent QA findings

| Severity | Change ID | Finding | Root cause | Remediation |
|---|---|---|---|---|
| BLOCKER | REL-001 | 10 of 124 screenshots captured the Storybook loader instead of evidence. | Evidence runner used a fixed timing window and did not wait for a populated `#storybook-root`. | Replacement-preview runner must wait for non-empty story content and explicitly load required font faces before capture. |
| HIGH | CMP-006 | Tooltip placements overflowed and collided on mobile. | The evidence story forced eight fixed-position tooltips open in one tall mobile board; side-arrow CSS also inherited an incompatible centering rule. | Mobile evidence now keeps one tooltip open while every trigger remains interactive; left/right arrows use only side-specific positioning. |
| MEDIUM | DOC-001 / TOK-003 | Semantic color table overflowed desktop. | Grid children retained intrinsic minimum widths and long token paths could not wrap. | Semantic cells now use `min-width: 0` and `overflow-wrap: anywhere`. |

## Second independent QA findings

| Severity | Change ID | Finding | Root cause | Remediation |
|---|---|---|---|---|
| HIGH | DOC-001 | Semantic Color Map exposed 111 of 288 approved roles. | The story rendered only Global Semantic colors and omitted Component Semantic colors. | The map now combines both approved collections, resolves aliases recursively and asserts exactly 288 rendered roles. |
| HIGH | PAT-003 | Widget Table story used placeholder gray bars rather than the approved Table composition. | The template story demonstrated shell geometry but did not exercise its actual content contract. | The story now contains the native COMETAL Table, four representative rows, two secondary actions and one primary action. |
| HIGH | CMP-006 / PAT-002 | Long Table tooltip content overflowed its 320 px panel. | Tooltip content retained an inline intrinsic width and had no forced wrapping rule. | Content now uses block layout, `min-width: 0`, `max-width: 100%`, normal whitespace and `overflow-wrap: anywhere`. |
| MEDIUM | PAT-001 | Escape closed Context Menu but returned focus to `BODY`. | Focus was sent to the non-focusable wrapper instead of its interactive trigger. | Context Menu now locates and focuses the actual focusable trigger child; the Storybook assertion covers close and focus restoration. |
| MEDIUM | CMP-003 | Unchecked Checkbox hover changed the border from default to strong. | The hover selector overrode the approved stable border role. | Hover now preserves the default border and communicates feedback through the subtle background only. |
| MEDIUM | CMP-006 | Escape did not close Tooltip. | The open Tooltip had no keyboard dismissal listener. | Tooltip now closes on document Escape and the interaction story asserts dismissal. |

## Additional defects found during remediation

- Tooltip referenced undefined Primitive names for its dark surface and inverse content.
- Context Menu and Widget referenced an undefined white Primitive name, making their intended surfaces transparent.
- Context Menu referenced an undefined radius token.
- Storybook and portal shadow samples referenced an undefined spacing token.
- Widget used 48 px padding instead of the approved 24 px inset.
- Date Picker relied on an undeclared optional local width variable.
- The first replacement-preview evidence run completed 124 / 124 checks without loader, font, overflow or runtime failures, but its metric audit exposed a Table defect: selection controls shrank from 20 px to 15 px in Comfortable and 7 px in Compact because cell insets consumed the square column width.
- The built-in Context Menu check used a 14-unit viewBox inside a 16 px slot, producing a rendered stroke above the 1.4 px contract.

All invalid references were replaced with existing approved Semantic or Primitive roles. Table selection cells now remove horizontal insets, center their content and prevent Checkbox flex shrink at both densities. The Context Menu check uses a matching 16-unit viewBox. A repository validation script now fails when an authored `var(--cometal-*)` reference has no definition in the active token/source graph.

## Local verification after fixes

- `pnpm validate:sources`: **PASS**, 5 logical sources, 15 components, 69 exact Storybook routes.
- `pnpm validate:css-variables`: **PASS**, 84 source files, zero unresolved `--cometal-*` references.
- `pnpm validate:secrets`: **PASS**, 249 tracked files.
- typecheck: **PASS** for all workspaces.
- unit tests: **30 / 30 PASS** across 7 files.
- Storybook interaction/a11y tests: **69 / 69 PASS** across 13 files.
- token, React, Storybook and portal builds: **PASS**; portal produced 37 static routes.
- focused browser verification: **24 / 24 route/environment checks PASS** across Chromium and WebKit at 1440 x 900 and 390 x 844.
- focused browser evidence reported HTTP 200, zero page/console errors, zero document overflow and successful loading of Grtsk Peta plus IBM Plex Mono Regular/Medium in every check.
- computed contracts: Tooltip `#111111` / `#ffffff`; Context Menu white raised surface and 4 px item radius; Widget white surface, 32 px radius and 24 px padding.
- targeted Table/stroke verification: **10 / 10 Chromium/WebKit checks PASS**; Comfortable and Compact selection controls remain 20 x 20 px and all inspected selection, Context Menu and loader outlines resolve to rendered 1.4 px without `non-scaling-stroke`.
- second-verdict remediation matrix: **16 / 16 PASS** in Chromium and WebKit, covering 288 resolved Semantic Color rows, native Widget Table/actions, Tooltip wrapping and Escape, Context Menu focus restoration, stable Checkbox hover border and mobile Widget containment.

## Release decision

The fixes are locally verified but do not replace independent preview QA. Publish a new replacement preview from the committed remediation state, collect the complete QA Matrix evidence, and request a fresh independent verdict. Production remains blocked until that exact preview returns `QA_PASSED`.
