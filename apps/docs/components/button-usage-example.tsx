'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@cometal/react';

const buttonImport = "import { Button } from '@cometal/react';";

type CopyState = 'idle' | 'copied' | 'failed';

export function ButtonUsageExample() {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function copyImport() {
    try {
      await navigator.clipboard.writeText(buttonImport);
      if (mountedRef.current) setCopyState('copied');
    } catch {
      if (mountedRef.current) setCopyState('failed');
    }
  }

  const copyLabel = copyState === 'copied' ? 'Скопировано' : copyState === 'failed' ? 'Повторить' : 'Копировать';

  return (
    <div className="button-usage-example">
      <code>{buttonImport}</code>
      <Button
        size="s"
        variant="secondary"
        onClick={copyImport}
        aria-label={copyState === 'failed' ? 'Не удалось скопировать импорт Button. Повторить' : 'Скопировать импорт Button'}
      >
        <span aria-live="polite">{copyLabel}</span>
      </Button>
    </div>
  );
}
