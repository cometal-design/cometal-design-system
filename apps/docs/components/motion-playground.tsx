'use client';

import { Button, Select, Switch } from '@cometal/react';
import { useState } from 'react';

const exampleOptions = [
  { value: 'active', label: 'Активный' },
  { value: 'approval', label: 'На согласовании' },
  { value: 'completed', label: 'Завершён' },
];

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
        <div className="portal-motion-playground__example" key={`${run}-${reduced}`}>
          <Select label="Статус" options={exampleOptions} size="m" defaultExpanded />
        </div>
      </div>
    </div>
  );
}
