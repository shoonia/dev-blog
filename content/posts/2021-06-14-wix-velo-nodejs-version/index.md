---
publish: true
path: '/wix-velo-nodejs-version'
template: 'default'
date: '2021-06-14T12:00:00.000Z'
modified: ''
lang: 'en'
title: 'Current Node.js version on Velo by Wix'
description: 'Online checker of Node.js version on Velo backend'
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/fd206f_fef1024a2084464ab6c6aca7a168d6ce~mv2.png'
---

# Current Node.js version on Velo by Wix

Online checker of Node.js version on Velo backend.

<mark>Today: <time id="ts">Loading...</time></mark>
<output id="error" style="color:red">&nbsp;</output>

<table id="table">
  <tbody>
    <tr>
      <td>NodeJS</td>
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

<script>
((d) => {
  const h = (selector, props) => {
    return Object.assign(d.querySelector(selector), props);
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
      dateTime: date.toISOString(),
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

      return Promise.reject(new Error(response.statusText));
    })
    .then(resolve)
    .catch(reject);
})(document);
</script>

## Resources

- [Velo: Node.js Server](https://www.wix.com/velo/feature/node.js-server)
- [Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)
- [Velo: Available list of npm packages](https://www.wix.com/velo/npm-modules)
