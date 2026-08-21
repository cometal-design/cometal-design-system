import type { Metadata } from 'next';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';

export const metadata: Metadata = { title: 'Шаблоны' };

export default function TemplatesPage() {
  return <main className="content-page components-page">
    <PageHeader eyebrow="ШАБЛОНЫ" title="Структуры продуктовых экранов" description="Шаблоны появятся здесь после утверждения полноэкранных структур. Widget перенесён в Components: это универсальная оболочка, а не шаблон экрана." stat={{ value: 0, label: 'опубликованных шаблонов' }} />
    <MetadataStrip ariaLabel="Сводка каталога шаблонов" items={['Web · React', '0 Ready', '0 In review']} bottomDivider />
  </main>;
}
