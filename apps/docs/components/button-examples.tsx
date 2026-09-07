'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Tab, TabList, TabPanel, Tabs } from '@cometal/react';
import type { ButtonVariant } from '@cometal/react';
import ArrowRightIcon from '@cometal/react/icons/outline/arrows/arrow-right';
import MoonIcon from '@cometal/react/icons/outline/weather/moon-01';
import SunIcon from '@cometal/react/icons/outline/weather/sun-02';
import { CodeBlock } from './code-block';

const loadingDuration = 1000;

function useButtonLoading() {
  const [loadingKeys, setLoadingKeys] = useState<ReadonlySet<string>>(() => new Set());
  const timersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  function startLoading(key: string) {
    if (timersRef.current.has(key)) return;
    setLoadingKeys((current) => new Set(current).add(key));
    const timer = window.setTimeout(() => {
      timersRef.current.delete(key);
      setLoadingKeys((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }, loadingDuration);
    timersRef.current.set(key, timer);
  }

  function resetLoading(prefix: string) {
    timersRef.current.forEach((timer, key) => {
      if (!key.startsWith(prefix)) return;
      window.clearTimeout(timer);
      timersRef.current.delete(key);
    });
    setLoadingKeys((current) => new Set([...current].filter((key) => !key.startsWith(prefix))));
  }

  return { isLoading: (key: string) => loadingKeys.has(key), resetLoading, startLoading };
}

const buttonLoadingSource = `const loadingDuration = 1000;

function useButtonLoading() {
  const [loadingKeys, setLoadingKeys] = useState<ReadonlySet<string>>(() => new Set());
  const timersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  function startLoading(key: string) {
    if (timersRef.current.has(key)) return;
    setLoadingKeys((current) => new Set(current).add(key));
    const timer = window.setTimeout(() => {
      timersRef.current.delete(key);
      setLoadingKeys((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }, loadingDuration);
    timersRef.current.set(key, timer);
  }

  return { isLoading: (key: string) => loadingKeys.has(key), startLoading };
}`;

const variants: ButtonVariant[] = [
  'primary', 'secondary', 'link', 'danger', 'success', 'warning', 'inverse-ghost', 'ghost', 'inverse',
];

const variantLabels: Record<ButtonVariant, string> = {
  primary: 'Primary', secondary: 'Secondary', link: 'Link', danger: 'Danger', success: 'Success', warning: 'Warning',
  ghost: 'Ghost', inverse: 'Inverse', 'inverse-ghost': 'Inverse Ghost',
};

const lightVariantsCode = `'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@cometal/react';

${buttonLoadingSource}

export function LightButtonVariantsExample() {
  const { isLoading, startLoading } = useButtonLoading();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--cometal-primitive-spacing-100)' }}>
      <Button size="m" variant="primary" loading={isLoading('primary')} onClick={() => startLoading('primary')}>Primary</Button>
      <Button size="m" variant="secondary" loading={isLoading('secondary')} onClick={() => startLoading('secondary')}>Secondary</Button>
      <Button size="m" variant="link" loading={isLoading('link')} onClick={() => startLoading('link')}>Link</Button>
      <Button size="m" variant="danger" loading={isLoading('danger')} onClick={() => startLoading('danger')}>Danger</Button>
      <Button size="m" variant="success" loading={isLoading('success')} onClick={() => startLoading('success')}>Success</Button>
      <Button size="m" variant="warning" loading={isLoading('warning')} onClick={() => startLoading('warning')}>Warning</Button>
      <Button size="m" variant="inverse-ghost" loading={isLoading('inverse-ghost')} onClick={() => startLoading('inverse-ghost')}>Inverse Ghost</Button>
    </div>
  );
}`;

const darkVariantsCode = `'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@cometal/react';

${buttonLoadingSource}

export function DarkButtonVariantsExample() {
  const { isLoading, startLoading } = useButtonLoading();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--cometal-primitive-spacing-100)', background: 'var(--cometal-semantic-color-global-surface-inverse)' }}>
      <Button size="m" variant="ghost" loading={isLoading('ghost')} onClick={() => startLoading('ghost')}>Ghost</Button>
      <Button size="m" variant="inverse" loading={isLoading('inverse')} onClick={() => startLoading('inverse')}>Inverse</Button>
    </div>
  );
}`;

const sizesCode = `'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@cometal/react';

${buttonLoadingSource}

export function ButtonSizesExample() {
  const { isLoading, startLoading } = useButtonLoading();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--cometal-primitive-spacing-100)' }}>
      <Button size="l" loading={isLoading('l')} onClick={() => startLoading('l')}>Продолжить</Button>
      <Button size="m" loading={isLoading('m')} onClick={() => startLoading('m')}>Продолжить</Button>
      <Button size="s" loading={isLoading('s')} onClick={() => startLoading('s')}>Продолжить</Button>
    </div>
  );
}`;

const statesCode = `'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@cometal/react';

${buttonLoadingSource}

export function ButtonStatesExample() {
  const { isLoading, startLoading } = useButtonLoading();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--cometal-primitive-spacing-150)' }}>
      <div><code>Default</code><Button size="m" loading={isLoading('default')} onClick={() => startLoading('default')}>Default</Button></div>
      <div><code>Hover</code><Button size="m" loading={isLoading('hover')} onClick={() => startLoading('hover')}>Наведите курсор</Button></div>
      <div><code>Pressed</code><Button size="m" loading={isLoading('pressed')} onClick={() => startLoading('pressed')}>Нажмите и удерживайте</Button></div>
      <div><code>Focus visible</code><Button size="m" loading={isLoading('focus')} onClick={() => startLoading('focus')}>Перейдите клавишей Tab</Button></div>
      <div><code>Disabled</code><Button size="m" disabled>Disabled</Button></div>
      <div><code>Loading</code><Button size="m" loading>Loading</Button></div>
    </div>
  );
}`;

const iconsCode = `'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@cometal/react';
import ArrowRightIcon from '@cometal/react/icons/outline/arrows/arrow-right';

${buttonLoadingSource}

export function ButtonIconsExample() {
  const { isLoading, startLoading } = useButtonLoading();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--cometal-primitive-spacing-100)' }}>
      <Button size="m" startIcon={<ArrowRightIcon />} loading={isLoading('start')} onClick={() => startLoading('start')}>Продолжить</Button>
      <Button size="m" endIcon={<ArrowRightIcon />} loading={isLoading('end')} onClick={() => startLoading('end')}>Продолжить</Button>
      <Button size="m" startIcon={<ArrowRightIcon />} aria-label="Продолжить" loading={isLoading('icon-only')} onClick={() => startLoading('icon-only')} />
    </div>
  );
}`;

function ButtonExample({ title, description, code, preview, previewTone = 'default' }: { title: string; description: string; code: string; preview: ReactNode; previewTone?: 'default' | 'inverse' }) {
  return (
    <article className="button-example">
      <h3>{title}</h3>
      <div className="button-example__preview" data-surface={previewTone}>{preview}</div>
      <Tabs defaultValue="description" size="m" className="button-example__details">
        <TabList aria-label={`${title}: описание и код`} className="button-example__details-toolbar">
          <Tab value="description">Описание</Tab>
          <Tab value="code">Код</Tab>
        </TabList>
        <TabPanel value="description" tabIndex={-1} className="button-example__description">
          <p>{description}</p>
        </TabPanel>
        <TabPanel value="code" tabIndex={-1} className="button-example__code">
          <CodeBlock code={code} copyName={`код примера «${title}»`} />
        </TabPanel>
      </Tabs>
    </article>
  );
}

export function ButtonExamples() {
  const [variantSurface, setVariantSurface] = useState<'light' | 'dark'>('light');
  const { isLoading, resetLoading, startLoading } = useButtonLoading();

  function selectVariantSurface(nextSurface: 'light' | 'dark') {
    resetLoading('variant:');
    setVariantSurface(nextSurface);
  }

  return (
    <div className="button-examples">
      <ButtonExample title="Варианты" description="Variant задаёт смысл и визуальный приоритет действия. Переключите поверхность: Inverse Ghost относится к светлой, Ghost и Inverse — к контрастной." code={variantSurface === 'light' ? lightVariantsCode : darkVariantsCode} previewTone={variantSurface === 'dark' ? 'inverse' : 'default'} preview={(
        <div className="button-variants-example">
          <div className="button-variants-example__surface-controls" role="group" aria-label="Поверхность примера вариантов">
            <Button type="button" size="s" variant="secondary" startIcon={<SunIcon />} aria-label="Светлый фон" title="Светлый фон" aria-pressed={variantSurface === 'light'} onClick={() => selectVariantSurface('light')} />
            <Button type="button" size="s" variant="secondary" startIcon={<MoonIcon />} aria-label="Тёмный фон" title="Тёмный фон" aria-pressed={variantSurface === 'dark'} onClick={() => selectVariantSurface('dark')} />
          </div>
          <div className="button-variants-example__items">
            {(variantSurface === 'light' ? variants.slice(0, 7) : variants.slice(7)).map((variant) => {
              const key = `variant:${variant}`;
              return <Button key={variant} size="m" variant={variant} loading={isLoading(key)} onClick={() => startLoading(key)}>{variantLabels[variant]}</Button>;
            })}
          </div>
        </div>
      )} />
      <ButtonExample title="Размеры" description="L, M и S сохраняют общую геометрию control scale: 48, 40 и 32 px. Выбирайте размер по плотности интерфейса, а не для визуального акцента." code={sizesCode} preview={(
        <div className="button-sizes-example">
          {(['l', 'm', 's'] as const).map((size) => {
            const key = `size:${size}`;
            return <Button key={size} size={size} loading={isLoading(key)} onClick={() => startLoading(key)}>Продолжить</Button>;
          })}
        </div>
      )} />
      <ButtonExample title="Состояния" description="Default, Disabled и Loading заданы напрямую. Hover, Pressed и Focus visible появляются только от настоящего курсора, удержания и клавиатурной навигации по соответствующим кнопкам." code={statesCode} preview={(
        <div className="button-states-example">
          <div><code>Default</code><Button size="m" loading={isLoading('state:default')} onClick={() => startLoading('state:default')}>Default</Button></div>
          <div><code>Hover</code><Button size="m" loading={isLoading('state:hover')} onClick={() => startLoading('state:hover')}>Наведите курсор</Button></div>
          <div><code>Pressed</code><Button size="m" loading={isLoading('state:pressed')} onClick={() => startLoading('state:pressed')}>Нажмите и удерживайте</Button></div>
          <div><code>Focus visible</code><Button size="m" loading={isLoading('state:focus')} onClick={() => startLoading('state:focus')}>Перейдите клавишей Tab</Button></div>
          <div><code>Disabled</code><Button size="m" disabled>Disabled</Button></div>
          <div><code>Loading</code><Button size="m" loading>Loading</Button></div>
        </div>
      )} />
      <ButtonExample title="Иконки" description="Используйте поддержанные startIcon и endIcon. Для icon-only Button обязательное доступное имя передаётся через aria-label." code={iconsCode} preview={(
        <div className="button-icons-example">
          <Button size="m" startIcon={<ArrowRightIcon />} loading={isLoading('icon:start')} onClick={() => startLoading('icon:start')}>Продолжить</Button>
          <Button size="m" endIcon={<ArrowRightIcon />} loading={isLoading('icon:end')} onClick={() => startLoading('icon:end')}>Продолжить</Button>
          <Button size="m" startIcon={<ArrowRightIcon />} aria-label="Продолжить" loading={isLoading('icon:only')} onClick={() => startLoading('icon:only')} />
        </div>
      )} />
    </div>
  );
}
