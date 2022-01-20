const gemoji = require('gemoji');
const emojiRegex = require('emoji-regex');

const emojiRx = emojiRegex();
const linkRx = /https:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;

const map = new Map(gemoji.map((i) => [i.emoji, i.description]));

exports.a11yEmoji = (val) => {
  if (emojiRx.test(val)) {
    return val.replace(emojiRx, (i) => {
      const label = map.get(i);

      if (typeof label !== 'string') {
        throw new Error(`Unknown emoji - ${i}`);
      }

      return `<span role="img" aria-label="${label.toLowerCase()}">${i}</span>`;
    });
  }

  return val;
};

exports.autoLink = (val) => {
  if (val.indexOf('https://') > -1) {
    return val.replace(linkRx, (i) => {
      return `<a href="${i}" target="_blank" rel="noopener noreferrer">${i}</a>`;
    });
  }

  return val;
};
