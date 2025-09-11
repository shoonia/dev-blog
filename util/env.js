import packageJson from '../package.json' with { type: 'json' };

console.log('\n Start:', process.env.NODE_ENV, '\n');

export const pkg = packageJson;
export const nodeEnv = process.env.NODE_ENV;
export const isProd = process.env.NODE_ENV === 'production';
export const debug = Boolean(process.env.DEBUG);
export const dateNow = new Date();
