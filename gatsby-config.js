const pkg = require('./package.json');

const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  siteMetadata: {
    title: pkg.title,
    description: pkg.description,
    author: pkg.author,
    siteUrl: IS_DEV ? 'http://localhost:8000' : pkg.homepage,
  },
  plugins: [
    'gatsby-plugin-mini-css-class-name',
    'gatsby-plugin-react-helmet',
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'images',
    //     path: `${__dirname}/src/images`,
    //   },
    // },
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
