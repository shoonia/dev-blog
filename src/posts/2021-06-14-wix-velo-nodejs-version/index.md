---
permalink: '/wix-velo-nodejs-version/'
date: '2021-06-14T12:00:00.000Z'
modified: '2021-06-25T12:00:00.000Z'
lang: 'en'
title: 'Current Node.js version on Velo by Wix'
description: 'Online checker of current Node.js version on Velo backend'
author: 'Alexander Zaytsev'
image: 'https://shoonia.site/assets/images/velo.png'
---

# Current Node.js version on Velo by Wix

Online checker of current Node.js version on Velo backend.

<mark>Checked now: <span id="ts">Loading...</span></mark>
<output id="error" style="color:red">&nbsp;</output>

<table>
  <tbody>
    <tr>
      <td>Node.js</td>
      <td id="version">...</td>
    </tr>
    <tr>
      <td>Platform</td>
      <td id="platform">...</td>
    </tr>
    <tr>
      <td>Architecture</td>
      <td id="arch">...</td>
    </tr>
  </tbody>
</table>

## Resources

- [Velo: Node.js Server](https://www.wix.com/velo/feature/node.js-server)
- [Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)
- [Velo: Available list of npm packages](https://www.wix.com/velo/npm-modules)

## Tools

- [Secret Manager Benchmark](/secret-manager-benchmark)
- [Online generator and validator for Velo `jobs.config` scheduling file](https://shoonia.github.io/jobs.config/)

<script>
{
  const h = (selector, props) => {
    return Object.assign(document.querySelector(selector), props);
  };

  const resolve = (data) => {
    const date = new Date(data.ts);

    h('#ts', {
      title: date.toLocaleString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      textContent: date.toLocaleString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
    });

    h('#version', { textContent: data.version });
    h('#arch', { textContent: data.arch });
    h('#platform', { textContent: data.platform });
  };

  const reject = (error) => {
    h('#error', { textContent: String(error) });
  };

  fetch('https://shoonia.wixsite.com/blog/_functions/nodejs_version', {
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
</script>
