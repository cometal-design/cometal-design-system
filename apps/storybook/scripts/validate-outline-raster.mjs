import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { iconManifest, iconManifestMetadata } from '@cometal/react/icons/manifest';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(appRoot, '../..');
const reactRoot = path.join(repositoryRoot, 'packages/react');
const outlineRecords = iconManifest.filter((record) => record.library === 'outline');
const sizes = Object.freeze([24, 96]);

function fail(message) {
  throw new Error(`[outline-raster] ${message}`);
}

async function rasterBatch(page, batch) {
  return page.evaluate(async ({ items, scales }) => {
    const raster = async (markup, size) => {
      const host = document.createElement('div');
      host.innerHTML = markup;
      const svg = host.querySelector('svg');
      if (!svg) throw new Error('markup has no SVG root');
      svg.setAttribute('width', String(size));
      svg.setAttribute('height', String(size));
      svg.style.color = '#292929';
      svg.style.display = 'block';
      const serialized = new XMLSerializer().serializeToString(svg);
      const image = new Image();
      const url = URL.createObjectURL(new Blob([serialized], { type: 'image/svg+xml' }));
      try {
        image.src = url;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('2D canvas is unavailable');
        context.clearRect(0, 0, size, size);
        context.drawImage(image, 0, 0, size, size);
        return context.getImageData(0, 0, size, size).data;
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    const mismatches = [];
    for (const item of items) {
      for (const size of scales) {
        const [source, runtime] = await Promise.all([raster(item.source, size), raster(item.runtime, size)]);
        if (source.length !== runtime.length) {
          mismatches.push({ canonicalName: item.canonicalName, size, reason: 'RGBA length mismatch' });
          continue;
        }
        let mismatchIndex = -1;
        for (let index = 0; index < source.length; index += 1) {
          if (source[index] !== runtime[index]) {
            mismatchIndex = index;
            break;
          }
        }
        if (mismatchIndex >= 0) {
          mismatches.push({
            canonicalName: item.canonicalName,
            size,
            pixel: Math.floor(mismatchIndex / 4),
            channel: mismatchIndex % 4,
            source: source[mismatchIndex],
            runtime: runtime[mismatchIndex],
          });
        }
      }
    }
    return mismatches;
  }, { items: batch, scales: sizes });
}

if (iconManifestMetadata.sourceFingerprintSha256 !== '510fb7514e9f5643ec25bb2ec22bb34c94fe38c147d76d676e15a2881b7d22ea') {
  fail(`unexpected source fingerprint ${iconManifestMetadata.sourceFingerprintSha256}`);
}
if (outlineRecords.length !== 875) fail(`expected 875 Outline records, received ${outlineRecords.length}`);

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.setContent('<!doctype html><html><body style="margin:0;background:transparent;color:#292929"></body></html>');
  let compared = 0;
  for (let offset = 0; offset < outlineRecords.length; offset += 20) {
    const records = outlineRecords.slice(offset, offset + 20);
    const batch = await Promise.all(records.map(async (record) => {
      const module = await import(record.importPath);
      if (module.definition.sourceSha256 !== record.sourceSha256) fail(`built source hash mismatch: ${record.canonicalName}`);
      return {
        canonicalName: record.canonicalName,
        source: await readFile(path.join(reactRoot, record.sourcePath), 'utf8'),
        runtime: renderToStaticMarkup(React.createElement(module.default)),
      };
    }));
    const mismatches = await rasterBatch(page, batch);
    if (mismatches.length) {
      const mismatch = mismatches[0];
      fail(`RGBA mismatch: ${mismatch.canonicalName} at ${mismatch.size}x${mismatch.size}; ${JSON.stringify(mismatch)}`);
    }
    compared += batch.length;
  }
  await context.close();
  console.log(`[outline-raster] exact RGBA parity: ${compared}/${outlineRecords.length} records at ${sizes.join('x and ')}x, Chromium DPR1, transparent, currentColor #292929, no skips`);
} finally {
  await browser.close();
}
