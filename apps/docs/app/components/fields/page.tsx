import type { Metadata } from 'next';
import { ActionLink, TextArea, TextField } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
import { ComboboxModeDemo } from '../../../components/combobox-mode-demo';
import { MultiSelectModeDemo } from '../../../components/multi-select-mode-demo';
import { SelectModeDemo } from '../../../components/select-mode-demo';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Fields' };

const fieldComponentIds = new Set(['input.text-field', 'input.text-area', 'input.select', 'input.combobox', 'input.multi-select']);
const fieldComponents = components.filter((item) => fieldComponentIds.has(item.id));
const firstField = fieldComponents[0]!;
const fieldsUsage = usageExamples['input.fields'];
const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${firstField.links.source}`;
export default function FieldsPage() {
  return (
    <main className="content-page component-detail">
      <header className="component-title">
        <div><span className="eyebrow">ГРУППА КОМПОНЕНТОВ · WEB</span><h1>Fields</h1><p>Пять публичных полей с общей визуальной основой и разной семантикой: ввод текста, многострочный ввод, выбор, поиск и множественный выбор.</p></div>
        <div className="component-title__toolbar"><span className="status component-title__status" data-status={firstField.status}>{statusLabels[firstField.status]}</span><div className="component-title__links"><ActionLink href="https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1096-42" target="_blank" rel="noreferrer" variant="secondary">Figma ↗</ActionLink><ActionLink href="/storybook/?path=/story/components-fields--fields-playground" variant="secondary">Playground ↗</ActionLink></div></div>
      </header>

      <section className="content-section" id="family">
        <SectionHeading title="Пять компонентов" description="Mode=Read не копирует disabled-поле: рамка и интерактивность полностью исчезают." />
        <div className="field-family-board">
          <article id="text-field"><header><code>input.text-field</code><h3>Text Field</h3></header><div className="field-family-board__examples"><TextField label="Название поля" placeholder="Введите значение" helperText="Подсказка или описание" /><TextField label="Название поля" mode="read" readValue="ООО Северсталь" /></div></article>
          <article id="text-area"><header><code>input.text-area</code><h3>Text Area</h3></header><div className="field-family-board__examples"><TextArea label="Комментарий" placeholder="Введите комментарий" helperText="До 500 символов" rows={4} /><TextArea label="Комментарий" mode="read" readValue="Условия поставки и порядок согласования изменений." /></div></article>
          <article id="select"><header><code>input.select</code><h3>Select</h3></header><SelectModeDemo /></article>
          <article id="combobox"><header><code>input.combobox</code><h3>Combobox</h3></header><ComboboxModeDemo /></article>
          <article id="multi-select"><header><code>input.multi-select</code><h3>Multi Select</h3></header><MultiSelectModeDemo /></article>
        </div>
      </section>

      <section className="content-section" id="code">
        <SectionHeading title="Код" description="Один пример показывает подключение и базовое использование всех пяти публичных компонентов Fields." />
        <CodeExample componentName="Fields" sourceHref={sourceHref} usage={fieldsUsage} />
      </section>

      <section className="content-section" id="states">
        <SectionHeading title="Состояния" description="Filled определяется значением, hover и focus возникают от взаимодействия. Error и disabled задаёт приложение." />
        <div className="field-state-board">
          <article><code>Default</code><TextField label="Название поля" placeholder="Введите значение" /></article>
          <article><code>Filled</code><TextField label="Название поля" defaultValue="Договор поставки" /></article>
          <article><code>Focus visible</code><TextField className="docs-field--focus" label="Название поля" defaultValue="Договор поставки" /></article>
          <article><code>Error</code><TextField label="Название поля" defaultValue="123" error="Проверьте значение" /></article>
          <article><code>Disabled</code><TextField label="Название поля" placeholder="Недоступно" disabled /></article>
        </div>
      </section>

      <section className="content-section" id="behavior">
        <SectionHeading title="Поведение" description="Общий визуальный слой не смешивает разные пользовательские задачи и browser semantics." />
        <div className="definition-list"><article><span>01</span><strong>Text Field / Text Area</strong><p>Вводят текст через нативные input и textarea.</p></article><article><span>02</span><strong>Select</strong><p>Видимый trigger открывает DS Core Listbox; скрытый native select хранит form-value.</p></article><article><span>03</span><strong>Combobox</strong><p>Управляет поисковым запросом и связанным Listbox результатов.</p></article><article><span>04</span><strong>Multi Select</strong><p>Открывает multi-select Listbox; выбранные значения показывает Value Tags с отдельным удалением.</p></article><article><span>05</span><strong>Read</strong><p>Показывает данные обычным текстом без рамки, chevron и tab-stop.</p></article></div>
      </section>

      <section className="content-section" id="api">
        <SectionHeading title="Общий React API" description="Каждый компонент расширяет нативные props своего HTML-элемента." />
        <div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[['label','string','required'],['size',"'l' | 'm'","'l'"],['mode',"'edit' | 'read'","'edit'"],['helperText','string','—'],['optional','boolean','false'],['error','string','—'],['readValue','ReactNode','—']].map(([name,type,value])=><div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div>
      </section>
    </main>
  );
}
