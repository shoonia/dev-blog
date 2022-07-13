const { readFile, writeFile } = require('node:fs/promises');
const { minify } = require('terser');

const { isProd } = require('./env');
const { rootResolve } = require('./halpers');
const { minifyJs } = require('./configs');

const jsFrom = rootResolve('src/assets/vendor.js');
const jsTo = rootResolve('public/assets/vendor.js');

exports.compileJs = async () => {
  if (isProd) {
    const source = await readFile(jsFrom, 'utf8');
    const { code } = await minify(source, minifyJs);

    await writeFile(jsTo, code);
  }
};
