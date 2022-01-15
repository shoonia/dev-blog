const { minify } = require('html-minifier-terser');
const posthtml = require('posthtml');
const imgAutosize = require('posthtml-img-autosize');
const { parser } = require('posthtml-parser');
const miniClassNames = require('mini-css-class-name');

const { isPrismeJsToken } = require('./styles');
const { resolve } = require('./resolve');

/**@type {import('html-minifier-terser').Options} */
const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyJS: true,
  minifyCSS: true,
  sortAttributes: true,
};

const isString = (val) => typeof val === 'string';

const isAbsoluteUrl = (url) => {
  return isString(url) && /^[a-zA-Z][a-zA-Z\d+\-.]*?:/.test(url);
};

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

const transformer = (classCache) => posthtml([
  imgAutosize({
    root: resolve('src'),
    processEmptySize: true,
  }),
]).use((tree) => {
  const generate = miniClassNames();

  tree.walk((node) => {
    if (isString(node)) {
      return node;
    }

    switch (node.tag) {
      case 'a': {
        if (isAbsoluteUrl(node.attrs?.href)) {
          node.attrs.target = '_blank';
          node.attrs.rel = 'noopener noreferrer';
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
          const i = generate();
          const [a] = parser(`<a href="#${id}" class="anchor" aria-labelledby="${i}"/>`);
          const [span] = parser(`<span id="${i}"/>`);

          span.content = node.content;
          node.attrs = { id, class: 'title' };
          node.content = [a, span];
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

      case 'time': {
        const t = new Date(node.attrs.datetime);
        const lang = node.attrs.lang ?? 'en';

        if (t.toString() === 'Invalid Date') {
          throw new Error(node);
        }

        const iso = t.toISOString();

        const a11y = t.toLocaleString(lang, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const label = t.toLocaleString(lang, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });

        node.attrs = { datetime: iso, title: a11y };
        node.content ??= [label];

        return node;
      }
    }

    return node;
  });

  return tree;
}).use((tree) => {
  tree.match({ attrs: { class: true } }, (node) => {
    const classList = node.attrs.class
      .split(' ')
      .reduce((acc, i) => {
        if (classCache.has(i)) {
          acc.push(classCache.get(i));
        }

        else if (i[0] === '_' ) {
          acc.push(i);
        }

        return acc;
      }, []);

    if (classList.length < 1 && isPrismeJsToken(node)) {
      return node.content;
    }

    node.attrs.class = classList.join(' ');

    return node;
  });

  return tree;
});

exports.transformHtml = async (source, isProd, classCache) => {
  const { html } = await transformer(classCache).process(source);

  if (isProd) {
    return minify(html, htmlMinifierOptions);
  }

  return html;
};
