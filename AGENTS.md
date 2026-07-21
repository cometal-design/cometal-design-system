# Instructions for humans and AI agents

## Read first

1. `knowledge-base/00 System/Design System.md`
2. `knowledge-base/05 Processes/Component Distribution.md`
3. `docs/technical-rules.md`
4. the component entry in `registry/components.json`
5. the component specification in `specifications/components/`

## Sources of truth

- Figma DS Core: visual anatomy, dimensions, variants and states.
- Specifications in Git: purpose, boundaries, behavior and acceptance criteria.
- Token and React packages in Git: executable implementation.
- Storybook: rendered states, examples, documentation and tests.
- Obsidian Vault: decisions, context, patterns, templates and relationships.

These sources are complementary. Do not silently resolve a conflict in favor of one source.

## Mandatory workflow

1. Work starts only after the Design System Lead explicitly marks the Figma component as approved for distribution.
2. Assign a stable ID and create or update the registry entry.
3. Create the component specification before implementation.
4. Use design tokens; unexplained raw visual values are forbidden.
5. Implement semantic HTML, keyboard behavior, focus behavior and accessible naming.
6. Add all required Storybook states and tests.
7. Update the Obsidian passport and affected system notes.
8. Run `pnpm validate`.
9. If any source differs, set the component to `blocked` and report the mismatch to the Design System Lead.

Do not publish, deploy, create external accounts or add remotes without explicit authorization.
