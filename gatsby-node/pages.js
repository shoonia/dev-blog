const path = require('path');

module.exports = async ({ actions }) => {
  const Page = path.resolve('./src/templates/Page.jsx');

  actions.createPage({
    path: '/hello',
    component: Page,
  });
};
