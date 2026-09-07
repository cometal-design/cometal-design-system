'use client';

import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { Button } from '@cometal/react';
import { CodeBlock } from './code-block';

export function ComponentPageSettings({
  componentName,
  preview,
  code,
  children,
  onReset,
  note,
  surface = 'default',
}: {
  componentName: string;
  preview: ReactNode;
  code: string;
  children: ReactNode;
  onReset: () => void;
  note?: ReactNode;
  surface?: 'default' | 'inverse';
}) {
  const [showCode, setShowCode] = useState(false);
  const id = useId().replace(/:/g, '');
  const previewTitleId = `${id}-preview-title`;
  const codeId = `${id}-code`;

  function reset() {
    onReset();
    setShowCode(false);
  }

  return (
    <div className="component-standard-settings">
      <section className="component-standard-settings__preview-section" aria-labelledby={previewTitleId}>
        <div className="component-standard-settings__preview" data-surface={surface}>
          <Button
            type="button"
            size="s"
            variant="secondary"
            className="component-standard-settings__code-toggle"
            aria-expanded={showCode}
            aria-controls={codeId}
            onClick={() => setShowCode((visible) => !visible)}
          >
            {showCode ? 'Скрыть код' : 'Показать код'}
          </Button>
          <h2 className="visually-hidden" id={previewTitleId}>Предпросмотр {componentName}</h2>
          {preview}
        </div>
        {showCode ? <div className="component-standard-settings__code" id={codeId}><CodeBlock code={code} copyName={`текущая конфигурация ${componentName}`} /></div> : null}
      </section>

      <section className="component-standard-settings__properties" aria-labelledby={`${id}-properties-title`}>
        <div className="component-standard-settings__properties-heading">
          <div><h2 id={`${id}-properties-title`}>Свойства</h2><p>Изменения сразу применяются к предпросмотру и коду.</p></div>
          <Button type="button" size="s" variant="secondary" onClick={reset}>Сбросить</Button>
        </div>
        {children}
      </section>

      {note ? <p className="component-standard-settings__note">{note}</p> : null}
    </div>
  );
}

export function ComponentPageSetting({
  name,
  type,
  defaultValue,
  description,
  children,
}: {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="component-standard-settings__property" data-property={name}>
      <div className="component-standard-settings__property-copy">
        <strong><code>{name}</code></strong>
        <span><code>{type}</code> · Default: <code>{defaultValue}</code></span>
        <p>{description}</p>
      </div>
      <div className="component-standard-settings__control">{children}</div>
    </div>
  );
}
