import type { Metadata } from 'next';
import { Combobox, Select, TextArea, TextField } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
import { ComponentEnvironmentNotes } from '../../../components/component-environment-notes';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { ComboboxModeDemo } from '../../../components/combobox-mode-demo';
import { MultiSelectModeDemo } from '../../../components/multi-select-mode-demo';
import { SelectModeDemo } from '../../../components/select-mode-demo';
import { SectionHeading } from '../../../components/section-heading';
import { contractorOptions } from '../../../lib/demo-options';
import { componentFamilies, components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Fields' };

const fieldComponentIds = new Set(['input.text-field', 'input.text-area', 'input.select', 'input.combobox', 'input.multi-select']);
const fieldComponents = components.filter((item) => fieldComponentIds.has(item.id));
const firstField = fieldComponents[0]!;
const fieldsFamilyFigma: string = componentFamilies.find((family) => family.id === 'input.fields')?.figma
  ?? (() => { throw new Error('Fields family requires an exact Figma source'); })();
const fieldsUsage = usageExamples['input.fields'];
const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${firstField.links.source}`;
const documentedFieldSizes = ['l', 'm', 's'] as const;
const fieldSizeOptions = [
  { value: 'draft', label: 'Черновик' },
  { value: 'active', label: 'Активный' },
];
export default function FieldsPage() {
  return (
    <main className="content-page component-detail">
      <ComponentPageHeader
        eyebrow="ГРУППА КОМПОНЕНТОВ · WEB"
        title="Fields"
        summary="Пять публичных полей с общей визуальной основой и разной семантикой: ввод текста, многострочный ввод, выбор, поиск и множественный выбор."
        status={firstField.status}
        statusLabel={statusLabels[firstField.status]}
        figmaHref={fieldsFamilyFigma}
        playgroundHref="/storybook/?path=/story/components-fields--fields-playground"
      />

      <div className="metadata-strip" data-component-phase="identity" data-top-divider data-bottom-divider><span>Stable IDs</span><code>input.text-field · input.text-area · input.select · input.combobox · input.multi-select</code><span>Family alias</span><strong>input.fields</strong><span>React</span><strong>Fields family</strong></div>

      <section className="content-section" data-component-phase="overview" id="family">
        <SectionHeading title="Пять компонентов" description="Mode=Read не копирует disabled-поле: рамка и интерактивность полностью исчезают." />
        <div className="field-family-board">
          <article id="text-field"><header><code>input.text-field</code><h3>Text Field</h3></header><div className="field-family-board__examples"><TextField label="Название поля" placeholder="Введите значение" helperText="Подсказка или описание" /><TextField label="Название поля" mode="read" readValue="ООО Северсталь" /></div></article>
          <article id="text-area"><header><code>input.text-area</code><h3>Text Area</h3></header><div className="field-family-board__examples"><TextArea label="Комментарий" placeholder="Введите комментарий" helperText="До 500 символов" rows={4} /><TextArea label="Комментарий" mode="read" readValue="Условия поставки и порядок согласования изменений." /></div></article>
          <article id="select"><header><code>input.select</code><h3>Select</h3></header><SelectModeDemo /></article>
          <article id="combobox"><header><code>input.combobox</code><h3>Combobox</h3></header><ComboboxModeDemo /></article>
          <article id="multi-select"><header><code>input.multi-select</code><h3>Multi Select</h3></header><MultiSelectModeDemo /></article>
        </div>
      </section>

      <section className="content-section" data-component-phase="visual-contract" id="sizes">
        <SectionHeading title="Размеры однострочных controls" description="Text Field, Select и Combobox используют общую шкалу S 32px, M 40px и L 48px. Text Area и Multi Select остаются в M/L." />
        <div className="field-size-board">
          {documentedFieldSizes.map((size) => (
            <article key={size}>
              <code>{size.toUpperCase()} · {size === 'l' ? '48' : size === 'm' ? '40' : '32'}px</code>
              <TextField label="Название поля" placeholder="Введите значение" size={size} />
              <Select label="Статус" options={fieldSizeOptions} size={size} />
              <Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} size={size} defaultValue="Северсталь" />
            </article>
          ))}
        </div>
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

      <section className="content-section" data-component-phase="code" id="code">
        <SectionHeading title="Код" description="Один пример показывает подключение и базовое использование всех пяти публичных компонентов Fields." />
        <CodeExample componentName="Fields" sourceHref={sourceHref} usage={fieldsUsage} />
      </section>

      <section className="content-section" data-component-phase="usage" id="usage">
        <SectionHeading title="Использование" description="Выбирайте field по задаче ввода, а не по внешнему сходству общей рамки." />
        <div className="guidance">
          <article data-tone="positive"><strong>Используйте</strong><p>Text Field для короткого ввода, Text Area для многострочного текста, Select для известного списка, Combobox для поиска и Multi Select для нескольких значений.</p></article>
          <article data-tone="negative"><strong>Не используйте</strong><p>Не используйте disabled control как режим чтения, Select как свободный ввод или Multi Select для единственного значения. Для неизменяемых данных используйте <code>mode=&quot;read&quot;</code>.</p></article>
        </div>
      </section>

      <section className="content-section" data-component-phase="behavior-a11y" id="behavior">
        <SectionHeading title="Поведение" description="Общий визуальный слой не смешивает разные пользовательские задачи и browser semantics." />
        <div className="definition-list"><article><span>01</span><strong>Text Field / Text Area</strong><p>Вводят текст через нативные input и textarea.</p></article><article><span>02</span><strong>Select</strong><p>Видимый trigger открывает DS Core Listbox; скрытый native select хранит form-value.</p></article><article><span>03</span><strong>Combobox</strong><p>Управляет поисковым запросом и связанным Listbox результатов.</p></article><article><span>04</span><strong>Multi Select</strong><p>Открывает multi-select Listbox; выбранные значения показывает Value Tags с отдельным удалением.</p></article><article><span>05</span><strong>Read</strong><p>Показывает данные обычным текстом без рамки, chevron и tab-stop.</p></article></div>
      </section>

      <section className="content-section" data-component-phase="public-api" id="api">
        <SectionHeading title="Общий React API" description="Каждый компонент расширяет нативные props своего HTML-элемента." />
        <div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[['label','string','required'],['size · single-line',"'l' | 'm' | 's'","'l'"],['size · TextArea / MultiSelect',"'l' | 'm'","'l'"],['mode',"'edit' | 'read'","'edit'"],['helperText','string','—'],['optional','boolean','false'],['error','string','—'],['readValue','ReactNode','—']].map(([name,type,value])=><div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div>
      </section>

      <div data-component-phase="adaptation"><ComponentEnvironmentNotes
        responsive="Fields занимают доступную ширину контейнера и сохраняют min-width: 0. Длинные выбранные значения используют ellipsis, а Multi Select сворачивает лишние tags в счётчик."
        theme="Control, listbox, error, helper и read mode используют общие semantic tokens активной темы; отдельного light/dark prop нет."
        edgeCases="Empty, disabled и error остаются различимыми семантически; длинные labels и helper text не должны перекрывать control, а optional и required нельзя показывать одновременно."
      /></div>
    </main>
  );
}
