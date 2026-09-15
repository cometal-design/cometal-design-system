import type { Metadata } from 'next';
import { TooltipDetail } from '../../../components/tooltip-detail';

export const metadata: Metadata = { title: 'Tooltip' };

export default function Page() {
  return <TooltipDetail />;
}
