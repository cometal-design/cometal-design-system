import type { Metadata } from 'next';
import { FieldDetail } from '../../../components/field-detail';

export const metadata: Metadata = { title: 'Multi Select' };

export default function Page() {
  return <FieldDetail kind="multi-select" />;
}
