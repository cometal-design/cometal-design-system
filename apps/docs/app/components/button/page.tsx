import type { Metadata } from 'next';
import { Button } from '@cometal/react';
import type { ButtonVariant } from '@cometal/react';
import ArrowRightIcon from '@cometal/react/icons/outline/arrows/arrow-right';
import { CodeExample } from '../../../components/code-example';
import { ComponentEnvironmentNotes } from '../../../components/component-environment-notes';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { components, statusLabels } from '../../../lib/registry';
import { SectionHeading } from '../../../components/section-heading';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Button' };

const component = components.find((item) => item.id === 'action.button')!;
const usage = usageExamples[component.id];
const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`;
const buttonSizes = ['l', 'm', 's'] as const;
const darkVariants = new Set(['ghost', 'inverse', 'inverse-ghost']);
const documentedVariants: ButtonVariant[] = ['primary', 'secondary', 'link', 'danger', 'success', 'warning', 'ghost', 'inverse', 'inverse-ghost'];

export default function ButtonPage() {
  return (
    <main className="content-page component-detail">
      <ComponentPageHeader
        title="Button"
        summary="Запускает одно понятное действие пользователя: сохранить, продолжить, создать, подтвердить или удалить."
        status={component.status}
        statusLabel={statusLabels[component.status]}
        figmaHref={component.links.figma}
        playgroundHref="/storybook/?path=/story/components-button--playground"
      />
      <div className="metadata-strip" data-top-divider data-bottom-divider><span>Stable ID</span><code>action.button</code><span>React</span><strong>Button</strong></div>

      <section className="content-section" id="usage">
        <SectionHeading title="Использование" description="Кнопка выполняет действие. Для обычного перехода используйте ссылку, для переключения режима — Toggle." />
        <div className="guidance"><article data-tone="positive"><strong>Используйте</strong><p>Один Primary на локальную область. Подпись начинается с глагола и объясняет результат.</p></article><article data-tone="negative"><strong>Не используйте</strong><p>Для навигации, выбора значения или нескольких равнозначных основных действий рядом.</p></article></div>
      </section>

      <section className="content-section" id="code">
        <SectionHeading title="Код" description="Скопируйте установку, импорт или минимальный рабочий пример. Все представления соответствуют публичному React API." />
        <CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} />
      </section>

      <section className="content-section" id="variants">
        <SectionHeading title="Варианты" description="Девять визуальных ролей синхронизированы с DS Core." />
        <div className="variant-board">
          {documentedVariants.map((variant) => <article key={variant} data-dark={darkVariants.has(variant) || undefined}><code>{variant}</code><Button variant={variant}>Продолжить</Button></article>)}
        </div>
      </section>

      <section className="content-section" id="sizes">
        <SectionHeading title="Размеры и композиция" description="Каждый размер проверяется в четырёх композициях DS Core: текст, иконка слева, иконка справа и только иконка." />
        <div className="size-list size-list--compositions">
          {buttonSizes.map((size) => (
            <article key={size}>
              <div className="size-list__size"><strong>{size.toUpperCase()}</strong><span>{size === 'l' ? 48 : size === 'm' ? 40 : 32}px</span></div>
              <div className="size-list__examples">
                <div className="size-list__example"><span>Текст</span><Button size={size}>Продолжить</Button></div>
                <div className="size-list__example"><span>Иконка слева</span><Button size={size} startIcon={<ArrowRightIcon />}>Продолжить</Button></div>
                <div className="size-list__example"><span>Иконка справа</span><Button size={size} endIcon={<ArrowRightIcon />}>Продолжить</Button></div>
                <div className="size-list__example"><span>Только иконка</span><Button size={size} startIcon={<ArrowRightIcon />} aria-label="Продолжить" /></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" id="states">
        <SectionHeading title="Состояния" description="Hover, pressed и focus появляются от взаимодействия. Disabled и loading задаёт приложение." />
        <div className="state-board"><article><code>Default</code><Button>Продолжить</Button></article><article><code>Hover</code><Button className="docs-button--hover">Продолжить</Button></article><article><code>Focus visible</code><Button className="docs-button--focus">Продолжить</Button></article><article><code>Pressed</code><Button className="docs-button--pressed">Продолжить</Button></article><article><code>Disabled</code><Button disabled>Продолжить</Button></article><article><code>Loading</code><Button loading>Продолжить</Button></article></div>
      </section>

      <section className="content-section">
        <SectionHeading title="Поведение и доступность" description="Button сохраняет нативную button-семантику и не превращает визуальный variant в отдельный interaction contract." />
        <div className="definition-list">
          <article><span>01</span><strong>Keyboard</strong><p>Tab переводит focus на Button, Enter и Space запускают нативное действие; focus-visible остаётся различимым.</p></article>
          <article><span>02</span><strong>Loading</strong><p><code>loading</code> блокирует повторное действие через disabled и сообщает занятость через aria-busy, сохраняя ширину подписи.</p></article>
          <article><span>03</span><strong>Accessible name</strong><p>Текст задаёт имя обычной кнопки. Для icon-only композиции обязателен <code>aria-label</code>; декоративные иконки скрыты от accessibility tree.</p></article>
        </div>
      </section>

      <section className="content-section" id="api">
        <SectionHeading title="React API" description="Публичный API остаётся минимальным. Интерактивные состояния не передаются props." />
        <div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[
          ['variant', "'primary' | 'secondary' | …", "'primary'"], ['size', "'l' | 'm' | 's'", "'l'"], ['loading', 'boolean', 'false'], ['disabled', 'boolean', 'false'], ['startIcon / endIcon', 'ReactNode', '—'], ['children', 'ReactNode', '—'],
        ].map(([name, type, value]) => <div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div>
      </section>

      <ComponentEnvironmentNotes
        responsive="Button сохраняет intrinsic width и nowrap; перенос, растяжение или вертикальный stack задаёт родительская layout-композиция. На узкой ширине не сокращайте доступное имя до одной непонятной иконки."
        theme="Primary, semantic и inverse variants используют component tokens активной темы. Inverse и inverse-ghost применяются только на контрастной тёмной поверхности."
        edgeCases="Loading и disabled не вызывают действие; icon-only требует aria-label, а длинная подпись должна проверяться в доступной ширине без ручного уменьшения control height."
      />
    </main>
  );
}
