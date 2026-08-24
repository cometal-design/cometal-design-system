# Icons foundation

Status: `IMPLEMENTATION_CANDIDATE` on the local delivery candidate only. This is not `CODE_APPROVED`, `QA_PASSED`, `Ready`, a release, or production evidence.

## Source contract

- Figma DS Core `KKNGucImxFAtQLBhPy8tLs`, Icons page `381:25439`.
- Canonical artboards: Outline `691:9685`, Filled `691:12877`, Feature Icons and Logos `691:15704`.
- Accepted handoff: `docs/handoffs/2026-08-24-icons/`; `2810/2810` standalone components, no component sets.
- Immutable handoff fingerprint: `d4a210b39244ccf6a09489e28c1e82858ec3efc7921f50fe28c7b48dd6d64c0a`.
- Candidate implementation SHA: `e528f77d85ed14cdc2decfac3bc3e0996c8cd5da` on `agent/icons-library-implementation-2026-08-25`.

The exact Figma `canonicalName` is the source identity. It remains byte-for-byte visible and copyable; search may normalize separately. Do not create 2,810 component registry records, synthesize a stable component ID, rename, deduplicate, redraw, or substitute records.

## Local candidate boundary

The durable source is `packages/react/icons/source/manifest.source.json` and its SVG corpus. The existing private `@cometal/react` package exposes direct tree-shakable subpaths such as `@cometal/react/icons/outline/arrows/arrow-curve-left-down`, plus `@cometal/react/icons/manifest` and `@cometal/react/icons/catalog`. The root export contains only the shared runtime and types.

`foundation--icons` is the candidate Storybook surface. `/foundation/icons/catalog/` is the candidate portal route. The shared catalog uses manifest-derived search, filters and deterministic 120-item paging; complete canonical names remain visible, selectable and wrapping. Copying a canonical name must preserve its exact value and give visible plus polite live-region feedback; clipboard failure must be recoverable.

## Visual, paint and accessibility rules

- Preserve accepted SVG viewBox, geometry, definitions, fills and strokes.
- `currentColor` applies only to audited monochrome Outline/Filled records. Feature Icons and Logos, including brands, flags, payment marks, gradients and required backgrounds, remain intrinsic.
- Decorative is the default: hidden from the accessibility tree and non-focusable.
- Informative use requires a non-empty product-owned label with `role="img"`; a Figma canonical name is never an accessible label.
- Icons are non-interactive. Product controls own interaction and accessible naming.

## Generation and validation

- Intentional generator: `pnpm generate:icons`.
- Read-only freshness/source validation: `pnpm validate:icons`.
- Repository source validation: `pnpm validate:sources`.

The implementation report records a passing local validation set, including source/hash/fingerprint checks, Storybook `foundation--icons`, and the portal route. It does not replace exact-SHA Senior code review or independent QA.

## Release boundary

Production remains the existing baseline. No package publication, production deployment, registry readiness flag, or release status is implied by this candidate contract.
