import { gemoji } from 'gemoji';
import emojiRegex from 'emoji-regex';

import { isString } from './halpers.js';

const emojiRx = emojiRegex();
const linkRx = /https:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;
const jsdocTag = /@[a-z-]+/gi;

const map = new Map(gemoji.map((i) => [i.emoji, i.description]));

export const a11yEmoji = (val) => {
  if (emojiRx.test(val)) {
    return val.replace(emojiRx, (i) => {
      if (i === '©') {
        return i;
      }

      const label = map.get(i);

      if (isString(label)) {
        return `<span role="img" aria-label="${label.toLowerCase()}">${i}</span>`;
      }

      throw new Error(`Unknown emoji - ${i}`);
    });
  }

  return val;
};

export const parseComment = (val) => {
  if (
    val.startsWith('/**') && val.includes('@') ||
    val.startsWith('// @ts-')
  ) {
    val = val.replace(jsdocTag, (i) => `<b>${i}</b>`);
  }

  if (val.includes('https://')) {
    val = val.replace(linkRx, (i) => {
      return `<a href="${i}" target="_blank" rel="noopener noreferrer">${i}</a>`;
    });
  }

  return val;
};
