---
permalink: '/secret-manager-benchmark/'
date: '2021-07-05T12:00:00.000Z'
modified: '2021-07-05T12:00:00.000Z'
lang: 'en'
title: 'Velo: Secrets Manager Benchmark'
description: 'Online checker of performance benchmark for Velo Secrets Manager'
image: '/assets/images/velo.png'
---

<style>
  #run,
  #average {
    font-family: var(--font-mono);
    font-size: 13px;
  }

  #run {
    background-color: #116dff;
    border-color: #116dff;
    color: #fff;
    overflow: hidden;
    position: relative;
    align-items: center;
    border-radius: 50px;
    border-style: solid;
    border-width: 1px;
    cursor: pointer;
    display: flex;
    font-size: 1em;
    outline: none;
    padding: .3em 1.3em;
    transition: all .2s ease-in-out;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    white-space: nowrap;
  }

  #run::after {
    box-sizing: border-box;
    background-color: #d3edff;
    border-radius: 6px;
    content: "";
    display: block;
    margin-left: -23px!important;
    opacity: 0;
    padding-left: 120%;
    padding-top: 120%;
    position: absolute;
    transition: all .6s;
  }

  #run:active::after {
    margin: 0;
    opacity: 1;
    padding: 0;
    transition: 0s;
  }

  #output-area {
    border: 1px solid #b6c1cd;
    border-radius: 8px;
    height: auto;
    min-height: 30vh;
    width: 100%;
    outline: none;
    overflow-y: scroll;
    padding: 1em;
    resize: vertical;
    background-color: rgba(163,217,246,0.2);
  }

  ._tool {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  ._output {
    margin-top: 16px;
  }
</style>

# Velo: Secret Manager Benchmark

Online checker of performance benchmark for Velo [Secrets Manager](https://support.wix.com/en/article/velo-about-the-secrets-manager).

<div class="_tool">
  <button type="button" id="run">
    Run
  </button>
  <output id="average">
    Average (0): 0 milliseconds
  </output>
</div>

<div class="_output">
  <textarea
    id="output-area"
    spellcheck="false"
    placeholder="0"
    autocomplete="off"
    readonly
  ></textarea>
</div>

## How it works

There is a simple checking. It's calculating milliseconds between the start and the end of the [`getSecret(name: string)`](https://www.wix.com/velo/reference/wix-secrets-backend/getsecret) API call.

**backand/benchmark.js**

```js
import { getSecret } from 'wix-secrets-backend';

export async function getBenchmark() {
  const start = Date.now();

  await getSecret('test');

  const end = Date.now();

  return end - start;
}
```

<script>
{
  const one = (selector) => document.querySelector(selector);

  const all = [];
  const outputArea = one('#output-area');
  const average = one('#average');

  const resolve = (data) => {
    all.push(data.ts);

    const i = all.length;

    outputArea.value = `#${i}: ${data.ts}\n${outputArea.value}`;
    average.value = `Average (${i}): ${Math.round( all.reduce((a, b) => a + b, 0) / i )} milliseconds`;
  };

  const reject = () => {};

  const run = () => {
    fetch('https://shoonia.wixsite.com/sm-benchmark/_functions/benchmark', {
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return Promise.reject(response.statusText);
      })
      .then(resolve)
      .catch(reject);
  };

  one('#run').addEventListener('click', run);

  outputArea.value = '';
  run();
}
</script>

## Resources

- [About the Secrets Manager](https://support.wix.com/en/article/velo-about-the-secrets-manager)
- [Secrets Manager API](https://www.wix.com/velo/reference/wix-secrets-backend/introduction)

## Tools

- [Current Node.js version on Velo by Wix](/wix-velo-nodejs-version/)
- [Online generator and validator for Velo `jobs.config` scheduling file](https://shoonia.github.io/jobs.config/)
