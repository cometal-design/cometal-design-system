const allowedRootAttributes = Object.freeze(['width', 'height', 'viewBox', 'fill', 'xmlns']);
const allowedRootAttributeSet = new Set(allowedRootAttributes);
const svgNamespace = 'http://www.w3.org/2000/svg';

function fail(record, message) {
  throw new Error(`[icons] invalid Outline root for ${record.canonicalName}: ${message}`);
}

function openingSvgAttributes(svg, record) {
  if (!svg.startsWith('<svg') || !/\s/.test(svg[4] ?? '')) fail(record, 'missing strict opening <svg>');
  let index = 4;
  let quote;
  let end = -1;
  for (; index < svg.length; index += 1) {
    const character = svg[index];
    if (quote) {
      if (character === quote) quote = undefined;
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === '>') {
      end = index;
      break;
    } else if (character === '<') fail(record, 'malformed opening tag');
  }
  if (quote || end < 0) fail(record, 'unterminated opening tag');
  const source = svg.slice(4, end);
  const attributes = new Map();
  index = 0;
  while (index < source.length) {
    const whitespaceStart = index;
    while (/\s/.test(source[index] ?? '')) index += 1;
    if (index === source.length) break;
    if (index === whitespaceStart) fail(record, `unconsumed root syntax at offset ${index}`);
    const nameMatch = /^[A-Za-z_:][A-Za-z0-9_.:-]*/.exec(source.slice(index));
    if (!nameMatch) fail(record, `malformed attribute at offset ${index}`);
    const name = nameMatch[0];
    index += name.length;
    while (/\s/.test(source[index] ?? '')) index += 1;
    if (source[index] !== '=') fail(record, `attribute ${name} is missing =`);
    index += 1;
    while (/\s/.test(source[index] ?? '')) index += 1;
    const attributeQuote = source[index];
    if (attributeQuote !== '"' && attributeQuote !== "'") fail(record, `attribute ${name} must be quoted`);
    index += 1;
    const valueStart = index;
    while (index < source.length && source[index] !== attributeQuote) index += 1;
    if (index >= source.length) fail(record, `attribute ${name} has an unterminated value`);
    const value = source.slice(valueStart, index);
    index += 1;
    if (!allowedRootAttributeSet.has(name)) fail(record, `unknown attribute ${name}`);
    if (attributes.has(name)) fail(record, `duplicate attribute ${name}`);
    attributes.set(name, value);
  }
  for (const name of allowedRootAttributes) {
    if (!attributes.has(name)) fail(record, `missing attribute ${name}`);
  }
  return attributes;
}

function numericTuple(value, length, record, name) {
  const parts = value.trim().split(/\s+/);
  const numbers = parts.map(Number);
  if (parts.length !== length || numbers.some((number) => !Number.isFinite(number))) {
    fail(record, `malformed ${name}`);
  }
  return numbers;
}

export function parseSvgRootPresentation(svg, record) {
  const attributes = openingSvgAttributes(svg, record);
  const width = numericTuple(attributes.get('width'), 1, record, 'width')[0];
  const height = numericTuple(attributes.get('height'), 1, record, 'height')[0];
  const viewBox = numericTuple(attributes.get('viewBox'), 4, record, 'viewBox');
  if (width !== record.intrinsicWidth) fail(record, `width ${width} does not match manifest ${record.intrinsicWidth}`);
  if (height !== record.intrinsicHeight) fail(record, `height ${height} does not match manifest ${record.intrinsicHeight}`);
  if (viewBox.some((value, index) => value !== record.viewBox[index])) fail(record, 'viewBox does not match manifest');
  if (attributes.get('fill') !== 'none') fail(record, 'fill must be the literal none');
  if (attributes.get('xmlns') !== svgNamespace) fail(record, `xmlns must be ${svgNamespace}`);
  return Object.freeze({ fill: 'none' });
}
