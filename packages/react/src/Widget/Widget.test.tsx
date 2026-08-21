import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Widget, WidgetContent, WidgetToolbar } from './Widget';

describe('Widget', () => {
  it('names the default region with its visible title and associates its description', () => {
    const html = renderToStaticMarkup(<Widget title="Спецификация" description="20 строк">Content</Widget>);
    expect(html).toContain('<section');
    expect(html).toMatch(/aria-labelledby="[^"]+-title"/);
    expect(html).toMatch(/aria-describedby="[^"]+-description"/);
    expect(html).toContain('>Спецификация</h2>');
    expect(html).toContain('>20 строк</p>');
  });

  it('omits optional description and toolbar without empty layout nodes', () => {
    const html = renderToStaticMarkup(<Widget title="Спецификация">Content</Widget>);
    expect(html).not.toContain('cometal-widget__description');
    expect(html).not.toContain('cometal-widget__toolbar');
  });

  it('keeps toolbar controls in document order', () => {
    const html = renderToStaticMarkup(<Widget title="Спецификация" toolbar={<><button>Фильтр</button><button>Добавить</button></>}>Content</Widget>);
    expect(html).toContain('role="toolbar"');
    expect(html).toContain('aria-label="Действия виджета"');
    expect(html.indexOf('Фильтр')).toBeLessThan(html.indexOf('Добавить'));
  });

  it('preserves nested content semantics', () => {
    const html = renderToStaticMarkup(<Widget title="Спецификация"><table aria-label="Позиции"><tbody><tr><td>POS-1</td></tr></tbody></table></Widget>);
    expect(html).toContain('<table aria-label="Позиции"');
    expect(html).toContain('<td>POS-1</td>');
  });

  it('supports a deliberate semantic root and stable IDs', () => {
    const html = renderToStaticMarkup(<Widget as="aside" title="Панель" titleId="panel-title">Content</Widget>);
    expect(html).toContain('<aside');
    expect(html).toContain('aria-labelledby="panel-title"');
    expect(html).toContain('id="panel-title"');
  });

  it('publishes content and toolbar primitives without altering children', () => {
    const html = renderToStaticMarkup(<><WidgetContent>Payload</WidgetContent><WidgetToolbar aria-label="Команды">Actions</WidgetToolbar></>);
    expect(html).toContain('cometal-widget__content">Payload');
    expect(html).toContain('role="toolbar"');
    expect(html).toContain('aria-label="Команды"');
  });
});
