const { join } = require('node:path');
const { readFileSync } = require('node:fs');
const stringHash = require('string-hash');
const { homepage } = require('../package.json');

const root = process.cwd();

const rootResolve = (...path) => join(root, ...path);
const siteUrl = (path) => new URL(path, homepage).href;

const fileHash = (...path) => {
  const content = readFileSync(join(root, ...path), 'utf8');
  return stringHash(content, 'utf8').toString(36).slice(0, 5);
};

const isString = (val) => typeof val === 'string';

const isAbsoluteUrl = (url) => {
  return isString(url) && url.startsWith('https://');
};

module.exports = {
  rootResolve,
  siteUrl,
  fileHash,
  isString,
  isAbsoluteUrl,
};
