import { SectionHeading } from './section-heading';

type ComponentEnvironmentNotesProps = {
  responsive: string;
  theme: string;
  edgeCases: string;
};

export function ComponentEnvironmentNotes({ responsive, theme, edgeCases }: ComponentEnvironmentNotesProps) {
  return (
    <section className="content-section">
      <SectionHeading
        title="Responsive, theme и edge cases"
        description="Публичный компонент сохраняет один контракт между ширинами и темами; продукт управляет только внешней композицией."
      />
      <div className="definition-list">
        <article><span>01</span><strong>Responsive / overflow</strong><p>{responsive}</p></article>
        <article><span>02</span><strong>Theme</strong><p>{theme}</p></article>
        <article><span>03</span><strong>Edge cases</strong><p>{edgeCases}</p></article>
      </div>
    </section>
  );
}
