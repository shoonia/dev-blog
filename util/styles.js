const { readFile } = require('fs/promises');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const miniCssClassName = require('mini-css-class-name/postcss-modules');

const { resolve } = require('./resolve');

const miniClass = true;

exports.getClassNames = async (isProd) => {
  const path = resolve('src/assets/styles.css');

  let jsonData;

  const source = await readFile(path, 'utf8');

  const { css } = await postcss([
    miniClass && postcssModules({
      getJSON(_, json) {
        jsonData = json;
      },
      generateScopedName: miniCssClassName({ excludePattern: /_/ }),
    }),
    isProd && cssnano(),
    isProd && autoprefixer(),
  ].filter(Boolean),
  ).process(source, { map: false, from: '' });

  return [
    css,
    miniClass ? new Map(Object.entries(jsonData)) : { get: x => x, has: () => true },
  ];
};

exports.isPrismeJsToken = (node) => {
  return node.tag === 'span' && typeof node.attrs?.class === 'string' && node.attrs.class.startsWith('token ');
};
