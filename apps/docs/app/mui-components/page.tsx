import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { MuiBoard } from '../../components/mui/MuiBoard';
import { readMuiDemoSources } from '../../lib/mui-demo-sources';

export const metadata: Metadata = {
  title: 'Компоненты на MUI',
  description: '12 интерактивных примеров Material UI в визуальном стиле COMETAL с размерами и полным React-кодом.',
};

export default async function MuiComponentsPage() {
  const sources = await readMuiDemoSources();
  return <AppRouterCacheProvider options={{ key: 'cometal-mui' }}>
    <MuiBoard sources={sources} />
  </AppRouterCacheProvider>;
}
