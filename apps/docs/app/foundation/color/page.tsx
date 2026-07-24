import type { Metadata } from 'next';
import { FoundationSectionOverview } from '../../../components/foundation-section-overview';
import { groupBy, primitiveTokens, semanticTokens } from '../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Цвет — Foundation',
  description: 'Структура примитивной палитры и семантической карты цветов Cometal.',
};

const primitiveColors = primitiveTokens.filter((token) => token.type === 'color');
const semanticColors = semanticTokens.filter((token) => token.type === 'color');
const primitiveFamilies = groupBy(primitiveColors, (token) => token.name.split('/')[1] ?? 'Other');
const semanticGroups = groupBy(semanticColors, (token) => token.name.split('/')[1] ?? 'Other');

export default function FoundationColorPage() {
  return (
    <FoundationSectionOverview
      eyebrow="FOUNDATION / ЦВЕТ"
      title="Цветовая система"
      description="Цвет разделён на два уровня: Primitive хранит исходные значения, Semantic назначает им продуктовые роли. Компоненты используют только semantic-токены."
      items={[
        {
          index: '01',
          title: 'Примитивы',
          description: 'Техническая палитра: семейства, ступени и уровни прозрачности без продуктового смысла.',
          meta: `${primitiveColors.length} значений · ${primitiveFamilies.size} семейств`,
          href: '/foundation/color/primitives/',
        },
        {
          index: '02',
          title: 'Семантика',
          description: 'Устойчивые роли Button, Surface, Text, Icon, Border, Action, State и Status.',
          meta: `${semanticColors.length} ролей · ${semanticGroups.size} групп`,
          href: '/foundation/color/semantic/',
        },
      ]}
    />
  );
}
