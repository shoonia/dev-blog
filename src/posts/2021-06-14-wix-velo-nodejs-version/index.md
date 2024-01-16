---
permalink: '/wix-velo-nodejs-version/'
date: '2021-06-14T12:00:00.000Z'
modified: '2024-01-16T12:00:00.000Z'
lang: 'en'
title: 'Check the Current Node.js Version on Velo by Wix'
description: 'Online checker for the current Node.js version on the Velo backend'
image: '/assets/images/velo.png'
linkPreload: '
<link href="https://shoonia.wixsite.com/blog/_functions/nodejs_version" rel="preload" as="fetch" crossorigin="anonymous">
'
---

# Check the Current Node.js Version on Velo by Wix

Online checker for the current Node.js version on the Velo backend.

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
- [Velo: Working with npm Packages](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/packages/working-with-npm-packages)
- [Velo: Available list of npm packages](https://www.wix.com/velo/npm-modules)

## Tools

- [Secret Manager Benchmark](/secret-manager-benchmark/)
- [Online Generator and Validator for Velo `jobs.config` Scheduling Files](https://shoonia.github.io/jobs.config/)

<script>
{
  const h = (selector, props) => {
    return Object.assign(document.querySelector(selector), props);
  };

  fetch('https://shoonia.wixsite.com/blog/_functions/nodejs_version')
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(response.statusText);
    })
    .then((data) => {
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
    })
    .catch((error) => {
      h('#error', { textContent: String(error) });
    });
}
</script>
