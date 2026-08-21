import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Table' };

export default function TableCompatibilityPage() { redirect('/components/table/'); }
