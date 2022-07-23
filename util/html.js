const htmlnano = require('htmlnano');
const posthtml = require('posthtml');
const imgAutosize = require('posthtml-img-autosize');
const miniCssClassName = require('mini-css-class-name');

const { rootResolve, isString, isAbsoluteUrl } = require('./halpers');
const { isProd, debug } = require('./env');
const { a11yEmoji, autoLink } = require('./stringParse');
const { minifyJs } = require('./configs');

const isAnonymous = (url) => {
  return isAbsoluteUrl(url) && new URL(url).origin !== 'https://shoonia.wixsite.com';
};

const isPrismeJsToken = (node) => {
  return !debug && node.tag === 'span' && node.attrs?.class?.startsWith('token ');
};

const isPrismeComment = (node) => {
  return node.tag === 'span' && node.attrs?.class === 'token comment';
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

const gcd = (a, b) => b ? gcd(b, a % b) : a;

const aspectRatio = (width, height)  => {
  const divisor = gcd(width, height);

  return `aspect-ratio:${width / divisor}/${height / divisor}`;
};

const transformer = (classCache) => posthtml([
  imgAutosize({
    root: rootResolve('src'),
    processEmptySize: true,
  }),
]).use((tree) => {
  const generate = miniCssClassName();

  tree.walk((node) => {
    if (isString(node)) {
      return a11yEmoji(node);
    }

    if (isPrismeComment(node)) {
      node.content = node.content?.map((i) => autoLink(i));
    }

    switch (node.tag) {
      case 'a': {
        if (isAbsoluteUrl(node.attrs?.href) && !isString(node.attrs.rel)) {
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

      case 'pre': {
        node.content = [
          {
            tag: 'button',
            attrs: {
              type: 'button',
              class: 'menu',
              'data-expand': true,
              'aria-label': 'toggle full screen',
            },
          },
          ...node.content,
          {
            tag: 'button',
            attrs: {
              type: 'button',
              class: 'copy-code',
              'data-copy': true,
            },
            content: ['Copy Code'],
          },
        ];

        return node;
      }

      case 'h2':
      case 'h3':
      case 'h4': {
        const id = createId(node.content);

        if (isString(id)) {
          const i = generate();

          node.attrs = {
            id,
            class: 'title',
          };

          node.content = [
            {
              tag: 'a',
              attrs: {
                href: `#${id}`,
                class: 'anchor',
                'aria-labelledby': i,
              },
            },
            {
              tag: 'span',
              attrs: {
                id: i,
              },
              content: node.content,
            },
          ];
        }

        return node;
      }

      case 'img': {
        if (!isString(node.attrs?.alt)) {
          throw new Error('\n\n<img /> must have an "alt" attribute\n\n' + JSON.stringify(node, null, 2));
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
        Object.assign(node.attrs, {
          width: '100%',
          loading: 'lazy',
          crossorigin: 'anonymous',
          scrolling: 'no',
        });

        return node;
      }

      case 'time': {
        const t = new Date(node.attrs?.datetime);
        const lang = node.attrs.lang ?? 'en';

        if (t.toString() === 'Invalid Date') {
          throw new Error('\n\n<time /> have invalid "datetime" attribute\n\n' + JSON.stringify(node, null, 2));
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

      case 'video': {
        const width = ~~node.attrs.width;
        const height = ~~node.attrs.height;

        if (width && height) {
          const style = node.attrs.style ?? '';

          node.attrs.style = style + aspectRatio(width, height);

          delete node.attrs.width;
          delete node.attrs.height;
        }

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
    minifyJs,
    minifySvg: {
      plugins: [
        {
          name: 'preset-default',
        },
      ],
    },
  })(tree);
});

exports.transformHtml = async (source, classCache) => {
  const { html } = await transformer(classCache).process(source);

  return html;
};
