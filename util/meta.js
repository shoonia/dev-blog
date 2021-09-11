const pkg = require('../package.json');

exports.createUrl = (path) => {
  return new URL(path, pkg.homepage).href;
};
