import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import { IconCatalog } from '@cometal/react/icons/catalog';
import { iconManifestMetadata } from '@cometal/react/icons/manifest';
import { FoundationCategoryHeader } from '../../../../components/foundation-category-header';
import { SectionHeading } from '../../../../components/section-heading';

export const metadata: Metadata = {
  title: 'Каталог иконок — Foundation',
  description: 'Полный generated-каталог 2 810 канонических иконок Cometal.',
};

export default function FoundationIconsCatalogPage() {
  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Иконографика"
        description="Единый каталог Outline, Filled, Feature Icons and Logos использует тот же manifest и loader map, что и Storybook."
      />

      <section className="content-section">
        <SectionHeading
          title="Каталог"
          description={`${iconManifestMetadata.total.toLocaleString('ru-RU')} компонентов Figma доступны по exact canonical name и прямым tree-shakable import paths.`}
        />
        <IconCatalog />
        <InlineLink className="technical-link" href="/storybook/?path=/story/foundation--icons" touchTarget>Открыть техническую Icons story ↗</InlineLink>
      </section>
    </main>
  );
}
