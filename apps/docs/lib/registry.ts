import registry from '../../../registry/components.json';
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

export const componentCatalog = componentFamilies.map((family) => {
  const members = family.members.map((id) => {
    const component = components.find((candidate) => candidate.id === id);
    if (!component) throw new Error(`Unknown registry member ${id} in family ${family.id}`);
    return component;
  });
  const status = members.every((component) => component.status === 'ready') ? 'ready' : 'in-review';
  return {
    ...family,
    status,
    checks: Math.min(...members.map(checksComplete)),
    version: members[0].version ?? 'unversioned',
  };
});
