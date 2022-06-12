const { test } = require('uvu');
const { is } = require('uvu/assert');

const urls = {
  'Query selector for child elements':                  'https://shoonia.wixsite.com/blog/child-selector',
  'Promise Queue':                                      'https://alexanderz5.wixsite.com/promise-queue',
  'Reduce server-side calls using a caching mechanism': 'https://shoonia.wixsite.com/blog/cache',
  'Message channel to iFrame':                          'https://shoonia.wixsite.com/blog/channel',
  'Imitating hover event on repeater container':        'https://shoonia.wixsite.com/blog/imitate-hover-event-on-corvid',
};

Object.entries(urls).forEach(([title, url]) => {
  test(title, async () => {
    const { status } = await fetch(url);

    is(status, 200);
  });
});

test.run();
