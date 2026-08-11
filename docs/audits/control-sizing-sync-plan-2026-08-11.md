# Control sizing sync audit and implementation plan

Date: 2026-08-11
Source handoff: `/Users/vadim/Documents/Cometal/docs/handoffs/2026-08-11-control-sizing-table-density.md`
Status: implementation, local QA, Git branch and Vercel preview complete; production merge pending

## Approved source contract

- Shared control-height scale: `S = 32 px`, `M = 40 px`, `L = 48 px`.
- Button: all nine public families use `S/M/L = 32/40/48`.
- Single-line Fields: Text Field, Select and Combobox receive `S`; existing `M/L` remain.
- Text Area remains `M/L`.
- Multi Select remains `M/L`.
- Table v3 atomic cells have `Compact = 40 px` and `Comfortable = 48 px`; Column Header stays `48 px`.
- Table v3 composition and public React API are not approved and must not be implemented in this pass.

## Audit

| Layer | Current repository state | Mismatch | Required update |
|---|---|---|---|
| Primitive tokens | `Size/32` and `Size/40` exist; `Size/48` is absent | Figma now has an approved `Size/48` variable | Add the verified primitive with Figma ID, key and code syntax from the handoff |
| Semantic size tokens | Button aliases still resolve to `28/36/44`; no shared `Size/Control/*` scale | Code does not express the new shared control contract | Add `Size/Control/S|M|L`; repoint `Size/Button/S|M|L` to it |
| Generated token package | CSS/JS/JSON are generated from the stale source tokens | Storybook, portal and React resolve old values | Rebuild `@cometal/tokens` and verify generated names and resolved values |
| React Button | Public API already exposes `s/m/l`; CSS already consumes Button semantic size tokens | Geometry resolves to the old scale; comments document old pixels | Keep API stable, update token resolution and inline API documentation |
| Button specification | States `44/36/28` | Specification contradicts Figma | Replace with `48/40/32` and record shared Control aliases |
| Button Storybook | Overview, controls and size matrix explicitly show `44/36/28` | Executable documentation is stale | Update text and matrices; add exact geometry checks for text, icon and icon-only compositions |
| Button portal page | Size labels are hardcoded as `44/36/28` | Vitrine contradicts Figma and React after token update | Update to `48/40/32`; keep the existing shared page header work intact |
| React Fields API | One shared `FieldSize = l|m` is used by all five fields | Text Field, Select and Combobox cannot expose `s`; blindly extending the type would incorrectly add `s` to Text Area and Multi Select | Split single-line and multiline/multi-select size contracts; add `s` only to approved components |
| React Fields CSS | Only `l/m` geometry, typography, inset and Listbox option rules exist | No 32 px single-line implementation | Add token-driven `s` control/read/listbox rules and preserve helper-space behavior |
| Field specifications | Text Field, Select and Combobox document only `l/m` | Specs contradict approved Figma sets | Add `s = 32 px`; explicitly retain Text Area and Multi Select exclusions |
| Fields Storybook | Shared controls expose only `l/m`; no comparative S/M/L story | Developers cannot validate the new scale | Add size comparison stories for Text Field, Select and Combobox; prove exclusions for Text Area and Multi Select |
| Fields portal page | Shows the family but not the approved size contract | Vitrine does not explain the new system | Add a compact S/M/L comparison and explain which components support each size |
| Foundation portal | Generic token list exists at `/foundation/layout/size/` | The shared component-size rule is not explained | Add a “Control heights” section with S/M/L, usage and exclusions before the raw Primitive/Semantic lists |
| Foundation inventory | Counts predate the new Figma variables | Summary numbers may become stale after token import | Refresh counts from the verified token source instead of editing numbers manually |
| Registry/release status | Components remain `in-review` | A size change alone does not satisfy the Ready gate | Keep statuses unchanged until engineering, visual and Frontend Lead review pass |

## Implementation order

