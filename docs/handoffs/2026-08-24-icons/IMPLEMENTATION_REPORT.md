# COMETAL Icons Library — Implementation Report

Status: `IMPLEMENTATION_CANDIDATE` pending bounded commit

Role: `30 · Web Implementation`

Initiative: `COMETAL-ICONS-LIBRARY-2026-08-24`

Source mode: `delivery_candidate`

Baseline: `7acd5547dc56f64aece583260b8ceef7a68c97ee`

Code-change request baseline: `fc7ae93b3fcb8650c5116d216bf75cfe4d52e8d3`

QA remediation baseline: `748e49f1ec06b65e389aaee23336225e769f10e7` (`QA_FAILED`; its prior `CODE_APPROVED` is stale for the new candidate)

Senior flaky-evidence remediation baseline: `b22df69b316c31d2efa42076d39939b096561344`

Branch: `agent/icons-library-implementation-2026-08-25`

This report records implementation evidence only. It is not `CODE_APPROVED`, `QA_PASSED`, user acceptance, release, or production evidence.

## Accepted input

- Figma DS Core: `KKNGucImxFAtQLBhPy8tLs`, Icons page `381:25439`.
- Canonical artboards: Outline `691:9685`, Filled `691:12877`, Feature Icons and Logos `691:15704`.
- Accepted records: `2810/2810`.
- Source fingerprint: `d4a210b39244ccf6a09489e28c1e82858ec3efc7921f50fe28c7b48dd6d64c0a`.
- Accepted Figma variable-binding paint contract: `80075bdc027f117ae810fd5ad7e0fcc98f6c562feba6ba37af4cf86b5de4e33c`.
- Approved package boundary: existing private `@cometal/react`; no `@cometal/icons` package.

## Implemented boundary

- Durable byte-for-byte SVG source corpus under `packages/react/icons/source/`.
- Deterministic intake/generation, read-only freshness validation, source/hash/fingerprint/collision/safety/reference checks, and dist bundle-boundary validation.
- One generated immutable metadata record, definition module, component module, loader entry, and direct package subpath for each source record.
- Root `@cometal/react` exports only the shared `Icon` runtime and types; it does not re-export the corpus or catalog.
- Decorative-by-default and informative-label accessibility contract, SSR-safe rendering, forwarded refs, immutable source viewBox, intrinsic dimensions, and per-instance definition IDs.
- `currentColor` only when the tracked source paint and accepted Figma variable binding both match the audited contract; black hex alone never enables recoloring. Feature Icons and Logos remain intrinsic, and binding drift makes freshness validation fail.
- Generator-backed stroke evidence audits all 1,640 explicit source widths. Only the 827 audited Outline elements whose source width is exactly 1.4 receive `data-cometal-stroke-scale`; all 808 nonstandard widths remain source-controlled. The two 2.8 mask strokes in `Outline/profiles-and-users/user-profile-03-02` are explicitly preserved.
- One client-only `IconCatalog` consumed by both Storybook `foundation--icons` and Portal `/foundation/icons/catalog/`.
- Search ranking: exact, prefix, then substring using a normalized search key while display/copy preserve exact canonical identity.
- Manifest-derived library/family/category filters and counts, deterministic 120-item paging, visible wrapping names, contextual exact-name/import copy actions, one aggregate polite live region for results/copy/error status, visible non-live feedback, clipboard error recovery, and non-live per-card loading placeholders.
- Catalog actions reuse the existing COMETAL `Button`; catalog layout and controls use existing token identities without fallback values that duplicate or contradict token semantics.
- Catalog Button labels may wrap inside their full accessible hit area; browser coverage asserts all 240 action controls have `scrollWidth <= clientWidth` at 320, 768, and 1440 px.
- Pagination moves focus from a control that becomes disabled at the 23→24 and 2→1 boundaries to its enabled counterpart; browser coverage rejects `BODY` focus loss.
- The Storybook play restores its original search, filters, page, and visible copy/error feedback in `finally`, leaving the direct iframe on the default 120-card state.
- Every lazy preview exposes an explicit `loading → loaded|error` lifecycle marker. The mask regression observes that lifecycle event, fails immediately on loader error, and only then verifies the real `stroke-width="2.8"` path and computed 2.8 stroke; it no longer relies on a fixed five-second polling budget.
- Copy feedback has symmetric Strict Mode setup/cleanup, lifecycle generation guards, timer cancellation, and no post-unmount updates.
- Read-only icon freshness is a mandatory predecessor of React build, assembled-site build, and the Storybook Vercel build path. An isolated stale-fixture test executes the real React build command and proves it stops before Vite without changing tracked generated output.
- Storybook, Portal, and assembled outputs expose identical `cometal-build-meta.json` files. Local builds resolve Git HEAD; Vercel-equivalent builds require `VERCEL_GIT_COMMIT_SHA`; unavailable provenance uses a clearly marked deterministic `unknown` fallback that cannot pass release-readiness validation.
- Generated compatibility projection at `packages/tokens/src/icons.inventory.json`; specification, registry, and knowledge changes remain Role 20 scope.

