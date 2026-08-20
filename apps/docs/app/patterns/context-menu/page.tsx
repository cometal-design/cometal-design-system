import { ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';

export default function ContextMenuPatternPage() {
  return (
    <main>
      <section>
        <p>Паттерн</p>
        <h1>Context Menu</h1>
        <p>
          Context Menu описывает действия над объектом в точке контекста: pointer anchor, keyboard navigation и
          size-specific menu items.
        </p>
      </section>

      <section style={{ paddingTop: 32 }}>
        <ContextMenu
          defaultOpen
          trigger={<button style={{ padding: '12px 16px' }}>Открыть context menu</button>}
        >
          <ContextMenuItem>Открыть</ContextMenuItem>
          <ContextMenuItem>Переименовать</ContextMenuItem>
          <ContextMenuDivider />
          <ContextMenuItem selected>Закрепить</ContextMenuItem>
          <ContextMenuItem tone="danger">Удалить</ContextMenuItem>
        </ContextMenu>
      </section>
    </main>
  );
}
