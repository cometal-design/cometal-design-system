import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Шаблоны' };

export default function TemplatesPage() {
  return <main className="content-page"><header className="page-header"><span className="eyebrow">ШАБЛОНЫ</span><h1>Структуры продуктовых экранов</h1><p>Шаблон соединяет Foundation, компоненты и паттерны в устойчивую структуру бизнес-процесса.</p></header><section className="empty-state"><span>Будущий каталог</span><h2>Шаблоны появятся из продукта</h2><p>Сначала мы собираем доказанный экран, затем выделяем повторяемую структуру и только после этого регистрируем шаблон.</p></section></main>;
}
