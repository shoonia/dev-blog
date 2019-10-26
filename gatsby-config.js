const pkg = require('./package.json');

const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  siteMetadata: {
    title: pkg.title,
    description: pkg.description,
    author: pkg.author.name,
    siteUrl: IS_DEV ? 'http://localhost:8000' : pkg.homepage,
  },
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-mini-css-class-name',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/posts`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-prismjs',
        ],
      },
    },
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: pkg.description,
    //     short_name: pkg.title,
    //     start_url: '/',
    //     background_color: '',
    //     theme_color: '',
    //     display: 'minimal-ui',
    //     icon: '',
    //   },
    // },
  ],
};
