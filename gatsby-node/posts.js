const path = require('path');

module.exports = async ({ actions, graphql }) => {
  const Page = path.resolve('./src/templates/Post.jsx');

  const {
    data: {
      allMarkdownRemark: {
        nodes,
      },
      site: {
        siteMetadata: {
          siteUrl,
        },
      },
    },
  } = await graphql(`
    {
      allMarkdownRemark(
        sort: {
          fields: [frontmatter___date]
          order: DESC
        }
        filter: {
          frontmatter: {
            publish: {
              eq: true
            }
          }
        }
      ) {
        nodes {
          frontmatter {
            path
            title
            description
            author
            date
            lang
            image
            template
          }
          html
        }
      }
      site {
        siteMetadata {
          siteUrl
        }
      }
    }`);

  const createUrl = (pth) => new URL(pth, siteUrl).toString();

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
