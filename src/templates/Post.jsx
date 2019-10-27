import React from 'react';
import T from 'prop-types';

import Post from '../layouts/Post';

function PagePage({
  pageContext: {
    meta,
    html,
  },
}) {
  return (
    <Post
      meta={meta}
      html={html}
    />
  );
}

PagePage.propTypes = {
  pageContext: T.shape({
    meta: T.shape().isRequired,
    html: T.string.isRequired,
  }).isRequired,
};

export default PagePage;
