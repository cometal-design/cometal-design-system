import { Button, IconButton, Widget } from '@cometal/react';

function SourceIcon({ type, inverse = false }: { type: 'filter' | 'refresh' | 'download' | 'plus'; inverse?: boolean }) {
  const color = inverse ? 'var(--cometal-semantic-color-global-icon-inverse)' : 'var(--cometal-semantic-color-global-icon-primary)';
  if (type === 'filter') return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.34103 4.03333H9.72564M0.7 0.7H11.3667M4.80256 7.36667H7.2641" transform="translate(1.96665 3.966665)" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (type === 'refresh') return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.75191 3.53333C2.67854 1.83956 4.41048 0.7 6.39414 0.7C8.64325 0.7 10.5688 2.16495 11.3638 4.24167M3.3796 4.24167H0.7V1.40833M10.9814 9.2C10.0548 10.8938 8.32285 12.0333 6.33919 12.0333C4.09009 12.0333 2.16457 10.5684 1.36956 8.49167M9.35374 8.49167H12.0333V11.325" transform="translate(1.63335 1.63335)" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (type === 'download') return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0.7 12.2885C0.969805 12.552 1.33574 12.7 1.7173 12.7H10.3494C10.7309 12.7 11.0969 12.552 11.3667 12.2885M6.03414 0.7V8.66164M2.74573 5.61953L6.03414 8.66164L9.32254 5.61953" transform="translate(1.96665 1.3)" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.36667 0.7V10.0333M10.0333 5.36667H0.7" transform="translate(2.63335 2.63335)" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></svg>;
}

export function WidgetSourceToolbar() {
  return <><IconButton size="m" variant="secondary" aria-label="Фильтры" icon={<SourceIcon type="filter" />} /><IconButton size="m" variant="secondary" aria-label="Обновить" icon={<SourceIcon type="refresh" />} /><IconButton size="m" variant="secondary" aria-label="Экспорт" icon={<SourceIcon type="download" />} /><Button size="m" startIcon={<SourceIcon type="plus" inverse />}>Добавить запись</Button></>;
}

export function WidgetSourceExample({ compact = false }: { compact?: boolean }) {
  return <Widget title="Спецификация позиций" description="20 строк · данные обновлены сегодня" toolbar={<WidgetSourceToolbar />}><div className={compact ? 'widget-slot-example widget-slot-example--compact' : 'widget-slot-example'}>Content slot</div></Widget>;
}
