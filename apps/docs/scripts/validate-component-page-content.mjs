#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(docsRoot, 'package.json'));
const ts = require('typescript');
const profiles = new Set(['legacy-linear', 'component-standard']);
const sorted = (values) => [...new Set(values)].sort();
const equal = (a, b) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
const parse = (source) => ts.createSourceFile('content.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function nodes(root, predicate) {
  const result = [];
  function walk(node) {
    if (predicate(node)) result.push(node);
    ts.forEachChild(node, walk);
  }
  walk(root);
  return result;
}
const jsx = (root, name) => nodes(root, (node) =>
  (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText() === name);
function attribute(node, name) {
  const item = node?.attributes.properties.find((prop) => ts.isJsxAttribute(prop) && prop.name.getText() === name);
  if (!item?.initializer) return null;
  return ts.isJsxExpression(item.initializer) ? item.initializer.expression : item.initializer;
}
function stringValue(node) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : null;
}
function unwrap(node) {
  while (node && (ts.isAsExpression(node) || ts.isParenthesizedExpression(node) || ts.isSatisfiesExpression(node))) node = node.expression;
  return node;
}
export function readFieldMap(source, variable = 'fieldDocumentation') {
  const ast = parse(source);
  const declaration = nodes(ast, ts.isVariableDeclaration).find((node) => node.name.getText() === variable);
  const object = unwrap(declaration?.initializer);
  if (!object || !ts.isObjectLiteralExpression(object)) return {};
  return Object.fromEntries(object.properties.filter(ts.isPropertyAssignment).map((entry) => {
    const value = unwrap(entry.initializer);
    return [stringValue(entry.name) ?? entry.name.getText(), value && ts.isObjectLiteralExpression(value)
      ? Object.fromEntries(value.properties.filter(ts.isPropertyAssignment).map((prop) => [prop.name.getText(), stringValue(prop.initializer)]))
      : {}];
  }));
}
function definitions(asts) {
  const map = new Map();
  for (const ast of asts) {
    for (const node of nodes(ast, (item) => ts.isFunctionDeclaration(item) || ts.isVariableDeclaration(item))) {
      if (node.name && ts.isIdentifier(node.name)) map.set(node.name.text, ts.isFunctionDeclaration(node) ? node : node.initializer);
    }
  }
  return map;
}
// Follow named local page/helper references only. Imported registry/shared shells are not content evidence.
function reachable(root, defs) {
  const seen = new Set();
  const output = [];
  function visit(node) {
    if (!node || seen.has(node)) return;
    seen.add(node);
    output.push(node.getText());
    for (const identifier of nodes(node, ts.isIdentifier)) {
      if (identifier.parent && ts.isPropertyAccessExpression(identifier.parent) && identifier.parent.name === identifier) continue;
      visit(defs.get(identifier.text));
    }
  }
  visit(root);
  return output.join('\n');
}
function result(id, pass, rationale) {
  return { id, status: pass ? 'PASS' : 'MISSING', rationale };
}

