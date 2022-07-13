const { readFile, writeFile } = require('node:fs/promises');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const miniCssClassName = require('mini-css-class-name/postcss-modules');

const { rootResolve } = require('./halpers');
const { isProd, debug } = require('./env');

const cssFrom = rootResolve('src/assets/styles.css');
const cssTo = rootResolve('public/assets/styles.css');

exports.compileCss = async () => {
  const source = await readFile(cssFrom, 'utf8');

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
  ).process(source, { map: false, from: cssFrom });

  return [
    css,
    new Map(Object.entries(jsonData)),
  ];
};

exports.writeCss = async (css) => {
  await writeFile(cssTo, css);
};
