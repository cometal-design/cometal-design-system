# COMETAL DS Global Sync - Final Match Matrix

This matrix is initialized from the canonical manifest and must be updated only with linked evidence. `IMPLEMENTED` and `PUBLISHED` are not accepted as `MATCHED`.

| Change ID | Figma | SOT-2 Spec/Registry | SOT-3 Tokens/React | SOT-4 Storybook | SOT-5 Obsidian | Visual QA | Engineering QA | Evidence / blocker |
|---|---|---|---|---|---|---|---|---|
| TOK-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | `IMPLEMENTATION_REPORT.md`; snapshot-to-DTCG sync and regenerated sources. |
| TOK-002 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Primitive total 413 regenerated once. |
| TOK-003 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Expanded semantic/component graph rebuilt from canonical snapshots. |
| TOK-004 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Legacy/stale consumers removed from current downstream implementation scope. |
| TOK-005 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Brand semantic ramp reflected through component consumers. |
| TOK-006 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Placeholder/neutral/disabled mappings normalized; local contrast defects fixed. |
| TOK-007 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Table semantic contract wired through stories/docs/specs. |
| TOK-008 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Documentation/widget roles reflected in portal and widget shell. |
| TYP-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Typography inventory preserved in token/docs surfaces. |
| EFX-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Soft/Hard effect tokens and overlay usage verified locally. |
| CMP-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Button showcase/stroke contract fixed; unsandboxed Storybook PASS. |
| CMP-002 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Fields family and overlay behavior fixed; unsandboxed Storybook PASS. |
| CMP-003 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Checkbox/Radio/Switch docs updated; Tabs remain blocked and unpublished. |
| CMP-004 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | DateRangePicker contract, stories and docs wired; unsandboxed Storybook PASS. |
| CMP-005 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Badge preserved under current component/token contract. |
| CMP-006 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Tooltip module/story/route/spec/KB implemented locally. |
| PAT-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Context Menu module/story/route/spec/KB implemented locally. |
| PAT-002 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Table composition contract implemented and locally verified. |
| PAT-003 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Widget shell/story/route/spec/KB implemented locally. |
| DOC-001 | VALIDATED | LOCAL_PASS | N/A | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Foundation/docs boards updated, including shadow coverage. |
| REG-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Registry, component usage, specs and passports updated locally. |
| REL-001 | VALIDATED | HOLD | HOLD | HOLD | HOLD | PENDING | PENDING | Release boundary intentionally not started in this phase: no preview/deploy. |

## Completion Rule

For each non-blocked cell, replace the current status with `MATCHED` and add a direct evidence reference. For an unresolved decision, write `BLOCKED: <specific reason>` and link the owner/task. Never leave a final row as `PENDING`, `UNKNOWN` or blank.
