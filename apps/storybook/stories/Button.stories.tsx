import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, buttonSizes, buttonVariants } from '@cometal/react';
import type { ButtonProps, ButtonVariant } from '@cometal/react';

const FIGMA_URL = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=835-3693';

const variantLabels: Record<ButtonVariant, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  ghost: 'Ghost',
  link: 'Link',
  danger: 'Danger',
  success: 'Success',
  warning: 'Warning',
  inverse: 'Inverse',
  'inverse-ghost': 'Inverse Ghost',
};

const documentedButtonVariants: ButtonVariant[] = [
  'primary',
  'secondary',
  'link',
  'danger',
  'success',
  'warning',
  'ghost',
  'inverse',
  'inverse-ghost',
];

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

function ButtonDocumentation() {
  return (
    <main className="ds-component-page">
      <header className="ds-component-hero">
        <div>
          <span className="ds-eyebrow">COMPONENT · WEB · IN REVIEW</span>
          <h1>Button</h1>
          <p>Запускает действие пользователя. Визуальная модель приходит из Figma, а здесь зафиксированы React API, реальные состояния, поведение и проверки.</p>
        </div>
        <a href={FIGMA_URL} target="_blank" rel="noreferrer">Открыть компонент в Figma ↗</a>
      </header>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>01</span><div><h2>Быстрый старт</h2><p>Импортируйте компонент и стили библиотеки один раз в приложении.</p></div></div>
        <pre className="ds-code"><code>{`import '@cometal/tokens/css';\nimport '@cometal/react/styles.css';\nimport { Button } from '@cometal/react';\n\n<Button variant="primary" size="l">\n  Сохранить\n</Button>`}</code></pre>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>02</span><div><h2>Когда использовать</h2><p>Для явного действия: сохранить, продолжить, создать, подтвердить или удалить.</p></div></div>
        <div className="ds-guidance-grid">
          <article className="ok"><strong>Используйте</strong><ul><li>Один Primary на локальную область.</li><li>Danger только для разрушительного действия.</li><li>Глагол, который объясняет результат нажатия.</li></ul></article>
          <article className="stop"><strong>Не используйте</strong><ul><li>Для перехода без действия — нужен Link.</li><li>Для включения режима — нужен Toggle.</li><li>Несколько равнозначных Primary рядом.</li></ul></article>
        </div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>03</span><div><h2>Варианты</h2><p>Девять визуальных ролей совпадают с DS Core. Тёмные варианты показаны на тёмной поверхности.</p></div></div>
        <div className="ds-button-variants">
          {documentedButtonVariants.map((variant) => (
            <article key={variant} className={variant === 'ghost' || variant === 'inverse' || variant === 'inverse-ghost' ? 'dark' : ''}>
              <code>{variantLabels[variant]}</code>
              <Button variant={variant}>Продолжить</Button>
            </article>
          ))}
        </div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>04</span><div><h2>Размеры и композиция</h2><p>L = 44px, M = 36px, S = 28px. Поддерживаются текст, иконка слева, иконка справа и icon-only.</p></div></div>
        <div className="ds-button-size-table">
          {buttonSizes.map((size) => (
            <article key={size}>
              <div><strong>{size.toUpperCase()}</strong><small>{size === 'l' ? '44' : size === 'm' ? '36' : '28'}px</small></div>
              <Button size={size}>Продолжить</Button>
              <Button size={size} startIcon={<Arrow />}>Продолжить</Button>
              <Button size={size} endIcon={<Arrow />}>Продолжить</Button>
              <Button size={size} startIcon={<Arrow />} aria-label="Продолжить" />
            </article>
          ))}
        </div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>05</span><div><h2>Состояния</h2><p>Hover, pressed и focus возникают от реального взаимодействия. Disabled и loading задаются приложением.</p></div></div>
        <div className="ds-button-state-grid">
          <article><code>Default</code><Button>Продолжить</Button></article>
          <article><code>Hover</code><Button className="sb-button--hover">Продолжить</Button></article>
          <article><code>Focus visible</code><Button className="sb-button--focus">Продолжить</Button></article>
          <article><code>Pressed</code><Button className="sb-button--pressed">Продолжить</Button></article>
          <article><code>Disabled</code><Button disabled>Продолжить</Button></article>
          <article><code>Loading</code><Button loading>Продолжить</Button></article>
        </div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>06</span><div><h2>Поведение и доступность</h2><p>Компонент остаётся нативным HTML button, поэтому Enter и Space работают без дополнительного JavaScript.</p></div></div>
        <div className="ds-rule-list">
          <article><code>type</code><p>По умолчанию <b>button</b>, чтобы случайно не отправить форму. Для отправки укажите <b>submit</b>.</p></article>
          <article><code>loading</code><p>Сохраняет ширину, показывает spinner, ставит <b>aria-busy</b> и блокирует повторный клик.</p></article>
          <article><code>focus</code><p>Focus ring показывается только при клавиатурной навигации через <b>:focus-visible</b>.</p></article>
          <article><code>icon-only</code><p>Обязательно передайте <b>aria-label</b>, потому что видимой подписи нет.</p></article>
        </div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>07</span><div><h2>React API</h2><p>В API нет props для hover, pressed и focus: браузер формирует эти состояния сам.</p></div></div>
        <div className="ds-api-table">
          {[
            ['variant', "'primary' | 'secondary' | 'ghost' | 'link' | 'danger' | 'success' | 'warning' | 'inverse' | 'inverse-ghost'", "'primary'"],
            ['size', "'l' | 'm' | 's'", "'l'"],
            ['loading', 'boolean', 'false'],
            ['disabled', 'boolean', 'false'],
            ['startIcon / endIcon', 'ReactNode', '—'],
            ['children', 'ReactNode', '—'],
            ['…button props', 'ButtonHTMLAttributes', 'native'],
          ].map(([name, type, value]) => <article key={name}><code>{name}</code><span>{type}</span><span>{value}</span></article>)}
        </div>
      </section>

      <aside className="ds-review-note"><strong>Статус: In review</strong><p>Визуал, API, stories и автоматические проверки собраны. До статуса Beta требуется review Frontend Lead и проверка внутри продукта Cometal.</p></aside>
    </main>
  );
}

