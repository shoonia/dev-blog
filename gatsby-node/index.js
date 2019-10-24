const pages = require('./pages.js');

exports.createPages = async (gatsby) => {
  await pages(gatsby);
  return Promise.resolve();
};
