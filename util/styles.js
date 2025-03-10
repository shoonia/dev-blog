import { readFile, writeFile } from 'node:fs/promises';
import postcss from 'postcss';
import postcssModules from 'postcss-modules';
import autoprefixer from 'autoprefixer';
import simpleVars from 'postcss-simple-vars';
import cssnano from 'cssnano';
import miniCssClassName from 'mini-css-class-name/postcss-modules';

import { rootResolve } from './halpers.js';
import { isProd, debug } from './env.js';

const cssFrom = rootResolve('src/assets/styles.css');
const cssTo = rootResolve('public/assets/styles.css');

export const compileCss = async () => {
  const source = await readFile(cssFrom, 'utf8');

  if (debug) {
    const { css } = await postcss([
      simpleVars(),
    ]).process(source, { from: cssFrom });

    return [
      css,
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
    simpleVars(),
  ].filter(Boolean),
  ).process(source, { map: false, from: cssFrom });

  return [
    css,
    new Map(Object.entries(jsonData)),
  ];
};

export const writeCss = async (css) => {
  await writeFile(cssTo, css);
};
