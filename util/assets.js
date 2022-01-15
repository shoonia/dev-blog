const { readFile, writeFile } = require('fs/promises');
const { minify } = require('terser');

const { resolve } = require('./resolve');

const script = resolve('public/assets/vendor.js');
const styles = resolve('public/assets/styles.css');

exports.compileAssets = async (isProd, css) => {
  const tasks = [writeFile(styles, css)];

  if (isProd) {
    tasks.push(
      (async () => {
        const source = await readFile(script, 'utf8');
        const { code } = await minify(source);

        await writeFile(script, code);
      })(),
    );
  }

  await Promise.all(tasks);
};
