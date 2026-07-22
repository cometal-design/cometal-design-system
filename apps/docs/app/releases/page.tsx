import type { Metadata } from 'next';
import { releases, releasesSource } from '../../../storybook/stories/releases.generated';

export const metadata: Metadata = { title: 'Релизы' };

export default function ReleasesPage() {
  return <main className="content-page"><header className="page-header"><span className="eyebrow">ДОКУМЕНТАЦИЯ · РЕЛИЗЫ</span><h1>История изменений</h1><p>Публичные выпуски дизайн-системы, синхронизированные с артбордом Releases в Figma.</p></header><div className="release-source"><span>Источник: {releasesSource.label}</span><span>Синхронизировано: {releasesSource.syncedAt}</span></div><section className="release-list">{releases.map((release) => <article key={release.version}><header><div><code>{release.version}</code><h2>{release.title}</h2></div><span>{release.status}</span></header><p>{release.description}</p><div>{release.sections.map((section) => <section key={section.title}><h3>{section.title}</h3><ul>{section.changes.map((change) => <li key={change}>{change}</li>)}</ul></section>)}</div></article>)}</section></main>;
}
