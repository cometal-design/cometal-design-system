import { useState } from 'react';
import { Button } from '@cometal/react';
import usageSource from '../../../registry/component-usage.json';

type ComponentUsageId = keyof typeof usageSource;
type CodeTab = 'install' | 'import' | 'example';

const labels: Record<CodeTab, string> = {
  install: 'Установка',
  import: 'Импорт',
  example: 'Пример',
};

export function ComponentCodeExample({
  componentId,
  componentName,
  sourceHref,
}: {
  componentId: ComponentUsageId;
  componentName: string;
  sourceHref: string;
}) {
  const [activeTab, setActiveTab] = useState<CodeTab>('example');
  const [copiedTab, setCopiedTab] = useState<CodeTab | null>(null);
  const usage = usageSource[componentId];
  const code = usage[activeTab];
  const idSuffix = componentId.replace(/[^a-z0-9]+/gi, '-');
  const panelId = `storybook-code-panel-${idSuffix}`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTab(activeTab);
      window.setTimeout(() => setCopiedTab(null), 1600);
    } catch {
      setCopiedTab(null);
    }
  }

  return (
    <div className="ds-code-example" data-code-example={componentId}>
      <div className="ds-code-example__meta">
        <div><span>REACT · {usage.packageName}</span><strong>{componentName}</strong></div>
        <a href={sourceHref} target="_blank" rel="noreferrer">Исходник ↗</a>
      </div>
      <div className="ds-code-example__toolbar">
        <div role="tablist" aria-label={`Код подключения ${componentName}`}>
          {(Object.keys(labels) as CodeTab[]).map((tab) => {
            const tabId = `storybook-code-tab-${idSuffix}-${tab}`;
            return (
              <button key={tab} id={tabId} type="button" role="tab" aria-controls={panelId} aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>
                {labels[tab]}
              </button>
            );
          })}
        </div>
        <Button type="button" variant="secondary" size="s" onClick={copyCode}>
          {copiedTab === activeTab ? 'Скопировано' : 'Скопировать'}
        </Button>
      </div>
      <pre id={panelId} role="tabpanel" aria-labelledby={`storybook-code-tab-${idSuffix}-${activeTab}`} tabIndex={0}><code>{code}</code></pre>
      {usage.availability === 'beta-target' && (
        <p>Команда установки станет доступна после публикации первого Beta-релиза. Сейчас пакет работает внутри репозитория как workspace-зависимость.</p>
      )}
      <span className="ds-visually-hidden" aria-live="polite">{copiedTab === activeTab ? 'Код скопирован' : ''}</span>
    </div>
  );
}
