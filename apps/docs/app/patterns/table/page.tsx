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

      <section className="content-section"><SectionHeading title="Код" description="Публичный API сохраняет нативную table-семантику и разделяет ответственность Table, Header Cell, Row и Cell." /><CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} /></section>
      <section className="content-section"><SectionHeading title="Технический контракт" description="Полная матрица состояний, плотностей, file metadata и computed-style проверки находятся в Storybook." /></section>
    </main>
  );
}
