const { resolve } = require('node:path');
const { readFileSync } = require('node:fs');
const stringHash = require('string-hash');
const { homepage } = require('../package.json');

const root = process.cwd();

const rootResolve = (...path) => resolve(root, ...path);
const siteUrl = (path) => new URL(path, homepage).href;

const fileHashSync = (path) => {
  return stringHash(readFileSync(rootResolve(path), 'utf8')).toString(36).substring(0, 5);
};

const isString = (val) => typeof val === 'string';

const isAbsoluteUrl = (url) => {
  return isString(url) && url.startsWith('https://');
};

module.exports = {
  rootResolve,
  siteUrl,
  fileHashSync,
  isString,
  isAbsoluteUrl,
};
