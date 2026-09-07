import type { Metadata } from 'next';
import { Badge, InlineLink, TabPanel, Tabs } from '@cometal/react';
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
          <section className="content-section button-accessibility-section" data-component-phase="behavior-a11y" aria-labelledby="button-accessibility-contrast">
            <header className="section-heading">
              <h2 id="button-accessibility-contrast">Контраст</h2>
              <p>Требования для проверки Button в вашем интерфейсе. Это не отчёт о соответствии всех вариантов COMETAL. Проверяйте фактические цвета после наложения на реальную поверхность, а не только названия токенов.</p>
            </header>
            <table className="button-composition-table button-accessibility-table button-accessibility-table--contrast">
              <caption className="visually-hidden">Требования к контрасту Button</caption>
              <thead><tr><th scope="col">Элемент</th><th scope="col">Требование</th><th scope="col">Что проверять</th></tr></thead>
              <tbody>
                <tr><th scope="row">Текст Button</th><td>Не менее 4.5:1</td><td>Контраст текста с фактическим фоном в состояниях default, hover и pressed.</td></tr>
                <tr><th scope="row">Смысловая иконка</th><td>Не менее 3:1</td><td>Иконку в icon-only Button. Декоративную иконку рядом с равнозначным текстом отдельно измерять не требуется.</td></tr>
                <tr><th scope="row">Рамка фокуса</th><td>Не менее 3:1</td><td>Пользовательскую рамку фокуса относительно соседней области; она не должна обрезаться или скрываться.</td></tr>
                <tr><th scope="row">Видимая граница</th><td>Не менее 3:1, если необходима</td><td>Границу или поверхность, без которой нельзя распознать элемент управления.</td></tr>
                <tr><th scope="row">Disabled</th><td>Исключение для неактивного элемента</td><td>Требование контраста WCAG не распространяется на неактивный элемент управления, но его состояние должно оставаться понятным.</td></tr>
              </tbody>
            </table>
            <p className="button-accessibility-sources">
              <InlineLink href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">WCAG: минимальный контраст ↗</InlineLink>
              <InlineLink href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" target="_blank" rel="noreferrer">WCAG: нетекстовый контраст ↗</InlineLink>
            </p>
          </section>

          <section className="content-section button-accessibility-section" aria-labelledby="button-accessibility-keyboard">
            <header className="section-heading">
              <h2 id="button-accessibility-keyboard">Клавиатура</h2>
              <p>Button использует нативное поведение HTML-кнопки и не добавляет навигацию стрелками, предназначенную для Tabs.</p>
            </header>
            <table className="button-composition-table button-accessibility-table">
              <caption className="visually-hidden">Клавиатурное управление Button</caption>
              <thead><tr><th scope="col">Клавиша</th><th scope="col">Результат</th></tr></thead>
              <tbody>
                <tr><th scope="row">Tab</th><td>Переводит фокус на следующий доступный интерактивный элемент.</td></tr>
                <tr><th scope="row">Shift + Tab</th><td>Возвращает фокус на предыдущий доступный интерактивный элемент.</td></tr>
                <tr><th scope="row">Enter / Space</th><td>Активирует кнопку, если она находится в фокусе и не отключена.</td></tr>
                <tr><th scope="row">Disabled / loading</th><td>Кнопка исключается из последовательной Tab-навигации и не запускает действие повторно.</td></tr>
              </tbody>
            </table>
            <p className="button-accessibility-note">Сохраняйте видимую рамку фокуса при клавиатурной навигации. Не переносите фокус на кнопку автоматически при загрузке и не удаляйте системный outline без равноценной замены.</p>
            <p className="button-accessibility-sources">
              <InlineLink href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" target="_blank" rel="noreferrer">WCAG: видимый фокус ↗</InlineLink>
              <InlineLink href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noreferrer">WAI-ARIA APG: Button Pattern ↗</InlineLink>
            </p>
          </section>

          <section className="content-section button-accessibility-section" aria-labelledby="button-accessibility-screenreader">
            <header className="section-heading">
              <h2 id="button-accessibility-screenreader">Скринридер и состояния</h2>
              <p>Доступное имя объясняет действие, а состояния передаются через нативную семантику и поддержанные ARIA-атрибуты.</p>
            </header>
            <table className="button-composition-table button-accessibility-table">
              <caption className="visually-hidden">Семантика и состояния Button для скринридера</caption>
              <thead><tr><th scope="col">Случай</th><th scope="col">Контракт</th></tr></thead>
              <tbody>
                <tr><th scope="row">Кнопка с текстом</th><td>Нативный <code>button</code> задаёт роль, а видимый текст — доступное имя. Не заменяйте корректную подпись дублирующим <code>aria-label</code>.</td></tr>
                <tr><th scope="row">Только иконка</th><td>Передайте осмысленный <code>aria-label</code>, например «Удалить строку», а не название иконки. Декоративные start/end-иконки скрыты от дерева доступности.</td></tr>
                <tr><th scope="row">Disabled</th><td>Компонент использует нативный атрибут <code>disabled</code>.</td></tr>
                <tr><th scope="row">Loading</th><td><code>aria-busy="true"</code> сочетается с <code>disabled</code>; подпись визуально скрыта, но сохраняет имя, индикатор загрузки остаётся декоративным.</td></tr>
                <tr><th scope="row">Результат действия</th><td>Button не гарантирует голосовое объявление загрузки и не создаёт live region. Сообщение об успехе или ошибке обеспечивает использующее приложение.</td></tr>
              </tbody>
            </table>
            <p className="button-accessibility-sources">
              <InlineLink href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noreferrer">WAI-ARIA APG: имя, роль и активация ↗</InlineLink>
            </p>
          </section>
        </TabPanel>
      </Tabs>
    </main>
  );
}
