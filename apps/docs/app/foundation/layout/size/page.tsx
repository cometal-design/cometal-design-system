import type { Metadata } from 'next';
import { FoundationMetricPage } from '../../../../components/foundation-metric-page';

export const metadata: Metadata = { title: 'Размеры — Foundation', description: 'Size-токены и semantic-роли Cometal.' };

export default function FoundationSizePage() {
  return <FoundationMetricPage kind="Size" />;
}
