import type { Metadata } from 'next';
import { SelectionDetail } from '../../../components/selection-detail';
export const metadata: Metadata = { title: 'Checkbox' };
export default function CheckboxPage() { return <SelectionDetail kind="checkbox" />; }
