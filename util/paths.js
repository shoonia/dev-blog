const { resolve } = require('path');

const root = process.cwd();

exports.rootResolve = (...path) => {
  return resolve(root, ...path);
};
