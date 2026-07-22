import type { Metadata } from 'next';
import '@cometal/tokens/css';
import '@cometal/react/styles.css';
import './globals.css';
import { PortalShell } from '../components/portal-shell';

export const metadata: Metadata = {
  metadataBase: new URL('https://cometal-design-system-storybook.vercel.app'),
  title: { default: 'Cometal Design System', template: '%s — Cometal Design System' },
  description: 'Компоненты, правила, паттерны и техническая реализация дизайн-системы Cometal.',
  icons: { icon: '/cometal-favicon.svg' },
  openGraph: {
    title: 'Cometal Design System',
    description: 'Компоненты, правила, паттерны и техническая реализация дизайн-системы Cometal.',
    images: ['/cometal-storybook-card.png'],
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <PortalShell>{children}</PortalShell>
      </body>
    </html>
  );
}
