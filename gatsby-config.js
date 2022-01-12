const { rootResolve } = require('./util/paths');
const { title, description, author, homepage, isProd } = require('./util/meta');

process.env.NODE_ICU_DATA = rootResolve('node_modules/full-icu');

module.exports = {
  polyfill: false,
  siteMetadata: {
    title,
    description,
    author: author.name,
    siteUrl: homepage,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: rootResolve('content/posts'),
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              noInlineHighlight: true,
              classPrefix: 'code-',
            },
          },
          '@fec/remark-a11y-emoji/gatsby',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [
          require('postcss-import'),
          require('postcss-simple-vars'),
          isProd && require('autoprefixer'),
        ].filter(Boolean),
      },
    },
    isProd && {
      resolve: 'gatsby-plugin-mini-css-class-name',
      options: {
        excludePattern: /_/,
      },
    },
    isProd && {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: title,
        short_name: description,
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        theme_color_in_head: true,
        display: 'minimal-ui',
        icon: rootResolve('static/assets/images/icon.png'),
      },
    },
    isProd && {
      resolve: 'gatsby-plugin-no-javascript-utils',
      options: {
        noScript: true,
        noSourcemaps: true,
        removeGeneratorTag: true,
        removeReactHelmetAttrs: true,
        noInlineStyles: true,
        removeGatsbyAnnouncer: true,
      },
    },
  ].filter(Boolean),
};
