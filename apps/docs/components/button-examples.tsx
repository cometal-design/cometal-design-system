'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Tab, TabList, TabPanel, Tabs } from '@cometal/react';
import type { ButtonVariant } from '@cometal/react';
import ArrowRightIcon from '@cometal/react/icons/outline/arrows/arrow-right';
import MoonIcon from '@cometal/react/icons/outline/weather/moon-01';
import SunIcon from '@cometal/react/icons/outline/weather/sun-01';

type CopyState = 'idle' | 'copied' | 'failed';

const variants: ButtonVariant[] = [
  'primary', 'secondary', 'link', 'danger', 'success', 'warning', 'inverse-ghost', 'ghost', 'inverse',
];

const variantLabels: Record<ButtonVariant, string> = {
  primary: 'Primary', secondary: 'Secondary', link: 'Link', danger: 'Danger', success: 'Success', warning: 'Warning',
  ghost: 'Ghost', inverse: 'Inverse', 'inverse-ghost': 'Inverse Ghost',
};

const lightVariantsCode = `import { Button } from '@cometal/react';

export function LightButtonVariantsExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--cometal-primitive-spacing-100)' }}>
      <Button size="m" variant="primary">Primary</Button>
      <Button size="m" variant="secondary">Secondary</Button>
      <Button size="m" variant="link">Link</Button>
      <Button size="m" variant="danger">Danger</Button>
      <Button size="m" variant="success">Success</Button>
      <Button size="m" variant="warning">Warning</Button>
      <Button size="m" variant="inverse-ghost">Inverse Ghost</Button>
    </div>
  );
}`;

const darkVariantsCode = `import { Button } from '@cometal/react';

export function DarkButtonVariantsExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--cometal-primitive-spacing-100)', background: 'var(--cometal-semantic-color-global-surface-inverse)' }}>
      <Button size="m" variant="ghost">Ghost</Button>
      <Button size="m" variant="inverse">Inverse</Button>
    </div>
  );
}`;

const sizesCode = `import { Button } from '@cometal/react';

export function ButtonSizesExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--cometal-primitive-spacing-100)' }}>
      <Button size="l">Продолжить</Button>
      <Button size="m">Продолжить</Button>
      <Button size="s">Продолжить</Button>
    </div>
  );
}`;

const statesCode = `import { Button } from '@cometal/react';

export function ButtonStatesExample() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--cometal-primitive-spacing-150)' }}>
      <div><code>Default</code><Button size="m">Default</Button></div>
      <div><code>Hover</code><Button size="m">Наведите курсор</Button></div>
      <div><code>Pressed</code><Button size="m">Нажмите и удерживайте</Button></div>
      <div><code>Focus visible</code><Button size="m">Перейдите клавишей Tab</Button></div>
      <div><code>Disabled</code><Button size="m" disabled>Disabled</Button></div>
      <div><code>Loading</code><Button size="m" loading>Loading</Button></div>
    </div>
  );
}`;

const iconsCode = `import { Button } from '@cometal/react';
import ArrowRightIcon from '@cometal/react/icons/outline/arrows/arrow-right';

export function ButtonIconsExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--cometal-primitive-spacing-100)' }}>
      <Button size="m" startIcon={<ArrowRightIcon />}>Продолжить</Button>
      <Button size="m" endIcon={<ArrowRightIcon />}>Продолжить</Button>
      <Button size="m" startIcon={<ArrowRightIcon />} aria-label="Продолжить" />
    </div>
  );
}`;

