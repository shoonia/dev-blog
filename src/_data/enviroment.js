const { fileHashSync } = require('../../util/resolve');

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  cssHash: fileHashSync('src/assets/styles.css'),
  jsHash: fileHashSync('src/assets/vendor.js'),
};
