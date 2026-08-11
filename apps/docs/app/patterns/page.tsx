import type { Metadata } from 'next';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';

export const metadata: Metadata = { title: 'Паттерны' };

export default function PatternsPage() {
  return (
    <main className="content-page">
      <PageHeader eyebrow="ПАТТЕРНЫ" title="Повторяемые решения" description="Паттерн связывает несколько компонентов с конкретной пользовательской задачей и поведением." />
      <MetadataStrip ariaLabel="Сводка каталога паттернов" items={['Web · React', '0 Ready', '0 In review']} bottomDivider />
      <section className="empty-state empty-state--after-metadata">
        <span>Каталог формируется</span>
        <h2>Паттернов пока нет</h2>
        <p>Первый паттерн появится здесь после подтверждения реального повторяемого сценария в продукте. Мы не создаём абстракции заранее.</p>
      </section>
    </main>
  );
}
