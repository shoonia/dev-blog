import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import stringHash from 'string-hash';

import { pkg } from './env.js';

const root = process.cwd();

export const rootResolve = (...path) => join(root, ...path);
export const siteUrl = (path) => new URL(path, pkg.homepage).href;

export const fileHash = (...path) => {
  const content = readFileSync(join(root, ...path), 'utf8');
  return stringHash(content).toString(36).slice(0, 5);
};

export const isString = (val) => typeof val === 'string';

export const isAbsoluteUrl = (url) => {
  return isString(url) && url.startsWith('https://');
};
