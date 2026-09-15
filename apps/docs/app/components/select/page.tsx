import type { Metadata } from 'next';
import { FieldDetail } from '../../../components/field-detail';

export const metadata: Metadata = { title: 'Select' };

export default function Page() {
  return <FieldDetail kind="select" />;
}
