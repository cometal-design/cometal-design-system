import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSvgRootPresentation } from './svg-root-presentation.mjs';

const record = Object.freeze({
  canonicalName: 'Outline/test/example',
  intrinsicWidth: 24,
  intrinsicHeight: 24,
  viewBox: Object.freeze([0, 0, 24, 24]),
});
const valid = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path/></svg>';

test('parses the complete strict Outline root contract', () => {
  assert.deepEqual(parseSvgRootPresentation(valid, record), { fill: 'none' });
});

for (const [name, source, pattern] of [
  ['unknown', valid.replace(' fill=', ' color="red" fill='), /unknown attribute color/],
  ['duplicate', valid.replace(' fill=', ' width="24" fill='), /duplicate attribute width/],
  ['missing', valid.replace(' fill="none"', ''), /missing attribute fill/],
  ['malformed', valid.replace('width="24"', 'width=24'), /must be quoted/],
  ['unconsumed', valid.replace(' height=', '/ height='), /unconsumed root syntax/],
  ['wrong width', valid.replace('width="24"', 'width="25"'), /does not match manifest/],
  ['wrong height', valid.replace('height="24"', 'height="25"'), /does not match manifest/],
  ['wrong viewBox', valid.replace('0 0 24 24', '0 0 20 20'), /viewBox does not match manifest/],
  ['wrong fill', valid.replace('fill="none"', 'fill="None"'), /fill must be the literal none/],
  ['wrong namespace', valid.replace('http://www.w3.org/2000/svg', 'urn:svg'), /xmlns must be/],
  ['unterminated', valid.replace('width="24"', 'width="24'), /unterminated opening tag/],
]) {
  test(`rejects ${name} root input`, () => {
    assert.throws(() => parseSvgRootPresentation(source, record), pattern);
  });
}
