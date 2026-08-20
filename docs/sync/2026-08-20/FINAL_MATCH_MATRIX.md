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
| CMP-003 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | RETEST_PENDING | PASS | Table density no longer shrinks Checkbox; 20 x 20 geometry, rendered 1.4 px mark and stable default-border hover pass targeted Chromium/WebKit checks. Tabs remain blocked and unpublished. |
| CMP-004 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | DateRangePicker contract, stories and docs wired; unsandboxed Storybook PASS. |
| CMP-005 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Badge preserved under current component/token contract. |
| CMP-006 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | RETEST_PENDING | PASS | Mobile placement, long-content wrapping and Escape dismissal pass focused Chromium/WebKit and Storybook checks. See `QA_REMEDIATION_REPORT.md`. |
| PAT-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | RETEST_PENDING | PASS | Raised-surface/radius references and Escape focus restoration corrected; replacement-preview retest pending. |
| PAT-002 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | RETEST_PENDING | PASS | Table selection geometry and Tooltip containment corrected after preview audits; replacement-preview retest pending. |
| PAT-003 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | RETEST_PENDING | PASS | Widget now hosts a native Table/actions; 32 px radius, 24 px inset and mobile containment are verified locally. |
| DOC-001 | VALIDATED | LOCAL_PASS | N/A | LOCAL_PASS | LOCAL_PASS | RETEST_PENDING | PASS | Semantic map renders 288 / 288 approved roles with resolved aliases and no document overflow; replacement-preview retest pending. |
| REG-001 | VALIDATED | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | LOCAL_PASS | PENDING | PASS | Registry, component usage, specs and passports updated locally. |
| REL-001 | VALIDATED | HOLD | HOLD | HOLD | HOLD | RETEST_PENDING | PASS | Two preview QA passes failed; all confirmed findings are locally remediated. A new exact-SHA preview and independent `QA_PASSED` are required before production. |

## Completion Rule

For each non-blocked cell, replace the current status with `MATCHED` and add a direct evidence reference. For an unresolved decision, write `BLOCKED: <specific reason>` and link the owner/task. Never leave a final row as `PENDING`, `UNKNOWN` or blank.
