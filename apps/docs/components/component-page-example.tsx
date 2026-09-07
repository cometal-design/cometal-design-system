import type { ReactNode } from 'react';
import { CodeBlock } from './code-block';

export function ComponentPageExample({
  title,
  description,
  code,
  preview,
  surface = 'default',
}: {
  title: string;
  description: string;
  code: string;
  preview: ReactNode;
  surface?: 'default' | 'inverse';
}) {
  return (
    <article className="component-standard-example">
      <div className="component-standard-example__preview" data-surface={surface}>{preview}</div>
      <h3>{title}</h3>
      <p className="component-standard-example__description">{description}</p>
      <div className="component-standard-example__usage" aria-label={`${title}: пример использования`}>
        <CodeBlock code={code} copyName={`код примера «${title}»`} />
      </div>
    </article>
  );
}
