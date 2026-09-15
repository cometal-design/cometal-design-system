import type { Metadata } from 'next';
import { FieldDetail } from '../../../../components/field-detail';

export const metadata: Metadata = { title: 'Text Area' };

export default function Page() {
  return <FieldDetail kind="text-area" />;
}
