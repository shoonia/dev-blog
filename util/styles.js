const { readFile } = require('fs/promises');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const miniCssClassName = require('mini-css-class-name/postcss-modules');

const { rootResolve } = require('./halpers');
const { isProd, debug } = require('./env');

const from = rootResolve('src/assets/styles.css');

exports.getClassNames = async () => {
  const source = await readFile(from, 'utf8');

  if (debug) {
    return [
      source,
      { get: x => x, has: () => true },
    ];
  }

  let jsonData;

  const { css } = await postcss([
    postcssModules({
      getJSON(_, json) {
        jsonData = json;
      },
      generateScopedName: miniCssClassName({ excludePattern: /_/ }),
    }),
    isProd && cssnano(),
    isProd && autoprefixer(),
  ].filter(Boolean),
  ).process(source, { map: false, from });

  return [
    css,
    new Map(Object.entries(jsonData)),
  ];
};

exports.isPrismeJsToken = (node) => {
  return !debug && node.tag === 'span' && typeof node.attrs?.class === 'string' && node.attrs.class.startsWith('token ');
};
