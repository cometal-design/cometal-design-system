import type { Metadata } from 'next';
import { FieldDetail } from '../../../../components/field-detail';

export const metadata: Metadata = { title: 'Combobox' };

export default function Page() {
  return <FieldDetail kind="combobox" />;
}
