import usageSource from '../../../registry/component-usage.json';

export type UsageExample = {
  packageName: string;
  availability: 'beta-target' | 'published';
  install: string;
  import: string;
  example: string;
};

export const usageExamples = usageSource as Record<string, UsageExample>;
