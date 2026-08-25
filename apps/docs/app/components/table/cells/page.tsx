import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import { TableCellsContract } from '../../../../components/table-contract-examples';
import { TableChildDocumentation } from '../../../../components/table-child-documentation';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
import { tableFigmaSources } from '../../../../lib/table-documentation';

export const metadata: Metadata = { title: 'Table · Cells' };
const apiRows = [
  { name: 'TableCell.state', type: 'TableCellState', description: 'Default, hover, active, selected, editing, error, dragging или disabled.' },
  { name: 'TableCell.align', type: 'start | center | end', description: 'Выравнивание значения без изменения table-семантики.' },
  { name: 'TableCell.leading / trailing', type: 'ReactNode', description: 'Опциональные области вокруг основного значения.' },
  { name: 'TableFileCell', type: 'fileName, fileSize?, fileType?', description: 'Файловое значение с доступным текстом и декоративной иконкой.' },
] as const;

export default function TableCellsPage() {
  return <main className="content-page component-detail table-family-page">
    <TableFamilyHeader activeHref="/components/table/cells/" title="Table · Cells" summary="Read, Edit, Selection, Index, Drag, Summary и File Content — самостоятельные source families внутри Table." />
    <section className="content-section" id="states">
      <SectionHeading title="Полная матрица Cells" description="Обе плотности и все утверждённые оси Type, State и Value показаны явно; скрытых состояний в витрине нет." />
      <TableCellsContract />
      <p><InlineLink href={tableFigmaSources.cells} target="_blank" rel="noreferrer">Открыть Cells в Figma ↗</InlineLink></p>
    </section>
    <TableChildDocumentation childLabel="Cells" useWhen="Для значений строки, selection, index, drag handle, summary и файлового контента внутри нативной Table композиции." doNotUseWhen="Не используйте Cell primitives как отдельную layout grid или для данных без строково-колоночных отношений." behavior="State управляет визуальным состоянием ячейки; error выставляет aria-invalid, disabled — aria-disabled. Selection сохраняет доступный label, а file icon остаётся декоративным." apiRows={apiRows} edgeCases="Empty и optional leading/trailing области не должны создавать пустые управляющие элементы; disabled/error state требует семантики, а длинные file names сохраняют полный title." />
  </main>;
}
