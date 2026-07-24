import type { Metadata } from 'next';
import grid from '../../../../../packages/tokens/src/grid.presets.json';
import { FoundationSectionOverview } from '../../../components/foundation-section-overview';
import { primitiveTokens, semanticTokens } from '../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Размеры и сетки — Foundation',
  description: 'Структура spacing, size, radius, stroke и адаптивных сеток Cometal.',
};

function metricCount(kind: string) {
  return [...primitiveTokens, ...semanticTokens].filter((token) => token.name.startsWith(`${kind}/`)).length;
}

export default function FoundationLayoutPage() {
  return (
    <FoundationSectionOverview
      eyebrow="FOUNDATION / РАЗМЕРЫ И СЕТКИ"
      title="Пространственная система"
      description="Числовые шкалы, semantic-роли и адаптивные сетки разделены на самостоятельные страницы, чтобы каждый слой можно было развивать и версионировать независимо."
      items={[
        { index: '01', title: 'Отступы', description: 'Шкала расстояний и роли внутренних и внешних отступов.', meta: `${metricCount('Spacing')} токенов`, href: '/foundation/layout/spacing/' },
        { index: '02', title: 'Размеры', description: 'Базовые размеры и роли Button, Icon и Field.', meta: `${metricCount('Size')} токенов`, href: '/foundation/layout/size/' },
        { index: '03', title: 'Радиусы', description: 'Радиусы controls, контейнеров и focus-состояний.', meta: `${metricCount('Radius')} токенов`, href: '/foundation/layout/radius/' },
        { index: '04', title: 'Толщины линий', description: 'Шкала stroke для границ, разделителей и focus.', meta: `${metricCount('Stroke')} токенов`, href: '/foundation/layout/stroke/' },
        { index: '05', title: 'Адаптивная сетка', description: 'Viewport, columns, margin и gutter для ключевых форм-факторов.', meta: `${grid.presets.length} пресета`, href: '/foundation/layout/grid/' },
      ]}
    />
  );
}
