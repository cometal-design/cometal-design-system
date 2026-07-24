'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@cometal/react';
import { primaryNavigation, sectionNavigation } from '../lib/navigation';

function normalizePath(path: string) {
  return path === '/' ? path : path.replace(/\/+$/, '');
}

function currentSection(pathname: string) {
  const section = pathname.split('/').filter(Boolean)[0] ?? 'home';
  return section;
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" focusable="false" aria-hidden="true">
      <path d="M5.833 7.917 10 12.083l4.167-4.166" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const section = currentSection(pathname);
  const items = sectionNavigation[section] ?? [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    return new Set(items.filter((item) => item.children?.some((child) => normalizePath(pathname) === normalizePath(child.href))).map((item) => item.href));
  });

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const activeGroups = items
      .filter((item) => item.children?.some((child) => normalizePath(pathname) === normalizePath(child.href)))
      .map((item) => item.href);
    if (activeGroups.length === 0) return;
    setOpenGroups((current) => new Set([...current, ...activeGroups]));
  }, [items, pathname]);

  function toggleGroup(href: string) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

  return (
    <div className="portal">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Cometal Design System — главная">
          <Image src="/cometal-favicon.svg" alt="" width={24} height={24} priority />
        </Link>

        <nav className="primary-nav" aria-label="Основные разделы">
          {primaryNavigation.map((item) => {
            const active = item.external ? false : pathname.startsWith(item.href);
            return item.external ? (
              <a key={item.href} href={item.href} className="primary-nav__link primary-nav__link--playground">
                {item.label}<span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link key={item.href} href={item.href} className="primary-nav__link" data-active={active || undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          className="menu-button"
          variant="link"
          size="m"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? 'Закрыть' : 'Меню'}
        </Button>
      </header>

      <div className="mobile-navigation" id="mobile-navigation" hidden={!menuOpen}>
        {primaryNavigation.map((item) => item.external ? (
          <a key={item.href} href={item.href}>{item.label} ↗</a>
        ) : (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </div>

      <div className="portal-body" data-has-sidebar={items.length > 0 || undefined}>
        {items.length > 0 ? (
          <aside className="section-sidebar">
            <div className="section-sidebar__title">{primaryNavigation.find((item) => pathname.startsWith(item.href))?.label ?? 'Документация'}</div>
            <nav className="section-nav" aria-label="Навигация раздела">
              {items.map((item) => {
                const active = normalizePath(pathname) === normalizePath(item.href);
                if (!item.children?.length) {
                  return <Link key={item.href} href={item.href} data-active={active || undefined}>{item.label}</Link>;
                }

                const expanded = openGroups.has(item.href);
                const containsActive = item.children.some((child) => normalizePath(pathname) === normalizePath(child.href));
                const groupId = `section-group-${item.href.split('/').filter(Boolean).join('-')}`;

                return (
                  <div className="section-nav__group" key={item.href} data-current={containsActive || undefined}>
                    <div className="section-nav__parent">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={groupId}
                        aria-label={`${expanded ? 'Свернуть' : 'Раскрыть'} раздел «${item.label}»`}
                        onClick={() => toggleGroup(item.href)}
                      >
                        <span>{item.label}</span>
                        <ArrowDownIcon />
                      </button>
                    </div>
                    <div className="section-nav__children" id={groupId} hidden={!expanded} role="group" aria-label={item.label}>
                      {item.children.map((child) => {
                        const childActive = normalizePath(pathname) === normalizePath(child.href);
                        return <Link key={child.href} href={child.href} data-active={childActive || undefined}>{child.label}</Link>;
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </aside>
        ) : null}
        <div className="portal-content">{children}</div>
      </div>
    </div>
  );
}
