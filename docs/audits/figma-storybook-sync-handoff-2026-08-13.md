# Figma, Git, Obsidian and Storybook sync handoff

Date: 2026-08-13  
Figma: `KKNGucImxFAtQLBhPy8tLs`  
Branch: `agent/figma-storybook-sync-2026-08-13`  
Scope: local synchronization and QA; no push, package publication or deployment.

## Result

The approved Foundation and the 11 registry components now have one local contract across Figma, DTCG tokens, React, Storybook, specifications, registry and Obsidian. The components remain `in-review`: visual match is confirmed, while Frontend Lead review and product pilots remain separate gates.

The earlier audit documents remain immutable baseline evidence. This handoff records the post-remediation state.

## Figma final state

| Metric | Result |
| --- | ---: |
| Variables | 627 |
| Primitive | 402 |
| Semantic | 155 |
| Component | 70 |
| Color / Float | 529 / 98 |
| Broken aliases | 0 |
| Alias cycles | 0 |
| Missing mode values | 0 |
| Missing WEB syntax | 0 |
| `ALL_SCOPES` | 0 |
| Missing descriptions | 0 |
| Deprecated variables | 0 |

Collections: Primitive 402, Semantic 155, Button 1, Input 7, Option 3, Badge 18, Icon 1, Table 40.

### Figma corrections

- `Color/Text/Supporting` (`VariableID:2406:5`) now aliases `Color Primitive Palette/Neutral/600/100` (`VariableID:305:19280`, `#667085`).
- `Dark/Surface/Yellow` (`VariableID:2126:1334`) now aliases `Color Primitive Palette/Yellow/700/100` (`VariableID:305:19465`).
- The Colors semantic map was updated to show the same Supporting alias and hex value.
- Button component-set names and descriptions use `Ghost` and `Inverse Ghost` consistently.
- All 9 unused deprecated variables were removed after Figma and repository consumer audits:
  - `VariableID:780:1325`, `VariableID:780:1327`, `VariableID:780:1328`;
  - `VariableID:780:1330`, `VariableID:780:1331`, `VariableID:780:1333`;
  - `VariableID:2017:2`, `VariableID:2374:5591`, `VariableID:2374:5601`.

## Downstream synchronization

- Imported the complete 627-variable Figma snapshot into DTCG sources.
- Bound Button and Fields runtime CSS to existing component token roles.
- Preserved the approved sizing contract: controls `32 / 40 / 48`, icons `14 / 16 / 20`, outline stroke `1.6px`.
- Added Badge to tokens, React, Storybook, portal, registry, specification and Obsidian.
- Normalized Button links to the exact Primary component set and documented all 9 public Figma sets.
- Added exact Storybook links to every component specification and Obsidian passport.
- Corrected the stable Combobox ID to `input.combobox` in the Obsidian index.
- Corrected the release snapshot: Tabs is a Figma draft and is not a public React or registry component.
- Set `visualMatch=true` for all 11 registry entries after direct Figma and Storybook comparison.

## QA evidence

- Source validation: 5 logical sources, 11 components, 57 exact Storybook routes.
- Unit tests: 28/28 passed.
- Storybook interaction and accessibility tests: 57/57 passed.
- TypeScript: all workspaces passed.
- Token, React, Storybook and documentation portal builds passed.
- Portal static output: 32/32 routes.
- Direct canvas QA used Chromium at `1440x900`, DPR 1, and `390x844`.
- No horizontal overflow on Button, Badge, Fields, Date Picker, Checkbox, Radio Button or Switch overviews.
- Button heights and icons: `48/20`, `40/16`, `32/14`.
- Field heights: `48`, `40`, `32`.
- Focus ring: `2px` with `2px` offset; the control border remains present.
- Select, Combobox and Multi Select listbox gap: `6px`; no clipping.
- Badge height: `24px`; icon: `12px`; icon-only: `24x24` with `role=img`.
- Minimum measured Badge text contrast: `4.90:1`; dark yellow: `6.44:1`.

## Publication decision

### Publish

- Badge is the only new public component in this change set.
- The synchronized branch can be pushed and deployed only after review approval.

### Update

- `@cometal/tokens`, `@cometal/react`, Storybook, portal, registry, specifications and Obsidian must move together from this exact branch state.
- Production currently remains on an older commit and does not contain this synchronization.

### Delete

- The nine deprecated Figma and token-source variables listed above are deleted.
- No public component is marked for deletion.

### Blocked

- Icons: no approved canonical SVG source and React API.
- Tabs: slot/count public API is not approved.
- Tables: public Table component set and React API are not approved.
- Package distribution: all packages remain private `0.0.0`; publication requires a separate versioning and release decision.

## Preserved state

- The original dirty worktree was not modified or reset.
- Work was isolated in `/Users/vadim/Documents/Cometal/cometal-design-system-sync-2026-08-13`.
- No Git push, Vercel deployment or npm/package publication was performed.

