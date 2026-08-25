# Icons

## Candidate contract

Icons are a foundation library in the local delivery candidate, not 2,810 independent registry components. Visual and identity authority remains Figma DS Core: page `381:25439`, artboards Outline `691:9685`, Filled `691:12877`, and Feature Icons and Logos `691:15704`.

The normalized source contains 2,810 standalone components: 875 Outline, 877 Filled and 1,058 Feature Icons and Logos. Its corpus fingerprint is `87caaa283983e042491e2b0beb6bb8cc54a8aeaad75b1b9599e66d06c2199a58`; the Outline fingerprint is `4143ba6593eb6f852c091552d83264ae73f1609a1d7679b4734eddd8c7a724ed`.

## Identity and use

`canonicalName` is the exact Figma component name, retained byte-for-byte in the source manifest, display and primary copy action. It is not an accessibility label and is not silently renamed, deduplicated, redrawn or substituted. Direct imports use generated `@cometal/react/icons/<path>` subpaths; the catalog is available separately at `@cometal/react/icons/catalog`.

The normalized Outline record `profiles-and-users/user-profile-03-02` keeps component `700:15590`, vector `700:15589`, its two 1.4 token-bound paths and no-mask structure. Only its stroke alignment changed from `INSIDE` to `CENTER`; SVG hash `897a2fb485e9e42472da312a1d567681fa766853b86f83b9c5927e6951d717b5` is the candidate source evidence.

The local candidate exposes the same catalog in Storybook `foundation--icons` and portal `/foundation/icons/catalog/`. It uses canonical-name search and filters, 120-item pages, visible wrapping selectable names, exact-name copy feedback, and a recoverable clipboard-error state.

## Rendering rules

- Preserve source viewBox, paths, definitions, fills and strokes.
- Use `currentColor` only for audited monochrome Outline/Filled records; feature, logo, flag and payment artwork keeps intrinsic paint.
- Decorative icons are hidden and unfocusable. Informative icons require a product-owned non-empty label; interaction belongs to a semantic parent control.
- The local corpus, generated modules and validation contract live in `packages/react/icons/`; the Figma handoff is evidence, not a runtime dependency.

## Status and next gate

Normalized implementation parent: `bb500bd2daf5921dd2f7c6a3a8a1d497a1c2b844` on `agent/icons-library-implementation-2026-08-25`. The exact current review candidate belongs in the external Orchestrator delivery manifest, not in this self-committing note. This remains a local implementation candidate only. `CODE_APPROVED`, `QA_PASSED`, user acceptance, publication and production verification remain pending.

Related: [[Index]], `specifications/foundations/icons.md`, `docs/handoffs/2026-08-24-icons/IMPLEMENTATION_REPORT.md`.
