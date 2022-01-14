const { readFile, writeFile } = require('fs/promises');
const { minify } = require('terser');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const { resolve } = require('./resolve');

const script = resolve('public/assets/vendor.js');
const styles = resolve('public/assets/styles.css');

exports.vendorScript = async () => {
  const source = await readFile(script, 'utf8');
  const { code } = await minify(source);

  await writeFile(script, code);
};

exports.vendorStyles = async () => {
  const source = await readFile(styles, 'utf8');
  const { css } = await postcss([
    cssnano(),
    autoprefixer(),
  ]).process(source);

  await writeFile(styles, css);
};
