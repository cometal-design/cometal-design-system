'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../Button/Button';
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

function CatalogPreview({ record }: { record: IconManifestRecord }) {
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
  if (failed) return <span className="cometal-icon-catalog__preview-state">Ошибка загрузки</span>;
  if (!IconComponent) return <span className="cometal-icon-catalog__preview-state" aria-hidden="true">Иконка загружается</span>;
  return <IconComponent className="cometal-icon-catalog__icon" />;
}

export interface IconCatalogProps {
  readonly className?: string;
}

export function IconCatalog({ className }: IconCatalogProps) {
  const [search, setSearch] = useState('');
  const [library, setLibrary] = useState('');
  const [family, setFamily] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [copyError, setCopyError] = useState('');
  const copyController = useRef<ReturnType<typeof createCatalogCopyController>>(undefined);
  if (!copyController.current) copyController.current = createCatalogCopyController({ setFeedback, setError: setCopyError });
  useEffect(() => copyController.current?.mount(), []);

  const filters = useMemo(() => ({ library, family, category }), [library, family, category]);
  const results = useMemo(() => filterIconRecords(iconManifest, search, filters), [search, filters]);
  const filterOptions = useMemo(() => getIconCatalogFilterOptions(iconManifest, search, filters), [search, filters]);
  const pagination = useMemo(() => paginateIconRecords(results, page), [results, page]);

  function resetPage() { setPage(1); }

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
        <label className="cometal-icon-catalog__search">Поиск по каноническому имени
          <input type="search" value={search} onChange={(event) => { setSearch(event.currentTarget.value); resetPage(); }} placeholder="Например, payment/lg/Visa" />
        </label>
        <label>Библиотека
          <select value={library} onChange={(event) => { setLibrary(event.currentTarget.value); setFamily(''); setCategory(''); resetPage(); }}>
            <option value="">Все ({iconManifest.length})</option>
            {filterOptions.libraries.map((option) => <option value={option.value} key={option.value}>{option.value} ({option.count})</option>)}
          </select>
        </label>
        <label>Семейство
          <select value={family} onChange={(event) => { setFamily(event.currentTarget.value); setCategory(''); resetPage(); }}>
            <option value="">Все</option>
            {filterOptions.families.map((option) => <option value={option.value} key={option.value}>{option.value} ({option.count})</option>)}
          </select>
        </label>
        <label>Категория
          <select value={category} onChange={(event) => { setCategory(event.currentTarget.value); resetPage(); }}>
            <option value="">Все</option>
            {filterOptions.categories.map((option) => <option value={option.value} key={option.value}>{option.value} ({option.count})</option>)}
          </select>
        </label>
      </div>
      <div className="cometal-icon-catalog__result-line" aria-live="polite">
        <span>Найдено: <strong>{results.length.toLocaleString('ru-RU')}</strong></span>
        <span>Страница {pagination.page} из {pagination.pageCount}</span>
      </div>
      {copyError ? <p className="cometal-icon-catalog__error" role="alert">{copyError}</p> : null}
      <p className="cometal-icon-catalog__feedback" aria-live="polite">{feedback}</p>
      {pagination.records.length ? (
        <ul className="cometal-icon-catalog__grid">
          {pagination.records.map((record) => (
            <li key={record.canonicalName} className="cometal-icon-catalog__card" data-paint-mode={record.paintMode}>
              <div className="cometal-icon-catalog__preview"><CatalogPreview record={record} /></div>
              <code className="cometal-icon-catalog__name">{record.canonicalName}</code>
              <span>{record.library} · {iconCategory(record)}</span>
              <div className="cometal-icon-catalog__actions">
                <Button variant="secondary" size="s" aria-label={`Копировать имя ${record.canonicalName}`} onClick={() => void copy(record.canonicalName, `Скопировано имя: ${record.canonicalName}`)}>Копировать имя</Button>
                <Button variant="secondary" size="s" aria-label={`Копировать import ${record.canonicalName}`} onClick={() => void copy(iconImportSnippet(record), `Скопирован import для ${record.canonicalName}`)}>Копировать import</Button>
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="cometal-icon-catalog__empty">По текущему запросу и фильтрам иконки не найдены.</p>}
      <nav className="cometal-icon-catalog__pagination" aria-label="Страницы каталога иконок">
        <Button variant="secondary" size="s" disabled={pagination.page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Предыдущая</Button>
        <span>{Math.min((pagination.page - 1) * 120 + 1, results.length)}–{Math.min(pagination.page * 120, results.length)} из {results.length}</span>
        <Button variant="secondary" size="s" disabled={pagination.page >= pagination.pageCount} onClick={() => setPage((value) => Math.min(pagination.pageCount, value + 1))}>Следующая</Button>
      </nav>
    </section>
  );
}
