import React from 'react';

import st from './footer.module.css';

function Footer() {
  return (
    <footer
      className={st.footer}
      role="contentinfo"
    >
      <span className={st.me}>
        <a
          className={st.link}
          href="https://twitter.com/_shoonia"
        >
          Twitter
        </a>
        <a
          className={st.link}
          href="https://github.com/shoonia"
        >
          GitHub
        </a>
        <a
          className={st.link}
          href="https://www.linkedin.com/in/shoonia/"
        >
          LinkedIn
        </a>
      </span>
    </footer>
  );
}

export default Footer;
