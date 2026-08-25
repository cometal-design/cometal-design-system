#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(docsRoot, '../..');
const contractPath = path.join(docsRoot, 'lib/component-page-content-contract.json');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const jsonOutput = args.has('--json');

const contract = JSON.parse(await readFile(contractPath, 'utf8'));

if (contract.schemaVersion !== 2) throw new Error(`Unsupported contract schemaVersion: ${contract.schemaVersion}`);

const criterionById = new Map(contract.criteria.map((criterion) => [criterion.id, criterion]));
const allowedRequirements = new Set(['required', 'conditional', 'na']);
const phases = [...contract.componentPhases].sort((a, b) => a.order - b.order);
const phaseById = new Map(phases.map((phase) => [phase.id, phase]));

if (phaseById.size !== phases.length) throw new Error('componentPhases contains duplicate IDs');
if (phases.some((phase, index) => phase.order !== index)) throw new Error('componentPhases orders must be contiguous and start at 0');

for (const route of contract.routes) {
  for (const [criterionId, override] of Object.entries(route.requirements ?? {})) {
    if (!criterionById.has(criterionId)) throw new Error(`${route.route}: unknown criterion ${criterionId}`);
    const requirement = override.requirement ?? criterionById.get(criterionId).defaultRequirement;
    if (!allowedRequirements.has(requirement)) throw new Error(`${route.route}/${criterionId}: invalid requirement ${requirement}`);
    if (requirement === 'na' && !override.rationale) throw new Error(`${route.route}/${criterionId}: N/A requires a rationale`);
  }
  for (const [phaseId, override] of Object.entries(route.phaseRequirements ?? {})) {
    if (!phaseById.has(phaseId)) throw new Error(`${route.route}: unknown phase ${phaseId}`);
    const requirement = override.requirement ?? phaseById.get(phaseId).defaultRequirement;
    if (!allowedRequirements.has(requirement)) throw new Error(`${route.route}/${phaseId}: invalid phase requirement ${requirement}`);
    if (requirement === 'na' && !override.rationale) throw new Error(`${route.route}/${phaseId}: phase N/A requires a rationale`);
  }
}

async function walkPages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkPages(absolute));
    else if (entry.name === 'page.tsx') files.push(absolute);
  }
  return files;
}

function sourceFileToRoute(file) {
  const relative = path.relative(path.join(docsRoot, contract.inventory.sourceRoot), file);
  const directory = path.dirname(relative).split(path.sep).join('/');
  return directory === '.' ? '/components/' : `/components/${directory}/`;
}

