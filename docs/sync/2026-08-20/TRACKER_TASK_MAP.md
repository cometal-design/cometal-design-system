# COMETAL DS Global Sync - Tracker Task Map

**Umbrella:** [DESIGN-148](https://tracker.yandex.ru/DESIGN-148) - `COMETAL DS — Global Synchronization Wave`
**Status:** `OPEN / TASKED`
**Boundary:** no worklogs, no npm publication, no inferred Frontend Lead approval. Tabs publication remains blocked pending a public API decision.

| Change ID | Tracker | Dependencies |
|---|---|---|
| TOK-001 | [DESIGN-149](https://tracker.yandex.ru/DESIGN-149) | None |
| TOK-002 | [DESIGN-150](https://tracker.yandex.ru/DESIGN-150) | TOK-001 |
| TOK-003 | [DESIGN-151](https://tracker.yandex.ru/DESIGN-151) | TOK-001, TOK-002 |
| TOK-004 | [DESIGN-152](https://tracker.yandex.ru/DESIGN-152) | TOK-003 |
| TOK-005 | [DESIGN-153](https://tracker.yandex.ru/DESIGN-153) | TOK-001, TOK-003 |
| TOK-006 | [DESIGN-154](https://tracker.yandex.ru/DESIGN-154) | TOK-002, TOK-003 |
| TOK-007 | [DESIGN-155](https://tracker.yandex.ru/DESIGN-155) | TOK-001..TOK-006 |
| TOK-008 | [DESIGN-156](https://tracker.yandex.ru/DESIGN-156) | TOK-002, TOK-003 |
| TYP-001 | [DESIGN-157](https://tracker.yandex.ru/DESIGN-157) | TOK-001 |
| EFX-001 | [DESIGN-158](https://tracker.yandex.ru/DESIGN-158) | TOK-002, TOK-003 |
| CMP-001 | [DESIGN-159](https://tracker.yandex.ru/DESIGN-159) | TOK-005, TOK-006 |
| CMP-002 | [DESIGN-160](https://tracker.yandex.ru/DESIGN-160) | TOK-006, EFX-001 |
| CMP-003 | [DESIGN-161](https://tracker.yandex.ru/DESIGN-161) | TOK-005, TOK-006 |
| CMP-004 | [DESIGN-162](https://tracker.yandex.ru/DESIGN-162) | CMP-002, EFX-001 |
| CMP-005 | [DESIGN-163](https://tracker.yandex.ru/DESIGN-163) | TOK-003, TOK-006 |
| CMP-006 | [DESIGN-164](https://tracker.yandex.ru/DESIGN-164) | TOK-003, EFX-001 |
| PAT-001 | [DESIGN-165](https://tracker.yandex.ru/DESIGN-165) | TOK-006, EFX-001 |
| PAT-002 | [DESIGN-166](https://tracker.yandex.ru/DESIGN-166) | TOK-007, CMP-002..CMP-006, PAT-001 |
| PAT-003 | [DESIGN-167](https://tracker.yandex.ru/DESIGN-167) | TOK-008, CMP-001, PAT-002 |
| DOC-001 | [DESIGN-168](https://tracker.yandex.ru/DESIGN-168) | All TOK/TYP/EFX |
| REG-001 | [DESIGN-169](https://tracker.yandex.ru/DESIGN-169) | CMP-001..PAT-003 |
| REL-001 | [DESIGN-170](https://tracker.yandex.ru/DESIGN-170) | Every prior Change ID |

`DESIGN-132` remains the existing standing Figma-to-Code-to-Storybook delivery task. It was inspected but not duplicated or repurposed as the umbrella.
