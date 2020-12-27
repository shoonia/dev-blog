import React from 'react';
import T from 'prop-types';

import './one-dark.css';

function Markdown({ html }) {
  return (
    <article
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

Markdown.propTypes = {
  html: T.string.isRequired,
};

export default Markdown;
