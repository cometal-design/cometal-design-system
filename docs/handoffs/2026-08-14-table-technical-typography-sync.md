# Table and Technical Typography sync

Date: 2026-08-14  
Status: implementation validated; production publication pending

## Figma source

- File: `KKNGucImxFAtQLBhPy8tLs`
- Typography board: `2561:116`
- Table Review: `2353:10833`
- Table Read Columns: `2353:9830`
- Table Edit Columns: `2353:10334`

## Synchronized changes

### Technical typography

- `Technical/L/Default`: IBM Plex Mono Regular, 14/20.
- `Technical/M/Default`: IBM Plex Mono Regular, 12/16.
- `Technical/M/Accent`: IBM Plex Mono Medium, 12/16.
- `Technical/S/Default`: IBM Plex Mono Regular, 11/14.
- Official IBM Plex Mono Regular/Medium assets and OFL license are included in Storybook and the portal.

### Tokens

- `Semantic / Color/Icon/Tertiary` → `Primitive / Color Primitive Palette/Neutral/500/100`.
- `Component / Table / Color/File/Metadata` → `Semantic / Color/Text/Supporting` in both modes.
- `Component / Table / File/Show Metadata`: `true` in Comfortable, `false` in Compact.
- Existing `Primitive / Stroke/140 = 1.4px` is applied directly to Table SVG stroke attributes and CSS.

### Table public contract

- Native table structure: `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, `TableFileCell`.
- Comfortable rows are 48px; Compact rows are 40px; Header remains 48px.
- Index and selection columns resize with density.
- File size remains in the DOM and is hidden only in Compact.
- Cell states: default, active, selected, editing, error, disabled.
- Sorting is exposed through `aria-sort`; error and disabled semantics are exposed through ARIA.

## Source-of-truth links

- Registry ID: `data-display.table`
- Specification: `specifications/components/table.md`
- React: `packages/react/src/Table/Table.tsx`
- Storybook: `/storybook/?path=/story/patterns-table--overview`
- Portal: `/patterns/table/`
- Knowledge: `knowledge-base/02 Components/Table.md`

## Validation evidence

- Source registry: 5 logical sources, 12 records, 59 exact Storybook routes.
- Unit tests: 30 passed.
- Storybook browser tests: 59 passed.
- Production builds: tokens, React, Storybook and 33 portal routes passed.
- Chromium computed QA: row heights 48/40px; Header 48px; file icon stroke 1.4px; file metadata visible/hidden by density without data loss.
- Desktop 1440×900 and mobile 390×844 screenshots show no document-level horizontal overflow; the Table uses its own scroll container.

## Publication handoff

1. Review the committed diff without changing the Figma-owned composition.
2. Push the validated commit to GitHub `main`.
3. Deploy the assembled portal and Storybook to Vercel production.
4. Run production QA on `/foundation/typography/web/`, `/patterns/`, `/patterns/table/` and `/storybook/?path=/story/patterns-table--overview`.
5. Confirm the production commit SHA and deployment URL in the final report.
