import { createRequire } from 'node:module';

console.log('\n Start:', process.env.NODE_ENV, '\n');

const require = createRequire(import.meta.url);

export const pkg = require('../package.json');
export const nodeEnv = process.env.NODE_ENV;
export const isProd = process.env.NODE_ENV === 'production';
export const debug = Boolean(process.env.DEBUG);
export const dateNow = new Date();
