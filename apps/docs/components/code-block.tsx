'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@cometal/react';

type CopyState = 'idle' | 'copied' | 'failed';
type CopyResult = { code: string; state: Exclude<CopyState, 'idle'> };

export function CodeBlock({
  code,
  copyName,
  compact = false,
  toolbarStart,
  panelId,
  labelledBy,
}: {
  code: string;
  copyName: string;
  compact?: boolean;
  toolbarStart?: ReactNode;
  panelId?: string;
  labelledBy?: string;
}) {
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null);
  const generationRef = useRef(0);
  const mountedRef = useRef(true);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    generationRef.current += 1;
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = null;
  }, [code]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      generationRef.current += 1;
      mountedRef.current = false;
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function copyCode() {
    const generation = generationRef.current;
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = null;
    setCopyResult(null);
    try {
      await navigator.clipboard.writeText(code);
      if (!mountedRef.current || generation !== generationRef.current) return;
      setCopyResult({ code, state: 'copied' });
      resetTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) setCopyResult((current) => current?.code === code ? null : current);
        resetTimerRef.current = null;
      }, 1600);
    } catch {
      if (mountedRef.current && generation === generationRef.current) setCopyResult({ code, state: 'failed' });
    }
  }

  const copyState: CopyState = copyResult?.code === code ? copyResult.state : 'idle';
  const visibleCopyLabel = copyState === 'copied' ? 'Скопировано' : copyState === 'failed' ? 'Повторить' : 'Копировать';
  const copyAriaLabel = copyState === 'copied'
    ? `Скопировано: ${copyName}`
    : copyState === 'failed'
      ? `Не удалось скопировать: ${copyName}. Повторить`
      : `Скопировать: ${copyName}`;

  return (
    <div className="docs-code-block" data-compact={compact || undefined}>
      <div className="docs-code-block__toolbar">
        {toolbarStart && <div className="docs-code-block__toolbar-start">{toolbarStart}</div>}
        <Button type="button" variant="secondary" size="s" onClick={copyCode} aria-label={copyAriaLabel}>
          {visibleCopyLabel}
        </Button>
      </div>
      <pre id={panelId} role={labelledBy ? 'tabpanel' : undefined} aria-labelledby={labelledBy} tabIndex={labelledBy ? 0 : undefined}><code>{code}</code></pre>
      <span className="visually-hidden" aria-live="polite">
        {copyState === 'copied' ? `Скопировано: ${copyName}` : copyState === 'failed' ? `Не удалось скопировать: ${copyName}` : ''}
      </span>
    </div>
  );
}
