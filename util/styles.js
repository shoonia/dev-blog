const { readFile } = require('fs/promises');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');

const { resolve } = require('./resolve');

exports.getClassNames = async () => {
  const path = resolve('src/assets/styles.css');

  const source = await readFile(path, 'utf8');

  let jsonData;

  await postcss(
    postcssModules({
      getJSON(_, json) {
        jsonData = json;
      },
    }),
  ).process(source);

  return new Set(Object.keys(jsonData));
};

exports.isPrismeJsClass = (val) => {
  return typeof val === 'string' && val.startsWith('token ');
};
