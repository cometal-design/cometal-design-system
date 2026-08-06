'use client';

import { Button, Switch } from '@cometal/react';
import { useState } from 'react';

export function MotionPlayground() {
  const [run, setRun] = useState(0);
  const [reduced, setReduced] = useState(false);

  return (
    <div className="portal-motion-playground" data-reduced={reduced || undefined}>
      <div className="portal-motion-playground__toolbar">
        <div>
          <strong>Popover enter</strong>
          <span>Opacity + 4px по оси Y</span>
        </div>
        <div className="portal-motion-playground__actions">
          <Switch
            size="s"
            checked={reduced}
            onChange={(event) => setReduced(event.currentTarget.checked)}
            label="Reduced motion"
          />
          <Button size="m" variant="secondary" onClick={() => setRun((value) => value + 1)}>
            Повторить
          </Button>
        </div>
      </div>
      <div className="portal-motion-playground__stage">
        <div className="portal-motion-playground__trigger" aria-hidden="true">
          Выберите значение <span>⌄</span>
        </div>
        <div className="portal-motion-playground__popover" key={`${run}-${reduced}`} aria-hidden="true">
          <span>Активный</span>
          <span>На согласовании</span>
          <span>Завершён</span>
        </div>
      </div>
    </div>
  );
}
