'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@cometal/react';
import ArrowRightIcon from '@cometal/react/icons/outline/arrows/arrow-right';
import HomeIcon from '@cometal/react/icons/outline/general/home-03';
import TrashIcon from '@cometal/react/icons/outline/general/trash-01';

const loadingDuration = 1000;
type DemoVariant = 'primary' | 'secondary' | 'link' | 'danger';

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
        <Button size="m" variant="primary" startIcon={<HomeIcon />} loading={loadingVariants.has('primary')} onClick={() => startLoading('primary')}>Домой</Button>
        <Button size="m" variant="secondary" endIcon={<ArrowRightIcon />} loading={loadingVariants.has('secondary')} onClick={() => startLoading('secondary')}>Продолжить</Button>
        <Button size="m" variant="link" loading={loadingVariants.has('link')} onClick={() => startLoading('link')}>Link</Button>
        <Button size="m" variant="danger" startIcon={<TrashIcon />} aria-label="Удалить" title="Удалить" loading={loadingVariants.has('danger')} onClick={() => startLoading('danger')} />
      </div>
    </div>
  );
}
