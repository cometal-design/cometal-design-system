import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { checkStandard, checkChooser, checkLegacy, checkInventory, readFieldMap, selectRoutes } from './validate-component-page-content.mjs';

const read = (file) => readFile(new URL('../' + file, import.meta.url), 'utf8');
const contract = JSON.parse(await read('lib/component-page-content-contract.json'));
const fieldSource = await read('components/field-detail.tsx');
const fields = readFieldMap(await read('lib/field-documentation.ts'));
const route = contract.routes.find((item) => item.selection?.kind === 'text-field');
const entry = await read(route.source);
const chooser = await read('app/components/fields/page.tsx');
const families = JSON.parse(await read(contract.inventory.familyRegistryFile)).families;
const registry = JSON.parse(await read(contract.inventory.registryFile)).components;
const model = {
  contract, fields, families, registry,
  sourceRoutes: contract.routes.map((item) => item.route),
  tableChildren: contract.routes.filter((item) => item.parent === '/components/table/').map((item) => item.route),
  navigation: await read('lib/navigation.ts'), shell: await read('components/portal-shell.tsx'),
};
const allPass = (report) => report.orderStatus === 'PASS' && report.results.every((item) => item.status !== 'MISSING');
const standard = (source = fieldSource, selected = fields, page = entry, config = route) => checkStandard(config, [page, source], selected);

test('standard selected field succeeds; shared shell does not supply content', () => assert.ok(allPass(standard())));
test('missing panel fails', () => assert.equal(allPass(standard(fieldSource.replace('accessibility={accessibility}', ''))), false));
test('missing usage fails order and content', () => assert.equal(allPass(standard(fieldSource.replace('<h2>Использование</h2>', '<h2>Другое</h2>'))), false));
test('missing example code fails', () => assert.equal(allPass(standard(fieldSource.replace(/code=\{fieldCode\(kind,[\s\S]*?\)\}/, ''))), false));
test('missing property description fails', () => assert.equal(allPass(standard(fieldSource.replace('description="Размер control без изменения его семантики."', ''))), false));
test('wrong stable ID fails', () => {
  const wrong = structuredClone(fields);
  wrong['text-field'].stableId = 'input.text-area';
  assert.equal(allPass(standard(fieldSource, wrong)), false);
});
test('sibling content cannot satisfy empty selected config', () => {
  const wrong = structuredClone(fields);
  wrong['text-field'].anatomy = '';
  assert.ok(wrong['text-area'].anatomy);
  assert.equal(allPass(standard(fieldSource, wrong)), false);
});
test('sibling JSX cannot replace selected actual component', () => {
  const wrong = fieldSource.replace(/case 'text-field':[\s\S]*?case 'text-area':/, "case 'text-field': return <p>No input</p>; case 'text-area':");
  assert.ok(wrong.includes('<TextArea'));
  assert.equal(allPass(standard(wrong)), false);
});
test('wrong route kind fails', () => assert.equal(allPass(standard(fieldSource, fields, entry.replace('kind="text-field"', 'kind="text-area"'))), false));
test('unused shared detail cannot satisfy route wiring', () => assert.equal(allPass(standard(fieldSource, fields, entry.replace('<FieldDetail kind="text-field" />', '<p>Empty route</p>'))), false));
test('chooser succeeds and missing child link fails', () => {
  assert.ok(allPass(checkChooser(chooser, fields)));
  assert.equal(allPass(checkChooser(chooser.replaceAll('href={doc.route}', 'href="/"'), fields)), false);
});
test('legacy Table full phase fixture succeeds and inversion fails', () => {
  const fixture = contract.componentPhases.map((phase) => '<section data-component-phase="' + phase.id + '">Table</section>').join('\n');
  const minimal = { ...contract, criteria: [{ id: 'table-source', defaultRequirement: 'required', evidence: { clauses: [{ all: ['Table'] }] } }] };
  assert.ok(allPass(checkLegacy({}, fixture, '', minimal)));
  assert.equal(allPass(checkLegacy({}, fixture.replace('phase="overview"', 'phase="code"'), '', minimal)), false);
});
test('global inventory succeeds', () => assert.deepEqual(checkInventory(model), []));
test('duplicate route fails', () => {
  const next = structuredClone(model);
  next.contract.routes.push(next.contract.routes[0]);
  assert.ok(checkInventory(next).includes('duplicate-route'));
});
test('unknown source route fails', () => {
  assert.ok(checkInventory({ ...model, sourceRoutes: [...model.sourceRoutes, '/components/unknown/'] }).includes('contract-vs-source'));
});
test('wrong parent fails', () => {
  const next = structuredClone(model);
  next.contract.routes.find((item) => item.selection).parent = '/components/table/';
  assert.ok(checkInventory(next).some((error) => error.startsWith('wrong-parent:')));
});
test('missing navigation wiring fails', () => {
  assert.ok(checkInventory({ ...model, navigation: model.navigation.replace('fieldSlugs.map', 'unrelated.map') }).includes('field-navigation-wiring'));
});
test('missing Table child fails global inventory even for targeted selection', () => {
  assert.ok(checkInventory({ ...model, tableChildren: model.tableChildren.slice(1) }).includes('table-navigation'));
  assert.equal(selectRoutes(contract.routes, route.route).length, 1);
});
test('unsupported profile fails', () => {
  const next = structuredClone(model);
  next.contract.routes[0].profile = 'bypass';
  assert.ok(checkInventory(next).some((error) => error.startsWith('unsupported-profile:')));
});
test('empty, unknown and duplicate bounded selections fail', () => {
  for (const selection of ['', '/components/nope/', route.route + ',' + route.route, route.route + ',']) {
    assert.throws(() => selectRoutes(contract.routes, selection));
  }
});

test('existing native Button panel layout is inspected rather than falsely rejected', async () => {
  const button = contract.routes.find((item) => item.route === '/components/button/');
  const sources = await Promise.all([button.source, ...button.contentFiles].map(read));
  const report = checkStandard(button, sources, fields);
  assert.equal(report.orderStatus, 'PASS');
  assert.deepEqual(report.results.filter((item) => item.status === 'MISSING').map((item) => item.id), ['responsive-theme-edge']);
  sources[0] = sources[0].replace('value="react-api"', 'value="unknown"');
  assert.equal(checkStandard(button, sources, fields).orderStatus, 'MISSING');
});

test('invalid legacy requirement or phase definition is never silently accepted', () => {
  const next = structuredClone(model);
  next.contract.componentPhases[0].order = 5;
  next.contract.routes[0].requirements.identity.requirement = 'skip';
  assert.ok(checkInventory(next).includes('phase-definition'));
  assert.ok(checkInventory(next).includes('invalid-requirement:identity'));
});
