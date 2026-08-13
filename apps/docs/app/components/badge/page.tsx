import type { Metadata } from 'next';
import { BadgeDetail } from '../../../components/badge-detail';

export const metadata: Metadata = { title: 'Badge' };

export default function BadgePage() {
  return <BadgeDetail />;
}
