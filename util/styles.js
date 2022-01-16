const { readFile } = require('fs/promises');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const miniCssClassName = require('mini-css-class-name');

const { resolve } = require('./resolve');

const miniClass = true;

exports.getClassNames = async (isProd) => {
  const path = resolve('src/assets/styles.css');
  const generate = miniCssClassName({ excludePattern: /_/ });
  const cache = new Map();

  let jsonData;

  const source = await readFile(path, 'utf8');
  const { css } = await postcss([
    miniClass && postcssModules({
      getJSON(_, json) {
        jsonData = json;
      },
      generateScopedName(name, filename) {
        const key = filename + name;

        if (cache.has(key)) {
          return cache.get(key);
        }

        const className = generate();

        cache.set(key, className);

        return className;
      },
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
