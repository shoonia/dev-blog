const { minify } = require('html-minifier-terser');
const posthtml = require('posthtml');

/**@type {import('html-minifier-terser').Options} */
const htmlMinifierOptions = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeEmptyElements: true,
  minifyJS: true,
  minifyCSS: true,
};

const isString = (val) => typeof val === 'string';

const createId = (content) => {
  if (Array.isArray(content)) {
    const title = content
      .filter((i) => isString(i))
      .join('')
      .trim();

    if (title !== '') {
      return title.toLowerCase().replace(/[^\wа-яїієґ]+/ig, '-');
    }
  }
};

const transformer = posthtml().use((tree) => {
  tree.walk((node) => {
    if (isString(node)) {
      return node;
    }

    switch (node.tag) {
      case 'span': {
        if (isString(node.attrs?.class) ) {
          if (node.attrs.class === 'token punctuation') {
            return node.content;
          }

          if (node.attrs.class.startsWith('token ')) {
            node.attrs.class = node.attrs.class.slice(6);
          }
        }

        return node;
      }

      case 'code': {
        if (isString(node.attrs?.class)) {
          node.attrs.class = '_';
        }

        return node;
      }

      case 'h2':
      case 'h3':
      case 'h4': {
        const id = createId(node.content);

        if (isString(id)) {
          if (node.attrs == null) {
            node.attrs = {};
          }

          node.attrs.id = id;
        }

        return node;
      }

      case 'div': {
        if (node.attrs?.class === 'gatsby-highlight') {
          return node.content;
        }

        if (node.attrs?.id === 'gatsby-focus-wrapper') {
          return node.content;
        }
      }
    }

    return node;
  });

  return tree;
});

exports.transformHtml = async (source) => {
  const minifiedSource = await minify(source, htmlMinifierOptions);
  const { html } = await transformer.process(minifiedSource);

  return html;
};
