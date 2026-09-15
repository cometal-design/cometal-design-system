import registry from '../../../registry/components.json';
import { fieldDocumentation } from './field-documentation';
import familyRegistry from '../../../registry/component-families.json';

export type RegistryComponent = (typeof registry.components)[number];

export const components = registry.components;
export const componentFamilies = familyRegistry.families;

export const statusLabels: Record<string, string> = {
  candidate: 'Candidate',
  beta: 'Beta',
  ready: 'Ready',
  blocked: 'Blocked',
  'in-review': 'In review',
};

export function checksComplete(component: RegistryComponent) {
  return Object.values(component.checks).filter(Boolean).length;
}

// Source families remain governance records; this is the sole portal projection.
export function buildComponentCatalog(
  families: typeof componentFamilies,
  registered: RegistryComponent[],
  fields: typeof fieldDocumentation,
) {
  const fieldEntries = Object.values(fields);
  const fieldFamily = families.find((family) => family.id === 'input.fields');
  if (!fieldFamily || fieldEntries.length !== fieldFamily.members.length
    || new Set(fieldEntries.map((entry) => entry.stableId)).size !== fieldEntries.length
    || fieldEntries.some((entry) => !fieldFamily.members.includes(entry.stableId))) {
    throw new Error('Portal fields must cover their exact source-family members');
  }
  const seen = new Set<string>();
  const routes = new Set<string>();
  const catalog = families.flatMap((family) => {
    const members = family.members.map((id) => {
      const component = registered.find((candidate) => candidate.id === id);
      if (!component || seen.has(id)) throw new Error(`Unknown or duplicate portal member ${id}`);
      seen.add(id);
      return component;
    });
    if (family.id === 'input.fields') return members.map((component) => {
      const doc = fieldEntries.find((entry) => entry.stableId === component.id);
      if (!doc) throw new Error(`Missing portal association ${component.id}`);
      return {
        ...family, id: component.id, name: component.name, route: doc.route,
        description: doc.summary, members: [component.id], aliases: [],
        preview: component.id, figma: component.links.figma,
        status: component.status, checks: checksComplete(component),
        version: component.version ?? 'unversioned',
      };
    });
    return [{
      ...family,
      status: members.every((component) => component.status === 'ready') ? 'ready' : 'in-review',
      checks: Math.min(...members.map(checksComplete)),
      version: members[0].version ?? 'unversioned',
    }];
  });
  if (seen.size !== registered.length) throw new Error('Portal must cover every registered component exactly once');
  for (const entry of catalog) {
    if (routes.has(entry.route)) throw new Error(`Duplicate portal route ${entry.route}`);
    routes.add(entry.route);
  }
  return catalog;
}

export const componentCatalog = buildComponentCatalog(componentFamilies, components, fieldDocumentation);
