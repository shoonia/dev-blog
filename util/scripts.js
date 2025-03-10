import { readFile, writeFile } from 'node:fs/promises';
import { minify } from 'terser';

import { isProd } from './env.js';
import { rootResolve } from './halpers.js';
import { minifyJs } from './configs.js';

const jsFrom = rootResolve('src/assets/vendor.js');
const jsTo = rootResolve('public/assets/vendor.js');

export const compileJs = async () => {
  if (isProd) {
    const source = await readFile(jsFrom, 'utf8');
    const { code } = await minify(source, minifyJs);

    await writeFile(jsTo, code);
  }
};