## QA remediation scope expansion

The QA request explicitly allowed the minimal build paths required for provenance. The expansion is limited to:

- `scripts/build-provenance.mjs` — resolves build-time SHA, writes shared static metadata, and blocks dirty/stale/unknown release-readiness evidence.
- `scripts/build-provenance.test.mjs` — isolated local/Vercel/fallback/stale provenance contract tests.
- root `package.json` — connects provenance writing to every root build, verification to `build:site`, and the isolated test to the full test suite.

No Storybook public/config file or Portal layout/helper expansion was necessary: post-build static metadata is written directly into both outputs before assembly.

## Generated census

| Evidence | Result |
|---|---:|
| Tracked SVG sources | 2810 |
| Generated definitions | 2810 |
| Generated components/direct entries | 2810 |
| Outline | 875 |
| Filled | 877 |
| Feature Icons and Logos | 1058 |
| `currentColor` records | 1751 |
| Intrinsic records | 1059 |
| Records with instance-scoped referenced IDs | 619 |
| Explicit source stroke-width elements | 1640 |
| Standard 1.4 source stroke-width elements | 832 |
| Nonstandard source stroke-width elements preserved | 808 |
| Generator-marked scalable Outline elements | 827 |
| Accepted identical-source exceptions | 1: `flag-rectangle/PM`, `flag-rectangle/RE` |

## Validation evidence

| Check | Result |
|---|---|
| `pnpm generate:icons` plus `pnpm validate:icons` | PASS; generated output fresh, exact fingerprint retained |
| XML/source/hash/count/collision/safety/reference validation | PASS; 2810 parses and 2810 hash matches |
| React TypeScript | PASS |
| React unit/runtime/catalog tests | PASS; 13 files, 56 tests |
| 2810 render-to-static sweep | PASS |
| Repeated-ID, binding-gated paint, complete stroke audit, informative/decorative, and unsafe-prop tests | PASS |
| Strict Mode copy, denied Clipboard API, timer cleanup, and unmount tests | PASS |
| Isolated stale-fixture React build predecessor test | PASS; validation stops the build before Vite and tracked output hash is unchanged |
| Direct JS/DTS subpath resolution and bundle boundaries | PASS; 2810 entries checked |
| Storybook interaction and addon-a11y tests | PASS; 14 files, 81 stories; default 120-item catalog, contextual names, and computed 2.8 mask stroke covered |
| Catalog responsive/focus/live-status remediation | PASS; Chromium 320/768/1440, 120 cards/240 actions, both pagination boundaries, one polite live region, success/error feedback, and final state restoration |
| Parallel lazy-preview stability regression | PASS twice consecutively; full Chromium 320/768/1440 matrix, 42/42 files and 243/243 tests in each run |
| Build provenance contract | PASS; local Git and Vercel env resolution, deterministic unknown fallback, stale/unknown rejection |
| Storybook static build | PASS; `foundation--icons` present in `index.json` |
| Docs static export | PASS; `/foundation/icons/catalog/` prerendered |
| Assembled site build | PASS; portal and Storybook copied into `apps/storybook/site-static` |
| `validate:sources`, CSS variables, secrets, `git diff --check` | PASS |

Final `pnpm validate` is rerun after this report and before the bounded commit. The exact commit SHA is recorded in the handoff response because writing it into this file would make the SHA self-referential.

## Local review surfaces

From the candidate worktree:

```bash
pnpm dev:storybook
# http://localhost:6006/?path=/story/foundation--icons

pnpm dev
# http://localhost:3000/foundation/icons/catalog/
```

Already assembled static artifacts can be served locally from `apps/storybook/site-static`; they are build evidence only and are not production publication.

## Known limits and next gate

- The package is private `0.0.0`; this is an internal local candidate, not a released package.
- Catalog metadata is intentionally isolated but substantial: direct product imports remain small, while the catalog owns the full manifest and loader map.
- The accepted `tech-full/Zoho/Grey` source is approximately 875 KB before compilation; it is preserved losslessly rather than simplified.
- No unrelated inline icon migration was performed.
- Knowledge, specification, and registry synchronization remains Role 20 ownership.
- Senior exact-SHA code review and independent same-SHA QA are still required before user acceptance or any release command.
