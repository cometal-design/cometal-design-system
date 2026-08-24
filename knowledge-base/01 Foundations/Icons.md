# Icons

## Candidate contract

Icons are a foundation library in the local delivery candidate, not 2,810 independent registry components. Visual and identity authority remains Figma DS Core: page `381:25439`, artboards Outline `691:9685`, Filled `691:12877`, and Feature Icons and Logos `691:15704`.

The accepted source contains 2,810 standalone components: 875 Outline, 877 Filled and 1,058 Feature Icons and Logos. Its immutable fingerprint is `d4a210b39244ccf6a09489e28c1e82858ec3efc7921f50fe28c7b48dd6d64c0a`.

## Identity and use

`canonicalName` is the exact Figma component name, retained byte-for-byte in the source manifest, display and primary copy action. It is not an accessibility label and is not silently renamed, deduplicated, redrawn or substituted. Direct imports use generated `@cometal/react/icons/<path>` subpaths; the catalog is available separately at `@cometal/react/icons/catalog`.

The local candidate exposes the same catalog in Storybook `foundation--icons` and portal `/foundation/icons/catalog/`. It uses canonical-name search and filters, 120-item pages, visible wrapping selectable names, exact-name copy feedback, and a recoverable clipboard-error state.

## Rendering rules

- Preserve source viewBox, paths, definitions, fills and strokes.
- Use `currentColor` only for audited monochrome Outline/Filled records; feature, logo, flag and payment artwork keeps intrinsic paint.
- Decorative icons are hidden and unfocusable. Informative icons require a product-owned non-empty label; interaction belongs to a semantic parent control.
- The local corpus, generated modules and validation contract live in `packages/react/icons/`; the Figma handoff is evidence, not a runtime dependency.

## Status and next gate

Candidate: `e528f77d85ed14cdc2decfac3bc3e0996c8cd5da` on `agent/icons-library-implementation-2026-08-25`. This is an implementation candidate only. `CODE_APPROVED`, `QA_PASSED`, user acceptance, publication and production verification remain pending.

Related: [[Index]], `specifications/foundations/icons.md`, `docs/handoffs/2026-08-24-icons/IMPLEMENTATION_REPORT.md`.
