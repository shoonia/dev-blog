import React from 'react';
import PropsType from 'prop-types';

import Post from '../layouts/Post';

function PagePage({ pageContext }) {
  const {
    meta,
    html,
  } = pageContext;

  return (
    <Post
      meta={meta}
      html={html}
    />
  );
}

PagePage.propTypes = {
  pageContext: PropsType.shape({
    meta: PropsType.shape().isRequired,
    html: PropsType.string.isRequired,
  }).isRequired,
};

export default PagePage;
