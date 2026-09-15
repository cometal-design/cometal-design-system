import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { checkStandard, readCatalogProjection, checkLegacy, checkInventory, readFieldMap, selectRoutes } from './validate-component-page-content.mjs';

const read = (file) => readFile(new URL('../' + file, import.meta.url), 'utf8');
const contract = JSON.parse(await read('lib/component-page-content-contract.json'));
const fieldSource = await read('components/field-detail.tsx');
const fields = readFieldMap(await read('lib/field-documentation.ts'));
const route = contract.routes.find((item) => item.selection?.kind === 'text-field');
const entry = await read(route.source);
const families = JSON.parse(await read(contract.inventory.familyRegistryFile)).families;
const registry = JSON.parse(await read(contract.inventory.registryFile)).components;
const model = {
  contract, fields, families, registry,
  sourceRoutes: [...contract.routes, ...contract.compatibilityRoutes].map((item) => item.route),
  projectionSource: await read('lib/registry.ts'),
  compatibilitySources: Object.fromEntries(await Promise.all(contract.compatibilityRoutes.map(async (item) => [item.route, await read('app' + item.route + 'page.tsx')]))),
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
  assert.ok(checkInventory({ ...model, navigation: model.navigation.replace('componentCatalog.map', 'unrelated.map') }).includes('catalog-navigation-wiring'));
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

test('canonical projection has 16 entries and exact per-member field metadata', () => {
  const catalog = readCatalogProjection(model.projectionSource, families, registry, fields);
  assert.equal(catalog.length, 16);
  assert.equal(catalog.some((entry) => entry.id === 'input.fields'), false);
  assert.deepEqual(catalog.flatMap((entry) => entry.members).sort(), registry.map((entry) => entry.id).sort());
  for (const field of Object.values(fields)) {
    const entry = catalog.find((entry) => entry.id === field.stableId);
    const member = registry.find((entry) => entry.id === field.stableId);
    assert.equal(entry.route, field.route);
    assert.equal(entry.name, member.name);
    assert.equal(entry.status, member.status);
    assert.equal(entry.figma, member.links.figma);
    assert.equal(entry.checks, Object.values(member.checks).filter(Boolean).length);
  }
});
test('projection rejects missing, unknown and duplicate family members', () => {
  for (const mutation of ['missing', 'unknown', 'duplicate']) {
    const next = structuredClone(families);
    const family = next.find((entry) => entry.id === 'input.fields');
    if (mutation === 'missing') family.members.pop();
    if (mutation === 'unknown') family.members[0] = 'input.unknown';
    if (mutation === 'duplicate') family.members[0] = family.members[1];
    assert.throws(() => readCatalogProjection(model.projectionSource, next, registry, fields));
  }
});
test('compatibility aliases are exact, not canonical content', () => {
  assert.equal(contract.routes.length, 20);
  assert.equal(contract.compatibilityRoutes.length, 6);
  assert.equal(contract.routes.some((route) => route.route.startsWith('/components/fields/')), false);
  assert.throws(() => selectRoutes(contract.routes, '/components/fields/'));
  const missingCanonical = { ...model, sourceRoutes: model.sourceRoutes.filter((item) => item !== route.route) };
  assert.ok(checkInventory(missingCanonical).includes('contract-vs-source'));
});
test('field route association cannot drift together with the projection', () => {
  const next = structuredClone(model);
  next.fields['text-field'].route = '/components/invented-field/';
  assert.ok(checkInventory(next).includes('field-canonical-association:text-field'));
});
for (const scenario of ['missing', 'extra', 'wrong-target', 'duplicate', 'loop', 'chain', 'overlap', 'content-stub']) {
  test('bad compatibility mapping fails: ' + scenario, () => {
    const next = structuredClone(model);
    const aliases = next.contract.compatibilityRoutes;
    if (scenario === 'missing') aliases.pop();
    if (scenario === 'extra') aliases.push({ route: '/components/legacy/', target: '/components/' });
    if (scenario === 'wrong-target') aliases[0].target = '/components/unknown/';
    if (scenario === 'duplicate') aliases.push(aliases[0]);
    if (scenario === 'loop') aliases[0].target = aliases[0].route;
    if (scenario === 'chain') aliases[0].target = aliases[1].route;
    if (scenario === 'overlap') aliases[0].route = route.route;
    if (scenario === 'content-stub') next.compatibilitySources[aliases[0].route] += '\nexport const content = <h1>Fields</h1>;';
    assert.ok(checkInventory(next).length > 0);
  });
}
