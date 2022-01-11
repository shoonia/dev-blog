const { readFile, writeFile } = require('fs/promises');
const { minify } = require('terser');

const { rootResolve } = require('../util/paths');

const from = rootResolve('src/vendor.js');
const to = rootResolve('public/static/vendor.js');

exports.createVendorScript = async () => {
  const source = await readFile(from, 'utf8');
  const { code } = await minify(`{${source}}`);

  await writeFile(to, code);
};
