'use client';

import type { MuiDemoSources } from '../../lib/mui-demo-sources';
import type { DemoSizeState } from './visual-adapter';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { CodeBlock } from '../code-block';
import { tabStyles, tabsStyles, sizeLabels, sizeSelectorStyles, supportedSizes } from './visual-adapter';
import { MuiButtonDemo } from './MuiButtonDemo';
import { MuiBadgeDemo } from './MuiBadgeDemo';
import { MuiTextFieldDemo } from './MuiTextFieldDemo';
import { MuiTextAreaDemo } from './MuiTextAreaDemo';
import { MuiSelectDemo } from './MuiSelectDemo';
import { MuiComboboxDemo } from './MuiComboboxDemo';
import { MuiMultiSelectDemo } from './MuiMultiSelectDemo';
import { MuiCheckboxDemo } from './MuiCheckboxDemo';
import { MuiRadioButtonDemo } from './MuiRadioButtonDemo';
import { MuiSwitchDemo } from './MuiSwitchDemo';
import { MuiTabsDemo } from './MuiTabsDemo';
import { MuiTooltipDemo } from './MuiTooltipDemo';

const demos = [
  { kind: 'lms', id: 'button', label: 'Button', Demo: MuiButtonDemo, sourceFile: 'MuiButtonDemo.tsx' },
  { kind: 'fixed', id: 'badge', label: 'Badge', Demo: MuiBadgeDemo, sourceFile: 'MuiBadgeDemo.tsx' },
  { kind: 'lms', id: 'textfield', label: 'TextField', Demo: MuiTextFieldDemo, sourceFile: 'MuiTextFieldDemo.tsx' },
  { kind: 'lm', id: 'textarea', label: 'TextArea', Demo: MuiTextAreaDemo, sourceFile: 'MuiTextAreaDemo.tsx' },
  { kind: 'lms', id: 'select', label: 'Select', Demo: MuiSelectDemo, sourceFile: 'MuiSelectDemo.tsx' },
  { kind: 'lms', id: 'combobox', label: 'Combobox', Demo: MuiComboboxDemo, sourceFile: 'MuiComboboxDemo.tsx' },
  { kind: 'lm', id: 'multiselect', label: 'MultiSelect', Demo: MuiMultiSelectDemo, sourceFile: 'MuiMultiSelectDemo.tsx' },
  { kind: 'lms', id: 'checkbox', label: 'Checkbox', Demo: MuiCheckboxDemo, sourceFile: 'MuiCheckboxDemo.tsx' },
  { kind: 'lms', id: 'radiobutton', label: 'RadioButton', Demo: MuiRadioButtonDemo, sourceFile: 'MuiRadioButtonDemo.tsx' },
  { kind: 'lms', id: 'switch', label: 'Switch', Demo: MuiSwitchDemo, sourceFile: 'MuiSwitchDemo.tsx' },
  { kind: 'lms', id: 'tabs', label: 'Tabs', Demo: MuiTabsDemo, sourceFile: 'MuiTabsDemo.tsx' },
  { kind: 'tooltip', id: 'tooltip', label: 'Tooltip', Demo: MuiTooltipDemo, sourceFile: 'MuiTooltipDemo.tsx' },
] as const;

