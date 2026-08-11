import type { Metadata } from 'next';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';

export const metadata: Metadata = { title: 'Шаблоны' };

export default function TemplatesPage() {
  return (
    <main className="content-page">
      <PageHeader eyebrow="ШАБЛОНЫ" title="Структуры продуктовых экранов" description="Шаблон соединяет Foundation, компоненты и паттерны в устойчивую структуру бизнес-процесса." />
      <MetadataStrip ariaLabel="Сводка каталога шаблонов" items={['Web · React', '0 Ready', '0 In review']} bottomDivider />
      <section className="empty-state empty-state--after-metadata">
        <span>Каталог формируется</span>
        <h2>Шаблонов пока нет</h2>
        <p>Первый шаблон появится после подтверждения повторяемой структуры в продукте. Мы не создаём абстракции заранее.</p>
      </section>
    </main>
  );
}
