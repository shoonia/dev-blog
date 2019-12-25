import React from 'react';
import T from 'prop-types';

import 'prismjs/themes/prism.css';
import s from './markdown.module.css';

function Markdown({ html }) {
  return (
    <article
    // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
      className={s.md}
    />
  );
}

Markdown.propTypes = {
  html: T.string.isRequired,
};

export default Markdown;
