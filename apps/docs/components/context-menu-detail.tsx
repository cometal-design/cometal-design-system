'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  InlineLink,
  Select,
  Switch,
} from '@cometal/react';
import type { ContextMenuSize } from '@cometal/react';
import { components, statusLabels } from '../lib/registry';
import { CodeBlock } from './code-block';
import { ComponentPageExample } from './component-page-example';
import { ComponentPageSetting, ComponentPageSettings } from './component-page-settings';
import { ComponentPageStandard } from './component-page-standard';

const component = components.find((item) => item.id === 'overlay.context-menu')!;
const sourceHref = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/ContextMenu/ContextMenu.tsx';
type MenuAnchor = 'trigger' | 'pointer';

const sizeOptions = [{ value: 'l', label: 'L' }, { value: 'm', label: 'M' }, { value: 's', label: 'S' }];
const anchorOptions = [{ value: 'trigger', label: 'Trigger' }, { value: 'pointer', label: 'Pointer' }];

function MenuItems({ selected = false, danger = false }: { selected?: boolean; danger?: boolean }) {
  return (
    <>
      <ContextMenuItem>Открыть</ContextMenuItem>
      <ContextMenuItem>Переименовать</ContextMenuItem>
      <ContextMenuItem selected={selected}>Закрепить</ContextMenuItem>
      <ContextMenuItem disabled>Недоступно</ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem tone={danger ? 'danger' : 'default'}>Удалить</ContextMenuItem>
    </>
  );
}

function ContextMenuSettings({ activeMenu, setActiveMenu }: { activeMenu: string | null; setActiveMenu: (value: string | null) => void }) {
  const [size, setSize] = useState<ContextMenuSize>('m');
  const [anchor, setAnchor] = useState<MenuAnchor>('trigger');
  const [selected, setSelected] = useState(false);
  const [danger, setDanger] = useState(false);
  const [clickOpens, setClickOpens] = useState(true);
  const [contextOpens, setContextOpens] = useState(true);
  const code = `import { Button, ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';

export function RowActions() {
  return (
    <ContextMenu
      size=${JSON.stringify(size)}
      anchor=${JSON.stringify(anchor)}
      clickOpens={${clickOpens}}
      contextOpens={${contextOpens}}
      trigger={<Button size="m" variant="secondary">Действия</Button>}
    >
      <ContextMenuItem>Открыть</ContextMenuItem>
      <ContextMenuItem>Переименовать</ContextMenuItem>
      <ContextMenuItem${selected ? ' selected' : ''}>Закрепить</ContextMenuItem>${danger ? `
      <ContextMenuItem disabled>Недоступно</ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem tone="danger">Удалить</ContextMenuItem>` : `
      <ContextMenuItem disabled>Недоступно</ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem>Удалить</ContextMenuItem>`}
    </ContextMenu>
  );
}`;

  function reset() {
    setSize('m');
    setAnchor('trigger');
    setSelected(false);
    setDanger(false);
    setClickOpens(true);
    setContextOpens(true);
    setActiveMenu(null);
  }

  const preview = (
    <ContextMenu size={size} anchor={anchor} clickOpens={clickOpens} contextOpens={contextOpens} open={activeMenu === 'settings'} onOpenChange={(open) => setActiveMenu(open ? 'settings' : null)} trigger={<Button size="m" variant="secondary">Действия</Button>}>
      <MenuItems selected={selected} danger={danger} />
    </ContextMenu>
  );

  return (
    <section className="content-section component-standard-settings-section">
      <ComponentPageSettings componentName="Context Menu" preview={preview} code={code} onReset={reset} note={<>Меню рендерится в <code>document.body</code> и открывается только после действия пользователя. Невидимая вкладка документации не оставляет portal surface.</>}>
        <ComponentPageSetting name="size" type="'l' | 'm' | 's'" defaultValue="'m'" description="Общий размер surface и пунктов."><Select label="Размер" size="m" options={sizeOptions} value={size} onValueChange={(value) => { setSize(value as ContextMenuSize); setActiveMenu(null); }} /></ComponentPageSetting>
        <ComponentPageSetting name="anchor" type="'trigger' | 'pointer'" defaultValue="'trigger'" description="Опорная область для позиционирования overlay."><Select label="Привязка" size="m" options={anchorOptions} value={anchor} onValueChange={(value) => { setAnchor(value as MenuAnchor); setActiveMenu(null); }} /></ComponentPageSetting>
        <ComponentPageSetting name="ContextMenuItem.selected" type="boolean" defaultValue="false" description="Selected пункт объявляется как menuitemcheckbox."><Switch label="Пункт «Закрепить» выбран" size="m" checked={selected} onChange={(event) => setSelected(event.currentTarget.checked)} /></ComponentPageSetting>
        <ComponentPageSetting name="ContextMenuItem.tone" type="'default' | 'danger'" defaultValue="'default'" description="Danger выделяет разрушительное действие."><Switch label="Danger для пункта «Удалить»" size="m" checked={danger} onChange={(event) => setDanger(event.currentTarget.checked)} /></ComponentPageSetting>
        <ComponentPageSetting name="clickOpens" type="boolean" defaultValue="true" description="Разрешает открытие обычным click по trigger."><Switch label="Открывать по клику" size="m" checked={clickOpens} onChange={(event) => { setClickOpens(event.currentTarget.checked); setActiveMenu(null); }} /></ComponentPageSetting>
        <ComponentPageSetting name="contextOpens" type="boolean" defaultValue="true" description="Разрешает открытие событием contextmenu."><Switch label="Открывать контекстным действием" size="m" checked={contextOpens} onChange={(event) => { setContextOpens(event.currentTarget.checked); setActiveMenu(null); }} /></ComponentPageSetting>
      </ComponentPageSettings>
    </section>
  );
}

