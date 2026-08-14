import type { Metadata } from 'next';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHeaderCell, TableHead, TableRow } from '@cometal/react';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';
import { components, statusLabels } from '../../lib/registry';

export const metadata: Metadata = { title: 'Паттерны' };

export default function PatternsPage() {
  const patterns = components.filter((component) => component.id.startsWith('data-display.'));
  const table = patterns.find((component) => component.id === 'data-display.table')!;
  return (
    <main className="content-page components-page">
      <PageHeader eyebrow="ПАТТЕРНЫ" title="Повторяемые решения" description="Паттерн связывает компоненты с конкретной пользовательской задачей и сохраняет общий поведенческий контракт." stat={{ value: patterns.length, label: 'паттерн в реестре' }} />
      <MetadataStrip ariaLabel="Сводка каталога паттернов" items={['Web · React', `${patterns.filter((item) => item.status === 'ready').length} Ready`, `${patterns.filter((item) => item.status === 'in-review').length} In review`]} bottomDivider />
      <section className="component-catalog" aria-label="Каталог паттернов">
        <article className="component-card" data-component-id={table.id}>
          <div className="component-card__preview">
            <div className="component-card__demo pattern-table-preview">
              <Table density="compact" aria-label="Пример таблицы">
                <TableHead><TableRow><TableHeaderCell>Позиция</TableHeaderCell><TableHeaderCell>Количество</TableHeaderCell></TableRow></TableHead>
                <TableBody><TableRow><TableCell>POS-00127</TableCell><TableCell align="end">120</TableCell></TableRow></TableBody>
              </Table>
            </div>
          </div>
          <div className="component-card__body">
            <div><code>{table.id}</code><span className="status" data-status={table.status}>{statusLabels[table.status] ?? table.status}</span></div>
            <h2><Link href="/patterns/table/">{table.name}</Link></h2>
            <p>Структурирует большие наборы бизнес-данных и сохраняет контент при смене плотности.</p>
            <footer><span>{table.version}</span><span>5/5 источников согласовано</span></footer>
          </div>
        </article>
      </section>
    </main>
  );
}
