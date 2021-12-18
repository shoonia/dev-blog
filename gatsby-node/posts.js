const { resolve } = require('path');

const { createUrl } = require('../util/meta');

module.exports = async ({ actions, graphql }) => {
  const Page = resolve('./src/templates/Post.jsx');

  const {
    data: {
      allMarkdownRemark: {
        nodes,
      },
    },
  } = await graphql(`
    {
      allMarkdownRemark(
        sort: {
          fields: [frontmatter___date]
          order: DESC
        }
        # filter: {
        #   frontmatter: {
        #     publish: {
        #       eq: true
        #     }
        #   }
        # }
      ) {
        nodes {
          frontmatter {
            path
            title
            description
            author
            date
            modified
            lang
            image
            template
          }
          html
        }
      }
    }`);

  nodes.forEach((node) => {
    actions.createPage({
      path: node.frontmatter.path,
      component: Page,
      context: {
        meta: {
          ...node.frontmatter,
          url: createUrl(node.frontmatter.path),
        },
        html: node.html,
      },
    });
  });
};
