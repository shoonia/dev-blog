import htmlnano from 'htmlnano';
import posthtml from 'posthtml';
import imgAutosize from 'posthtml-img-autosize';
import miniCssClassName from 'mini-css-class-name';

import { rootResolve, isString, isAbsoluteUrl, fileHash } from './halpers.js';
import { isProd, debug } from './env.js';
import { a11yEmoji, parseComment } from './stringParse.js';
import { minifyJs } from './configs.js';

const giscusClass = new Set([
  'giscus',
  'giscus-frame',
]);

const isAnonymous = (url) => {
  return isAbsoluteUrl(url) && new URL(url).origin !== 'https://shoonia.wixsite.com';
};

const isPrismeJsToken = (node) => {
  return !debug && node.tag === 'span' && node.attrs.class?.startsWith('token ');
};

const createId = (content) => {
  if (Array.isArray(content)) {
    const title = content
      .filter((i) => isString(i))
      .join('')
      .trim();

    if (title) {
      return title.toLowerCase().replace(/[^\wа-яїієґ]+/ig, '-');
    }
  }
};

const gcd = (a, b) => b ? gcd(b, a % b) : a;

const aspectRatio = (width, height) => {
  const divisor = gcd(width, height);

  return `aspect-ratio:${width / divisor}/${height / divisor}`;
};

const map = new Map();

const withHashVersion = (path) => {
  if (map.has(path)) {
    return map.get(path);
  }

  const src = `${path}?v=${fileHash('src', path)}`;

  map.set(path, src);

  return src;
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

    switch (node.tag) {
      case 'a': {
        if (isAbsoluteUrl(node.attrs?.href) && !isString(node.attrs.rel)) {
          node.attrs.target = '_blank';
          node.attrs.rel = 'noopener noreferrer';
        }

        return node;
      }

      case 'span': {
        const className = node.attrs?.class;

        if (className == null) {
          return node;
        }

        if (className.startsWith('token deleted-sign deleted')) {
          node.tag = 'del';
          return node;
        }

        if (className.startsWith('token inserted-sign inserted')) {
          node.tag = 'ins';
          return node;
        }

        switch (className) {
          case 'token comment': {
            node.content = node.content?.map((i) => parseComment(i));
            break;
          }
          case 'token prefix inserted': {
            node.content = [];
            break;
          }
          case 'token prefix deleted': {
            node.content = [
              {
                tag: 'span',
                attrs: {
                  class: 'sr-only',
                },
                content: ['// '],
              },
            ];
            break;
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

      case 'pre': {
        node.content = [
          {
            tag: 'button',
            attrs: {
              type: 'button',
              class: 'menu menu-left',
              'data-expand': true,
              'aria-label': 'toggle full screen',
            },
          },
          {
            tag: 'button',
            attrs: {
              type: 'button',
              class: 'menu menu-right',
              'data-expand': true,
              'aria-label': 'toggle full screen',
            },
          },
          ...node.content,
          {
            tag: 'button',
            attrs: {
              type: 'button',
              class: 'menu menu-copy',
              'data-copy': true,
              'aria-label': 'copy code',
            },
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
        node.attrs.loading = 'lazy';
        return node;
      }

      case 'time': {
        const t = new Date(node.attrs.datetime);
        const lang = node.attrs.lang || 'en';

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
          const style = node.attrs.style ? node.attrs.style + ';' : '';

          node.attrs.style = style + aspectRatio(width, height);

          delete node.attrs.width;
          delete node.attrs.height;
        }

        return node;
      }

      case 'script': {
        if (node.attrs?.src?.startsWith('/')) {
          node.attrs.src = withHashVersion(node.attrs.src);
        }

        return node;
      }

      case 'link': {
        if (node.attrs?.rel === 'stylesheet' && node.attrs.href.startsWith('/')) {
          node.attrs.href = withHashVersion(node.attrs.href);
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

        else if (giscusClass.has(i) || i.startsWith('_')) {
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
          params: {
            overrides: {
              cleanupIds: false,
            },
          },
        },
      ],
    },
  })(tree);
});

export const transformHtml = async (source, classCache) => {
  try {
    const { html } = await transformer(classCache).process(source);

    return html;
  } catch (error) {
    console.error({ error });

    throw error;
  }
};
