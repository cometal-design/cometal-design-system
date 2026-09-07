'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@cometal/react';

const loadingDuration = 1000;
const demoButtons = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'link', label: 'Link' },
  { variant: 'danger', label: 'Danger' },
] as const;

type DemoVariant = (typeof demoButtons)[number]['variant'];

export function ButtonInteractiveDemo() {
  const [loadingVariants, setLoadingVariants] = useState<ReadonlySet<DemoVariant>>(() => new Set());
  const timersRef = useRef<Map<DemoVariant, number>>(new Map());

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  function startLoading(variant: DemoVariant) {
    if (timersRef.current.has(variant)) return;
    setLoadingVariants((current) => new Set(current).add(variant));
    const timer = window.setTimeout(() => {
      timersRef.current.delete(variant);
      setLoadingVariants((current) => {
        const next = new Set(current);
        next.delete(variant);
        return next;
      });
    }, loadingDuration);
    timersRef.current.set(variant, timer);
  }

  return (
    <div className="button-interactive-demo">
      <div className="button-interactive-demo__actions">
        {demoButtons.map(({ variant, label }) => (
          <Button key={variant} size="m" variant={variant} loading={loadingVariants.has(variant)} onClick={() => startLoading(variant)}>{label}</Button>
        ))}
      </div>
    </div>
  );
}
