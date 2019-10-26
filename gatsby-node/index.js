const pages = require('./posts');

exports.createPages = async (gatsby) => {
  await pages(gatsby);
  return Promise.resolve();
};
