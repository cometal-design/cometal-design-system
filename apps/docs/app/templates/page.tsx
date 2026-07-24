import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Шаблоны' };

export default function TemplatesPage() {
  return <main className="content-page"><header className="page-header"><span className="eyebrow">ШАБЛОНЫ</span><h1>Структуры продуктовых экранов</h1><p>Шаблон соединяет Foundation, компоненты и паттерны в устойчивую структуру бизнес-процесса.</p></header><section className="empty-state"><span>Каталог формируется</span><h2>Шаблонов пока нет</h2><p>Первый шаблон появится после подтверждения повторяемой структуры в продукте. Мы не создаём абстракции заранее.</p></section></main>;
}
