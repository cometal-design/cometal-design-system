'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Select, Switch, TextField } from '@cometal/react';
import type { ButtonSize, ButtonVariant } from '@cometal/react';
import ArrowRightIcon from '@cometal/react/icons/outline/arrows/arrow-right';
import HomeIcon from '@cometal/react/icons/outline/general/home-03';
import TrashIcon from '@cometal/react/icons/outline/general/trash-01';
import { CodeBlock } from './code-block';

type IconChoice = 'none' | 'home' | 'arrow-right' | 'trash';
type ButtonType = 'button' | 'submit' | 'reset';
type PreviewSurface = 'light' | 'inverse';

const variantOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'link', label: 'Link' },
  { value: 'danger', label: 'Danger' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'inverse', label: 'Inverse' },
  { value: 'inverse-ghost', label: 'Inverse Ghost' },
];

const sizeOptions = [
  { value: 'l', label: 'L · 48 px' },
  { value: 'm', label: 'M · 40 px' },
  { value: 's', label: 'S · 32 px' },
];

const iconOptions = [
  { value: 'none', label: 'Нет' },
  { value: 'home', label: 'Home 03' },
  { value: 'arrow-right', label: 'Arrow right' },
  { value: 'trash', label: 'Trash 01' },
];

const typeOptions = [
  { value: 'button', label: 'button' },
  { value: 'submit', label: 'submit' },
  { value: 'reset', label: 'reset' },
];

const surfaceOptions = [
  { value: 'light', label: 'Светлая' },
  { value: 'inverse', label: 'Контрастная' },
];

const iconImports: Record<Exclude<IconChoice, 'none'>, { name: string; path: string }> = {
  home: { name: 'HomeIcon', path: '@cometal/react/icons/outline/general/home-03' },
  'arrow-right': { name: 'ArrowRightIcon', path: '@cometal/react/icons/outline/arrows/arrow-right' },
  trash: { name: 'TrashIcon', path: '@cometal/react/icons/outline/general/trash-01' },
};

function renderIcon(choice: IconChoice) {
  if (choice === 'home') return <HomeIcon />;
  if (choice === 'arrow-right') return <ArrowRightIcon />;
  if (choice === 'trash') return <TrashIcon />;
  return undefined;
}

function PropertyRow({
  name,
  type,
  defaultValue,
  description,
  children,
}: {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="button-settings__property" data-property={name}>
      <div className="button-settings__property-copy">
        <strong><code>{name}</code></strong>
        <span><code>{type}</code> · Default: <code>{defaultValue}</code></span>
        <p>{description}</p>
      </div>
      <div className="button-settings__control">{children}</div>
    </div>
  );
}

function createButtonCode({
  variant,
  size,
  disabled,
  loading,
  type,
  children,
  startIcon,
  endIcon,
  ariaLabel,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  loading: boolean;
  type: ButtonType;
  children: string;
  startIcon: IconChoice;
  endIcon: IconChoice;
  ariaLabel: string;
}) {
  const selectedIcons = Array.from(new Set([startIcon, endIcon].filter((icon): icon is Exclude<IconChoice, 'none'> => icon !== 'none')));
  const imports = [
    "import { Button } from '@cometal/react';",
    ...selectedIcons.map((icon) => `import ${iconImports[icon].name} from '${iconImports[icon].path}';`),
  ].join('\n');
  const props = [
    `type=${JSON.stringify(type)}`,
    `variant=${JSON.stringify(variant)}`,
    `size=${JSON.stringify(size)}`,
    startIcon !== 'none' ? `startIcon={<${iconImports[startIcon].name} />}` : null,
    endIcon !== 'none' ? `endIcon={<${iconImports[endIcon].name} />}` : null,
    ariaLabel.trim() ? `aria-label={${JSON.stringify(ariaLabel.trim())}}` : null,
    disabled ? 'disabled' : null,
    loading ? 'loading' : null,
  ].filter(Boolean);
  const propLines = props.map((prop) => `      ${prop}`).join('\n');
  const content = children.trim()
    ? `\n    >\n      {${JSON.stringify(children)}}\n    </Button>`
    : '\n    />';

  return `${imports}\n\nexport function ButtonExample() {\n  return (\n    <Button\n${propLines}${content}\n  );\n}`;
}

