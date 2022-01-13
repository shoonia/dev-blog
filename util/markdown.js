const { readFile } = require('fs/promises');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const { rootResolve } = require('./paths');

exports.getClassNames = async () => {
  const path = rootResolve('src/components/Markdown/one-dark.css');
  const css = await readFile(path, 'utf8');

  let jsonData;

  await postcss(
    postcssModules({
      getJSON: (_, json) => {
        jsonData = json;
      },
    }),
  ).process(css);

  return Object.keys(jsonData).reduce((acc, key) => acc.add(key), new Set());
};

exports.isPrismeJsClass = (val) => {
  return typeof val === 'string' && val.startsWith('token ');
};
