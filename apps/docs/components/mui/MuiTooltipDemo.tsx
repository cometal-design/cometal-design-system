'use client';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { buttonStyles, tooltipStyles } from './visual-adapter';

export function MuiTooltipDemo() {
  return <Tooltip title="Создаёт новую заявку для выбранного проекта" describeChild arrow placement="top"
    slotProps={{ tooltip: { sx: tooltipStyles }, arrow: { sx: { color: 'var(--cometal-semantic-color-global-surface-inverse)' } } }}>
    <Button type="button" variant="contained" sx={buttonStyles}>О подсказке</Button>
  </Tooltip>;
}
