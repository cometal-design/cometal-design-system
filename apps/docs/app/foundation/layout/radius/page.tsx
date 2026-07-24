import type { Metadata } from 'next';
import { FoundationMetricPage } from '../../../../components/foundation-metric-page';

export const metadata: Metadata = { title: 'Радиусы — Foundation', description: 'Radius-токены и semantic-роли Cometal.' };

export default function FoundationRadiusPage() {
  return <FoundationMetricPage kind="Radius" />;
}
