import primitiveSource from '../../../packages/tokens/src/primitive.tokens.json';
import semanticSource from '../../../packages/tokens/src/semantic.tokens.json';

export type TokenValue =
  | string
  | number
  | { value: number; unit: string }
  | { colorSpace: string; components: number[]; alpha?: number };

export type FoundationToken = {
  name: string;
  type: string;
  value: TokenValue;
};

export function collectTokens(
  node: unknown,
  path: string[] = [],
  result: FoundationToken[] = [],
): FoundationToken[] {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return result;
  const object = node as Record<string, unknown>;

  if ('$type' in object && '$value' in object) {
    const figma = (object.$extensions as Record<string, Record<string, string>> | undefined)?.['com.cometal.figma'];
    result.push({
      name: figma?.name ?? path.filter((part) => part !== '$root').join('/'),
      type: String(object.$type),
      value: object.$value as TokenValue,
    });
  }

  for (const [key, value] of Object.entries(object)) {
    if (key === '$root') collectTokens(value, path, result);
    else if (!key.startsWith('$')) collectTokens(value, [...path, key], result);
  }

  return result;
}

export const primitiveTokens = collectTokens(primitiveSource.Primitive);
export const semanticTokens = collectTokens(semanticSource.Semantic);

const primitiveByReference = new Map(
  primitiveTokens.map((token) => [`Primitive.${token.name.replaceAll('/', '.')}`, token]),
);

export function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const group = key(item);
    groups.set(group, [...(groups.get(group) ?? []), item]);
  }
  return groups;
}

export function cssValue(value: TokenValue): string {
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string') {
    const referenced = primitiveByReference.get(value.replace(/^\{|\}$/g, ''));
    return referenced ? cssValue(referenced.value) : value;
  }
  if ('value' in value) return `${value.value}${value.unit}`;
  const [r, g, b] = value.components.map((part) => Math.round(part * 255));
  return `rgba(${r}, ${g}, ${b}, ${value.alpha ?? 1})`;
}

export function aliasName(value: TokenValue): string {
  return typeof value === 'string' && value.startsWith('{')
    ? value.slice(1, -1).replace(/^Primitive\./, 'Primitive / ').replaceAll('.', ' / ')
    : '—';
}

export function numericValue(value: TokenValue): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && 'value' in value) return value.value;
  return 0;
}