const menuCode = `import { Button, ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';

export function RowActions() {
  return (
    <ContextMenu trigger={<Button size="m" variant="secondary">Действия</Button>}>
      <ContextMenuItem>Открыть</ContextMenuItem>
      <ContextMenuItem>Переименовать</ContextMenuItem>
      <ContextMenuItem selected>Закрепить</ContextMenuItem>
      <ContextMenuItem disabled>Недоступно</ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem tone="danger">Удалить</ContextMenuItem>
    </ContextMenu>
  );
}`;

const sizesMenuCode = `import { Button, ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';

export function ContextMenuSizes() {
  return (
    <div>
      {(['l', 'm', 's'] as const).map((size) => (
        <ContextMenu
          key={size}
          size={size}
          trigger={<Button size="m" variant="secondary">{\`Открыть \${size.toUpperCase()}\`}</Button>}
        >
          <ContextMenuItem>Открыть</ContextMenuItem>
          <ContextMenuItem>Переименовать</ContextMenuItem>
          <ContextMenuItem>Закрепить</ContextMenuItem>
          <ContextMenuItem disabled>Недоступно</ContextMenuItem>
          <ContextMenuDivider />
          <ContextMenuItem>Удалить</ContextMenuItem>
        </ContextMenu>
      ))}
    </div>
  );
}`;

