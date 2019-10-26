import React from 'react';
import PropTypes from 'prop-types';

import Markdown from '../../components/Markdown';

function Post({ html }) {
  return (
    <Markdown html={html} />
  );
}

Post.propTypes = {
  html: PropTypes.string.isRequired,
};

export default Post;
