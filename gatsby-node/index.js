const CssMqpackerPlugin = require('css-mqpacker-webpack-plugin');
const posts = require('./posts');

const { sitemapAndRss } = require('./sitemapAndRss');
const { clean } = require('./clean');

exports.createPages = async (gatsby) => {
  await posts(gatsby);
};

exports.onPostBuild = async (...args) => {
  await Promise.all([
    sitemapAndRss(...args),
    clean(),
  ]);
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage.includes('build')) {
    actions.setWebpackConfig({
      plugins: [
        new CssMqpackerPlugin(),
      ],
    });
  }
};
