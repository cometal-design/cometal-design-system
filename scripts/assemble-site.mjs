import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const portalOutput = resolve(root, 'apps/docs/out');
const storybookOutput = resolve(root, 'apps/storybook/storybook-static');
const siteOutput = resolve(root, 'apps/storybook/site-static');

await rm(siteOutput, { recursive: true, force: true });
await mkdir(siteOutput, { recursive: true });
await cp(portalOutput, siteOutput, { recursive: true });
await cp(storybookOutput, resolve(siteOutput, 'storybook'), { recursive: true });

console.log('Cometal portal assembled:');
console.log(`- portal: ${siteOutput}`);
console.log(`- Storybook: ${resolve(siteOutput, 'storybook')}`);
