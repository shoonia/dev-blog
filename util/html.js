const { minify } = require('html-minifier-terser');
const posthtml = require('posthtml');
// const { parser } = require('posthtml-parser');
const _isAbsolute = require('is-absolute-url').default;

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
const isAbsoluteUrl = (url) => isString(url) && _isAbsolute(url);

const isAnonymous = (url) => {
  return isAbsoluteUrl(url) && new URL(url).origin !== 'https://shoonia.wixsite.com';
};

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
        if (isString(node.attrs?.class)) {
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

      case 'a': {
        if (isAbsoluteUrl(node.attrs?.href)) {
          node.attrs.target = '_blank';
          node.attrs.rel = 'noopener noreferrer';
        }

        return node;
      }

      case 'h2':
      case 'h3':
      case 'h4': {
        const id = createId(node.content);

        if (isString(id)) {
          // const [link] = parser('<a aria-hidden="true" class="anchor" />');

          if (node.attrs == null) {
            node.attrs = {};
          }

          // link.attrs.href = `#${id}`;
          // node.content.unshift(link);
          node.attrs.id = id;
        }

        return node;
      }

      case 'img': {
        if (!isString(node.attrs?.alt)) {
          throw new Error(node);
        }

        if (isAnonymous(node.attrs.src)) {
          node.attrs.crossorigin = 'anonymous';
        }

        if (node.attrs.loading === 'lazy') {
          node.attrs.decoding = 'async';
        }

        node.attrs.alt = node.attrs.alt.toLowerCase();

        return node;
      }

      case 'iframe': {
        node.attrs.width = '100%';
        node.attrs.loading = 'lazy';
        node.attrs.crossorigin = 'anonymous';

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
