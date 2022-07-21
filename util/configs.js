/** @type {import('terser').MinifyOptions} */
exports.minifyJs = {
  ecma: 2020,
  module: true,
  toplevel: true,
  compress: {
    ecma: 2020,
    module: true,
    comparisons: false,
    inline: 2,
    passes: 3,
    toplevel: true,
    pure_getters: true,
  },
};
