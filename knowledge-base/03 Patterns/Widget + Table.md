# Widget + Table

- Status: In review
- Figma evidence: `2702:2265`
- Storybook: `patterns-widget-with-table--overview`
- Portal: `/patterns/widget-table/`

## Назначение

Рабочий бизнес-паттерн для табличного содержимого внутри универсального Widget. Он связывает toolbar с Table, но не меняет API и ответственность базовых компонентов.

## Состав

- канонический Widget shell;
- каноническая Table с двумя уровнями header;
- все Table source families, summary и paginator;
- toolbar actions из Widget source;
- 10 строк демонстрационного контента из Figma Review.

## Граница

Widget может содержать не только Table. Table может использоваться без Widget. Их связка появляется только на уровне Pattern.
