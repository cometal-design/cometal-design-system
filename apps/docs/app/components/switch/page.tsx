import type { Metadata } from 'next';
import { SelectionDetail } from '../../../components/selection-detail';
export const metadata: Metadata = { title: 'Switch' };
export default function SwitchPage() { return <SelectionDetail kind="switch" stableId={<code>selection.switch</code>} />; }
