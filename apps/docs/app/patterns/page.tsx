import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Паттерны' };

export default function PatternsPage() {
  return <main className="content-page"><header className="page-header"><span className="eyebrow">ПАТТЕРНЫ</span><h1>Повторяемые решения</h1><p>Паттерн связывает несколько компонентов с конкретной пользовательской задачей и поведением.</p></header><section className="empty-state"><span>Каталог формируется</span><h2>Паттернов пока нет</h2><p>Первый паттерн появится здесь после подтверждения реального повторяемого сценария в продукте. Мы не создаём абстракции заранее.</p></section></main>;
}
