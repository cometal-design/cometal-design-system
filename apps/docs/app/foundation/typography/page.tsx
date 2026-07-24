import type { Metadata } from 'next';
import typography from '../../../../../packages/tokens/src/typography.styles.json';
import { FoundationSectionOverview } from '../../../components/foundation-section-overview';

export const metadata: Metadata = {
  title: 'Типографика — Foundation',
  description: 'Платформенная архитектура типографики Cometal.',
};

export default function FoundationTypographyPage() {
  return (
    <FoundationSectionOverview
      eyebrow="FOUNDATION / ТИПОГРАФИКА"
      title="Типографика"
      description="Типографика организуется по платформам, потому что шрифты, метрики и системные ограничения Web, iOS и Android различаются. Сейчас утверждён и опубликован слой Web."
      items={[
        {
          index: '01',
          title: 'Web',
          description: 'Grtsk Peta: Display, Heading, Body, Control, Caption и Label с точными метриками из Figma.',
          meta: `${typography.styles.length} стилей`,
          href: '/foundation/typography/web/',
        },
      ]}
    />
  );
}
