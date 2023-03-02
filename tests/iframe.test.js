const { test } = require('uvu');
const { is } = require('uvu/assert');

const urls = [
  ['Promise Queue', /*                                 */ 'https://alexanderz5.wixsite.com/promise-queue'],
  ['Query selector for child elements', /*             */ 'https://shoonia.wixsite.com/blog/child-selector'],
  ['Reduce server-side calls using a caching mechanism',  'https://shoonia.wixsite.com/blog/cache'],
  ['Message channel to iFrame', /*                     */ 'https://shoonia.wixsite.com/blog/channel'],
  ['Imitating hover event on repeater container', /*   */ 'https://shoonia.wixsite.com/blog/imitate-hover-event-on-corvid'],
  ['Rotate animation', /*                              */ 'https://shoonia.wixsite.com/blog/rotate-animation'],
  ['Create accordion in Velo', /*                      */ 'https://shoonia.wixsite.com/blog/toggle'],
];

urls.forEach(([title, url]) => {
  test(title, async () => {
    const { status } = await fetch(url);

    is(status, 200);
  });
});

test.run();