function extractRoutes(source) {
  return [...source.matchAll(/['"](\/components\/[a-z0-9-/]*\/?)['"]/g)].map((match) => {
    const value = match[1];
    return value.endsWith('/') ? value : `${value}/`;
  });
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

const actualSourceRoutes = uniqueSorted((await walkPages(path.join(docsRoot, contract.inventory.sourceRoot)))
  .map(sourceFileToRoute)
  .filter((route) => route !== '/components/'));
const contractRoutes = uniqueSorted(contract.routes.map((route) => route.route));
const tableNavigationSource = await readFile(path.join(docsRoot, contract.inventory.tableFamilyNavigationFile), 'utf8');
const registry = JSON.parse(await readFile(path.join(docsRoot, contract.inventory.registryFile), 'utf8'));
const familyRegistry = JSON.parse(await readFile(path.join(docsRoot, contract.inventory.familyRegistryFile), 'utf8'));
const registryIds = new Set(registry.components.map((component) => component.id));
const primaryRoutes = uniqueSorted(familyRegistry.families.map((family) => family.route));
const tableChildRoutes = uniqueSorted(extractRoutes(tableNavigationSource).filter((route) => route.startsWith('/components/table/') && route !== '/components/table/'));

const inventoryErrors = [];
const compareRouteSets = (label, expected, actual) => {
  const missing = expected.filter((route) => !actual.includes(route));
  const extra = actual.filter((route) => !expected.includes(route));
  if (missing.length || extra.length) inventoryErrors.push(`${label}: missing=[${missing.join(', ')}] extra=[${extra.join(', ')}]`);
};

compareRouteSets('contract vs source', actualSourceRoutes, contractRoutes);
compareRouteSets('primary navigation vs primary contract routes', contract.routes.filter((route) => route.tier === 'primary').map((route) => route.route).sort(), primaryRoutes);
compareRouteSets('Table family navigation vs child contract routes', contract.routes.filter((route) => route.tier === 'family-child').map((route) => route.route).sort(), tableChildRoutes);

if (tableChildRoutes.length !== contract.inventory.expectedTableChildRoutes) inventoryErrors.push(`Table child route count: expected ${contract.inventory.expectedTableChildRoutes}, found ${tableChildRoutes.length}`);
if (actualSourceRoutes.length !== contract.inventory.expectedTotalDetailRoutes) inventoryErrors.push(`total detail route count: expected ${contract.inventory.expectedTotalDetailRoutes}, found ${actualSourceRoutes.length}`);
for (const route of contract.routes) {
  for (const stableId of route.stableIds) {
    if (!registryIds.has(stableId)) inventoryErrors.push(`${route.route}: stable ID is absent from registry: ${stableId}`);
  }
}

const extensionCandidates = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'];
async function resolveLocalImport(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  for (const suffix of extensionCandidates) {
    const candidate = `${base}${suffix}`;
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  for (const suffix of ['.ts', '.tsx', '.js', '.mjs']) {
    const candidate = path.join(base, `index${suffix}`);
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  return null;
}

async function collectGraph(entryFiles) {
  const queue = [...entryFiles];
  const visited = new Set();
  const sources = [];
  while (queue.length) {
    const file = queue.shift();
    if (!file || visited.has(file)) continue;
    visited.add(file);
    const source = await readFile(file, 'utf8');
    sources.push(source);
    if (file.endsWith('.json')) continue;
    for (const match of source.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)) {
      const resolved = await resolveLocalImport(file, match[1]);
      if (resolved && resolved.startsWith(repositoryRoot)) queue.push(resolved);
    }
  }
  return sources.join('\n');
}

function regexMatches(source, pattern) {
  return new RegExp(pattern, 'iu').test(source);
}

function evaluateEvidence(evidence, sources) {
  if (!evidence?.clauses?.length) return false;
  return evidence.clauses.every((clause) => {
    const source = sources[clause.scope ?? 'content'];
    if (typeof source !== 'string') throw new Error(`Unknown evidence scope: ${clause.scope}`);
    const allPass = (clause.all ?? []).every((pattern) => regexMatches(source, pattern));
    const anyPass = !clause.any?.length || clause.any.some((pattern) => regexMatches(source, pattern));
    return allPass && anyPass;
  });
}

function evaluatePhaseOrder(route, content) {
  const declarations = [...content.matchAll(/data-component-phase=["']([a-z0-9-]+)["']/g)].map((match) => match[1]);
  const unknown = declarations.filter((phaseId) => !phaseById.has(phaseId));
  const duplicates = declarations.filter((phaseId, index) => declarations.indexOf(phaseId) !== index);
  const required = phases.filter((phase) => (route.phaseRequirements?.[phase.id]?.requirement ?? phase.defaultRequirement) !== 'na');
  const missing = required.filter((phase) => !declarations.includes(phase.id)).map((phase) => phase.id);
  const expected = required.map((phase) => phase.id);
  const actual = declarations;
  const outOfOrder = declarations.some((phaseId, index) => {
    if (index === 0 || !phaseById.has(phaseId) || !phaseById.has(declarations[index - 1])) return false;
    return phaseById.get(declarations[index - 1]).order >= phaseById.get(phaseId).order;
  });
  const status = unknown.length || duplicates.length || missing.length || outOfOrder ? 'MISSING' : 'PASS';
  return {
    status,
    expected,
    actual,
    missing,
    unknown: uniqueSorted(unknown),
    duplicates: uniqueSorted(duplicates),
    outOfOrder,
  };
}

const routeReports = [];
for (const route of contract.routes) {
  const contentPaths = [route.source, ...(route.contentFiles ?? [])].map((file) => path.join(docsRoot, file));
  const content = (await Promise.all(contentPaths.map((file) => readFile(file, 'utf8')))).join('\n');
  const graph = await collectGraph(contentPaths);
  const results = contract.criteria.map((criterion) => {
    const override = route.requirements?.[criterion.id] ?? {};
    const requirement = override.requirement ?? criterion.defaultRequirement;
    const rationale = override.rationale ?? criterion.condition ?? null;
    const evidence = override.evidence ?? criterion.evidence;
    const status = requirement === 'na' ? 'NA' : evaluateEvidence(evidence, { content, graph }) ? 'PASS' : 'MISSING';
    return { id: criterion.id, label: criterion.label, requirement, status, rationale };
  });
  const phaseOrder = evaluatePhaseOrder(route, content);
  const contentStatus = results.some((result) => result.status === 'MISSING') ? 'MISSING' : 'PASS';
  routeReports.push({
    route: route.route,
    source: route.source,
    tier: route.tier,
    stableIds: route.stableIds,
    status: contentStatus === 'PASS' && phaseOrder.status === 'PASS' ? 'PASS' : 'MISSING',
    contentStatus,
    orderStatus: phaseOrder.status,
    phaseOrder,
    results,
  });
}

const summary = {
  routes: routeReports.length,
  routePass: routeReports.filter((route) => route.status === 'PASS').length,
  routeMissing: routeReports.filter((route) => route.status === 'MISSING').length,
  contentPass: routeReports.filter((route) => route.contentStatus === 'PASS').length,
  contentMissing: routeReports.filter((route) => route.contentStatus === 'MISSING').length,
  orderPass: routeReports.filter((route) => route.orderStatus === 'PASS').length,
  orderMissing: routeReports.filter((route) => route.orderStatus === 'MISSING').length,
  criteriaPass: routeReports.flatMap((route) => route.results).filter((result) => result.status === 'PASS').length,
  criteriaMissing: routeReports.flatMap((route) => route.results).filter((result) => result.status === 'MISSING').length,
  criteriaNa: routeReports.flatMap((route) => route.results).filter((result) => result.status === 'NA').length,
  inventoryPass: inventoryErrors.length === 0,
};

const report = {
  schemaVersion: contract.schemaVersion,
  mode: strict ? 'strict' : 'report',
  inventory: {
    sourceRoutes: actualSourceRoutes,
    primaryRoutes,
    tableChildRoutes,
    errors: inventoryErrors,
  },
  routes: routeReports,
  summary,
};

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`COMPONENT_PAGE_CONTENT_AUDIT mode=${report.mode}`);
  console.log(`INVENTORY ${summary.inventoryPass ? 'PASS' : 'MISSING'} primary=${primaryRoutes.length} table-children=${tableChildRoutes.length} total=${actualSourceRoutes.length}`);
  for (const error of inventoryErrors) console.log(`  MISSING ${error}`);
  for (const route of routeReports) {
    const missing = route.results.filter((result) => result.status === 'MISSING').map((result) => `${result.id}[${result.requirement}]`);
    const na = route.results.filter((result) => result.status === 'NA').map((result) => result.id);
    const phaseIssues = [
      route.phaseOrder.missing.length ? `missing:${route.phaseOrder.missing.join('|')}` : null,
      route.phaseOrder.duplicates.length ? `duplicate:${route.phaseOrder.duplicates.join('|')}` : null,
      route.phaseOrder.unknown.length ? `unknown:${route.phaseOrder.unknown.join('|')}` : null,
      route.phaseOrder.outOfOrder ? `actual:${route.phaseOrder.actual.join('>')}` : null,
    ].filter(Boolean).join(',');
    console.log(`${route.status.padEnd(7)} ${route.route} content=${route.contentStatus} order=${route.orderStatus} missing=${missing.length ? missing.join(',') : 'none'} na=${na.length ? na.join(',') : 'none'} phases=${phaseIssues || 'canonical'}`);
  }
  console.log(`SUMMARY routes=${summary.routes} pass=${summary.routePass} missing=${summary.routeMissing} content-pass=${summary.contentPass} content-missing=${summary.contentMissing} order-pass=${summary.orderPass} order-missing=${summary.orderMissing} criteria-pass=${summary.criteriaPass} criteria-missing=${summary.criteriaMissing} criteria-na=${summary.criteriaNa}`);
}

if (strict && (!summary.inventoryPass || summary.routeMissing > 0)) process.exitCode = 1;
