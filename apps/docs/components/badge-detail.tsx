'use client';

import { useState } from 'react';
import { Badge, InlineLink, Select, Switch, TextField } from '@cometal/react';
import type { BadgeSurface, BadgeTone } from '@cometal/react';
import CheckIcon from '@cometal/react/icons/filled/general/check-01-filled';
import { components, statusLabels } from '../lib/registry';
import { CodeBlock } from './code-block';
import { ComponentPageExample } from './component-page-example';
import { ComponentPageSetting, ComponentPageSettings } from './component-page-settings';
import { ComponentPageStandard } from './component-page-standard';

const badgeSurfaces: readonly BadgeSurface[] = ['light', 'dark'];
const badgeTones: readonly BadgeTone[] = ['neutral', 'blue', 'cyan', 'green', 'purple', 'red', 'violet', 'yellow'];
const badgeImport = "import { Badge } from '@cometal/react';";

const toneOptions = badgeTones.map((tone) => ({ value: tone, label: tone[0].toUpperCase() + tone.slice(1) }));
const surfaceOptions = badgeSurfaces.map((surface) => ({ value: surface, label: surface === 'light' ? 'Light' : 'Dark' }));

const tonesCode = `import { Badge } from '@cometal/react';

const tones = ['neutral', 'blue', 'cyan', 'green', 'purple', 'red', 'violet', 'yellow'] as const;

export function BadgeTones() {
  return (
    <div>
      {(['light', 'dark'] as const).map((surface) => (
        <div key={surface}>
          {tones.map((tone) => <Badge key={tone} surface={surface} tone={tone}>{tone}</Badge>)}
        </div>
      ))}
    </div>
  );
}`;

const compositionCode = `import { Badge } from '@cometal/react';
import CheckIcon from '@cometal/react/icons/filled/general/check-01-filled';

export function BadgeCompositions() {
  return (
    <div>
      <Badge>Статус</Badge>
      <Badge startIcon={<CheckIcon />}>Согласовано</Badge>
      <Badge endIcon={<CheckIcon />}>Согласовано</Badge>
      <Badge startIcon={<CheckIcon />} endIcon={<CheckIcon />}>Согласовано</Badge>
      <Badge aria-label="Согласовано" surface="dark" tone="green" startIcon={<CheckIcon />} />
    </div>
  );
}`;

