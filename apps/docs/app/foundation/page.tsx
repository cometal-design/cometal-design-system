import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Foundation' };

const colorSteps = ['#FFFFFF', '#F3F6FB', '#D6DEE7', '#667085', '#292929', '#111111'];

export default function FoundationPage() {
  return (
    <main className="content-page">
      <header className="page-header">
        <span className="eyebrow">FOUNDATION</span>
        <h1>Основа визуального языка</h1>
        <p>Токены превращают решения Figma в переносимые значения для компонентов, паттернов и продуктовых экранов.</p>
      </header>

      <section className="foundation-stats">
        <article><strong>529</strong><span>переменных</span></article>
        <article><strong>18</strong><span>текстовых стилей</span></article>
        <article><strong>4</strong><span>grid-пресета</span></article>
        <article><strong>2 810</strong><span>икон-компонентов</span></article>
      </section>

      <section className="content-section" id="color">
        <div className="section-heading"><h2>Цвет</h2><p>Примитивная палитра хранит значения. Семантический слой объясняет назначение.</p></div>
        <div className="color-ramp">{colorSteps.map((color) => <div key={color} style={{ background: color }}><span>{color}</span></div>)}</div>
      </section>

      <section className="content-section" id="typography">
        <div className="section-heading"><h2>Типографика</h2><p>Grtsk Peta используется во всех интерфейсных ролях Cometal.</p></div>
        <div className="type-specimen"><span>Grtsk Peta</span><strong>Данные превращаются<br />в понятные решения.</strong><small>АБВГДЕЁЖЗ · ABCDEFG · 0123456789</small></div>
      </section>

      <section className="content-section" id="layout">
        <div className="section-heading"><h2>Размеры и сетки</h2><p>Spacing, радиусы и grid-пресеты задают общий ритм продукта.</p></div>
        <div className="foundation-links"><article><strong>Spacing</strong><span>Системный ритм от токенов до шаблонов</span></article><article><strong>Radius</strong><span>Семантические радиусы компонентов</span></article><article><strong>Grid</strong><span>Четыре пресета продуктовой компоновки</span></article></div>
      </section>

      <section className="content-section" id="themes">
        <div className="section-heading"><h2>Темы</h2><p>Сейчас система развивает базовую светлую тему. Тёмная тема будет заведена как отдельная семантическая карта, а не набор локальных переопределений.</p></div>
        <div className="theme-preview"><div><span>Light · active</span><strong>Cometal</strong></div><div><span>Dark · planned</span><strong>Cometal</strong></div></div>
      </section>

      <section className="content-section" id="icons">
        <div className="section-heading"><h2>Иконки</h2><p>Реестр считан из Figma. Публичный SVG и React API появятся после отдельного утверждения.</p></div>
        <div className="notice"><strong>2 810 записей</strong><span>Статус: inventory only</span></div>
      </section>
    </main>
  );
}
