# COMETAL component page content checklist

Status: permanent portal authoring and audit contract
Applies to: every detail route under `apps/docs/app/components/`
Validator contract: `apps/docs/lib/component-page-content-contract.json`

## Purpose

A component page is complete only when a reader can identify the component, understand when and how to use it, inspect a real COMETAL implementation, reach the exact design and engineering sources, and copy a working integration example. A polished screenshot or a green portal build is not a substitute for this evidence.

The component index at `/components/` is navigation, not a detail page. The audited detail inventory is the 11 primary routes in `apps/docs/lib/navigation.ts` plus the four Table child routes in `apps/docs/components/table-family-header.tsx`.

## Required evidence

| ID | Evidence | Pass criteria |
|---|---|---|
| `identity` | Identity and stable ID | The visible page content names the component or family and shows every applicable registry stable ID. An internal lookup that is not rendered does not pass. |
| `title-summary` | Title and summary | One unambiguous H1 and a short purpose statement explain the user or system job, not only implementation status. |
| `lifecycle` | Lifecycle Badge | A COMETAL `Badge` shows the current registry lifecycle label. Styling or prose alone does not pass. |
| `figma` | Exact Figma source | A direct DS Core link resolves the exact canonical component/source node appropriate to this route. A page-level link is insufficient when the route documents a narrower family child. |
| `storybook` | Storybook/playground | A direct Storybook or local playground link identifies an executable story for the same component/family. |
| `react-source` | React source context | A visible link identifies the public React source. Family and child pages must state whether they share the parent implementation and must not silently omit source context. |
| `usage-boundaries` | Usage and boundaries | The page states when to use the component and at least one meaningful boundary, alternative, or “do not use” condition. |
| `real-example` | Real DS example | The page renders the actual `@cometal/react` component or an existing shared portal example built from it. A bespoke HTML mock or text-only diagram does not pass. |
| `code-example` | Install/import/usage/copy | The code area provides installation, exact import, minimal working usage, source link and copy action. Availability limitations must remain explicit. |
| `matrix` | Sizes, variants and states | Every applicable public size, variant, value and state axis is demonstrated or linked to an exact executable matrix. Interaction-only states may use Storybook evidence. |
| `behavior-a11y` | Behavior, keyboard and accessibility | The page documents semantics, focus/keyboard behavior and accessible naming or explicitly explains why an interaction rule is not applicable. |
| `public-api` | Public API | Public props, defaults, controlled/uncontrolled behavior, composition boundaries and native-attribute inheritance are described at the useful depth for consumers. |
| `responsive-theme-edge` | Responsive, theme and edge cases | Evidence covers supported responsive/overflow behavior, applicable themes/surfaces, and representative edge cases such as long content, empty/error/disabled or optional regions. |

## Conditional and N/A rules

- `required` means the page fails when evidence is absent.
- `conditional` means the evidence is required when the component exposes that axis. The contract must name the condition.
- `N/A` is allowed only when the route has no corresponding public behavior or axis. Every N/A entry requires a route-specific rationale in the machine-readable contract.
- N/A cannot be used because implementation or evidence is unfinished, because a child page relies on an undocumented parent, or because the evidence exists only in Figma without a link.
- A family child may inherit lifecycle, Figma family context and Storybook navigation through a shared header, but it still requires explicit source/code context and its own exact source link where the child maps to a narrower Figma source.
- If a family shares one React implementation, the child page may link that shared implementation and parent usage example; it must say so explicitly.

## Code example boundary

The current `CodeExample` uses native HTML buttons with `role="tab"` for Install/Import/Example switching. Those code Tabs are not approved in Figma. Their presence may satisfy content transport and copy behavior, but it must not be reported as Figma parity or an approved COMETAL Tabs component. This checklist does not authorize changing or approving them.

## Inventory and validator

Report mode audits the current source and always prints every route:

```bash
pnpm --filter @cometal/docs audit:component-pages
```

Machine-readable output:

```bash
node apps/docs/scripts/validate-component-page-content.mjs --report --json
```

Strict mode exits non-zero when inventory differs or any required/conditional evidence is missing:

```bash
node apps/docs/scripts/validate-component-page-content.mjs --strict
```

Strict mode is intentionally not wired into the default build or repository validation while the baseline audit contains known gaps.

## Authoring completion rule

Before declaring a component page content-complete:

1. Add or update its route entry in the JSON contract.
2. Reconcile source routes, primary navigation and family navigation.
3. Run report mode and inspect the route’s PASS/MISSING/NA result.
4. Resolve every MISSING item or record an allowed N/A with rationale.
5. Run strict mode, docs typecheck and `git diff --check` on the bounded candidate.
6. Treat visual parity, code approval, QA and release as separate exact-SHA gates.
