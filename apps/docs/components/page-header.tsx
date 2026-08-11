import type { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  stat?: {
    value: ReactNode;
    label: ReactNode;
  };
  className?: string;
  hasTabs?: boolean;
};

function HeaderCopy({ eyebrow, title, description }: Pick<PageHeaderProps, 'eyebrow' | 'title' | 'description'>) {
  return (
    <>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
}

export function PageHeader({ eyebrow, title, description, stat, className, hasTabs = false }: PageHeaderProps) {
  const classes = ['page-header', stat ? 'page-header--with-stat' : null, className].filter(Boolean).join(' ');

  return (
    <header className={classes} data-has-tabs={hasTabs || undefined}>
      {stat ? <div><HeaderCopy eyebrow={eyebrow} title={title} description={description} /></div> : <HeaderCopy eyebrow={eyebrow} title={title} description={description} />}
      {stat ? <div className="page-stat"><strong>{stat.value}</strong><span>{stat.label}</span></div> : null}
    </header>
  );
}
