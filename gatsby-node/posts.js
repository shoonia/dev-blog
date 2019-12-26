const path = require('path');
const { xss, minify } = require('../util/html.js');

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
    errors,
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

  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

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
        html: minify(xss(node.html)),
      },
    });
  });
};
