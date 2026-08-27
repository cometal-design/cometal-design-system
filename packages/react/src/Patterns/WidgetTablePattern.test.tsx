import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { WidgetTablePattern } from './WidgetTablePattern';

describe('WidgetTablePattern', () => {
  it('remains a thin Widget slot composition without owning Table internals', () => {
    const markup = renderToStaticMarkup(
      <WidgetTablePattern
        title="Спецификация"
        description="Контролируемая таблица"
        toolbar={<button type="button">Действие</button>}
        footer={<div>Пагинация</div>}
      >
        <table><tbody><tr><td>Строка</td></tr></tbody></table>
      </WidgetTablePattern>,
    );

    expect(markup).toContain('cometal-widget-table-pattern__table');
    expect(markup).toContain('cometal-widget-table-pattern__footer');
    expect(markup).toContain('Строка');
    expect(markup).toContain('Пагинация');
  });
});
