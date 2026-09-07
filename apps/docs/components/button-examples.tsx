'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@cometal/react';
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

const variants: ButtonVariant[] = [
  'primary', 'secondary', 'link', 'danger', 'success', 'warning', 'inverse-ghost', 'ghost', 'inverse',
];

const variantLabels: Record<ButtonVariant, string> = {
  primary: 'Primary', secondary: 'Secondary', link: 'Link', danger: 'Danger', success: 'Success', warning: 'Warning',
  ghost: 'Ghost', inverse: 'Inverse', 'inverse-ghost': 'Inverse Ghost',
};

const lightVariantsCode = '<Button size="m" variant="primary">Primary</Button>';
const darkVariantsCode = '<Button size="m" variant="ghost">Ghost</Button>';
const sizesCode = '<Button size="l">Продолжить</Button>';
const statesCode = '<Button size="m" loading>Сохранить</Button>';
const iconsCode = `import ArrowRightIcon from '@cometal/react/icons/outline/arrows/arrow-right';

<Button size="m" endIcon={<ArrowRightIcon />}>Продолжить</Button>`;

function ButtonExample({ title, description, code, preview, previewTone = 'default' }: { title: string; description: string; code: string; preview: ReactNode; previewTone?: 'default' | 'inverse' }) {
  return (
    <article className="button-example">
      <div className="button-example__preview" data-surface={previewTone}>{preview}</div>
      <h3>{title}</h3>
      <p className="button-example__description">{description}</p>
      <div className="button-example__usage" aria-label={`${title}: пример использования`}>
        <CodeBlock code={code} copyName={`код примера «${title}»`} compact />
      </div>
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
      <ButtonExample title="Состояния" description="Шесть состояний Primary-кнопки показаны как статичная галерея и не меняются при наведении или нажатии. Короткий пример ниже показывает реальный prop loading; Hover, Pressed и Focus visible возникают при взаимодействии с обычной кнопкой." code={statesCode} preview={(
        <div className="button-states-example" aria-hidden="true">
          <Button size="m" tabIndex={-1}>Default</Button>
          <Button size="m" tabIndex={-1} className="button-state-specimen--hover">Hover</Button>
          <Button size="m" tabIndex={-1} className="button-state-specimen--pressed">Pressed</Button>
          <Button size="m" tabIndex={-1} className="button-state-specimen--focus">Focus visible</Button>
          <Button size="m" tabIndex={-1} disabled>Disabled</Button>
          <Button size="m" tabIndex={-1} loading>Loading</Button>
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
