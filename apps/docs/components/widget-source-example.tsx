import { Button, IconButton, Widget } from '@cometal/react';
import DownloadIcon from '@cometal/react/icons/outline/general/download';
import FilterIcon from '@cometal/react/icons/outline/general/filter';
import PlusIcon from '@cometal/react/icons/outline/general/plus-01';
import RefreshIcon from '@cometal/react/icons/outline/media/refresh-01';

export function WidgetSourceToolbar() {
  return <><IconButton size="m" variant="secondary" aria-label="Фильтры" icon={<FilterIcon />} /><IconButton size="m" variant="secondary" aria-label="Обновить" icon={<RefreshIcon />} /><IconButton size="m" variant="secondary" aria-label="Экспорт" icon={<DownloadIcon />} /><Button size="m" startIcon={<PlusIcon />}>Добавить запись</Button></>;
}

export function WidgetSourceExample({ compact = false }: { compact?: boolean }) {
  return <Widget title="Спецификация позиций" description="20 строк · данные обновлены сегодня" toolbar={<WidgetSourceToolbar />}><div className={compact ? 'widget-slot-example widget-slot-example--compact' : 'widget-slot-example'}>Content slot</div></Widget>;
}
