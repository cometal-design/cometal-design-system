'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  InlineLink,
  Select,
  TextArea,
  Tooltip,
  tooltipPlacements,
  tooltipSizes,
} from '@cometal/react';
import type { TooltipPlacement, TooltipSize } from '@cometal/react';
import { ComponentPageStandard } from './component-page-standard';
import type { ComponentPageSection } from './component-page-standard';
import { ComponentPageSettings, ComponentPageSetting } from './component-page-settings';
import { ComponentPageExample } from './component-page-example';
import { CodeBlock } from './code-block';
import { components, statusLabels } from '../lib/registry';

const shortContent = 'Сохранить изменения';
const longContent =
  'Сохранённые изменения будут доступны участникам проекта. Проверьте данные перед отправкой документа на согласование.';
const placementLabels: Record<TooltipPlacement, string> = {
  'top-start': 'Top Start',
  'top-center': 'Top Center',
  'top-end': 'Top End',
  'bottom-start': 'Bottom Start',
  'bottom-center': 'Bottom Center',
  'bottom-end': 'Bottom End',
  left: 'Left',
  right: 'Right',
};

function tooltipCode(size: TooltipSize, placement: TooltipPlacement, content: string, disabled = false) {
  return `import { Button, Tooltip } from '@cometal/react';

export function Example() {
  return (
    <Tooltip size="${size}" placement="${placement}"
      content={${JSON.stringify(content)}}${disabled ? ' disabled' : ''}>
      <Button variant="secondary">Сохранить</Button>
    </Tooltip>
  );
}`;
}

function TooltipDemo({
  active,
  size = 'compact',
  placement = 'top-center',
  content = shortContent,
  disabled = false,
}: {
  active: boolean;
  size?: TooltipSize;
  placement?: TooltipPlacement;
  content?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!active || disabled) setOpen(false);
  }, [active, disabled]);
  return (
    <Tooltip
      size={size}
      placement={placement}
      content={content}
      disabled={disabled}
      open={active && open}
      onOpenChange={setOpen}
    >
      <Button variant="secondary">Сохранить</Button>
    </Tooltip>
  );
}

function TooltipSettings({ active }: { active: boolean }) {
  const [size, setSize] = useState<TooltipSize>('compact');
  const [placement, setPlacement] = useState<TooltipPlacement>('top-center');
  const [content, setContent] = useState(shortContent);
  const [disabled, setDisabled] = useState(false);
  const [generation, setGeneration] = useState(0);
  function reset() {
    setSize('compact');
    setPlacement('top-center');
    setContent(shortContent);
    setDisabled(false);
    setGeneration((value) => value + 1);
  }
  if (!active) return null;
  return (
    <ComponentPageSettings
      componentName="Tooltip"
      onReset={reset}
      preview={
        <TooltipDemo
          key={generation}
          active={active}
          size={size}
          placement={placement}
          content={content}
          disabled={disabled}
        />
      }
      code={tooltipCode(size, placement, content, disabled)}
      note="Tooltip открывается наведением или фокусом на кнопке. API defaults: compact / top-start / disabled=false; open первоначально false. В этом примере явно выбран top-center; Reset восстанавливает эту конфигурацию примера."
    >
      <ComponentPageSetting
        name="size"
        type="compact | wide"
        defaultValue="compact"
        description="Compact — одна строка; Wide переносит длинный текст и растёт по содержимому."
      >
        <Select
          label="Размер"
          size="m"
          value={size}
          options={tooltipSizes.map((item) => ({
            value: item,
            label: item === 'compact' ? 'Compact' : 'Wide',
          }))}
          onValueChange={(value) => setSize(value === 'wide' ? 'wide' : 'compact')}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="placement"
        type="TooltipPlacement"
        defaultValue="top-start"
        description="Предпочитаемая позиция. Если места мало, shared Tooltip выбирает fallback и сдвиг в viewport."
      >
        <Select
          label="Положение"
          size="m"
          value={placement}
          options={tooltipPlacements.map((item) => ({ value: item, label: placementLabels[item] }))}
          onValueChange={(value) => {
            const next = tooltipPlacements.find((item) => item === value);
            if (next) setPlacement(next);
          }}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="content"
        type="ReactNode"
        defaultValue="обязательное"
        description="Дополнительное объяснение. В примере — текст; не размещайте интерактивные элементы."
      >
        <TextArea
          label="Текст подсказки"
          size="m"
          rows={3}
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="disabled"
        type="boolean"
        defaultValue="false"
        description="Отключает только подсказку, не сам trigger."
      >
        <Checkbox
          label="Отключить подсказку"
          checked={disabled}
          onChange={(event) => setDisabled(event.currentTarget.checked)}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="children"
        type="ReactElement"
        defaultValue="обязательное"
        description="Один trigger, поддерживающий ref и события. Здесь — системный Button с собственным доступным именем."
      >
        <p>
          Текст кнопки остаётся понятным без Tooltip. Не оборачивайте недоступный trigger, ожидая keyboard
          focus.
        </p>
      </ComponentPageSetting>
      <ComponentPageSetting
        name="open / defaultOpen / onOpenChange"
        type="boolean / callback"
        defaultValue="false"
        description="Controlled или uncontrolled раскрытие; hover и focus учитываются совместно."
      >
        <p>
          Сниппет использует обычное uncontrolled поведение. Контроллер страницы закрывает Tooltip при смене
          раздела и Reset.
        </p>
      </ComponentPageSetting>
    </ComponentPageSettings>
  );
}

