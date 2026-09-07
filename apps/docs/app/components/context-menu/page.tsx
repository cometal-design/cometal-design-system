import type { Metadata } from 'next';
import { ContextMenuDetail } from '../../../components/context-menu-detail';

export const metadata: Metadata = { title: 'Context Menu' };

export default function ContextMenuPage() {
  return <ContextMenuDetail />;
}
