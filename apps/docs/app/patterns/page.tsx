import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@cometal/react';
import { WidgetTableReviewExample } from '../../../shared/widget-table/WidgetTableReviewExample';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';

export const metadata: Metadata = { title: 'Паттерны' };

export default function PatternsPage() {
  return <main className="content-page components-page">
    <PageHeader eyebrow="ПАТТЕРНЫ" title="Повторяемые решения" description="Паттерн связывает несколько канонических компонентов с пользовательской задачей. Он не создаёт новые кирпичики и не дублирует их CSS." stat={{ value: 1, label: 'паттерн в разработке' }} />
    <MetadataStrip ariaLabel="Сводка каталога паттернов" items={['Web · React', '0 Ready', '1 In review']} bottomDivider />
    <section className="pattern-catalog" aria-label="Каталог паттернов">
      <article className="pattern-catalog__item">
        <div className="pattern-catalog__preview"><WidgetTableReviewExample initialDensity="compact" /></div>
        <div className="pattern-catalog__body"><div><code>pattern.widget-table</code><Badge tone="yellow">In review</Badge></div><h2><Link href="/patterns/widget-table/">Widget + Table</Link></h2><p>Универсальный Widget с полноценной Table: toolbar, два уровня header, строки, summary и paginator.</p></div>
      </article>
    </section>
  </main>;
}
