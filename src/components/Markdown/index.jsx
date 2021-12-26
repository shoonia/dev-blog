import T from 'prop-types';

import './one-dark.css';

function Markdown({ html }) {
  return (
    <article
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

Markdown.propTypes = {
  html: T.string.isRequired,
};

export default Markdown;
