import type { Metadata } from 'next';
import Link from 'next/link';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { FieldDemo } from '../../../components/field-detail';
import { fieldDocumentation, fieldSlugs } from '../../../lib/field-documentation';
import { componentFamilies, components, statusLabels } from '../../../lib/registry';

export const metadata: Metadata = { title: 'Fields' };

export default function FieldsPage() {
  const family = componentFamilies.find((item) => item.id === 'input.fields')!;
  if (!family.figma) throw new Error('Fields family requires an exact Figma source');
  const first = components.find((item) => item.id === fieldDocumentation['text-field'].stableId)!;
  return (
    <main className="content-page field-doc-chooser">
      <ComponentPageHeader
        title="Fields"
        summary="Выберите поле по задаче: короткий текст, комментарий, один вариант, поиск или несколько значений."
        status={first.status} statusLabel={statusLabels[first.status]}
        figmaHref={family.figma}
        playgroundHref="/storybook/?path=/story/components-fields--fields-playground"
      />
      <section className="content-section" id="family">
        <h2>Пять компонентов</h2>
        <div className="field-doc-chooser__cards">
          {fieldSlugs.map((slug) => {
            const doc = fieldDocumentation[slug];
            const component = components.find((item) => item.id === doc.stableId)!;
            return (
              <article key={slug} id={slug}>
                <h3><Link href={doc.route}>{doc.title}</Link></h3>
                <p>{doc.summary}</p>
                <p><code>{doc.stableId}</code> · {statusLabels[component.status]}</p>
                <FieldDemo kind={slug} />
                <Link href={doc.route}>Обзор, настройки и доступность →</Link>
              </article>
            );
          })}
        </div>
      </section>
      <section className="content-section" aria-label="Справочник семейства">
        <h2>Как выбрать</h2>
        <p id="usage">Для свободного ввода — <Link href={fieldDocumentation['text-field'].route}>Text Field</Link> или <Link href={fieldDocumentation['text-area'].route}>Text Area</Link>. Для заданного набора — Select, Combobox или Multi Select.</p>
        <p id="sizes">Размеры L/M/S поддерживают <Link href="/components/fields/text-field/#examples">однострочные поля</Link>; Text Area и Multi Select — L/M.</p>
        <p id="states">Read, error, disabled и живой focus показаны в <Link href="/components/fields/select/#examples">примерах каждого поля</Link>.</p>
        <p id="code">Рабочий код со state и callbacks находится в разделе <Link href="/components/fields/combobox/#examples">Примеры</Link> каждой страницы.</p>
        <p id="behavior">Клавиатура и семантика различаются: откройте вкладку «Доступность» <Link href={fieldDocumentation['multi-select'].route}>нужного компонента</Link>.</p>
        <p id="api">Поддерживаемые свойства, их defaults и синхронный код — во вкладке «Настройки» <Link href={fieldDocumentation['text-field'].route}>страницы поля</Link>.</p>
      </section>
    </main>
  );
}
