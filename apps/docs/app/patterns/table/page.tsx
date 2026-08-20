import type { Metadata } from 'next';
import { Badge, Table, TableBody, TableCell, TableFileCell, TableHeaderCell, TableHead, TableRow } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Table' };

export default function TablePage() {
  const component = components.find((item) => item.id === 'data-display.table')!;
  const usage = usageExamples[component.id];
  const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`;
  return (
    <main className="content-page component-detail">
      <ComponentPageHeader
        title="Table"
        summary="Составной паттерн чтения и редактирования больших бизнес-наборов данных."
        status={component.status}
        statusLabel={statusLabels[component.status]}
        figmaHref={component.links.figma}
        playgroundHref="/storybook/?path=/story/patterns-table--overview"
      />

      <section className="content-section">
        <SectionHeading title="Рабочий пример" description="Header сохраняет высоту 48px, а строки переключаются между Comfortable 48px и Compact 40px без потери значений." />
        <div className="pattern-table-detail">
          <Table density="comfortable" aria-label="Позиции закупки">
            <TableHead><TableRow><TableHeaderCell kind="index">№</TableHeaderCell><TableHeaderCell>Позиция</TableHeaderCell><TableHeaderCell>Статус</TableHeaderCell><TableHeaderCell>Файл</TableHeaderCell></TableRow></TableHead>
            <TableBody>
              <TableRow><TableCell align="center">1</TableCell><TableCell>POS-00127</TableCell><TableCell><Badge tone="green">Согласовано</Badge></TableCell><TableFileCell fileName="specification.pdf" fileSize="130 KB" /></TableRow>
              <TableRow selected><TableCell align="center">2</TableCell><TableCell state="selected">POS-00128</TableCell><TableCell><Badge tone="yellow">На проверке</Badge></TableCell><TableFileCell fileName="drawing.dwg" fileSize="2.4 MB" /></TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading title="Композиция поведения" description="Table собирает готовые primitives и не клонирует их в отдельный продуктовый API." />
        <div className="definition-list">
          <article><span>01</span><strong>Tooltip для truncate</strong><p>Подсказка появляется только для реально усечённого контента и использует общий overlay-контракт.</p></article>
          <article><span>02</span><strong>Context Menu для header actions</strong><p>Действия колонок переиспользуют общий menu overlay с Hard elevation и корректной danger semantic.</p></article>
          <article><span>03</span><strong>Date Range filter</strong><p>Фильтр периода собирается поверх Date Range Picker и не создаёт отдельный private dropdown.</p></article>
          <article><span>04</span><strong>Summary + paginator</strong><p>Нижний summary и пагинация живут рядом с таблицей и не меняют нативную table-семантику.</p></article>
          <article><span>05</span><strong>Reorder handle</strong><p>Ручка перестановки остаётся composable affordance внутри ячейки и не превращается в prop-count из Figma.</p></article>
        </div>
      </section>

      <section className="content-section"><SectionHeading title="Код" description="Публичный API сохраняет нативную table-семантику и разделяет ответственность Table, Header Cell, Row и Cell." /><CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} /></section>
      <section className="content-section"><SectionHeading title="Технический контракт" description="Storybook фиксирует плотности, file metadata, tooltip/context menu reuse, range filter, summary row, paginator и reorder handle. Полная матрица состояний и computed-style проверки находятся там." /></section>
    </main>
  );
}
