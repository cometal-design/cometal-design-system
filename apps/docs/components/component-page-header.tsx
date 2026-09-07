import { ActionLink, Badge } from '@cometal/react';
import type { ButtonSize } from '@cometal/react';
import type { ReactNode } from 'react';

type ComponentPageHeaderProps = {
  eyebrow?: string;
  title: string;
  summary: string;
  status: string;
  statusLabel: string;
  figmaHref: string;
  playgroundHref: string;
  playgroundLabel?: string;
  sourceHref?: string;
  linkSize?: ButtonSize;
  linksFirst?: boolean;
  statusAtTop?: boolean;
  hideEyebrow?: boolean;
  identityLabel?: ReactNode;
  compactSummary?: boolean;
  identityAfterSummary?: boolean;
  linksAtEnd?: boolean;
  toolbarStart?: ReactNode;
};

export function ComponentPageHeader({
  eyebrow = 'КОМПОНЕНТ · WEB',
  title,
  summary,
  status,
  statusLabel,
  figmaHref,
  playgroundHref,
  playgroundLabel = 'Playground ↗',
  sourceHref,
  linkSize,
  linksFirst = false,
  statusAtTop = false,
  hideEyebrow = false,
  identityLabel,
  compactSummary = false,
  identityAfterSummary = false,
  linksAtEnd = false,
  toolbarStart,
}: ComponentPageHeaderProps) {
  const links = (
    <div className="component-title__links">
      <ActionLink href={figmaHref} target="_blank" rel="noreferrer" variant="secondary" size={linkSize}>Figma ↗</ActionLink>
      <ActionLink href={playgroundHref} variant="secondary" size={linkSize}>{playgroundLabel}</ActionLink>
      {sourceHref ? <ActionLink href={sourceHref} target="_blank" rel="noreferrer" variant="secondary" size={linkSize}>GitHub ↗</ActionLink> : null}
    </div>
  );
  const statusBadge = <Badge className="component-title__status" tone={status === 'ready' ? 'green' : 'yellow'}>{statusLabel}</Badge>;
  const identity = identityLabel ? <div className="component-title__identity">{identityLabel}</div> : null;

  return (
    <header className="component-title" data-status-top={statusAtTop || undefined} data-compact-summary={compactSummary || undefined}>
      {statusAtTop ? <div className="component-title__topline" data-heading-row={hideEyebrow || undefined}>{hideEyebrow ? <h1>{title}</h1> : <span className="eyebrow">{eyebrow}</span>}{statusBadge}</div> : null}
      <div className={statusAtTop ? 'component-title__copy' : undefined}>
        {statusAtTop || hideEyebrow ? null : <span className="eyebrow">{eyebrow}</span>}
        {statusAtTop && hideEyebrow ? null : <h1>{title}</h1>}
        {identityAfterSummary ? null : identity}
        <p>{summary}</p>
        {identityAfterSummary ? identity : null}
      </div>
      <div className="component-title__toolbar" data-links-first={linksFirst || undefined} data-links-end={linksAtEnd || undefined} data-has-start={toolbarStart ? true : undefined}>
        {toolbarStart ? <div className="component-title__toolbar-start">{toolbarStart}</div> : null}
        {statusAtTop ? links : linksFirst ? links : statusBadge}
        {statusAtTop ? null : linksFirst ? statusBadge : links}
      </div>
    </header>
  );
}
