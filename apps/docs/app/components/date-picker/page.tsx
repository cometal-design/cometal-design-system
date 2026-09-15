import type { Metadata } from 'next';
import { DatePickerDetail } from '../../../components/date-picker-detail';

export const metadata: Metadata = { title: 'Date Picker' };

export default function Page() {
  return <DatePickerDetail />;
}
