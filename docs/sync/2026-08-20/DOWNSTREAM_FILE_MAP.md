# COMETAL DS Global Sync - Downstream File Map

This map identifies the baseline surfaces affected by the manifest. It is a routing aid, not a replacement for repository search or the canonical manifest.

## Token Sources

- `packages/tokens/src/primitive.tokens.json` - TOK-001, TOK-002.
- `packages/tokens/src/semantic.tokens.json` - TOK-001, TOK-003, TOK-005, TOK-006, TOK-008, EFX-001.
- `packages/tokens/src/component.tokens.json` - TOK-001, TOK-003, TOK-004, TOK-007 and component namespaces.
- `packages/tokens/src/typography.styles.json` - TYP-001.
- `packages/tokens/src/foundation.inventory.json` - collection/style inventory.
- `packages/tokens/scripts/build.mjs` - generated representation if the new typed architecture requires build changes.

## React

- `packages/react/src/Button/` - CMP-001.
- `packages/react/src/Field/` - CMP-002 and Table filter triggers.
- `packages/react/src/Selection/` - CMP-003 and Table selection columns.
- `packages/react/src/DatePicker/` - CMP-004.
- `packages/react/src/Badge/` - CMP-005 and nested Table badges.
- `packages/react/src/Table/` - TOK-007, PAT-001 integration and PAT-002.
- New bounded modules expected for Tooltip, Context Menu and Widget rather than adding unrelated logic to Table.
- `packages/react/src/index.ts` - approved public exports only; Tabs excluded.
- `packages/react/src/icon.css` - retain global 1.4 px outline contract.

## Storybook

- Existing stories: `Button.stories.tsx`, `Fields.stories.tsx`, `Checkbox.stories.tsx`, `RadioButton.stories.tsx`, `Switch.stories.tsx`, `DatePicker.stories.tsx`, `Badge.stories.tsx`, `Table.stories.tsx`, `Foundation.stories.tsx`.
- New stories expected for Tooltip, Context Menu and Widget.
- `apps/storybook/stories/foundation.css` and preview/global styles require the token/effect migration.
- `apps/storybook/stories/releases.generated.ts` updates only after the release contract is final.

## Documentation Portal

- Foundation routes under `apps/docs/app/foundation/` for Colors, Typography, Radius, Size, Spacing, Stroke and new Shadow coverage.
- Existing component routes under `apps/docs/app/components/`.
- New component/pattern/template routes for Tooltip, Context Menu and Widget.
- `apps/docs/app/patterns/table/page.tsx` for PAT-002.
- `apps/docs/lib/navigation.ts`, `registry.ts`, `foundation-data.ts` and `usage-examples.ts` for discoverability and examples.

## Registry, Specifications and Knowledge

- `registry/components.json`, `registry/component-usage.json` and schemas.
- Existing specifications under `specifications/components/`.
- New or updated specifications for Tooltip, Context Menu, Table expansion and Widget.
- Existing passports under `knowledge-base/02 Components/`.
- Pattern passports/index under `knowledge-base/03 Patterns/`.
- Template passport/index under `knowledge-base/04 Templates/` if Widget is classified as a template; classification must remain consistent with registry and navigation.
- Process/decision updates under `knowledge-base/05 Processes/` and `06 Decisions/` where the token migration or public API needs an ADR.

## Publication and Validation

- Root scripts in `package.json`: `validate:sources`, `validate:secrets`, `typecheck`, `test`, `build` and aggregate `validate`.
- `scripts/assemble-site.mjs` and `apps/storybook/vercel.json` for the assembled preview/production surface.
- npm metadata remains private `0.0.0` and must not be changed in this wave.
