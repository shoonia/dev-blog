/* eslint-disable react/no-danger */
import React from 'react';

import * as s from './footer.module.css';

function Footer() {
  return (
    <footer className={s.footer}>
      <span className={s.me}>
        <a
          className={s.link}
          href="https://twitter.com/_shoonia"
        >
          Twitter
        </a>
        <a
          className={s.link}
          href="https://github.com/shoonia"
        >
          GitHub
        </a>
        <a
          className={s.link}
          href="https://www.linkedin.com/in/shoonia/"
        >
          LinkedIn
        </a>
      </span>
    </footer>
  );
}

export default Footer;
