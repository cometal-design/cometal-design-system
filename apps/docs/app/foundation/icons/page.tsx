import type { Metadata } from 'next';
import icons from '../../../../../packages/tokens/src/icons.inventory.json';
import { FoundationSectionOverview } from '../../../components/foundation-section-overview';

export const metadata: Metadata = {
  title: 'Иконки — Foundation',
  description: 'Структура иконографики Cometal.',
};

export default function FoundationIconsPage() {
  return (
    <FoundationSectionOverview
      eyebrow="FOUNDATION / ИКОНКИ"
      title="Иконографика"
      description="Раздел будет расти вместе с платформенными библиотеками, правилами применения и API. Сейчас опубликован проверенный инвентарь и инженерный статус."
      items={[
        {
          index: '01',
          title: 'Каталог',
          description: 'Источники Figma, карта замены и граница готовности SVG-ресурсов и React API.',
          meta: `${icons.totalComponents.toLocaleString('ru-RU')} компонентов`,
          href: '/foundation/icons/catalog/',
        },
      ]}
    />
  );
}