function BadgeSettings() {
  const [label, setLabel] = useState('Согласовано');
  const [surface, setSurface] = useState<BadgeSurface>('light');
  const [tone, setTone] = useState<BadgeTone>('neutral');
  const [startIcon, setStartIcon] = useState(false);
  const [endIcon, setEndIcon] = useState(false);
  const [ariaLabel, setAriaLabel] = useState('');

  const hasText = label.trim().length > 0;
  const hasIcon = startIcon || endIcon;
  const effectiveStartIcon = !hasText && !hasIcon ? true : startIcon;
  const effectiveAriaLabel = hasText ? undefined : ariaLabel.trim() || 'Согласовано';
  const imports = [
    "import { Badge } from '@cometal/react';",
    effectiveStartIcon || endIcon ? "import CheckIcon from '@cometal/react/icons/filled/general/check-01-filled';" : null,
  ].filter(Boolean).join('\n');
  const props = [
    `surface=${JSON.stringify(surface)}`,
    `tone=${JSON.stringify(tone)}`,
    effectiveStartIcon ? 'startIcon={<CheckIcon />}' : null,
    endIcon ? 'endIcon={<CheckIcon />}' : null,
    effectiveAriaLabel ? `aria-label={${JSON.stringify(effectiveAriaLabel)}}` : null,
  ].filter(Boolean).join('\n      ');
  const code = `${imports}\n\nexport function BadgeExample() {\n  return (\n    <Badge\n      ${props}${hasText ? `\n    >\n      {${JSON.stringify(label)}}\n    </Badge>` : '\n    />'}\n  );\n}`;

  function reset() {
    setLabel('Согласовано');
    setSurface('light');
    setTone('neutral');
    setStartIcon(false);
    setEndIcon(false);
    setAriaLabel('');
  }

  return (
    <section className="content-section component-standard-settings-section">
      <ComponentPageSettings
        componentName="Badge"
        code={code}
        onReset={reset}
        preview={<Badge surface={surface} tone={tone} startIcon={effectiveStartIcon ? <CheckIcon /> : undefined} endIcon={endIcon ? <CheckIcon /> : undefined} aria-label={effectiveAriaLabel}>{hasText ? label : undefined}</Badge>}
        note={<><code>Badge</code> остаётся пассивным и имеет фиксированную высоту 24 px. <code>@cometal/react</code> пока используется как workspace-зависимость.</>}
      >
        <ComponentPageSetting name="children" type="ReactNode" defaultValue="—" description="Короткий видимый статус. Пустое значение вместе с иконкой создаёт icon-only композицию.">
          <TextField label="Текст Badge" size="m" value={label} onChange={(event) => setLabel(event.currentTarget.value)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="surface" type="'light' | 'dark'" defaultValue="'light'" description="Сила поверхности статуса.">
          <Select label="Поверхность" size="m" options={surfaceOptions} value={surface} onValueChange={(value) => setSurface(value as BadgeSurface)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="tone" type="BadgeTone" defaultValue="'neutral'" description="Смысловой цвет статуса.">
          <Select label="Тон" size="m" options={toneOptions} value={tone} onValueChange={(value) => setTone(value as BadgeTone)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="startIcon" type="ReactNode" defaultValue="—" description="Filled-иконка перед подписью.">
          <Switch label="Иконка слева" size="m" checked={effectiveStartIcon} onChange={(event) => setStartIcon(event.currentTarget.checked)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="endIcon" type="ReactNode" defaultValue="—" description="Filled-иконка после подписи; для icon-only используется одна иконка.">
          <Switch label="Иконка справа" size="m" checked={endIcon} onChange={(event) => setEndIcon(event.currentTarget.checked)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="aria-label" type="string" defaultValue="—" description="Обязательное доступное имя только для Badge без текста.">
          <TextField label="Доступное имя" size="m" value={ariaLabel} disabled={hasText} helperText={!hasText && !ariaLabel.trim() ? 'Используется безопасное имя «Согласовано».' : undefined} onChange={(event) => setAriaLabel(event.currentTarget.value)} />
        </ComponentPageSetting>
      </ComponentPageSettings>
    </section>
  );
}

export function BadgeDetail() {
  const component = components.find((item) => item.id === 'status.badge')!;
  const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`;

  const overview = (
    <>
      <section className="content-section" data-component-phase="overview" aria-labelledby="badge-preview-title">
        <div className="component-standard-presentation"><h2 className="visually-hidden" id="badge-preview-title">Пример Badge</h2><Badge tone="green" startIcon={<CheckIcon />}>Согласовано</Badge></div>
      </section>
      <section className="content-section" aria-labelledby="badge-usage-title">
        <header className="section-heading"><h2 id="badge-usage-title">Использование</h2><p>Импортируйте Badge и передайте короткую подпись статуса.</p></header>
        <CodeBlock code={badgeImport} copyName="импорт Badge" compact />
      </section>
      <section className="content-section" aria-labelledby="badge-composition-title">
        <header className="section-heading"><h2 id="badge-composition-title">Композиция</h2></header>
        <table className="component-standard-table"><caption className="visually-hidden">Элементы композиции Badge</caption><thead><tr><th scope="col">Элемент</th><th scope="col">Описание</th></tr></thead><tbody>
          <tr><th scope="row">Текст</th><td>Короткая подпись статуса или атрибута.</td></tr>
          <tr><th scope="row">Иконка слева</th><td>Необязательная filled-иконка перед текстом.</td></tr>
          <tr><th scope="row">Иконка справа</th><td>Необязательная filled-иконка после текста.</td></tr>
          <tr><th scope="row">Только иконка</th><td>Одна иконка в круге 24×24 с обязательным <code>aria-label</code>.</td></tr>
        </tbody></table>
      </section>
      <section className="content-section" data-component-phase="usage" aria-labelledby="badge-rules-title">
        <header className="section-heading"><h2 id="badge-rules-title">Правила использования</h2></header>
        <table className="component-standard-table component-standard-practices-table"><caption className="visually-hidden">Правила использования Badge</caption><thead><tr><th scope="col">Статус</th><th scope="col">Тезис</th><th scope="col">Объяснение</th></tr></thead><tbody>
          <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Короткий статус</th><td>Обозначайте состояние заявки, уровень риска или категорию.</td></tr>
          <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Текстовый смысл</th><td>Дополняйте цвет понятной подписью или доступным именем.</td></tr>
          <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Действие</th><td>Не используйте Badge как кнопку, ссылку или фильтр.</td></tr>
          <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Длинный текст</th><td>Не превращайте компактный статус в предложение.</td></tr>
        </tbody></table>
      </section>
      <section className="content-section component-standard-examples-section" data-component-phase="visual-contract" aria-labelledby="badge-examples-title">
        <header className="section-heading"><h2 id="badge-examples-title">Примеры</h2><p>Оба surface, восемь tone и поддержанные композиции используют реальный Badge.</p></header>
        <div className="component-standard-examples">
          <ComponentPageExample title="Поверхности и тона" description="Light снижает визуальный приоритет, Dark усиливает статусный акцент." code={tonesCode} preview={<div className="badge-tone-board component-standard-badge-tones">{badgeSurfaces.map((surface) => <article key={surface}><code>{surface}</code><div>{badgeTones.map((tone) => <Badge key={tone} surface={surface} tone={tone}>{tone}</Badge>)}</div></article>)}</div>} />
          <ComponentPageExample title="Состав" description="Текст и обе иконки независимы; icon-only сохраняет одну иконку и доступное имя." code={compositionCode} preview={<div className="badge-composition-row"><Badge>Статус</Badge><Badge startIcon={<CheckIcon />}>Согласовано</Badge><Badge endIcon={<CheckIcon />}>Согласовано</Badge><Badge startIcon={<CheckIcon />} endIcon={<CheckIcon />}>Согласовано</Badge><Badge aria-label="Согласовано" surface="dark" tone="green" startIcon={<CheckIcon />} /></div>} />
        </div>
      </section>
    </>
  );

  const accessibility = (
    <>
      <section className="content-section component-standard-accessibility" data-component-phase="behavior-a11y" aria-labelledby="badge-accessibility-semantics">
        <header className="section-heading"><h2 id="badge-accessibility-semantics">Семантика и имя</h2><p>Badge — неинтерактивная подпись, а не элемент управления.</p></header>
        <table className="component-standard-table"><caption className="visually-hidden">Семантика Badge</caption><thead><tr><th scope="col">Случай</th><th scope="col">Контракт</th></tr></thead><tbody>
          <tr><th scope="row">Текстовый Badge</th><td>Видимый текст передаёт смысл; отдельная роль или tab-stop не добавляются.</td></tr>
          <tr><th scope="row">Только иконка</th><td>Компонент получает <code>role="img"</code> и требует осмысленный <code>aria-label</code>.</td></tr>
          <tr><th scope="row">Декоративные иконки</th><td>Иконки рядом с текстом скрыты от дерева доступности.</td></tr>
          <tr><th scope="row">Клавиатура</th><td>Badge не получает фокус и не реагирует на Enter или Space.</td></tr>
        </tbody></table>
      </section>
      <section className="content-section component-standard-accessibility" aria-labelledby="badge-accessibility-color">
        <header className="section-heading"><h2 id="badge-accessibility-color">Цвет и контраст</h2><p>Цвет помогает различать статус, но не заменяет понятную подпись.</p></header>
        <table className="component-standard-table"><caption className="visually-hidden">Проверки цвета Badge</caption><thead><tr><th scope="col">Проверка</th><th scope="col">Что учитывать</th></tr></thead><tbody>
          <tr><th scope="row">Подпись</th><td>Проверьте контраст текста с фактической поверхностью Badge.</td></tr>
          <tr><th scope="row">Смысл</th><td>Одинаковый смысл должен оставаться понятным без различения tone.</td></tr>
          <tr><th scope="row">Icon-only</th><td>Если иконка передаёт смысл без текста, проверьте её нетекстовый контраст.</td></tr>
        </tbody></table>
        <p className="component-standard-sources"><InlineLink href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" target="_blank" rel="noreferrer">WCAG: использование цвета ↗</InlineLink><InlineLink href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" target="_blank" rel="noreferrer">WCAG: нетекстовый контраст ↗</InlineLink></p>
      </section>
    </>
  );

  return <ComponentPageStandard title="Badge" summary="Компактный неинтерактивный статус или атрибут с Light/Dark surface и восемью смысловыми тонами." status={component.status} statusLabel={statusLabels[component.status]} stableId={component.id} reactExport="Badge" figmaHref={component.links.figma} storybookHref="/storybook/?path=/story/components-badge--playground" sourceHref={sourceHref} overview={overview} settings={<BadgeSettings />} accessibility={accessibility} />;
}
