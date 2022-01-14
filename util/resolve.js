const { resolve } = require('path');

const root = process.cwd();

exports.resolve = (...path) => resolve(root, ...path);
