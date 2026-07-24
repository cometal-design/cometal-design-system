import type { Metadata } from 'next';
import { FoundationMetricPage } from '../../../../components/foundation-metric-page';

export const metadata: Metadata = { title: 'Отступы — Foundation', description: 'Spacing-токены и semantic-роли Cometal.' };

export default function FoundationSpacingPage() {
  return <FoundationMetricPage kind="Spacing" />;
}