export function TooltipDetail() {
  const component = components.find((item) => item.id === 'overlay.tooltip')!;
  const [section, setSection] = useState<ComponentPageSection>('overview');
  const active = section === 'overview';
  const overview = (
    <>
      <section className="content-section" aria-label="Представление Tooltip">
        <div className="component-standard-presentation">
          <TooltipDemo active={active} />
        </div>
      </section>
      <section className="content-section" id="usage">
        <h2>Использование</h2>
        <p>
          Короткое пояснение к понятному trigger. Наведите указатель или переведите фокус на кнопку, чтобы
          открыть подсказку.
        </p>
        <CodeBlock
          code="import { Button, Tooltip } from '@cometal/react';"
          copyName="импорт Tooltip"
          compact
        />
      </section>
      <section className="content-section" id="composition">
        <h2>Композиция</h2>
        <table className="component-standard-table">
          <thead>
            <tr>
              <th>Элемент</th>
              <th>Назначение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Trigger</th>
              <td>Один доступный элемент с понятным именем.</td>
            </tr>
            <tr>
              <th>Surface и arrow</th>
              <td>
                Shared Tooltip в body portal; inverse surface, стрелка и расстояние до trigger принадлежат
                компоненту.
              </td>
            </tr>
            <tr>
              <th>Compact / Wide</th>
              <td>
                Compact — одна строка и ограничение viewport. Wide — ширина до 240px, min-height 44px и
                автоматическая высота при переносе.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="content-section" id="boundaries">
        <h2>Правила использования</h2>
        <table className="component-standard-table component-standard-practices-table">
          <thead>
            <tr>
              <th>Статус</th>
              <th>Тезис</th>
              <th>Объяснение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Badge tone="green">Do</Badge>
              </td>
              <th>Дополнить контекст</th>
              <td>Коротко поясните действие, термин или усечённый текст.</td>
            </tr>
            <tr>
              <td>
                <Badge tone="red">Don’t</Badge>
              </td>
              <th>Скрыть важное</th>
              <td>
                Не прячьте ошибки, обязательные инструкции, единственное имя кнопки или ссылки. Для действий
                нужен Context Menu или другое интерактивное раскрытие.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="content-section" id="examples">
        <h2>Примеры</h2>
        <div className="component-standard-examples">
          <ComponentPageExample
            title="Короткая подсказка"
            description="Compact появляется при hover или keyboard focus. Escape закрывает подсказку, не активируя кнопку."
            preview={<TooltipDemo active={active} />}
            code={tooltipCode('compact', 'top-center', shortContent)}
          />
          <ComponentPageExample
            title="Длинное пояснение"
            description="Wide переносит текст, высота не зафиксирована. В узком viewport panel остаётся внутри доступной области."
            preview={<TooltipDemo active={active} size="wide" content={longContent} />}
            code={tooltipCode('wide', 'top-center', longContent)}
          />
          {tooltipPlacements.map((placement) => (
            <ComponentPageExample
              key={placement}
              title={placementLabels[placement]}
              description={`Предпочтительное placement="${placement}". Откройте реальный Tooltip; collision fallback может изменить итоговую сторону.`}
              preview={<TooltipDemo active={active} placement={placement} />}
              code={tooltipCode('compact', placement, shortContent)}
            />
          ))}
          <ComponentPageExample
            title="Подсказка отключена"
            description="disabled отключает Tooltip; Button остаётся доступной кнопкой."
            preview={<TooltipDemo active={active} disabled />}
            code={tooltipCode('compact', 'top-center', shortContent, true)}
          />
        </div>
      </section>
    </>
  );
  const accessibility = (
    <div className="field-doc-accessibility">
      <section className="content-section">
        <h2>Клавиатура и фокус</h2>
        <p>
          Tab ставит фокус на trigger; Tooltip открывается без перевода фокуса в panel. Escape закрывает.
          Hover и focus учитываются совместно: уход указателя не скрывает подсказку, пока trigger в фокусе.
          Panel остаётся доступной для наведения.
        </p>
      </section>
      <section className="content-section">
        <h2>Семантика и имя</h2>
        <p>
          Panel имеет role=tooltip и связана с trigger через aria-describedby при раскрытии. Trigger обязан
          иметь своё имя: Tooltip его дополняет, не заменяет. Внутри не должно быть buttons, links или других
          focusable controls.
        </p>
      </section>
      <section className="content-section">
        <h2>Адаптация и ограничения</h2>
        <p>
          Восемь placements — предпочтения, а не гарантия стороны при нехватке места. Body portal следует за
          trigger при scroll/resize; используйте Wide для переноса длинного текста. Не полагайтесь на hover
          как единственный способ донести обязательную информацию на touch-устройствах.
        </p>
      </section>
      <section className="content-section">
        <h2>Темы и проверка</h2>
        <p>
          Текст, inverse surface и focus trigger используют текущие semantic tokens. Отдельного theme prop
          нет. Примеры показывают текущий React contract, не заявляют универсальный visual MATCH или
          сертификацию screen reader.
        </p>
        <InlineLink href="https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/" target="_blank" rel="noreferrer">
          WAI: Tooltip pattern ↗
        </InlineLink>
      </section>
    </div>
  );
  return (
    <ComponentPageStandard
      title="Tooltip"
      summary="Короткое дополнительное пояснение при наведении или фокусе."
      stableId="overlay.tooltip"
      reactExport="Tooltip"
      status={component.status}
      statusLabel={statusLabels[component.status]}
      figmaHref={component.links.figma}
      storybookHref={component.links.storybook}
      sourceHref={`https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`}
      overview={overview}
      settings={<TooltipSettings active={section === 'settings'} />}
      accessibility={accessibility}
      onSectionChange={setSection}
    />
  );
}
