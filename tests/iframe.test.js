const { test } = require('uvu');
const { is } = require('uvu/assert');

test('Promise Queue', async () => {
  const response = await fetch('https://alexanderz5.wixsite.com/promise-queue');

  is(response.status, 200);
});

test.run();
