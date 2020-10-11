const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    isProd && require('autoprefixer')(),
    isProd && require('cssnano')(),
    require('postcss-simple-vars')({
      variables: () => require('./src/cssVariables'),
    }),
  ].filter(Boolean),
};
