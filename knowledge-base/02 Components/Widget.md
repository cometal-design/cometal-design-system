# Widget

- ID: `template.widget` — legacy registry identity retained for compatibility
- Статус: In review
- Слой: Component
- Figma: Main `2702:2173`, Toolbar `2702:3`, Content slot `2702:21`
- Storybook: `components-widget--overview`

## Что это

Widget — универсальная оболочка для именованной области: обязательные title/content, optional description и consumer-owned toolbar. Она не знает, будет ли внутри Table, форма, график или другой утверждённый payload.

## Что принадлежит Widget

- Raised surface и Default border;
- outer radius 32 px;
- inset и section gap 24 px;
- header rhythm 16 px;
- toolbar gap и inner radius 8 px;
- доступная связь region → title → description;
- перенос toolbar без скрытия действий;
- отсутствие clipping для focus rings и overlays.

## Что не принадлежит Widget

- фильтры, refresh, export и add-record business behavior;
- состояния вложенной Table или формы;
- фиксированные размеры Figma documentation frames;
- Widget-specific hover/open/disabled variants;
- Table-owned tokens.

## Совместимость

Registry ID `template.widget` оставлен временно, чтобы не ломать существующие ссылки. Канонический маршрут теперь `/components/widget/`; `/templates/widget/` — redirect.

`Widget`, `WidgetContent` и `WidgetToolbar` образуют публичную component family. `WidgetToolbarIcon` сохранён только как deprecated compatibility export: новые toolbar actions собираются из `Button`/`IconButton` и generated icons. `WidgetTablePattern` относится к слою Pattern и не является вариантом Widget.

M8: `2702:2190` is Widget source context, `2702:2238` Main, `2702:3` Toolbar and `2702:21` Content slot. Generic Widget owns only shell and toolbar placement; the app-shared 120-row demo/controller and all Table state remain outside its API.