1. **Tokens first**
   - Add `Primitive.Size.48`.
   - Add `Semantic.Size.Control.S|M|L` aliases to `32/40/48`.
   - Repoint Button aliases to the shared scale.
   - Rebuild and inspect generated CSS, JS and JSON.

2. **React contracts**
   - Keep Button API unchanged and let the new tokens update all variants centrally.
   - Introduce the approved 32 px contract for Text Field, Select and Combobox.
   - Prevent `size="s"` on Text Area and Multi Select at TypeScript level.
   - Add unit tests for allowed and excluded size contracts and exact rendered data attributes.

3. **Storybook engineering documentation**
   - Update Button sizes everywhere to `32/40/48`.
   - Add S/M/L comparison stories and tests for Button compositions.
   - Add S/M/L stories for Text Field, Select and Combobox.
   - Keep Text Area and Multi Select at M/L and state that explicitly.

4. **Vitrine**
   - Update Button size matrix.
   - Add an approved size block to Fields.
   - Extend Foundation → Sizes with the reusable Control scale, usage matrix and exclusions.
   - Preserve the current uncommitted portal consistency refactor and avoid replacing its shared headers or CSS rules.

5. **Specifications and registry**
   - Synchronize Button, Text Field, Select and Combobox specifications.
   - Update source metadata and inventory where verified data is available.
   - Do not mark anything Ready and do not create a Table component.

6. **QA gates**
   - Run token build, React typecheck/unit tests, Storybook tests/build, docs build and source validation.
   - Visual matrix: desktop, tablet and mobile; Button variants/compositions/states; single-line Field S/M/L; open Listbox positioning.
   - Figma comparison at the approved node IDs.
   - Regression: Text Area and Multi Select remain unchanged; no Table public API appears.

7. **Git and publication**
   - Review the existing dirty portal changes separately so the sizing work is not accidentally mixed or lost.
   - Commit implementation and documentation in reviewable commits.
   - Push only after the local QA report is clean and the user confirms publication.
   - Vercel deployment follows the Git push; then verify both the portal and direct Storybook URLs.

## Proposed commit split

1. `feat(tokens-react): align controls to 32 40 48 scale`
2. `docs(storybook-portal): document shared control sizing`

## Stop conditions

- No Table v3 React component or public density API in this pass.
- No `S` size for Text Area or Multi Select.
- No status promotion to Ready before the normal review gate.
- No push or Vercel publication before implementation QA and user approval.

## Local QA result

Completed on 2026-08-11.

- Token output: `Primitive.Size.48 = 48px`; `Semantic.Size.Control.S|M|L` resolve to `32|40|48px`.
- React: Button keeps its existing public `s|m|l` API; Text Field, Select and Combobox expose `s|m|l`; Text Area and Multi Select remain type-restricted to `m|l`.
- Unit tests: 5 files, 24 tests passed.
- Storybook interaction tests: 8 files, 54 tests passed.
- Storybook direct-canvas geometry:
  - Button text, icon-left, icon-right and icon-only compositions use heights `48|40|32px`.
  - Button icon slots use `20|16|14px` for `L|M|S`.
  - Text Field controls use heights `48|40|32px` and insets `16|12|12px`.
- Responsive portal checks at `1440px`, `768px` and `390px`: no horizontal overflow or framework error overlay on Foundation Sizes and Fields routes.
- Responsive Storybook checks at `390px`: Button and Fields sizing stories retain `48|40|32px`, no horizontal overflow and no browser console errors.
- Builds: tokens, React, Storybook and docs passed; docs produced 31 routes.
- Source registry and secret validation passed.
- Table remains documentation-only in this pass; no React component or public density API was introduced.
- Git: commit `2537d42` on `agent/control-sizing-sync`; draft PR `#1`.
- Vercel preview: deployment `dpl_HrdnaPCSYGYvKzgKYBhUeNmdeAE5` reached `READY` for the exact commit.
- Preview browser verification: portal home, Foundation Sizes, Button sizing canvas and Fields sizing canvas load without visible errors; deployed geometry matches the local measurements.
