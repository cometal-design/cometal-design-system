import registry from '../../../registry/components.json';

export type RegistryComponent = (typeof registry.components)[number];

export const components = registry.components;

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
