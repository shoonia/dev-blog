const { join } = require('node:path');
const { test } = require('node:test');
const { ok, strictEqual } = require('node:assert/strict');

const baseUrl = (path) => join('https://shoonia.wixsite.com', path);
const getJson = (path) => fetch(baseUrl(path)).then((i) => i.json());
const getText = (path) => fetch(baseUrl(path)).then((i) => i.text());

test('qrcode API', async () => {
  const data = await getText('/blog/_functions/qrcode?text=test');

  ok(data.startsWith('�PNG\r\n\x1A\n'));
});

test('benchmark API', async () => {
  const data = await getJson('/sm-benchmark/_functions/benchmark');

  strictEqual(typeof data.ts, 'number');
});

test('nodejs_version API', async () => {
  const data = await getJson('/blog/_functions/nodejs_version');

  strictEqual(typeof data.arch, 'string');
  strictEqual(typeof data.platform, 'string');
  strictEqual(typeof data.ts, 'number');
  strictEqual(typeof data.version, 'string');
});
