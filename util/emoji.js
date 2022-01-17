const gemoji = require('gemoji');
const emojiRegex = require('emoji-regex');

const regExp = emojiRegex();

const map = new Map(gemoji.map((i) => [i.emoji, i.description]));

exports.a11yEmoji = (val) => {
  if (regExp.test(val)) {
    return val.replace(regExp, (i) => {
      const label = map.get(i);

      if (typeof label !== 'string') {
        throw new Error(`Unknown emoji - ${i}`);
      }

      return `<span role="img" aria-label="${label}">${i}</span>`;
    });
  }

  return val;
};