function ButtonExample({ title, description, code, preview, previewTone = 'default', copyResetKey }: { title: string; description: string; code: string; preview: ReactNode; previewTone?: 'default' | 'inverse'; copyResetKey?: string }) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  useEffect(() => setCopyState('idle'), [copyResetKey]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }

  const copyLabel = copyState === 'copied' ? 'Скопировано' : copyState === 'failed' ? 'Повторить' : 'Копировать';
  const copyAriaLabel = copyState === 'copied'
    ? `Код примера «${title}» скопирован`
    : copyState === 'failed'
      ? `Повторить копирование кода примера «${title}»`
      : `Скопировать код примера «${title}»`;

  return (
    <article className="button-example">
      <h3>{title}</h3>
      <div className="button-example__preview" data-surface={previewTone}>{preview}</div>
      <Tabs defaultValue="description" size="s" className="button-example__details">
        <TabList aria-label={`${title}: описание и код`} className="button-example__details-toolbar">
          <Tab value="description">Описание</Tab>
          <Tab value="code">Код</Tab>
        </TabList>
        <TabPanel value="description" tabIndex={-1} className="button-example__description">
          <p>{description}</p>
        </TabPanel>
        <TabPanel value="code" tabIndex={-1} className="button-example__code">
          <div className="button-example__code-toolbar">
            <Button type="button" variant="secondary" size="s" onClick={copyCode} aria-label={copyAriaLabel}>{copyLabel}</Button>
          </div>
          <pre><code>{code}</code></pre>
          <span className="visually-hidden" aria-live="polite">
            {copyState === 'copied' ? `Код примера «${title}» скопирован` : copyState === 'failed' ? `Не удалось скопировать код примера «${title}»` : ''}
          </span>
        </TabPanel>
      </Tabs>
    </article>
  );
}

export function ButtonExamples() {
  const [variantSurface, setVariantSurface] = useState<'light' | 'dark'>('light');

  return (
    <div className="button-examples">
      <ButtonExample title="Варианты" description="Variant задаёт смысл и визуальный приоритет действия. Переключите поверхность: Inverse Ghost относится к светлой, Ghost и Inverse — к контрастной." code={variantSurface === 'light' ? lightVariantsCode : darkVariantsCode} previewTone={variantSurface === 'dark' ? 'inverse' : 'default'} copyResetKey={variantSurface} preview={(
        <div className="button-variants-example">
          <div className="button-variants-example__surface-controls" role="group" aria-label="Поверхность примера вариантов">
            <Button type="button" size="s" variant="secondary" startIcon={<SunIcon />} aria-label="Светлый фон" title="Светлый фон" aria-pressed={variantSurface === 'light'} onClick={() => setVariantSurface('light')} />
            <Button type="button" size="s" variant="secondary" startIcon={<MoonIcon />} aria-label="Тёмный фон" title="Тёмный фон" aria-pressed={variantSurface === 'dark'} onClick={() => setVariantSurface('dark')} />
          </div>
          <div className="button-variants-example__items">
            {(variantSurface === 'light' ? variants.slice(0, 7) : variants.slice(7)).map((variant) => <Button key={variant} size="m" variant={variant}>{variantLabels[variant]}</Button>)}
          </div>
        </div>
      )} />
      <ButtonExample title="Размеры" description="L, M и S сохраняют общую геометрию control scale: 48, 40 и 32 px. Выбирайте размер по плотности интерфейса, а не для визуального акцента." code={sizesCode} preview={(
        <div className="button-sizes-example">
          <Button size="l">Продолжить</Button><Button size="m">Продолжить</Button><Button size="s">Продолжить</Button>
        </div>
      )} />
      <ButtonExample title="Состояния" description="Default, Disabled и Loading заданы напрямую. Hover, Pressed и Focus visible появляются только от настоящего курсора, удержания и клавиатурной навигации по соответствующим кнопкам." code={statesCode} preview={(
        <div className="button-states-example">
          <div><code>Default</code><Button size="m">Default</Button></div>
          <div><code>Hover</code><Button size="m">Наведите курсор</Button></div>
          <div><code>Pressed</code><Button size="m">Нажмите и удерживайте</Button></div>
          <div><code>Focus visible</code><Button size="m">Перейдите клавишей Tab</Button></div>
          <div><code>Disabled</code><Button size="m" disabled>Disabled</Button></div>
          <div><code>Loading</code><Button size="m" loading>Loading</Button></div>
        </div>
      )} />
      <ButtonExample title="Иконки" description="Используйте поддержанные startIcon и endIcon. Для icon-only Button обязательное доступное имя передаётся через aria-label." code={iconsCode} preview={(
        <div className="button-icons-example">
          <Button size="m" startIcon={<ArrowRightIcon />}>Продолжить</Button>
          <Button size="m" endIcon={<ArrowRightIcon />}>Продолжить</Button>
          <Button size="m" startIcon={<ArrowRightIcon />} aria-label="Продолжить" />
        </div>
      )} />
    </div>
  );
}