export function checkStandard(route, sources, fields) {
  if (route.standardLayout === 'native-tabs') return checkNativeStandard(route, sources);
  const asts = sources.map(parse);
  const defs = definitions(asts);
  const shells = asts.flatMap((ast) => jsx(ast, 'ComponentPageStandard'));
  const shell = shells[0];
  const errors = [];
  const entry = asts[0].statements.find((node) => ts.isFunctionDeclaration(node)
    && node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword));
  const wired = Boolean(entry && shell && reachable(entry, defs).includes(shell.getText()));
  if (!wired) errors.push('entry-shell-wiring');
  const panels = {};
  for (const name of ['overview', 'settings', 'accessibility']) {
    const value = attribute(shell, name);
    panels[name] = reachable(value, defs);
    if (!value || !panels[name].trim()) errors.push('missing-panel:' + name);
  }
  if (shells.length !== 1) errors.push('standard-shell');
  const overview = parse(panels.overview);
  const settings = parse(panels.settings);
  const accessibility = panels.accessibility;
  const whole = sources.join('\n');
  const selected = route.selection ? fields[route.selection.kind] : null;
  let selectedValid = true;
  let realComponent = false;
  if (route.selection) {
    const selector = jsx(asts[0], 'FieldDetail')[0];
    selectedValid = Boolean(selected)
      && stringValue(attribute(selector, 'kind')) === route.selection.kind
      && selected.route === route.route
      && equal([selected.stableId], route.stableIds)
      && selected.reactExport === route.selection.export;
    const control = defs.get('FieldControl');
    const branch = control && nodes(control, ts.isCaseClause).find((item) => stringValue(item.expression) === route.selection.kind);
    realComponent = Boolean(branch && jsx(branch, route.selection.export).length);
    // A sibling's prose never satisfies this route's required content.
    for (const key of ['summary', 'label', 'placeholder', 'use', 'avoid', 'anatomy', 'keyboard', 'semantics', 'edge', 'apg']) {
      if (!selected?.[key]?.trim()) errors.push('selected-content:' + key);
    }
  } else {
    const stable = stringValue(attribute(shell, 'stableId'));
    selectedValid = stable ? route.stableIds.includes(stable) : route.stableIds.every((id) => whole.includes(id));
    const exported = stringValue(attribute(shell, 'reactExport'));
    realComponent = Boolean(exported && exported.split(' · ').every((name) => asts.some((ast) => jsx(ast, name).length)));
    const selection = jsx(asts[0], 'SelectionDetail')[0];
    if (selection) {
      const kind = stringValue(attribute(selection, 'kind'));
      const copy = readFieldMap(whole, 'content')[kind];
      selectedValid = Boolean(copy && route.stableIds.includes(copy.id));
      const preview = defs.get('SelectionPreview');
      const branch = preview?.body?.statements.find((node) => ts.isIfStatement(node)
        && ts.isBinaryExpression(node.expression) && stringValue(node.expression.right) === kind);
      const target = branch?.thenStatement ?? preview?.body?.statements.find(ts.isReturnStatement);
      realComponent = Boolean(selectedValid && target && jsx(target, copy.reactExport).length);
    }
  }
  const props = jsx(settings, 'ComponentPageSetting');
  const examples = jsx(overview, 'ComponentPageExample');
  const headings = nodes(overview, ts.isJsxElement)
    .filter((node) => node.openingElement.tagName.getText() === 'h2').map((node) => node.getText());
  const expectedHeadings = ['Использование', 'Композиция', 'Правила использования', 'Примеры'];
  const headingIndices = expectedHeadings.map((label) => headings.findIndex((value) => value.includes(label)));
  const ordered = headingIndices.every((index, position) => index >= 0 && (position === 0 || index > headingIndices[position - 1]));
  const has = (name) => Boolean(attribute(shell, name));
  const selectedContent = selectedValid && !errors.some((error) => error.startsWith('selected-content:'));
  return {
    orderStatus: wired && !errors.some((error) => error.startsWith('missing-panel:')) && shells.length === 1 && ordered ? 'PASS' : 'MISSING',
    phaseOrder: { expected: ['overview', 'settings', 'accessibility'], actual: Object.keys(panels).filter((key) => panels[key]), errors },
    results: [
      result('identity', selectedValid && has('stableId') && has('reactExport')),
      result('title-summary', has('title') && has('summary') && selectedContent),
      result('lifecycle', has('status') && has('statusLabel') && whole.includes('statusLabels')),
      result('figma', has('figmaHref') && whole.includes('component.links.figma')),
      result('storybook', has('storybookHref')),
      result('react-source', has('sourceHref') && (whole.includes('component.links.source')
        || /https:\/\/github\.com\/cometal-design\/cometal-design-system\/blob\/main\/packages\/react\/src\//.test(whole))),
      result('usage-boundaries', ordered && selectedContent && /Do/.test(panels.overview) && /Don.t/.test(panels.overview)),
      result('real-example', realComponent && panels.overview.includes('component-standard-presentation') && whole.includes('@cometal/react')),
      result('code-example', jsx(overview, 'CodeBlock').some((node) => attribute(node, 'code'))
        && examples.length > 0 && examples.every((node) => attribute(node, 'code') && attribute(node, 'preview'))),
      result('matrix', examples.length > 1 && /size|Sizes|Размер|placement|states|состояни/i.test(panels.overview)),
      result('behavior-a11y', selectedContent && /[Кк]лавиатур|keyboard/.test(accessibility) && /aria-|семантик/i.test(accessibility)),
      result('public-api', jsx(settings, 'ComponentPageSettings').some((node) => attribute(node, 'code') && attribute(node, 'onReset'))
        && props.length > 0 && props.every((node) => ['name', 'type', 'defaultValue', 'description'].every((name) => {
          const value = attribute(node, name);
          return value && (stringValue(value) === null || stringValue(value).trim().length > 0);
        }))),
      result('responsive-theme-edge', selectedContent && /viewport|адаптац|ширин/i.test(accessibility)
        && /theme|тем[аы]/i.test(accessibility) && /длинн|огранич|edge|disabled/i.test(accessibility)),
    ],
  };
}

// The original Button reference predates ComponentPageStandard but implements the same
// three-panel contract. Inspect its real TabPanels and named local helpers, not a bypass.
function checkNativeStandard(route, sources) {
  const asts = sources.map(parse);
  const defs = definitions(asts);
  const entry = asts[0];
  const header = jsx(entry, 'ComponentPageHeader')[0];
  const panelElements = nodes(entry, ts.isJsxElement).filter((node) => node.openingElement.tagName.getText() === 'TabPanel');
  const expected = ['overview', 'react-api', 'accessibility'];
  const actual = panelElements.map((node) => stringValue(attribute(node.openingElement, 'value')));
  const texts = panelElements.map((node) => reachable(node, defs));
  const [overview = '', settings = '', accessibility = ''] = texts;
  const previewAst = parse(overview);
  const settingsAst = parse(settings);
  const whole = sources.join('\n');
  const headingNodes = nodes(previewAst, (node) =>
    ts.isJsxElement(node) && node.openingElement.tagName.getText() === 'h2'
    || (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText() === 'SectionHeading');
  const headings = headingNodes.map((node) => node.getText());
  const indices = ['Использование', 'Композиция', 'Правила использования', 'Примеры'].map((name) => headings.findIndex((text) => text.includes(name)));
  const order = JSON.stringify(actual) === JSON.stringify(expected)
    && indices.every((value, index) => value >= 0 && (index === 0 || value > indices[index - 1]))
    && jsx(entry, 'Tabs').some((node) => stringValue(attribute(node, 'defaultValue')) === 'overview');
  const props = jsx(settingsAst, 'PropertyRow');
  const examples = jsx(previewAst, 'ButtonExample');
  const has = (name) => Boolean(attribute(header, name));
  return {
    orderStatus: order ? 'PASS' : 'MISSING',
    phaseOrder: { expected, actual, errors: order ? [] : ['native-panel-order'] },
    results: [
      result('identity', has('identityLabel') && route.stableIds.every((id) => reachable(attribute(header, 'identityLabel'), defs).includes(id))),
      result('title-summary', has('title') && has('summary')),
      result('lifecycle', has('status') && has('statusLabel')),
      result('figma', has('figmaHref') && whole.includes('component.links.figma')),
      result('storybook', has('playgroundHref')),
      result('react-source', has('sourceHref') && whole.includes('component.links.source')),
      result('usage-boundaries', order && overview.includes('Don’t') && overview.includes('Do')),
      result('real-example', jsx(previewAst, 'Button').length > 0 && whole.includes('@cometal/react')),
      result('code-example', jsx(previewAst, 'CodeBlock').some((node) => attribute(node, 'code'))
        && examples.length > 0 && examples.every((node) => attribute(node, 'code') && attribute(node, 'preview'))),
      result('matrix', examples.length > 1 && /Размеры|Состояния/.test(overview)),
      result('behavior-a11y', /Клавиатура/.test(accessibility) && /aria-/.test(accessibility)),
      result('public-api', props.length > 0 && props.every((node) => ['name', 'type', 'defaultValue', 'description'].every((name) => attribute(node, name)))
        && jsx(settingsAst, 'CodeBlock').length > 0 && jsx(settingsAst, 'Button').some((node) => attribute(node, 'onClick')?.getText() === 'reset')),
      result('responsive-theme-edge', /viewport|адаптац|ширин|overflow/i.test(accessibility)
        && /theme|тем[аы]/i.test(accessibility) && /длинн|огранич|edge|disabled/i.test(accessibility)),
    ],
  };
}

// Execute the actual portal projection with only its three declared data imports.
export function readCatalogProjection(source, families, registry, fields) {
  const imports = {
    '../../../registry/components.json': { components: registry },
    '../../../registry/component-families.json': { families },
    './field-documentation': { fieldDocumentation: fields },
  };
  const module = { exports: {} };
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  runInNewContext(compiled, {
    module, exports: module.exports,
    require(name) { if (!(name in imports)) throw Error('Unexpected projection import: ' + name); return imports[name]; },
  }, { timeout: 1000 });
  return structuredClone(module.exports.componentCatalog);
}

export function redirectTarget(source) {
  const ast = parse(source);
  if (ast.statements.length !== 2) return null;
  const [importNode, declaration] = ast.statements;
  if (!ts.isImportDeclaration(importNode) || stringValue(importNode.moduleSpecifier) !== 'next/navigation'
    || importNode.importClause?.namedBindings?.getText() !== '{ redirect }'
    || !ts.isFunctionDeclaration(declaration) || !declaration.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
    || declaration.body?.statements.length !== 1) return null;
  const statement = declaration.body.statements[0];
  if (!ts.isExpressionStatement(statement) || !ts.isCallExpression(statement.expression)
    || statement.expression.expression.getText() !== 'redirect' || statement.expression.arguments.length !== 1) return null;
  return stringValue(statement.expression.arguments[0]);
}

function matches(source, pattern) { return new RegExp(pattern, 'iu').test(source); }
export function checkLegacy(route, content, graph, contract) {
  const phases = [...contract.componentPhases].sort((a, b) => a.order - b.order);
  const declarations = [...content.matchAll(/data-component-phase=["']([a-z0-9-]+)["']/g)].map((match) => match[1]);
  const expected = phases.filter((phase) => (route.phaseRequirements?.[phase.id]?.requirement ?? phase.defaultRequirement) !== 'na').map((phase) => phase.id);
  const orderPass = equal(declarations, expected) && declarations.length === expected.length
    && declarations.every((id, index) => id === expected[index]);
  const results = contract.criteria.map((criterion) => {
    const override = route.requirements?.[criterion.id] ?? {};
    const requirement = override.requirement ?? criterion.defaultRequirement;
    if (requirement === 'na') {
      if (!override.rationale) throw Error('N/A requires rationale');
      return { id: criterion.id, status: 'NA', rationale: override.rationale };
    }
    const evidence = override.evidence ?? criterion.evidence;
    const pass = evidence?.clauses?.length && evidence.clauses.every((clause) => {
      const source = { content, graph }[clause.scope ?? 'content'];
      if (typeof source !== 'string') throw Error('Unknown evidence scope');
      return (clause.all ?? []).every((pattern) => matches(source, pattern))
        && (!clause.any?.length || clause.any.some((pattern) => matches(source, pattern)));
    });
    return result(criterion.id, pass);
  });
  return { results, orderStatus: orderPass ? 'PASS' : 'MISSING', phaseOrder: { expected, actual: declarations, errors: orderPass ? [] : ['phase-order'] } };
}

export function checkInventory({ contract, sourceRoutes, families, registry, tableChildren, fields, navigation, shell, projectionSource, compatibilitySources = {} }) {
  const errors = [];
  const routes = contract.routes;
  const compare = (label, left, right) => { if (!equal(left, right)) errors.push(label); };
  if (contract.schemaVersion !== 4) errors.push('schema-version');
  if (contract.componentPhases.some((phase, index) => phase.order !== index)
    || new Set(contract.componentPhases.map((phase) => phase.id)).size !== contract.componentPhases.length) errors.push('phase-definition');
  if (new Set(routes.map((route) => route.route)).size !== routes.length) errors.push('duplicate-route');
  const aliases = contract.compatibilityRoutes ?? [];
  const canonical = routes.map((route) => route.route);
  const aliasRoutes = aliases.map((alias) => alias.route);
  const expectedAliases = [
    { route: '/components/fields/', target: '/components/' },
    ...Object.entries(fields).map(([slug, field]) => ({ route: '/components/fields/' + slug + '/', target: field.route })),
  ];
  if (new Set(aliasRoutes).size !== aliases.length) errors.push('duplicate-alias');
  compare('exact-compatibility', aliases.map((a) => a.route + '>' + a.target), expectedAliases.map((a) => a.route + '>' + a.target));
  for (const alias of aliases) {
    if (canonical.includes(alias.route)) errors.push('alias-canonical-overlap');
    if (aliasRoutes.includes(alias.target)) errors.push('alias-chain-or-loop');
    if (alias.target !== '/components/' && !canonical.includes(alias.target)) errors.push('unknown-alias-target');
    if (redirectTarget(compatibilitySources[alias.route] ?? '') !== alias.target) errors.push('redirect-only-source:' + alias.route);
  }
  compare('contract-vs-source', [...canonical, ...aliasRoutes], sourceRoutes);
  let catalog = [];
  try { catalog = readCatalogProjection(projectionSource, families, registry, fields); }
  catch (error) { errors.push('catalog-projection:' + error.message); }
  compare('primary-navigation', routes.filter((route) => route.tier === 'primary').map((route) => route.route), catalog.map((entry) => entry.route));
  const projectedMembers = catalog.flatMap((entry) => entry.members);
  if (projectedMembers.length !== registry.length || new Set(projectedMembers).size !== projectedMembers.length
    || !equal(projectedMembers, registry.map((item) => item.id))) errors.push('projected-member-coverage');
  if (catalog.some((entry) => entry.id === 'input.fields' || aliasRoutes.includes(entry.route))) errors.push('visible-source-family');
  for (const field of Object.values(fields)) {
    if (!catalog.some((entry) => entry.id === field.stableId && entry.route === field.route)) errors.push('field-projection:' + field.stableId);
  }
  compare('table-navigation', routes.filter((route) => route.parent === '/components/table/').map((route) => route.route), tableChildren);
  compare('field-navigation', routes.filter((route) => route.selection).map((route) => route.route), Object.values(fields).map((field) => field.route));
  if (routes.length !== contract.inventory.expectedTotalDetailRoutes) errors.push('source-count');
  if (tableChildren.length !== contract.inventory.expectedTableChildRoutes) errors.push('table-child-count');
  if (!navigation.includes("import { componentCatalog } from './registry'") || !navigation.includes('...componentCatalog.map')
    || shell.includes('item.children') || navigation.includes('children:')) errors.push('catalog-navigation-wiring');
  for (const route of routes) {
    if (!profiles.has(route.profile)) errors.push('unsupported-profile:' + route.route);
    if (route.standardLayout && route.standardLayout !== 'native-tabs') errors.push('unsupported-layout:' + route.route);
    for (const [id, override] of Object.entries(route.requirements ?? {})) {
      if (!contract.criteria.some((criterion) => criterion.id === id)) errors.push('unknown-criterion:' + id);
      if (override.requirement && !['required', 'conditional', 'na'].includes(override.requirement)) errors.push('invalid-requirement:' + id);
      if (override.requirement === 'na' && !override.rationale) errors.push('missing-na-rationale:' + id);
    }
    for (const [id, override] of Object.entries(route.phaseRequirements ?? {})) {
      if (!contract.componentPhases.some((phase) => phase.id === id)) errors.push('unknown-phase:' + id);
      if (override.requirement && !['required', 'conditional', 'na'].includes(override.requirement)) errors.push('invalid-phase-requirement:' + id);
      if (override.requirement === 'na' && !override.rationale) errors.push('missing-phase-na-rationale:' + id);
    }
    const family = route.selection
      ? families.find((item) => item.members.includes(fields[route.selection.kind]?.stableId))
      : families.find((item) => item.route === (route.parent ?? route.route));
    if (!family || (route.selection && (route.parent || route.tier !== 'primary')) || (route.tier === 'family-child' && (!route.parent || !route.route.startsWith(route.parent)))) errors.push('wrong-parent:' + route.route);
    if (family && (route.stableIds.some((id) => !family.members.includes(id)) || route.stableIds.some((id) => !registry.some((item) => item.id === id)))) errors.push('wrong-stable-id:' + route.route);
    if (route.tier === 'primary' && family && !equal(route.stableIds, route.selection ? [fields[route.selection.kind]?.stableId] : family.members)) errors.push('primary-members:' + route.route);
    if (route.selection) {
      const field = fields[route.selection.kind];
      if (!field || field.route !== route.route || !equal([field.stableId], route.stableIds)) errors.push('field-selection:' + route.route);
    }
  }
  const fieldIds = Object.values(fields).map((field) => field.stableId);
  for (const [slug, field] of Object.entries(fields)) {
    if (field.stableId !== 'input.' + slug || field.route !== '/components/' + slug + '/') errors.push('field-canonical-association:' + slug);
  }
  if (new Set(fieldIds).size !== fieldIds.length) errors.push('duplicate-field-id');
  return errors;
}

export function selectRoutes(routes, selection) {
  if (selection === undefined) return routes;
  const selected = selection.split(',').map((route) => route.trim());
  if (selected.some((route) => !route || !routes.some((item) => item.route === route)) || new Set(selected).size !== selected.length) throw Error('Unknown, duplicate or empty --routes selection');
  return routes.filter((route) => selected.includes(route.route));
}

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else if (entry.name === 'page.tsx') result.push(file);
  }
  return result;
}
async function graphSources(files) {
  const queue = [...files], visited = new Set(), sources = [];
  while (queue.length) {
    const file = queue.shift();
    if (visited.has(file)) continue;
    visited.add(file);
    const source = await readFile(file, 'utf8');
    sources.push(source);
    for (const match of source.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)) {
      const base = path.resolve(path.dirname(file), match[1]);
      for (const suffix of ['', '.ts', '.tsx', '.mjs', '.json', '/index.ts', '/index.tsx']) {
        const candidate = base + suffix;
        if (!candidate.startsWith(path.resolve(docsRoot, '../..'))) continue;
        if (await stat(candidate).then((item) => item.isFile()).catch(() => false)) { queue.push(candidate); break; }
      }
    }
  }
  return sources.join('\n');
}
export async function audit(selection) {
  const read = (file) => readFile(path.join(docsRoot, file), 'utf8');
  const contract = JSON.parse(await read('lib/component-page-content-contract.json'));
  const fields = readFieldMap(await read(contract.inventory.fieldDocumentationFile));
  const sourceRoutes = (await walk(path.join(docsRoot, contract.inventory.sourceRoot)))
    .map((file) => '/' + path.relative(path.join(docsRoot, 'app'), path.dirname(file)).split(path.sep).join('/') + '/')
    .filter((route) => route !== '/components/');
  const families = JSON.parse(await read(contract.inventory.familyRegistryFile)).families;
  const registry = JSON.parse(await read(contract.inventory.registryFile)).components;
  const tableSource = await read(contract.inventory.tableFamilyNavigationFile);
  const tableChildren = sorted([...tableSource.matchAll(/['"](\/components\/table\/[a-z-]+\/)['"]/g)].map((match) => match[1]));
  const errors = checkInventory({ contract, sourceRoutes, families, registry, tableChildren, fields,
    navigation: await read(contract.inventory.navigationFile), shell: await read(contract.inventory.portalShellFile),
    projectionSource: await read(contract.inventory.catalogProjectionFile),
    compatibilitySources: Object.fromEntries(await Promise.all((contract.compatibilityRoutes ?? []).map(async (alias) =>
      [alias.route, await read('app' + alias.route + 'page.tsx').catch(() => '')]))) });
  const reports = [];
  for (const route of selectRoutes(contract.routes, selection)) {
    let evidence;
    try {
      const files = [route.source, ...(route.contentFiles ?? [])];
      const sources = await Promise.all(files.map(read));
      if (route.profile === 'legacy-linear') evidence = checkLegacy(route, sources.join('\n'), await graphSources(files.map((file) => path.join(docsRoot, file))), contract);
      else if (route.profile === 'component-standard') evidence = checkStandard(route, sources, fields);
      else throw Error('Unsupported profile');
      for (const id of route.stableIds) {
        const component = registry.find((item) => item.id === id);
        if (!component || !component.links.figma || !component.links.storybook || !component.links.source
          || !await stat(path.resolve(docsRoot, '../..', component.links.source)).then((item) => item.isFile()).catch(() => false)) {
          evidence.results.push(result('registry-source-existence', false));
        }
      }
    } catch (error) {
      evidence = { results: [result('source', false, error.message)], orderStatus: 'MISSING', phaseOrder: { errors: [error.message] } };
    }
    const contentStatus = evidence.results.some((item) => item.status === 'MISSING') ? 'MISSING' : 'PASS';
    reports.push({ route: route.route, profile: route.profile, ...evidence, contentStatus,
      status: contentStatus === 'PASS' && evidence.orderStatus === 'PASS' ? 'PASS' : 'MISSING' });
  }
  return { schemaVersion: 4, scope: selection === undefined ? 'global' : 'selected (inventory remains global)',
    inventory: { status: errors.length ? 'MISSING' : 'PASS', errors, routes: contract.routes.length, compatibilityRoutes: contract.compatibilityRoutes.length },
    routes: reports, summary: { pass: reports.filter((route) => route.status === 'PASS').length, total: reports.length } };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const index = args.indexOf('--routes');
  const report = await audit(index < 0 ? undefined : args[index + 1] ?? '');
  if (args.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else {
    console.log('INVENTORY', report.inventory);
    for (const route of report.routes) console.log(route.status, route.route, 'profile=' + route.profile,
      'content=' + route.contentStatus, 'order=' + route.orderStatus,
      'missing=' + route.results.filter((item) => item.status === 'MISSING').map((item) => item.id).join(','),
      route.phaseOrder.errors);
    console.log('SUMMARY', report.scope, report.summary);
  }
  if (args.includes('--strict') && (report.inventory.errors.length || report.summary.pass !== report.summary.total)) process.exitCode = 1;
}
