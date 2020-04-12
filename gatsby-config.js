const pkg = require('./package.json');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  siteMetadata: {
    title: pkg.title,
    description: pkg.description,
    author: pkg.author.name,
    siteUrl: isDev ? 'http://localhost:8000' : pkg.homepage,
  },
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-mini-css-class-name',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'snippets',
        path: `${__dirname}/content/snippets`,
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
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: pkg.description,
        short_name: pkg.title,
        start_url: '/',
        // background_color: '',
        // theme_color: '',
        display: 'minimal-ui',
        icon: `${__dirname}/src/images/icon.png`,
      },
    },
    {
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
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-137813864-1',
      },
    },
    'gatsby-plugin-no-javascript',
    'gatsby-plugin-no-sourcemaps',
  ],
};
