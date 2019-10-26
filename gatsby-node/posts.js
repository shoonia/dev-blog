const path = require('path');
const xss = require('xss');

const options = {
  onIgnoreTagAttr(tag, name, value) {
    if (name !== 'class') {
      return '';
    }

    return `${name}="${xss.escapeAttrValue(value)}"`;
  },

  onTag(tag, html) {
    if (tag === 'a') {
      const a = html.slice(0, -1);
      return `${a} target="_blank" rel="noopener noreferrer">`;
    }

    return html;
  },
};

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
        html: xss(node.html, options),
      },
    });
  });
};
