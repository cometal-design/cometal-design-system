'use client';

import { useState } from 'react';
import { Button, InlineLink } from '@cometal/react';
import type { UsageExample } from '../lib/usage-examples';

type CodeTab = 'install' | 'import' | 'example';

const labels: Record<CodeTab, string> = {
  install: 'Установка',
  import: 'Импорт',
  example: 'Пример',
};

export function CodeExample({ componentName, sourceHref, usage }: { componentName: string; sourceHref: string; usage: UsageExample }) {
  const [activeTab, setActiveTab] = useState<CodeTab>('example');
  const [copiedTab, setCopiedTab] = useState<CodeTab | null>(null);
  const code = usage[activeTab];

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
    <div className="component-code-example">
      <div className="component-code-example__meta">
        <div>
          <span>REACT · {usage.packageName}</span>
          <strong>{componentName}</strong>
        </div>
        <InlineLink href={sourceHref} target="_blank" rel="noreferrer">Исходник ↗</InlineLink>
      </div>
      <div className="component-code-example__toolbar">
        <div role="tablist" aria-label={`Код подключения ${componentName}`}>
          {(Object.keys(labels) as CodeTab[]).map((tab) => (
            <button
              key={tab}
              id={`code-tab-${tab}`}
              type="button"
              role="tab"
              aria-controls="component-code-panel"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {labels[tab]}
            </button>
          ))}
        </div>
        <Button type="button" variant="secondary" size="s" onClick={copyCode}>
          {copiedTab === activeTab ? 'Скопировано' : 'Скопировать'}
        </Button>
      </div>
      <pre id="component-code-panel" role="tabpanel" aria-labelledby={`code-tab-${activeTab}`} tabIndex={0}><code>{code}</code></pre>
      {usage.availability === 'beta-target' && (
        <p className="component-code-example__notice">Команда установки станет доступна после публикации первого Beta-релиза. Сейчас пакет работает внутри репозитория как workspace-зависимость.</p>
      )}
      <span className="visually-hidden" aria-live="polite">{copiedTab === activeTab ? 'Код скопирован' : ''}</span>
    </div>
  );
}
