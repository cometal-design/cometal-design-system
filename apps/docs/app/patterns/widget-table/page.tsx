import type { Metadata } from 'next';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { WidgetTablePatternExample } from '../../../components/widget-table-pattern-example';

export const metadata: Metadata = { title: 'Widget + Table' };

export default function WidgetTablePatternPage() {
  return <main className="content-page component-detail widget-table-pattern-page">
    <ComponentPageHeader eyebrow="ПАТТЕРН · WEB" title="Widget + Table" summary="Widget предоставляет универсальную оболочку и toolbar. Table предоставляет два уровня header, source families, data rows, summary и paginator. Паттерн связывает их, не создавая третью таблицу." status="in-review" statusLabel="In review" figmaHref="https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2702-2265" playgroundHref="/storybook/?path=/story/patterns-widget-with-table--overview" />
    <section className="content-section"><SectionHeading title="Рабочий паттерн" description="10 строк и полный состав колонок взяты из Widget Review. Первый header floor — названия и actions; второй — независимые фильтры." /><WidgetTablePatternExample /></section>
    <section className="content-section"><SectionHeading title="Граница ответственности" description="Смена density, фильтрация, selection, context actions и pagination принадлежат Table и продуктовой композиции. Widget не получает Table-specific API." /><div className="definition-list"><article><span>01</span><strong>Widget</strong><p>Title, description, toolbar, Raised surface и content slot.</p></article><article><span>02</span><strong>Table</strong><p>Headers, filters, cells, rows, summary и paginator.</p></article><article><span>03</span><strong>Pattern</strong><p>Связывает toolbar с таблицей и сохраняет state при изменении density.</p></article></div></section>
  </main>;
}
