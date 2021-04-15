import React from 'react';

import * as s from './footer.module.css';

export const Footer = () => (
  <footer className={s.footer}>
    <span className={s.me} role="list">
      <span role="listitem">
        <a
          className={s.link}
          href="https://twitter.com/_shoonia"
          rel="me"
        >
          Twitter
        </a>
      </span>
      <span role="listitem">
        <a
          className={s.link}
          href="https://github.com/shoonia"
          rel="me"
        >
          GitHub
        </a>
      </span>
      <span role="listitem">
        <a
          className={s.link}
          href="https://www.linkedin.com/in/shoonia/"
          rel="me"
        >
          LinkedIn
        </a>
      </span>
    </span>
  </footer>
);
