'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { primaryNavigation, sectionNavigation } from '../lib/navigation';

function currentSection(pathname: string) {
  const section = pathname.split('/').filter(Boolean)[0] ?? 'home';
  return section;
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const section = currentSection(pathname);
  const items = sectionNavigation[section] ?? [];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="portal">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Cometal Design System — главная">
          <Image src="/cometal-logotype.svg" alt="Cometal" width={132} height={28} priority />
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

        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}>
          <span>{menuOpen ? 'Закрыть' : 'Меню'}</span>
        </button>
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
            <nav aria-label="Навигация раздела">
              {items.map((item) => {
                const exact = item.href.endsWith('/') && !item.href.includes('#');
                const active = exact ? pathname === item.href : item.href.includes('#') ? false : pathname.startsWith(item.href);
                return <Link key={item.href} href={item.href} data-active={active || undefined}>{item.label}</Link>;
              })}
            </nav>
          </aside>
        ) : null}
        <div className="portal-content">{children}</div>
      </div>
    </div>
  );
}