export function ButtonSettings() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('l');
  const [children, setChildren] = useState('Продолжить');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<ButtonType>('button');
  const [startIcon, setStartIcon] = useState<IconChoice>('none');
  const [endIcon, setEndIcon] = useState<IconChoice>('none');
  const [ariaLabel, setAriaLabel] = useState('');
  const [surface, setSurface] = useState<PreviewSurface>('light');
  const [showCode, setShowCode] = useState(false);

  const iconOnly = !children.trim() && (startIcon !== 'none' || endIcon !== 'none');
  const effectiveAriaLabel = iconOnly ? ariaLabel.trim() || 'Действие' : ariaLabel.trim();
  const requiresInverseSurface = variant === 'ghost' || variant === 'inverse';
  const code = useMemo(() => createButtonCode({
    variant,
    size,
    disabled,
    loading,
    type,
    children,
    startIcon,
    endIcon,
    ariaLabel: effectiveAriaLabel,
  }), [children, disabled, effectiveAriaLabel, endIcon, loading, size, startIcon, type, variant]);

  function updateVariant(nextVariant: string) {
    const value = nextVariant as ButtonVariant;
    setVariant(value);
    if (value === 'ghost' || value === 'inverse') setSurface('inverse');
    else if (value === 'inverse-ghost') setSurface('light');
  }

  function updateChildren(nextChildren: string) {
    setChildren(nextChildren);
    if (!nextChildren.trim() && startIcon === 'none' && endIcon === 'none') setStartIcon('home');
  }

  function updateIcon(position: 'start' | 'end', nextIcon: string) {
    const value = nextIcon as IconChoice;
    if (position === 'start') setStartIcon(value);
    else setEndIcon(value);
    const otherIcon = position === 'start' ? endIcon : startIcon;
    if (value === 'none' && otherIcon === 'none' && !children.trim()) setChildren('Действие');
  }

  function reset() {
    setVariant('primary');
    setSize('l');
    setChildren('Продолжить');
    setDisabled(false);
    setLoading(false);
    setType('button');
    setStartIcon('none');
    setEndIcon('none');
    setAriaLabel('');
    setSurface('light');
    setShowCode(false);
  }

  return (
    <div className="button-settings">
      <section className="button-settings__preview-section" data-component-phase="code" aria-labelledby="button-settings-preview-title">
        <div className="button-settings__preview" data-surface={surface}>
          <Button
            type="button"
            size="s"
            variant="secondary"
            className="button-settings__code-toggle"
            aria-expanded={showCode}
            aria-controls="button-settings-code"
            onClick={() => setShowCode((visible) => !visible)}
          >
            {showCode ? 'Скрыть код' : 'Показать код'}
          </Button>
          <h2 className="visually-hidden" id="button-settings-preview-title">Предпросмотр Button</h2>
          <Button
            type={type}
            variant={variant}
            size={size}
            disabled={disabled}
            loading={loading}
            startIcon={renderIcon(startIcon)}
            endIcon={renderIcon(endIcon)}
            aria-label={effectiveAriaLabel || undefined}
          >
            {children.trim() ? children : undefined}
          </Button>
        </div>
        {showCode && <div className="button-settings__code" id="button-settings-code"><CodeBlock code={code} copyName="текущая конфигурация Button" /></div>}
      </section>

      <section className="button-settings__properties" data-component-phase="public-api" aria-labelledby="button-settings-properties-title">
        <div className="button-settings__properties-heading">
          <div><h2 id="button-settings-properties-title">Свойства</h2><p>Изменения сразу применяются к предпросмотру и коду.</p></div>
          <Button type="button" size="s" variant="secondary" onClick={reset}>Сбросить</Button>
        </div>

        <PropertyRow name="children" type="ReactNode" defaultValue="—" description="Видимая подпись. Пустая строка вместе с иконкой создаёт icon-only композицию.">
          <TextField label="Текст кнопки" size="m" value={children} onChange={(event) => updateChildren(event.currentTarget.value)} />
        </PropertyRow>
        <PropertyRow name="variant" type="ButtonVariant" defaultValue="'primary'" description="Смысл и визуальный приоритет действия.">
          <Select label="Вариант" size="m" options={variantOptions} value={variant} onValueChange={updateVariant} />
        </PropertyRow>
        <PropertyRow name="size" type="'l' | 'm' | 's'" defaultValue="'l'" description="Высота control scale: 48, 40 или 32 px.">
          <Select label="Размер" size="m" options={sizeOptions} value={size} onValueChange={(value) => setSize(value as ButtonSize)} />
        </PropertyRow>
        <PropertyRow name="disabled" type="boolean" defaultValue="false" description="Отключает действие и нативный keyboard focus.">
          <Switch label="Отключена" size="m" checked={disabled} onChange={(event) => setDisabled(event.currentTarget.checked)} />
        </PropertyRow>
        <PropertyRow name="loading" type="boolean" defaultValue="false" description="Показывает индикатор и блокирует повторное действие.">
          <Switch label="Загрузка" size="m" checked={loading} onChange={(event) => setLoading(event.currentTarget.checked)} />
        </PropertyRow>
        <PropertyRow name="startIcon" type="ReactNode" defaultValue="—" description="Декоративная иконка перед подписью.">
          <Select label="Иконка слева" size="m" options={iconOptions} value={startIcon} onValueChange={(value) => updateIcon('start', value)} />
        </PropertyRow>
        <PropertyRow name="endIcon" type="ReactNode" defaultValue="—" description="Декоративная иконка после подписи.">
          <Select label="Иконка справа" size="m" options={iconOptions} value={endIcon} onValueChange={(value) => updateIcon('end', value)} />
        </PropertyRow>
        <PropertyRow name="aria-label" type="string" defaultValue="—" description="Необязательное имя; обязательно для Button без видимой подписи.">
          <TextField
            label="Доступное имя"
            size="m"
            value={ariaLabel}
            helperText={iconOnly && !ariaLabel.trim() ? 'Пустое значение заменено на «Действие», чтобы сохранить доступное имя.' : iconOnly ? 'Обязательно для icon-only.' : 'Оставьте пустым, если видимая подпись уже описывает действие.'}
            onChange={(event) => setAriaLabel(event.currentTarget.value)}
          />
        </PropertyRow>
        <PropertyRow name="type" type="'button' | 'submit' | 'reset'" defaultValue="'button'" description="Нативный тип. Предпросмотр не находится внутри form и ничего не отправляет.">
          <Select label="Тип" size="m" options={typeOptions} value={type} onValueChange={(value) => setType(value as ButtonType)} />
        </PropertyRow>
        <PropertyRow name="preview surface" type="docs only" defaultValue="light" description="Поверхность документации, а не prop Button. Ghost и Inverse требуют контрастного фона.">
          <Select
            label="Поверхность превью"
            size="m"
            options={surfaceOptions.map((option) => ({ ...option, disabled: option.value === 'light' && requiresInverseSurface }))}
            value={surface}
            onValueChange={(value) => setSurface(value as PreviewSurface)}
          />
        </PropertyRow>
      </section>

      <p className="button-settings__note"><code>onClick</code>, form-атрибуты и остальные нативные button-атрибуты передаются без отдельного редактора. <code>@cometal/react</code> пока доступен внутри репозитория как workspace-зависимость; команда установки появится после публикации Beta.</p>
    </div>
  );
}
