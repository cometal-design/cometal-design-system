import type { Metadata } from 'next';
import { SelectionDetail } from '../../../components/selection-detail';
export const metadata: Metadata = { title: 'Radio Button' };
export default function RadioButtonPage() { return <SelectionDetail kind="radio-button" />; }
