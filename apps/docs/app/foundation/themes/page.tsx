import type { Metadata } from 'next';
import inventory from '../../../../../packages/tokens/src/foundation.inventory.json';
import { FoundationSectionOverview } from '../../../components/foundation-section-overview';

export const metadata: Metadata = {
  title: 'Темы — Foundation',
  description: 'Архитектура и опубликованные темы Cometal.',
};

export default function FoundationThemesPage() {
  return (
    <FoundationSectionOverview
      eyebrow="FOUNDATION / ТЕМЫ"
      title="Темы"
      description="Каждая тема является отдельным режимом семантической коллекции и может развиваться независимо, не меняя API компонентов. Сейчас утверждена только основная тема Default."
      items={[
        {
          index: '01',
          title: 'Основная тема',
          description: 'Светлый режим Default с системными ролями текста, поверхностей и границ.',
          meta: `${inventory.figma.collections[1]?.modes ?? 1} опубликованный режим`,
          href: '/foundation/themes/default/',
        },
      ]}
    />
  );
}
