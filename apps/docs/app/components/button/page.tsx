import type { Metadata } from 'next';
import { Badge, TabPanel, Tabs } from '@cometal/react';
import { ButtonInteractiveDemo } from '../../../components/button-interactive-demo';
import { ButtonExamples } from '../../../components/button-examples';
import { ButtonPageTabList } from '../../../components/button-page-tabs';
import { ButtonSettings } from '../../../components/button-settings';
import { ButtonUsageExample } from '../../../components/button-usage-example';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { components, statusLabels } from '../../../lib/registry';
import { SectionHeading } from '../../../components/section-heading';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Button' };

const component = components.find((item) => item.id === 'action.button')!;
const usage = usageExamples[component.id];
const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`;

export default function ButtonPage() {
  return (
    <main className="content-page component-detail component-detail--button">
      <Tabs defaultValue="overview" size="m" className="button-page-tabs">
        <div data-component-phase="identity">
          <ComponentPageHeader
            title="Button"
            summary="Запускает одно понятное действие пользователя: сохранить, продолжить, создать, подтвердить или удалить."
            status={component.status}
            statusLabel={statusLabels[component.status]}
            figmaHref={component.links.figma}
            playgroundHref="/storybook/?path=/story/components-button--playground"
            playgroundLabel="Storybook ↗"
            sourceHref={sourceHref}
            linkSize="m"
            statusAtTop
            hideEyebrow
            identityLabel={<>ID: <code>action.button</code> · React: {component.name} · {usage.packageName}</>}
            compactSummary
            identityAfterSummary
            linksAtEnd
            toolbarStart={<ButtonPageTabList />}
          />
        </div>

        <TabPanel value="overview" className="button-page-tabs__panel" tabIndex={-1}>

      <section className="content-section" data-component-phase="overview" aria-labelledby="button-interactive-demo-title">
        <h2 className="visually-hidden" id="button-interactive-demo-title">Интерактивный пример Button</h2>
        <ButtonInteractiveDemo />
      </section>

      <section className="content-section" aria-label="Использование Button">
        <SectionHeading title="Использование" description="Импортируйте Button, задайте текст кнопки и обработчик нажатия." />
        <ButtonUsageExample />
      </section>

      <section className="content-section" aria-label="Композиция Button" id="composition">
        <header className="section-heading"><h2>Композиция</h2></header>
        <table className="button-composition-table">
          <caption className="visually-hidden">Элементы композиции Button</caption>
          <thead><tr><th scope="col">Элемент</th><th scope="col">Описание</th></tr></thead>
          <tbody>
            <tr><th scope="row">Текст</th><td>Подпись, которая объясняет действие кнопки.</td></tr>
            <tr><th scope="row">Иконка слева</th><td>Необязательная иконка перед текстом.</td></tr>
            <tr><th scope="row">Иконка справа</th><td>Необязательная иконка после текста.</td></tr>
            <tr><th scope="row">Индикатор загрузки</th><td>Показывается в состоянии loading; повторное нажатие недоступно.</td></tr>
          </tbody>
        </table>
        <p className="button-composition-note">Для кнопки только с иконкой задайте доступное имя через <code>aria-label</code>.</p>
      </section>

      <section className="content-section" data-component-phase="usage" id="best-practices">
        <header className="section-heading"><h2>Правила использования</h2></header>
        <table className="button-composition-table button-best-practices-table">
          <caption className="visually-hidden">Правила использования Button</caption>
          <thead><tr><th scope="col">Статус</th><th scope="col">Тезис</th><th scope="col">Объяснение</th></tr></thead>
          <tbody>
            <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Одно основное действие</th><td>Выделяйте Primary основное действие в группе.</td></tr>
            <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Понятная подпись</th><td>Пишите конкретное действие: «Сохранить изменения», «Отправить заявку».</td></tr>
            <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Разрушительные действия</th><td>Для разрушительных действий используйте Danger.</td></tr>
            <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Конкурирующие акценты</th><td>Не ставьте несколько конкурирующих Primary в одной группе.</td></tr>
            <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Необратимое удаление</th><td>Не выполняйте необратимое удаление без подтверждения.</td></tr>
            <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Навигация</th><td>Не используйте кнопку для перехода на другую страницу — используйте ссылку.</td></tr>
          </tbody>
        </table>
      </section>

      <section className="content-section button-examples-section" id="examples">
        <SectionHeading title="Примеры" description="Сравните варианты, размеры, настоящие интерактивные состояния и поддержанные композиции с иконками. Превью остаётся на месте, пока вы читаете описание или копируете код." />
        <ButtonExamples />
      </section>

        </TabPanel>

        <TabPanel value="react-api" className="button-page-tabs__panel" tabIndex={-1}>
          <section className="content-section button-settings-section">
            <ButtonSettings />
          </section>
        </TabPanel>

        <TabPanel value="accessibility" className="button-page-tabs__panel" tabIndex={-1}>
          <section className="content-section" data-component-phase="behavior-a11y">
            <SectionHeading title="Поведение и доступность" description="Button сохраняет нативную button-семантику и не превращает визуальный variant в отдельный interaction contract." />
            <div className="definition-list">
              <article><span>01</span><strong>Keyboard</strong><p>Tab переводит focus на Button, Enter и Space запускают нативное действие; focus-visible остаётся различимым.</p></article>
              <article><span>02</span><strong>Loading</strong><p><code>loading</code> блокирует повторное действие через disabled и сообщает занятость через aria-busy, сохраняя ширину подписи.</p></article>
              <article><span>03</span><strong>Accessible name</strong><p>Текст задаёт имя обычной кнопки. Для icon-only композиции обязателен <code>aria-label</code>; декоративные иконки скрыты от accessibility tree.</p></article>
            </div>
          </section>
        </TabPanel>
      </Tabs>
    </main>
  );
}
