---
permalink: '/secret-manager-benchmark/'
date: '2021-07-05T12:00:00.000Z'
modified: '2024-01-016T12:00:00.000Z'
lang: 'en'
title: 'Velo: Secrets Manager Benchmark'
description: 'Online checker of performance benchmarks for Velo Secrets Manager'
image: '/assets/images/velo.png'
linkPreload: '
<link href="https://shoonia.wixsite.com/sm-benchmark/_functions/benchmark" rel="preload" as="fetch" crossorigin="anonymous">
'
head: '
<style>
  #run,
  #average {
    font-family: var(--font-mono);
    font-size: 14px;
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
    border: var(--border);
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
    gap: 1em;
    margin: 1em 0;
  }
</style>
'
postBody: '
<script type="module">
  let $ = (selector) => document.querySelector(selector);

  let all = [];
  let outputArea = $("#output-area");
  let average = $("#average");

  let run = async () => {
    let response = await fetch("https://shoonia.wixsite.com/sm-benchmark/_functions/benchmark");
    let data = await response.json();

    all.push(data.ts);

    let i = all.length;

    outputArea.value = `#${i}: ${data.ts}\n${outputArea.value}`;
    average.value = `Average (${i}): ${Math.round( all.reduce((a, b) => a + b, 0) / i )} milliseconds`;
  };

  $("#run").addEventListener("click", run);

  run();
</script>
'
---

# Velo: Secret Manager Benchmark

Online checker of performance benchmarks for Velo [Secrets Manager](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/secrets-manager/about-the-secrets-manager).

<textarea
  id="output-area"
  spellcheck="false"
  placeholder="0"
  readonly
></textarea>
<div class="_tool">
  <button type="button" id="run">
    Run
  </button>
  <output id="average">
    Average (0): 0 milliseconds
  </output>
</div>

## How it works

The process involves a straightforward check. It calculates the number of milliseconds that elapse between the start and end of the [`getSecret(name: string)`](https://www.wix.com/velo/reference/wix-secrets-backend/getsecret) API call.

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

## Resources

- [About the Secrets Manager](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/secrets-manager/about-the-secrets-manager)
- [Secrets Manager API](https://www.wix.com/velo/reference/wix-secrets-backend/introduction)

## Tools

- [Check the Current Node.js Version on Velo by Wix](/wix-velo-nodejs-version/)
- [Online Generator and Validator for Velo `jobs.config` Scheduling Files](https://shoonia.github.io/jobs.config/)
