# Icons foundation

Status: `IMPLEMENTATION_CANDIDATE` on the local delivery candidate only. This is not `CODE_APPROVED`, `QA_PASSED`, `Ready`, a release, or production evidence.

## Source contract

- Figma DS Core `KKNGucImxFAtQLBhPy8tLs`, Icons page `381:25439`.
- Canonical artboards: Outline `691:9685`, Filled `691:12877`, Feature Icons and Logos `691:15704`.
- Accepted handoff: `docs/handoffs/2026-08-24-icons/`; `2810/2810` standalone components, no component sets.
- Normalized corpus fingerprint: `87caaa283983e042491e2b0beb6bb8cc54a8aeaad75b1b9599e66d06c2199a58`; Outline fingerprint: `4143ba6593eb6f852c091552d83264ae73f1609a1d7679b4734eddd8c7a724ed`.
- Normalized implementation parent: `bb500bd2daf5921dd2f7c6a3a8a1d497a1c2b844` on `agent/icons-library-implementation-2026-08-25`.

The exact Figma `canonicalName` is the source identity. It remains byte-for-byte visible and copyable; search may normalize separately. Do not create 2,810 component registry records, synthesize a stable component ID, rename, deduplicate, redraw, or substitute records.

The normalized record is `Outline/profiles-and-users/user-profile-03-02`: component `700:15590`, vector `700:15589`. Its stroke alignment changed only from `INSIDE` to `CENTER`; the two token-bound 1.4 paths, geometry and identity remain unchanged. The normalized SVG is `897a2fb485e9e42472da312a1d567681fa766853b86f83b9c5927e6951d717b5`; it has no mask or IDs and compiles to two scalable `currentColor` paths.

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

The exact current review candidate is owned by the external Orchestrator delivery manifest and is deliberately not hardcoded in this self-committing knowledge artifact. Production remains the existing baseline. No package publication, production deployment, registry readiness flag, or release status is implied by this candidate contract.
