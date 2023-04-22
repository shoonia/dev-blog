---
permalink: '/velo-filesystem-chrome-extension/'
date: '2022-06-15T12:00:00.000Z'
modified: '2022-06-15T12:00:00.000Z'
lang: 'en'
title: 'Download your Velo code files to your computer'
description: 'Chrome extensions for downloading Velo code directly from the web editor to your computer'
image: '/assets/images/chrome-extension.png'
---

# Download your Velo code files to your computer

*Chrome extensions for downloading Velo code directly from the web editor to your computer.*

![chrome extensions](/assets/images/chrome-extension.png)

Here is a Chrome Browser extension that provides a way to download Velo files from the web editor. You can install it in Chrome Web Store:

<style>
._dowload {
  cursor: pointer;
  text-align: center;
  padding: 0.5em 1.6em;
  margin: auto;
  color: #fff;
  font-weight: bold;
  display: inline-block;
  background-color: #1a73e8;
  border-color: #2d53af;
  border-radius: 4px;
}

._dowload:hover {
  background-color: #174ea6;
}

._dowload::before {
  display: none;
}
</style>
<div style="display: flex; padding: 1em 0;">
  <a class="_dowload" href="https://chrome.google.com/webstore/detail/velo-filesystem/gjmdfafehkeddjhielckakekclainbpn">
    Add to Chrome
  </a>
</div>

After installing, you should open the Wix editor and turn on dev mode. The extension asks you to pick a folder that the extension could use for saving files.

<figure>
  <figcaption>
    <strong>Download Velo code</strong>
  </figcaption>
  <video
    src="/assets/videos/chrome-extension-example.mp4"
    preload="metadata"
    width="1728"
    height="1080"
    controls
  />
</figure>

This extension use [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API).

## Posts
- [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
- [Repeated item event handlers v2.0](/repeated-item-event-handlers-v2/)
- [Query selector for child elements](/velo-query-selector-for-child-elements/)
- [Promise Queue](/promise-queue/)