export function MuiBoard({ sources }: { sources: MuiDemoSources }) {
  const [selected, setSelected] = useState<(typeof demos)[number]['id']>('button');
  const [fixture, setFixture] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const userSelected = useRef(false);
  useEffect(() => {
    let disposed = false;
    let frame = 0;
    // Let native MUI scroll buttons settle after hydration and final font metrics.
    void document.fonts.ready.then(() => {
      if (disposed) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (disposed) return;
          const query = new URLSearchParams(window.location.search);
          const state = query.get('state');
          if (!userSelected.current) {
            setSelected(demos.find((demo) => demo.id === query.get('component'))?.id ?? 'button');
            setFixture(state === 'disabled' || state === 'error' ? state : null);
          }
          setHydrated(true);
        });
      });
    });
    return () => { disposed = true; cancelAnimationFrame(frame); };
  }, []);
  const adapterSource = sources['visual-adapter.tsx'];
  const [sizes, setSizes] = useState<DemoSizeState>({ button: 'm', textfield: 'm', textarea: 'm', select: 'm', combobox: 'm', multiselect: 'm', checkbox: 'm', radiobutton: 'm', switch: 'm', tabs: 'm' });
  return <Box component="main" data-mui-board-hydrated={hydrated} sx={{ maxWidth: 'var(--cometal-documentation-layout-width-content)', margin: '0 auto', padding: 'var(--cometal-primitive-spacing-200)', minWidth: 0 }}>
    <header>
      <p>MATERIAL UI 9.4.0 · ЭКСПЕРИМЕНТАЛЬНЫЙ СТЕНД</p>
      <h1>Компоненты на MUI</h1>
      <p>12 примеров: визуальный стиль COMETAL, поведение Material UI</p>
    </header>
    <Tabs aria-label="Компоненты MUI пилота" value={selected} onChange={(_, next: string) => {
      const demo = demos.find((item) => item.id === next);
      if (demo) { userSelected.current = true; setSelected(demo.id); }
    }} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ ...tabsStyles, marginBottom: 'var(--cometal-primitive-spacing-150)' }}>
      {demos.map((demo) => <Tab key={demo.id} value={demo.id} label={demo.label} id={`pilot-board-tab-${demo.id}`} aria-controls={`pilot-board-panel-${demo.id}`} sx={tabStyles} />)}
    </Tabs>
    {demos.map((demo) => {
      const { id, label, sourceFile } = demo;
      const source = sources[sourceFile];
      const size = demo.kind === 'lms' || demo.kind === 'lm' ? sizes[demo.id] : undefined;
      const disabled = fixture === 'disabled' && ['select', 'checkbox', 'radiobutton'].includes(id);
      const error = fixture === 'error' && id === 'select';
      const usage = `import { Mui${label}Demo } from './Mui${label}Demo';\n\n<Mui${label}Demo${size ? ` size="${size}"` : ''}${disabled ? ' disabled' : ''}${error ? ' error' : ''} />`;
      return <section key={id} role="tabpanel" hidden={id !== selected} id={`pilot-board-panel-${id}`} aria-labelledby={`pilot-board-tab-${id}`}>
      {id === selected && <>
        <h2>{label}</h2>
        <Box component="section" className="component-standard-presentation" aria-label={`Интерактивный пример ${label}`} sx={{ gridTemplateRows: 'auto minmax(0, 1fr)', alignItems: 'stretch', gap: 'var(--cometal-primitive-spacing-150)' }}>
          <Box data-size-controls sx={{ width: '100%', minWidth: 0, justifySelf: 'start' }}>
            {demo.kind === 'fixed' ? <span>Фиксированный размер · 24px</span> : demo.kind === 'tooltip' ? <span>Размеры L/M/S не предусмотрены · Wide</span> : <>
              <ToggleButtonGroup exclusive value={size} aria-label={`Размер примера ${label}`} aria-describedby={demo.kind === 'lm' ? `pilot-size-note-${id}` : undefined} sx={sizeSelectorStyles} onChange={(_, next: unknown) => {
                if (next !== 'l' && next !== 'm' && next !== 's') return;
                if (demo.kind === 'lm' && next === 's') return;
                setSizes((previous) => ({ ...previous, [demo.id]: next }));
              }}>
                {supportedSizes.lms.map((value) => <ToggleButton key={value} value={value} aria-label={sizeLabels[value]} disabled={demo.kind === 'lm' && value === 's'}>{value.toUpperCase()}</ToggleButton>)}
              </ToggleButtonGroup>
              {demo.kind === 'lm' && <p id={`pilot-size-note-${id}`} style={{ marginBottom: 0 }}>Small не предусмотрен контрактом COMETAL.</p>}
            </>}
          </Box>
          <Box data-demo-stage data-demo-size={size} sx={{ display: 'grid', width: '100%', minWidth: 0, placeItems: 'center' }}>
            {demo.kind === 'lms' ? <demo.Demo size={sizes[demo.id]} disabled={disabled} error={error} /> : demo.kind === 'lm' ? <demo.Demo size={sizes[demo.id]} /> : <demo.Demo />}
          </Box>
        </Box>
        <section aria-labelledby={`pilot-source-${id}`} style={{ marginTop: 'var(--cometal-primitive-spacing-200)', minWidth: 0 }}>
          <h2 id={`pilot-source-${id}`}>React-код примера</h2>
          <p>Полный исходник демо и общего адаптера ниже. Нужны Material UI 9.4.0, Emotion 11.14, React 19.2.8, COMETAL token CSS, Grtsk Peta, generated chevron и icon CSS. Демо используют публичные package exports; стенд не заменяет канонические компоненты COMETAL.</p>
          {['combobox', 'tooltip'].includes(id) && <p>Встроенные glyphs и стрелка Tooltip сохраняют форму Material UI; exact Figma-паритет не заявлен.</p>}
          <h3>{`Mui${label}Demo.tsx`}</h3>
          <CodeBlock key={id} code={source} copyName={`MUI ${label} — полный React-код`} />
          <h3>Текущее использование</h3>
          <CodeBlock code={usage} copyName={`MUI ${label} — текущее использование`} />
          <h3>visual-adapter.tsx</h3>
          <CodeBlock key={`${id}-adapter`} code={adapterSource} copyName="MUI — общий визуальный адаптер" />
        </section>
      </>}
    </section>;
    })}
  </Box>;
}
