# COMETAL component page content checklist

Status: permanent portal authoring and audit contract
Applies to: every detail route under `apps/docs/app/components/`
Validator contract: `apps/docs/lib/component-page-content-contract.json`

## Purpose

A component page is complete only when a reader can identify the component, understand when and how to use it, inspect a real COMETAL implementation, reach the exact design and engineering sources, and copy a working integration example. A polished screenshot or a green portal build is not a substitute for this evidence.

The component index at `/components/` is navigation, not a detail page. Primary catalog cards, sidebar routes, family membership, documented aliases and preview IDs come from the validated `registry/component-families.json`; the four Table child routes remain in `apps/docs/components/table-family-header.tsx`.

`input.fields` is a family alias for five stable registry IDs, not a sixth component. `input.date-range-picker` is a family-child alias for the `DateRangePicker` export owned by `input.date-picker`. Aliases never receive independent lifecycle checks or readiness verdicts.

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

## Canonical semantic phase order

Every detail route uses the single ordered phase definition in `componentPhases` inside `apps/docs/lib/component-page-content-contract.json`. A phase is declared once in rendered page source with `data-component-phase`; additional H2 sections may belong to that phase until the next declaration.

| Order | Phase ID | Reader question | Typical content |
|---:|---|---|---|
| 0 | `identity` | What is this exact component? | Header, lifecycle, visible stable ID, exact Figma/Storybook/React sources. |
| 1 | `overview` | What does the real component or family look like? | Live `@cometal/react` example or an explicit shared-family overview. |
| 2 | `visual-contract` | What visual axes and composition rules exist? | Anatomy, variants, sizes, values, states, composition and complex family matrices. |
| 3 | `code` | How do I integrate it? | Install, import, minimal usage, copy and React source context. |
| 4 | `usage` | When should or should not I use it? | Use cases, alternatives, content guidance and product boundaries. |
| 5 | `behavior-a11y` | How does it behave? | Interaction lifecycle, keyboard, focus, semantics, accessible names and ARIA. |
| 6 | `public-api` | What is the supported React contract? | Public props, defaults, controlled/uncontrolled state and native inheritance. |
| 7 | `adaptation` | What changes across environments? | Responsive/overflow behavior, themes and representative edge cases. |

Table family matrices belong to phase 2. Each Table child still declares all later phases and explicitly references the shared parent React implementation. Fields begins phase 1 with the live five-component family overview; sizes and states remain phase 2. Tabs are outside this contract and remain out of scope.

## Conditional and N/A rules

- `required` means the page fails when evidence is absent.
- `conditional` means the evidence is required when the component exposes that axis. The contract must name the condition.
- `N/A` is allowed only when the route has no corresponding public behavior or axis. Every N/A entry requires a route-specific rationale in the machine-readable contract.
- N/A cannot be used because implementation or evidence is unfinished, because a child page relies on an undocumented parent, or because the evidence exists only in Figma without a link.
- A family child may inherit lifecycle, Figma family context and Storybook navigation through a shared header, but it still requires explicit source/code context and its own exact source link where the child maps to a narrower Figma source.
- If a family shares one React implementation, the child page may link that shared implementation and parent usage example; it must say so explicitly.
- Phase N/A follows the same fail-closed rule: a route-specific `phaseRequirements` entry and rationale are required. The phase must retain its canonical position through an explicit N/A section or shared-parent reference when omitting it would make the reading sequence ambiguous.
- Missing, duplicate, unknown or out-of-order phase declarations fail order validation even when all content criteria pass.

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

Strict mode exits non-zero when inventory differs, any required/conditional evidence is missing, or any route has missing, duplicate, unknown or out-of-order phase declarations:

```bash
node apps/docs/scripts/validate-component-page-content.mjs --strict
```

Strict mode remains an explicit documentation gate and is not presented as visual QA, code approval or release readiness.

## Authoring completion rule

Before declaring a component page content-complete:

1. Add or update its route entry in the JSON contract.
2. Add or update the family, route, members, aliases and preview ID once in `registry/component-families.json`; do not duplicate the catalog or sidebar list in portal code.
3. Declare the eight semantic phases in canonical order and place every visible H2 under the correct phase.
4. Run report mode and inspect both the route’s content and order PASS/MISSING results.
5. Resolve every MISSING item or record an allowed N/A with rationale.
6. Run strict mode, docs typecheck and `git diff --check` on the bounded candidate.
7. Treat visual parity, code approval, QA and release as separate exact-SHA gates.
