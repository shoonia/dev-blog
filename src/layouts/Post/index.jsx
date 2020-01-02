import React from 'react';
import T from 'prop-types';

import Document from '../../components/Document';
import Markdown from '../../components/Markdown';
import Time from '../../components/Time';
import s from './posts.module.css';

function Post({ meta, html }) {
  return (
    <Document meta={meta}>
      <main className={s.content}>
        <Time
          lang={meta.lang}
          date={meta.date}
        />
        <Markdown html={html} />
      </main>
    </Document>
  );
}

Post.propTypes = {
  meta: T.shape().isRequired,
  html: T.string.isRequired,
};

export default Post;
