const { resolve: pathResolve } = require('path');
const { readFileSync } = require('fs');
const stringHash = require('string-hash');

const root = process.cwd();

const resolve = (...path) => pathResolve(root, ...path);

exports.fileHashSync = (path) => {
  return stringHash(readFileSync(resolve(path), 'utf8')).toString(36).substring(0, 5);
};

exports.resolve = resolve;