export function ContextMenuDetail() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const controlledMenu = (id: string, size: ContextMenuSize, label: string, selected = false, danger = false) => (
    <ContextMenu size={size} open={activeMenu === id} onOpenChange={(open) => setActiveMenu(open ? id : null)} trigger={<Button size="m" variant="secondary">{label}</Button>}>
      <MenuItems selected={selected} danger={danger} />
    </ContextMenu>
  );

  const overview = (
    <>
      <section className="content-section" data-component-phase="overview" aria-labelledby="context-menu-preview-title">
        <div className="component-standard-presentation"><h2 className="visually-hidden" id="context-menu-preview-title">Пример Context Menu</h2>{controlledMenu('hero', 'm', 'Открыть меню')}</div>
      </section>
      <section className="content-section" aria-labelledby="context-menu-usage-title">
        <header className="section-heading"><h2 id="context-menu-usage-title">Использование</h2><p>Импортируйте menu surface, пункты и разделитель; trigger остаётся видимым системным элементом.</p></header>
        <CodeBlock code="import { ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';" copyName="импорт Context Menu" compact />
      </section>
      <section className="content-section" aria-labelledby="context-menu-composition-title">
        <header className="section-heading"><h2 id="context-menu-composition-title">Композиция</h2></header>
        <table className="component-standard-table"><caption className="visually-hidden">Элементы композиции Context Menu</caption><thead><tr><th scope="col">Элемент</th><th scope="col">Назначение</th></tr></thead><tbody>
          <tr><th scope="row">Trigger</th><td>Видимый Button или IconButton с aria-haspopup, aria-expanded и aria-controls.</td></tr>
          <tr><th scope="row">Surface</th><td>Portal menu, привязанный к trigger или координатам pointer.</td></tr>
          <tr><th scope="row">Item</th><td>Короткое действие; selected, disabled и danger передают состояние и смысл.</td></tr>
          <tr><th scope="row">Divider</th><td>Разделяет смысловые группы, но не получает фокус.</td></tr>
        </tbody></table>
      </section>
      <section className="content-section" data-component-phase="usage" aria-labelledby="context-menu-rules-title">
        <header className="section-heading"><h2 id="context-menu-rules-title">Правила использования</h2></header>
        <table className="component-standard-table component-standard-practices-table"><caption className="visually-hidden">Правила использования Context Menu</caption><thead><tr><th scope="col">Статус</th><th scope="col">Тезис</th><th scope="col">Объяснение</th></tr></thead><tbody>
          <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Ясный объект</th><td>Показывайте короткие вторичные действия над конкретной строкой, файлом или сущностью.</td></tr>
          <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Доступный путь</th><td>Оставляйте видимый trigger, если действие важно и для keyboard/touch пользователей.</td></tr>
          <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Основная навигация</th><td>Не заменяйте меню сайта или единственный путь к критичному действию.</td></tr>
          <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Сложная форма</th><td>Не помещайте внутрь длинные объяснения и многошаговый ввод.</td></tr>
        </tbody></table>
      </section>
      <section className="content-section component-standard-examples-section" data-component-phase="visual-contract" aria-labelledby="context-menu-examples-title">
        <header className="section-heading"><h2 id="context-menu-examples-title">Примеры</h2><p>Меню закрыты при загрузке; откройте один размер, чтобы сравнить surface и высоту item.</p></header>
        <div className="component-standard-examples">
          <ComponentPageExample title="Состояния пунктов" description="Selected, disabled, divider и danger используют публичные ContextMenu subcomponents." code={menuCode} preview={controlledMenu('states', 'm', 'Показать состояния', true, true)} />
          <ComponentPageExample title="Размеры L, M и S" description="Высота item — 48, 40 и 32px; состав действий одинаков во всех примерах." code={sizesMenuCode} preview={<div className="component-standard-menu-sizes">{(['l', 'm', 's'] as const).map((size) => <article key={size}><code>{size.toUpperCase()}</code>{controlledMenu(`size-${size}`, size, `Открыть ${size.toUpperCase()}`)}</article>)}</div>} />
        </div>
      </section>
    </>
  );

  const accessibility = (
    <>
      <section className="content-section component-standard-accessibility" data-component-phase="behavior-a11y" aria-labelledby="context-menu-keyboard-title">
        <header className="section-heading"><h2 id="context-menu-keyboard-title">Клавиатура</h2><p>При keyboard-открытии фокус переходит на первый доступный пункт.</p></header>
        <table className="component-standard-table"><caption className="visually-hidden">Клавиатурное управление Context Menu</caption><thead><tr><th scope="col">Клавиша</th><th scope="col">Результат</th></tr></thead><tbody>
          <tr><th scope="row">Enter / Space</th><td>Открывает menu из trigger и переводит фокус на доступный item.</td></tr>
          <tr><th scope="row">Arrow Up / Down</th><td>Циклически перемещает фокус и пропускает disabled пункты.</td></tr>
          <tr><th scope="row">Home / End</th><td>Переходит к первому или последнему доступному действию.</td></tr>
          <tr><th scope="row">Escape</th><td>Закрывает menu и возвращает фокус trigger.</td></tr>
        </tbody></table>
      </section>
      <section className="content-section component-standard-accessibility" aria-labelledby="context-menu-semantics-title">
        <header className="section-heading"><h2 id="context-menu-semantics-title">Имя, состояние и dismiss</h2><p>Portal surface сохраняет связь с trigger и закрывается предсказуемо.</p></header>
        <table className="component-standard-table"><caption className="visually-hidden">Семантика Context Menu</caption><thead><tr><th scope="col">Проверка</th><th scope="col">Контракт</th></tr></thead><tbody>
          <tr><th scope="row">Menu</th><td><code>role="menu"</code> получает имя от trigger; пункты используют menuitem или menuitemcheckbox.</td></tr>
          <tr><th scope="row">Состояние</th><td>Trigger отражает open через <code>aria-expanded</code>; selected item — через <code>aria-checked</code>.</td></tr>
          <tr><th scope="row">Dismiss</th><td>Выбор, Escape, pointer down снаружи или resize закрывают overlay; scroll пересчитывает позицию.</td></tr>
          <tr><th scope="row">Viewport</th><td>Surface сдвигается или переворачивается внутри доступной области и не зависит от overflow предка.</td></tr>
        </tbody></table>
        <p className="component-standard-sources"><InlineLink href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" target="_blank" rel="noreferrer">WAI-ARIA APG: Menu Button ↗</InlineLink><InlineLink href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" target="_blank" rel="noreferrer">WCAG: видимый фокус ↗</InlineLink></p>
      </section>
    </>
  );

  return <ComponentPageStandard title="Context Menu" summary="Показывает короткие контекстные действия над сущностью из trigger или pointer anchor." status={component.status} statusLabel={statusLabels[component.status]} stableId="overlay.context-menu" reactExport="ContextMenu · ContextMenuItem · ContextMenuDivider" figmaHref={component.links.figma} storybookHref="/storybook/?path=/story/components-context-menu--overview" sourceHref={sourceHref} overview={overview} settings={<ContextMenuSettings activeMenu={activeMenu} setActiveMenu={setActiveMenu} />} accessibility={accessibility} onSectionChange={() => setActiveMenu(null)} />;
}
