import React from 'react';
import PropTypes from 'prop-types';

import Document from '../../components/Document';
import Markdown from '../../components/Markdown';

function Post({ meta, html }) {
  return (
    <Document
      meta={meta}
    >
      <Markdown html={html} />
    </Document>
  );
}

Post.propTypes = {
  meta: PropTypes.shape().isRequired,
  html: PropTypes.string.isRequired,
};

export default Post;
