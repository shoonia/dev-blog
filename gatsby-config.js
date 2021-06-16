const { realpathSync } = require('fs');
const { resolve } = require('path');

const pkg = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';
const root = realpathSync(process.cwd());

process.env.NODE_ICU_DATA = resolve(root, 'node_modules/full-icu');

module.exports = {
  siteMetadata: {
    title: pkg.title,
    description: pkg.description,
    author: pkg.author.name,
    siteUrl: isProd ? pkg.homepage : 'http://localhost:8000',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: resolve(root, 'content/posts'),
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
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              rel: 'noopener noreferrer',
            },
          },
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
    isProd && 'gatsby-plugin-mini-css-class-name',
    isProd && {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: pkg.description,
        short_name: pkg.title,
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'minimal-ui',
        icon: resolve(root, 'src/images/icon.png'),
      },
    },
    isProd && {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/sitemap.xml',
        exclude: [
          '/404/',
          '/404.html',
          '/dev-404-page/',
          '/static/*',
        ],
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            edges {
              node {
                path
              }
            }
          }
        }`,
      },
    },
    isProd && 'gatsby-plugin-no-javascript',
    isProd && {
      resolve: 'gatsby-plugin-no-javascript-utils',
      options: {
        noInlineStyles: true,
        removeGatsbyAnnouncer: true,
        removePreloadLinks: true,
      },
    },
  ].filter(Boolean),
};
