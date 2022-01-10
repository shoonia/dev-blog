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
            head
            publish
          }
          html
        }
      }
    }`);

  nodes.forEach((node) => {
    const i = node.frontmatter;

    if (i.publish || i.template === 'noindex') {
      actions.createPage({
        path: i.path,
        component: Page,
        context: {
          meta: {
            ...i,
            url: createUrl(i.path),
          },
          html: node.html,
        },
      });
    }
  });
};
