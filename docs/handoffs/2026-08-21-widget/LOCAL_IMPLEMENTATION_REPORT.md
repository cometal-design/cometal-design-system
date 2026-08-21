# Widget local implementation report

Baseline: `6d16ed8e3b5d5b84d5d3d8e9bacc4f40f94c9a67`  
Worktree: `cometal-design-system-table-2026-08-21`  
Publication: none

## Replacement ledger summary

- Legacy Widget-specific React and CSS were replaced, not cosmetically patched.
- Public `Widget` identity is preserved; `actions` remains an explicit deprecated alias for `toolbar`.
- Template route redirects to the canonical Component route.
- Template knowledge entry was removed and replaced by the Component passport.
- Shared Button, Table, tokens and icons were preserved.

## Delivered contract

- Named semantic region with title and optional description association.
- Optional toolbar/content slots without empty reservations.
- Raised surface, Default border, Primary/Secondary text.
- 32px outer radius; 24px inset and section gap; 16px header rhythm; 8px toolbar and content radius.
- Exact Widget toolbar source icons as a reusable internal brick.
- No clipping of focus rings or overlays; fluid width and content-driven height.
- Storybook: Overview, Anatomy, Optional Regions, Content Swap, Geometry, Responsive and Playground.
- Portal: canonical `/components/widget/`; compatibility redirect `/templates/widget/`.

## Local evidence

- React unit suite: 39/39 PASS.
- Storybook browser suite: 81/81 PASS.
- Storybook production build: PASS.
- Portal build: 45/45 routes PASS.
- Local browser regression: 75/75 route, responsive and interaction checks PASS at 1440, 1024, 768, 390 and 360px; document overflow 0 and console/page errors 0.
- Context Menu is portalled, named from its trigger and remains visible during contained Table scrolling.
- Full `pnpm validate`: PASS after final responsive and overlay fixes.
- Independent Figma-vs-local Visual QA: pending final gate.
