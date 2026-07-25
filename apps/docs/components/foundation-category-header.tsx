'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { FoundationTab } from '../lib/navigation';

export function FoundationCategoryHeader({
  title,
  description,
  tabs = [],
  activeHref,
}: {
  title: string;
  description: string;
  tabs?: FoundationTab[];
  activeHref?: string;
}) {
  const tabsRef = useRef<HTMLElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const hasTabs = tabs.length > 1;

  useEffect(() => {
    if (!hasTabs) return;
    const tabsElement = tabsRef.current;
    const activeTabElement = activeTabRef.current;
    if (!tabsElement || !activeTabElement) return;

    const centeredLeft = activeTabElement.offsetLeft - ((tabsElement.clientWidth - activeTabElement.clientWidth) / 2);
    tabsElement.scrollTo({ left: Math.max(0, centeredLeft), behavior: 'auto' });
  }, [activeHref, hasTabs]);

  return (
    <>
      <header className="page-header foundation-category-header" data-has-tabs={hasTabs || undefined}>
        <span className="eyebrow">FOUNDATION</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {hasTabs ? (
        <nav className="foundation-tabs" ref={tabsRef} aria-label={`Разделы категории «${title}»`}>
          {tabs.map((tab) => {
            const active = tab.href === activeHref;
            return (
              <Link
                href={tab.href}
                key={tab.href}
                ref={active ? activeTabRef : undefined}
                data-active={active || undefined}
                aria-current={active ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </>
  );
}
