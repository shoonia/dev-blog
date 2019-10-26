import React from 'react';
import PropTypes from 'prop-types';

import Document from '../../components/Document';
import Markdown from '../../components/Markdown';
import st from './posts.module.css';

function Post({ meta, html }) {
  return (
    <Document
      meta={meta}
    >
      <main className={st.content}>
        <Markdown html={html} />
      </main>
    </Document>
  );
}

Post.propTypes = {
  meta: PropTypes.shape().isRequired,
  html: PropTypes.string.isRequired,
};

export default Post;
