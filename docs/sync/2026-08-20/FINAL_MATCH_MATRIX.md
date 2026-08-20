# COMETAL DS Global Sync - Final Match Matrix

This matrix is initialized from the canonical manifest and must be updated only with linked evidence. `IMPLEMENTED` and `PUBLISHED` are not accepted as `MATCHED`.

| Change ID | Figma | SOT-2 Spec/Registry | SOT-3 Tokens/React | SOT-4 Storybook | SOT-5 Obsidian | Visual QA | Engineering QA | Evidence / blocker |
|---|---|---|---|---|---|---|---|---|
| TOK-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | `IMPLEMENTATION_REPORT.md`; snapshot-to-DTCG sync and regenerated sources. |
| TOK-002 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Primitive total 413 regenerated once. |
| TOK-003 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Expanded semantic/component graph rebuilt from canonical snapshots. |
| TOK-004 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Legacy/stale consumers removed from current downstream implementation scope. |
| TOK-005 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Brand semantic ramp reflected through component consumers. |
| TOK-006 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Placeholder/neutral/disabled mappings normalized; local contrast defects fixed. |
| TOK-007 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Table semantic contract wired through stories/docs/specs. |
| TOK-008 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Documentation/widget roles reflected in portal and widget shell. |
| TYP-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Typography inventory preserved in token/docs surfaces. |
| EFX-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Soft/Hard effect tokens and overlay usage verified locally. |
| CMP-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Button showcase/stroke contract fixed; unsandboxed Storybook PASS. |
| CMP-002 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Fields family and overlay behavior fixed; unsandboxed Storybook PASS. |
| CMP-003 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Independent QA confirmed 20 x 20 Table selection geometry, rendered 1.4 px mark and stable default-border hover. Tabs remain blocked and unpublished. |
| CMP-004 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | DateRangePicker contract, stories and docs wired; unsandboxed Storybook PASS. |
| CMP-005 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Badge preserved under current component/token contract. |
| CMP-006 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Independent QA confirmed mobile placement, long-content wrapping and Escape dismissal. See `QA_REMEDIATION_REPORT.md`. |
| PAT-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Independent QA confirmed raised surface/radius and Escape focus restoration. |
| PAT-002 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Independent QA confirmed Table selection geometry and Tooltip containment. |
| PAT-003 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Independent QA confirmed native Table/actions, 32 px radius, 24 px inset and mobile containment. |
| DOC-001 | VALIDATED | LOCAL_PASS | N/A | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Independent QA confirmed 288 / 288 resolved roles, visible previews and zero document overflow. |
| REG-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PASS | PASS | Registry, component usage, specs and passports updated locally. |
| REL-001 | VALIDATED | READY | READY | READY | READY | QA_PASSED | PASS | Exact candidate `5287ad377a1050284ebb187c37035063981382c0` passed independent QA. Final evidence-only equivalence, production deploy and production smoke remain. |

## Completion Rule

For each non-blocked cell, replace the current status with `MATCHED` and add a direct evidence reference. For an unresolved decision, write `BLOCKED: <specific reason>` and link the owner/task. Never leave a final row as `PENDING`, `UNKNOWN` or blank.
