const { fileHashSync } = require('./halpers');

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  isProd: process.env.NODE_ENV === 'production',
  debug: Boolean(process.env.DEBUG),
  cssHash: fileHashSync('src/assets/styles.css'),
  jsHash: fileHashSync('src/assets/vendor.js'),
};
