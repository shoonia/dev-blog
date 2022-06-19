const { join } = require('path');
const { test } = require('uvu');
const { ok, type } = require('uvu/assert');

const baseUrl = (path) => join('https://shoonia.wixsite.com', path);
const getJson = (path) => fetch(baseUrl(path)).then((i) => i.json());
const getText = (path) => fetch(baseUrl(path)).then((i) => i.text());

test('qrcode API', async () => {
  const data = await getText('/blog/_functions/qrcode?text=test');

  ok(data.startsWith('�PNG\r\n\x1A\n'));
});

test('benchmark API', async () => {
  const data = await getJson('/sm-benchmark/_functions/benchmark');

  type(data.ts, 'number');
});

test('nodejs_version API', async () => {
  const data = await getJson('/blog/_functions/nodejs_version');

  type(data.arch, 'string');
  type(data.platform, 'string');
  type(data.ts, 'number');
  type(data.version, 'string');
});

test.run();
