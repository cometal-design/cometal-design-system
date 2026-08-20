import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Widget } from '@cometal/react';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';
import { checksComplete, components, statusLabels } from '../../lib/registry';

export const metadata: Metadata = { title: 'Шаблоны' };

export default function TemplatesPage() {
  const templates = components.filter((component) => component.id === 'template.widget');
  return (
    <main className="content-page components-page">
      <PageHeader eyebrow="ШАБЛОНЫ" title="Структуры продуктовых экранов" description="Шаблон соединяет Foundation, компоненты и паттерны в устойчивую структуру бизнес-процесса." stat={{ value: templates.length, label: 'шаблон в реестре' }} />
      <MetadataStrip ariaLabel="Сводка каталога шаблонов" items={['Web · React', `${templates.filter((item) => item.status === 'ready').length} Ready`, `${templates.filter((item) => item.status === 'in-review').length} In review`]} bottomDivider />
      <section className="component-catalog" aria-label="Каталог шаблонов">
        {templates.map((template) => (
          <article className="component-card" data-component-id={template.id} key={template.id}>
            <div className="component-card__preview">
              <div className="component-card__demo">
                <Widget title="Сводка по закупкам" description="Reusable shell для title, actions и content slot." actions={<Button size="m">Действие</Button>}>
                  <div style={{ minHeight: 240, display: 'grid', placeItems: 'center', color: 'var(--cometal-semantic-color-global-text-secondary)' }}>Content slot</div>
                </Widget>
              </div>
            </div>
            <div className="component-card__body">
              <div><code>{template.id}</code><span className="status" data-status={template.status}>{statusLabels[template.status] ?? template.status}</span></div>
              <h2><Link href="/templates/widget/">{template.name}</Link></h2>
              <p>Widget публикует shell для dashboard/table blocks и не смешивает layout с продуктовой бизнес-логикой.</p>
              <footer><span>{template.version}</span><span>{checksComplete(template)}/5 источников согласовано</span></footer>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
