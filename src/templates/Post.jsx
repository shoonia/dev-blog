import React from 'react';
import PropsType from 'prop-types';

import Post from '../layouts/Post';

function PagePage({ pageContext }) {
  const {
    html,
  } = pageContext;

  return (
    <Post
      html={html}
    />
  );
}

PagePage.propTypes = {
  pageContext: PropsType.shape({
    html: PropsType.string.isRequired,
  }).isRequired,
};

export default PagePage;
