import type { Metadata } from 'next';
import { FoundationMetricPage } from '../../../../components/foundation-metric-page';

export const metadata: Metadata = { title: 'Толщины линий — Foundation', description: 'Stroke-токены и semantic-роли Cometal.' };

export default function FoundationStrokePage() {
  return <FoundationMetricPage kind="Stroke" />;
}
