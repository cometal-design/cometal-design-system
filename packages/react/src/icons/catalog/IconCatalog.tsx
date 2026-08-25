'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../Button/Button';
import { Combobox, Select } from '../../Field/Field';
import type { SelectOption } from '../../Field/Field';
import CopyLeftIcon from '../generated/components/outline/general/copy-left';
import { iconLoaders } from '../generated/loaders';
import { iconManifest, iconManifestMetadata } from '../generated/manifest';
import type { IconComponent, IconManifestRecord } from '../runtime/types';
import {
  filterIconRecords,
  getIconCatalogFilterOptions,
  iconCategory,
  iconImportSnippet,
  paginateIconRecords,
} from './catalog-model';
import { createCatalogCopyController } from './copy-feedback';
import './catalog.css';

type PreviewSize = 32 | 48 | 64;

const previewSizeOptions: SelectOption[] = [
  { value: '32', label: '32 × 32' },
  { value: '48', label: '48 × 48' },
  { value: '64', label: '64 × 64' },
];

function CatalogPreview({ record, size }: { record: IconManifestRecord; size: PreviewSize }) {
  const [IconComponent, setIconComponent] = useState<IconComponent>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setIconComponent(undefined);
    setFailed(false);
    iconLoaders[record.canonicalName]?.()
      .then((module) => { if (active) setIconComponent(() => module.default); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [record.canonicalName]);
  const state = failed ? 'error' : IconComponent ? 'loaded' : 'loading';
  return (
    <span
      className="cometal-icon-catalog__preview-content"
      data-preview-name={record.canonicalName}
      data-preview-state={state}
    >
      {failed ? <span className="cometal-icon-catalog__preview-state">Ошибка загрузки</span> : null}
      {!failed && !IconComponent ? <span className="cometal-icon-catalog__preview-state" aria-hidden="true">Иконка загружается</span> : null}
      {IconComponent ? <IconComponent className="cometal-icon-catalog__icon" width={size} height={size} /> : null}
    </span>
  );
}

export interface IconCatalogProps {
  readonly className?: string;
}

export function IconCatalog({ className }: IconCatalogProps) {
  const [search, setSearch] = useState('');
  const [library, setLibrary] = useState('');
  const [family, setFamily] = useState('');
  const [previewSize, setPreviewSize] = useState<PreviewSize>(32);
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [copyError, setCopyError] = useState('');
  const filters = useMemo(() => ({ library, family }), [library, family]);
  const results = useMemo(() => filterIconRecords(iconManifest, search, filters), [search, filters]);
  const filterOptions = useMemo(() => getIconCatalogFilterOptions(iconManifest, search, filters), [search, filters]);
  const searchOptions = useMemo<SelectOption[]>(() =>
    filterIconRecords(iconManifest, '', filters).map((record) => ({
      value: record.canonicalName,
      label: record.canonicalName,
    })), [filters]);
  const libraryOptions = useMemo<SelectOption[]>(() => [
    { value: '', label: 'Все' },
    ...filterOptions.libraries.map((option) => ({ value: option.value, label: option.value })),
  ], [filterOptions.libraries]);
  const familyOptions = useMemo<SelectOption[]>(() => [
    { value: '', label: 'Все' },
    ...filterOptions.families.map((option) => ({ value: option.value, label: option.value })),
  ], [filterOptions.families]);
  const pagination = useMemo(() => paginateIconRecords(results, page), [results, page]);
  const resultAnnouncement = `Найдено ${results.length.toLocaleString('ru-RU')}. Страница ${pagination.page} из ${pagination.pageCount}.`;
  const resultAnnouncementRef = useRef(resultAnnouncement);
  const [announcement, setAnnouncement] = useState(resultAnnouncement);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const pendingBoundaryFocus = useRef<'previous' | 'next' | undefined>(undefined);
  const copyController = useRef<ReturnType<typeof createCatalogCopyController>>(undefined);

  resultAnnouncementRef.current = resultAnnouncement;
  if (!copyController.current) {
    copyController.current = createCatalogCopyController({
      setFeedback(value) {
        setFeedback(value);
        setAnnouncement(value || resultAnnouncementRef.current);
      },
      setError(value) {
        setCopyError(value);
        if (value) setAnnouncement(value);
      },
    });
  }

  useEffect(() => copyController.current?.mount(), []);
  useEffect(() => setAnnouncement(resultAnnouncement), [resultAnnouncement]);
  useEffect(() => {
    if (pendingBoundaryFocus.current === 'previous') previousButtonRef.current?.focus();
    if (pendingBoundaryFocus.current === 'next') nextButtonRef.current?.focus();
    pendingBoundaryFocus.current = undefined;
  }, [pagination.page]);

  function clearCopyMessages() {
    setFeedback('');
    setCopyError('');
    setAnnouncement(resultAnnouncementRef.current);
  }

  function resetPage() {
    clearCopyMessages();
    setPage(1);
  }

  function goToPreviousPage() {
    const target = Math.max(1, pagination.page - 1);
    if (target === 1) pendingBoundaryFocus.current = 'next';
    clearCopyMessages();
    setPage(target);
  }

  function goToNextPage() {
    const target = Math.min(pagination.pageCount, pagination.page + 1);
    if (target === pagination.pageCount) pendingBoundaryFocus.current = 'previous';
    clearCopyMessages();
    setPage(target);
  }

  async function copy(value: string, label: string) {
    await copyController.current?.copy(value, label, typeof navigator === 'undefined' ? undefined : navigator.clipboard);
  }

  return (
    <section className={['cometal-icon-catalog', className].filter(Boolean).join(' ')} aria-labelledby="cometal-icon-catalog-title">
      <header className="cometal-icon-catalog__summary">
        <div><span>Источник</span><strong id="cometal-icon-catalog-title">{iconManifestMetadata.total.toLocaleString('ru-RU')} иконок</strong></div>
        <code>{iconManifestMetadata.sourceFingerprintSha256}</code>
      </header>
      <div className="cometal-icon-catalog__controls">
        <Combobox
          type="search"
          label="Поиск по каноническому имени"
          size="l"
          options={searchOptions}
          maxVisibleOptions={50}
          value={search}
          onChange={(event) => { setSearch(event.currentTarget.value); resetPage(); }}
          onOptionSelect={(value) => { setSearch(value); resetPage(); }}
          placeholder="Например, payment/lg/Visa"
        />
        <Select
          label="Библиотека"
          size="l"
          options={libraryOptions}
          value={library}
          onValueChange={(value) => { setLibrary(value); setFamily(''); resetPage(); }}
        />
        <Select
          label="Семейство"
          size="l"
          options={familyOptions}
          value={family}
          onValueChange={(value) => { setFamily(value); resetPage(); }}
        />
        <Select
          label="Размер превью"
          size="l"
          options={previewSizeOptions}
          value={String(previewSize)}
          onValueChange={(value) => setPreviewSize(Number(value) as PreviewSize)}
        />
      </div>
      <div className="cometal-icon-catalog__result-line" data-page={pagination.page} data-page-count={pagination.pageCount}>
        <span>Найдено: <strong>{results.length.toLocaleString('ru-RU')}</strong></span>
        <span>Страница {pagination.page} из {pagination.pageCount}</span>
      </div>
      {copyError ? <p className="cometal-icon-catalog__error">{copyError}</p> : null}
      <p className="cometal-icon-catalog__feedback">{feedback}</p>
      <p className="cometal-icon-catalog__live-status" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      {pagination.records.length ? (
        <ul className="cometal-icon-catalog__grid">
          {pagination.records.map((record) => (
            <li key={record.canonicalName} className="cometal-icon-catalog__card" data-paint-mode={record.paintMode}>
              <div className="cometal-icon-catalog__preview"><CatalogPreview record={record} size={previewSize} /></div>
              <code className="cometal-icon-catalog__name">{record.canonicalName}</code>
              <span>{record.library} · {iconCategory(record)}</span>
              <div className="cometal-icon-catalog__actions">
                <Button variant="secondary" size="s" startIcon={<CopyLeftIcon />} aria-label={`Копировать имя ${record.canonicalName}`} onClick={() => void copy(record.canonicalName, `Скопировано имя: ${record.canonicalName}`)}>Имя</Button>
                <Button variant="secondary" size="s" startIcon={<CopyLeftIcon />} aria-label={`Копировать import ${record.canonicalName}`} onClick={() => void copy(iconImportSnippet(record), `Скопирован import для ${record.canonicalName}`)}>Импорт</Button>
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="cometal-icon-catalog__empty">По текущему запросу и фильтрам иконки не найдены.</p>}
      <nav className="cometal-icon-catalog__pagination" aria-label="Страницы каталога иконок">
        <Button ref={previousButtonRef} variant="secondary" size="s" disabled={pagination.page <= 1} onClick={goToPreviousPage}>Предыдущая</Button>
        <span>{Math.min((pagination.page - 1) * 120 + 1, results.length)}–{Math.min(pagination.page * 120, results.length)} из {results.length}</span>
        <Button ref={nextButtonRef} variant="secondary" size="s" disabled={pagination.page >= pagination.pageCount} onClick={goToNextPage}>Следующая</Button>
      </nav>
    </section>
  );
}
