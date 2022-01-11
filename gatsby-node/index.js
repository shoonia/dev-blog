const CssMqpackerPlugin = require('css-mqpacker-webpack-plugin');
const posts = require('./posts');

const { sitemapAndRss } = require('./sitemapAndRss');
const { createVendorScript } = require('./createVendorScript');
const { clean } = require('./clean');

exports.createPages = async (gatsby) => {
  await posts(gatsby);
};

exports.onPostBuild = async (...args) => {
  await Promise.all([
    sitemapAndRss(...args),
    createVendorScript(),
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
