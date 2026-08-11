import { ActionLink } from '@cometal/react';

type ComponentPageHeaderProps = {
  eyebrow?: string;
  title: string;
  summary: string;
  status: string;
  statusLabel: string;
  figmaHref: string;
  playgroundHref: string;
};

export function ComponentPageHeader({
  eyebrow = 'КОМПОНЕНТ · WEB',
  title,
  summary,
  status,
  statusLabel,
  figmaHref,
  playgroundHref,
}: ComponentPageHeaderProps) {
  return (
    <header className="component-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{summary}</p>
      </div>
      <div className="component-title__toolbar">
        <span className="status component-title__status" data-status={status}>{statusLabel}</span>
        <div className="component-title__links">
          <ActionLink href={figmaHref} target="_blank" rel="noreferrer" variant="secondary">Figma ↗</ActionLink>
          <ActionLink href={playgroundHref} variant="secondary">Playground ↗</ActionLink>
        </div>
      </div>
    </header>
  );
}
