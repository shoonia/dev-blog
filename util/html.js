const htmlnano = require('htmlnano');
const posthtml = require('posthtml');
const imgAutosize = require('posthtml-img-autosize');
const miniClassNames = require('mini-css-class-name');

const { rootResolve } = require('./halpers');
const { isProd, debug } = require('./env');
const { a11yEmoji } = require('./emoji');

const isString = (val) => typeof val === 'string';

const isAbsoluteUrl = (url) => {
  return isString(url) && /^[a-zA-Z][a-zA-Z\d+\-.]*?:/.test(url);
};

const isAnonymous = (url) => {
  return isAbsoluteUrl(url) && new URL(url).origin !== 'https://shoonia.wixsite.com';
};

const isPrismeJsToken = (node) => {
  return !debug && node.tag === 'span' && node.attrs?.class?.startsWith('token ');
};

class Node {
  constructor(tag, attrs, content) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = content;
  }
}

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
    root: rootResolve('src'),
    processEmptySize: true,
  }),
]).use((tree) => {
  const generate = miniClassNames();

  tree.walk((node) => {
    if (isString(node)) {
      return a11yEmoji(node);
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

          const a = new Node('a', {
            href: `#${id}`,
            class: 'anchor',
            'aria-labelledby': i,
          });

          const span = new Node('span', { id: i }, node.content);

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
        node.attrs.scrolling = 'no';

        return node;
      }

      case 'time': {
        const t = new Date(node.attrs.datetime);
        const lang = node.attrs.lang ?? 'en';

        if (t.toString() === 'Invalid Date') {
          throw new Error(node);
        }

        node.attrs = {
          datetime: t.toISOString(),
          title: t.toLocaleString(lang, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };

        node.content ??= [
          t.toLocaleString(lang, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }),
        ];

        return node;
      }
    }

    return node;
  });

  if (debug) {
    return tree;
  }

  tree.match({ attrs: { class: true } }, (node) => {
    const classList = node.attrs.class
      .split(' ')
      .reduce((acc, i) => {
        if (classCache.has(i)) {
          acc.push(classCache.get(i));
        }

        else if (i[0] === '_') {
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

  if (!isProd) {
    return tree;
  }

  return htmlnano({
    collapseWhitespace: 'aggressive',
    removeComments: 'aggressive',
    removeEmptyAttributes: true,
    collapseAttributeWhitespace: true,
    deduplicateAttributeValues: true,
    normalizeAttributeValues: true,
    sortAttributes: true,
    collapseBooleanAttributes: {
      amphtml: true,
    },
    minifyJs: {
      ecma: 2020,
      module: true,
      toplevel: true,
      parse: {
        ecma: 2020,
      },
      compress: {
        ecma: 2020,
        module: true,
        comparisons: false,
        inline: 2,
        drop_console: true,
        passes: 3,
        toplevel: true,
        pure_getters: true,
      },
      output: {
        ecma: 2020,
        comments: false,
      },
    },
  })(tree);
});

exports.transformHtml = async (source, classCache) => {
  const { html } = await transformer(classCache).process(source);

  return html;
};
