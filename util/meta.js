const pkg = require('../package.json');

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

exports.title = pkg.title;
exports.description = pkg.description;
exports.author = pkg.author;
exports.homepage = isProd ? pkg.homepage : 'http://localhost:8000';
exports.isProd = isProd;
exports.isDev = isDev;

exports.createUrl = (path) => {
  return new URL(path, pkg.homepage).href;
};
