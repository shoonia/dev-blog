import React from 'react';
import PropTypes from 'prop-types';
import 'prismjs/themes/prism.css';

const Markdown = ({ html }) => (
  <article
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

Markdown.propTypes = {
  html: PropTypes.string.isRequired,
};

export default Markdown;
