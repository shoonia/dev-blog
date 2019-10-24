const path = require('path');

module.exports = async ({ actions, graphql }) => {
  const Page = path.resolve('./src/templates/Page.jsx');

  const {
    data: {
      allMarkdownRemark: { nodes },
    },
    errors,
  } = await graphql(`
    {
      allMarkdownRemark(
        sort: {
          fields: [frontmatter___date]
          order: DESC
        }
      ) {
        nodes {
          frontmatter {
            path
          }
        }
      }
    }`);

  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  nodes.forEach((node) => {
    actions.createPage({
      path: node.frontmatter.path,
      component: Page,
    });
  });
};
