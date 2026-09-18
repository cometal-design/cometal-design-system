import 'server-only';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Closed build-time inventory; never derive paths from a request or query string.
const sourceFiles = [
  "MuiBadgeDemo.tsx",
  "MuiButtonDemo.tsx",
  "MuiCheckboxDemo.tsx",
  "MuiComboboxDemo.tsx",
  "MuiMultiSelectDemo.tsx",
  "MuiRadioButtonDemo.tsx",
  "MuiSelectDemo.tsx",
  "MuiSwitchDemo.tsx",
  "MuiTabsDemo.tsx",
  "MuiTextAreaDemo.tsx",
  "MuiTextFieldDemo.tsx",
  "MuiTooltipDemo.tsx",
  "visual-adapter.tsx"
] as const;
export type MuiDemoSources = Readonly<Record<(typeof sourceFiles)[number], string>>;

export async function readMuiDemoSources(): Promise<MuiDemoSources> {
  const entries = await Promise.all(sourceFiles.map(async (file) => {
    const path = resolve(process.cwd(), 'components/mui', file);
    try {
      return [file, await readFile(path, 'utf8')] as const;
    } catch (cause) {
      throw new Error('MUI source unavailable: ' + file + '. Run the build in @cometal/docs; no fallback source is allowed.', { cause });
    }
  }));
  return Object.fromEntries(entries) as MuiDemoSources;
}
