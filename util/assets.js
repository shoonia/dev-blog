const { readFile, writeFile } = require('fs/promises');
const { minify } = require('terser');

const { isProd } = require('./env');
const { rootResolve } = require('./halpers');

const jsFrom = rootResolve('src/assets/vendor.js');
const jsTo = rootResolve('public/assets/vendor.js');
const cssTo = rootResolve('public/assets/styles.css');

const minifyJs = async () => {
  const source = await readFile(jsFrom, 'utf8');
  const { code } = await minify(source);

  await writeFile(jsTo, code);
};

exports.compileAssets = async (css) => {
  const tasks = [
    writeFile(cssTo, css),
  ];

  if (isProd) {
    tasks.push(minifyJs());
  }

  await Promise.all(tasks);
};
