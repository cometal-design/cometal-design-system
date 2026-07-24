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
      description="Каждая тема является отдельным mode семантической коллекции и может развиваться независимо, не меняя API компонентов. Сейчас утверждён только Default."
      items={[
        {
          index: '01',
          title: 'Default',
          description: 'Основной светлый режим с системными ролями текста, поверхностей и границ.',
          meta: `${inventory.figma.collections[1]?.modes ?? 1} опубликованный mode`,
          href: '/foundation/themes/default/',
        },
      ]}
    />
  );
}
