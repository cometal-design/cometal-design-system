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
- два явных режима: Read с построчным hover и Edit с hover/editing отдельной ячейки;
- Read не изменяет данные, не включает reorder и полностью исключает drag-column, а не показывает disabled-заглушку;
- Edit показывает drag-column, разрешает controlled reorder и переводит eligible TableCell в `editing`;
- функциональная панель Widget включает и скрывает всю строку итогов системной IconButton с канонической Outline-иконкой;
- в Edit сама TableCell автоматически становится `td[contenteditable][role=textbox]` без вложенного Input.

## Граница

Widget может содержать не только Table. Table может использоваться без Widget. Их связка появляется только на уровне Pattern.