function ClickExample(props: ButtonProps) {
  const [count, setCount] = useState(0);
  return (
    <div className="ds-interaction-demo">
      <Button {...props} onClick={() => setCount((value) => value + 1)}>Добавить строку</Button>
      <output aria-live="polite">Нажатий: {count}</output>
    </div>
  );
}

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Нативная React-кнопка Cometal. Figma определяет визуальную модель; код — поведение и API; Storybook — живые состояния и проверки.',
      },
    },
  },
  args: {
    children: 'Продолжить',
    variant: 'primary',
    size: 'l',
    loading: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: buttonVariants, description: 'Визуальная роль действия.' },
    size: { control: 'inline-radio', options: buttonSizes, description: 'Размер: L 44px, M 36px, S 28px.' },
    loading: { control: 'boolean', description: 'Ожидание завершения действия.' },
    disabled: { control: 'boolean', description: 'Действие недоступно.' },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Обзор',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: () => <ButtonDocumentation />,
};

export const Playground: Story = {
  name: 'Песочница',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Продолжить' });
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    button.focus();
    await expect(button).toHaveFocus();
  },
};

export const Interaction: Story = {
  name: 'Поведение клика',
  args: { children: 'Добавить строку' },
  render: (args) => <ClickExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Добавить строку' }));
    await expect(canvas.getByText('Нажатий: 1')).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Продолжить' })).toBeDisabled();
  },
};

export const Loading: Story = {
  name: 'Loading',
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Продолжить' });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  },
};

export const IconOnly: Story = {
  name: 'Только иконка',
  args: { children: undefined, startIcon: <Arrow />, 'aria-label': 'Продолжить' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument();
  },
};
