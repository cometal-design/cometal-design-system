import { Button, Widget } from '@cometal/react';

export default function WidgetTemplatePage() {
  return (
    <main>
      <section>
        <p>Шаблон</p>
        <h1>Widget</h1>
        <p>
          Widget — это reusable container для dashboard/table surfaces: heading, optional description, actions и
          content slot.
        </p>
      </section>

      <section style={{ paddingTop: 32 }}>
        <Widget
          title="Сводка по закупкам"
          description="Шаблон собирает toolbar, content slot и системные токены в единый host."
          actions={<Button size="m">Действие</Button>}
        >
          <div style={{ minHeight: 240, display: 'grid', placeItems: 'center', color: 'var(--cometal-semantic-color-global-text-secondary)' }}>Content slot</div>
        </Widget>
      </section>
    </main>
  );
}
