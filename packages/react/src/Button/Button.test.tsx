import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ActionLink, Button, IconButton } from './Button';

describe('Button', () => {
  it('uses safe button semantics and default visual contract', () => {
    const html = renderToStaticMarkup(<Button>Продолжить</Button>);

    expect(html).toContain('type="button"');
    expect(html).toContain('data-variant="primary"');
    expect(html).toContain('data-size="l"');
    expect(html).toContain('Продолжить');
  });

  it('keeps native button attributes and selected visual options', () => {
    const html = renderToStaticMarkup(
      <Button variant="danger" size="s" name="delete" type="submit">
        Удалить
      </Button>,
    );

    expect(html).toContain('type="submit"');
    expect(html).toContain('name="delete"');
    expect(html).toContain('data-variant="danger"');
    expect(html).toContain('data-size="s"');
  });

  it('blocks interaction and exposes busy state while loading', () => {
    const html = renderToStaticMarkup(<Button loading>Сохранить</Button>);

    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('data-loading="true"');
    expect(html).toContain('cometal-button__loader');
    expect(html).toContain('viewBox="0 0 15 15"');
    expect(html).toContain('stroke-width="var(--cometal-primitive-stroke-140, 1.4)"');
    expect(html).toContain('vector-effect="non-scaling-stroke"');
    expect(html).toContain('Сохранить');
  });

  it('supports an accessible icon-only composition', () => {
    const html = renderToStaticMarkup(
      <Button aria-label="Добавить строку" startIcon={<span>+</span>} />,
    );

    expect(html).toContain('aria-label="Добавить строку"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('cometal-button__label');
  });

  it('keeps navigation semantics in the action-link composition', () => {
    const html = renderToStaticMarkup(
      <ActionLink href="/components/" variant="secondary">
        Компоненты
      </ActionLink>,
    );

    expect(html).toContain('<a');
    expect(html).toContain('href="/components/"');
    expect(html).toContain('data-cometal-component="action-link"');
    expect(html).toContain('data-variant="secondary"');
    expect(html).not.toContain('type="button"');
  });

  it('requires an accessible name for the icon-button composition', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="Открыть меню" icon={<span>+</span>} />,
    );

    expect(html).toContain('<button');
    expect(html).toContain('aria-label="Открыть меню"');
    expect(html).not.toContain('cometal-button__label');
  });
});
