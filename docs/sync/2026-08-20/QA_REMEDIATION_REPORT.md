# COMETAL DS Preview QA Remediation Report

**Date:** 2026-08-20

**Initial preview SHA:** `71826516bc76126996f5018fa05f41937ba602e0`

**Initial deployment:** `dpl_DunwFDQ1kUKnwm6CP7AE6CtwyAK1`

**Initial preview URL:** `https://cometal-design-system-storybook-pydq9olmg.vercel.app`

**Initial independent verdict:** `QA_FAILED`

**Current gate:** replacement preview and independent retest required; production prohibited.

## Independent QA findings

| Severity | Change ID | Finding | Root cause | Remediation |
|---|---|---|---|---|
| BLOCKER | REL-001 | 10 of 124 screenshots captured the Storybook loader instead of evidence. | Evidence runner used a fixed timing window and did not wait for a populated `#storybook-root`. | Replacement-preview runner must wait for non-empty story content and explicitly load required font faces before capture. |
| HIGH | CMP-006 | Tooltip placements overflowed and collided on mobile. | The evidence story forced eight fixed-position tooltips open in one tall mobile board; side-arrow CSS also inherited an incompatible centering rule. | Mobile evidence now keeps one tooltip open while every trigger remains interactive; left/right arrows use only side-specific positioning. |
| MEDIUM | DOC-001 / TOK-003 | Semantic color table overflowed desktop. | Grid children retained intrinsic minimum widths and long token paths could not wrap. | Semantic cells now use `min-width: 0` and `overflow-wrap: anywhere`. |

## Additional defects found during remediation

- Tooltip referenced undefined Primitive names for its dark surface and inverse content.
- Context Menu and Widget referenced an undefined white Primitive name, making their intended surfaces transparent.
- Context Menu referenced an undefined radius token.
- Storybook and portal shadow samples referenced an undefined spacing token.
- Widget used 48 px padding instead of the approved 24 px inset.
- Date Picker relied on an undeclared optional local width variable.

All invalid references were replaced with existing approved Semantic or Primitive roles. A repository validation script now fails when an authored `var(--cometal-*)` reference has no definition in the active token/source graph.

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

## Release decision

The fixes are locally verified but do not replace independent preview QA. Publish a replacement preview from the committed remediation state, collect the complete QA Matrix evidence, and request a fresh independent verdict. Production remains blocked until that exact preview returns `QA_PASSED`.
