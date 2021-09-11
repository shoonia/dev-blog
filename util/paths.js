const { resolve } = require('path');
const { realpathSync } = require('fs');

const root = realpathSync(process.cwd());

exports.rootResolve = (...path) => {
  return resolve(root, ...path);
};
