import { CodeExample } from './code-example';
import { SectionHeading } from './section-heading';
import { usageExamples } from '../lib/usage-examples';
import type { ReactNode } from 'react';

type ApiRow = {
  name: string;
  type: string;
  description: string;
};

type TableChildDocumentationProps = {
  childLabel: string;
  useWhen: string;
  doNotUseWhen: string;
  behavior: string;
  apiRows: readonly ApiRow[];
  edgeCases: string;
  visualContract: ReactNode;
};

const tableSourceHref = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Table/Table.tsx';

export function TableChildDocumentation({ childLabel, useWhen, doNotUseWhen, behavior, apiRows, edgeCases, visualContract }: TableChildDocumentationProps) {
  return <>
    <div className="metadata-strip" data-component-phase="identity" data-top-divider data-bottom-divider>
      <span>Stable ID</span><code>data-display.table</code><span>Family scope</span><strong>{childLabel}</strong>
    </div>
    <section className="content-section" data-component-phase="overview">
      <SectionHeading title="Обзор shared implementation" description={`${childLabel} — исполняемый срез единого Table API и stable ID data-display.table, а не отдельный React-компонент.`} />
      <p>Страница начинает с общего source context, затем показывает полную visual matrix этого family-child.</p>
    </section>
    <div data-component-phase="visual-contract">{visualContract}</div>
    <section className="content-section" data-component-phase="code">
      <SectionHeading title="Код и React source" description="Все дочерние разделы Table используют одну публичную реализацию и один импорт. Family-child страница не вводит локальный API." />
      <CodeExample componentName="Table" sourceHref={tableSourceHref} usage={usageExamples['data-display.table']} />
    </section>
    <section className="content-section" data-component-phase="usage" id="usage">
      <SectionHeading title="Использование" description={`${childLabel} — документируемая часть общего Table API, а не отдельный React-компонент или registry identity.`} />
      <div className="guidance">
        <article data-tone="positive"><strong>Используйте</strong><p>{useWhen}</p></article>
        <article data-tone="negative"><strong>Не используйте</strong><p>{doNotUseWhen}</p></article>
      </div>
    </section>
    <section className="content-section" data-component-phase="behavior-a11y">
      <SectionHeading title="Поведение и доступность" description="Нативная table-семантика остаётся источником отношений между header, row и cell; интерактивные элементы сохраняют самостоятельный клавиатурный focus." />
      <div className="definition-list">
        <article><span>01</span><strong>Контракт</strong><p>{behavior}</p></article>
        <article><span>02</span><strong>Keyboard</strong><p>Scrollable region получает tab-stop и aria-label; кнопки, поля и ссылки внутри таблицы идут в обычном tab order. Стрелочная навигация grid не заявлена публичным API.</p></article>
        <article><span>03</span><strong>Семантика</strong><p>Используйте TableHead, TableBody, TableRow, TableHeaderCell и TableCell по их нативным ролям; визуальные состояния не заменяют aria-disabled, aria-invalid, aria-sort и доступные имена.</p></article>
      </div>
    </section>
    <section className="content-section" data-component-phase="public-api" id="api">
      <SectionHeading title="Общий React API" description={`Публичные props, относящиеся к ${childLabel}. Полный source остаётся в packages/react/src/Table/Table.tsx.`} />
      <div className="api-table">
        <div className="api-table__head"><span>Prop</span><span>Тип</span><span>Назначение</span></div>
        {apiRows.map((row) => <div key={row.name}><code>{row.name}</code><code>{row.type}</code><span>{row.description}</span></div>)}
      </div>
    </section>
    <section className="content-section" data-component-phase="adaptation">
      <SectionHeading title="Responsive, theme и edge cases" description="Проверки относятся к общей реализации Table и не создают отдельный child breakpoint или theme prop." />
      <div className="definition-list">
        <article><span>01</span><strong>Responsive / overflow</strong><p>На узком viewport Table сохраняет структуру и использует горизонтальный overflow контейнера .cometal-table-scroll; содержимое не превращается в карточки автоматически.</p></article>
        <article><span>02</span><strong>Theme</strong><p>Отдельный light/dark prop отсутствует: поверхности, текст и состояния наследуют активную тему через общие семантические tokens.</p></article>
        <article><span>03</span><strong>Edge cases</strong><p>{edgeCases}</p></article>
      </div>
    </section>
  </>;
}
