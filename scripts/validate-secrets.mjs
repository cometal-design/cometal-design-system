import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const { stdout } = await execFileAsync('git', ['ls-files', '-z']);
const files = stdout.split('\0').filter(Boolean);
const forbiddenFiles = files.filter((file) => /(^|\/)\.env(?:\.|$)/.test(file) && !file.endsWith('.env.example'));
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bghp_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
];
const findings = forbiddenFiles.map((file) => `${file}: tracked environment file`);

for (const file of files) {
  if (/\.(?:png|jpe?g|gif|webp|woff2?|ttf|otf|pdf)$/i.test(file)) continue;
  const content = await readFile(file, 'utf8').catch(() => '');
  for (const pattern of patterns) {
    if (pattern.test(content)) findings.push(`${file}: matches forbidden secret pattern`);
  }
}

if (findings.length) {
  console.error(['Secret validation failed:', ...findings.map((finding) => `- ${finding}`)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Secret validation passed for ${files.length} tracked file(s).`);
}
