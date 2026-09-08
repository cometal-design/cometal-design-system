import usageSource from '../../../registry/component-usage.json';

const usageAvailabilities = ['beta-target', 'published'] as const;

export type UsageExample = {
  packageName: string;
  availability: (typeof usageAvailabilities)[number];
  install: string;
  import: string;
  example: string;
};

function isUsageExample(value: unknown): value is UsageExample {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.packageName === 'string' &&
    usageAvailabilities.includes(candidate.availability as UsageExample['availability']) &&
    typeof candidate.install === 'string' &&
    typeof candidate.import === 'string' &&
    typeof candidate.example === 'string'
  );
}

function isUsageRegistry(value: unknown): value is Record<string, UsageExample> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(isUsageExample)
  );
}

if (!isUsageRegistry(usageSource)) {
  throw new Error('registry/component-usage.json contains an unsupported usage example');
}

export const usageExamples: Record<string, UsageExample> = usageSource;
