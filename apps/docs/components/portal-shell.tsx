'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconButton } from '@cometal/react';
import { primaryNavigation, sectionNavigation } from '../lib/navigation';

function normalizePath(path: string) {
  return path === '/' ? path : path.replace(/\/+$/, '');
}

function currentSection(pathname: string) {
  const section = pathname.split('/').filter(Boolean)[0] ?? 'home';
  return section;
}

function isPrimaryItemActive(pathname: string, item: (typeof primaryNavigation)[number]) {
  if (item.external) return false;
  const section = currentSection(pathname);
  if (item.activeSections) return item.activeSections.includes(section);
  return pathname.startsWith(item.href);
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="menu-icon" data-open={open || undefined} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPathname = pathname ?? '/';
  const section = currentSection(currentPathname);
  const items = sectionNavigation[section] ?? [];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <div className="portal">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Cometal Design System — главная">
          <Image src="/cometal-favicon.svg" alt="" width={24} height={24} priority />
        </Link>

        <div className="topbar__group">
          <nav className="primary-nav" aria-label="Основные разделы">
            {primaryNavigation.map((item) => {
              const active = isPrimaryItemActive(currentPathname, item);
              return item.external ? (
                <a key={item.href} href={item.href} className="primary-nav__link primary-nav__link--playground">
                  {item.label}<span aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="primary-nav__link"
                  data-active={active || undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <IconButton
            className="menu-button"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
            icon={<MenuIcon open={menuOpen} />}
          />
        </div>

        <nav className="mobile-navigation" id="mobile-navigation" hidden={!menuOpen} aria-label="Основные разделы">
          {primaryNavigation.map((item) => {
            const active = isPrimaryItemActive(currentPathname, item);
            return item.external ? (
              <a key={item.href} href={item.href}>{item.label}<span aria-hidden="true">↗</span></a>
            ) : (
              <Link key={item.href} href={item.href} data-active={active || undefined} aria-current={active ? 'page' : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="portal-body" data-has-sidebar={items.length > 0 || undefined}>
        {items.length > 0 ? (
          <aside className="section-sidebar">
            <nav className="section-nav" aria-label="Навигация раздела">
              {items.map((item) => {
                const itemPath = normalizePath(item.href);
                const currentPath = normalizePath(currentPathname);
                const activePrefix = item.activePrefix ? normalizePath(item.activePrefix) : null;
                const active = currentPath === itemPath || Boolean(activePrefix && currentPath.startsWith(`${activePrefix}/`));
                return <Link key={item.href} href={item.href} data-active={active || undefined} aria-current={active ? 'page' : undefined}>{item.label}</Link>;
              })}
            </nav>
          </aside>
        ) : null}
        <div className="portal-content">{children}</div>
      </div>
    </div>
  );
}
