import React from 'react';
import { Link } from 'gatsby';
import T from 'prop-types';

import Document from '../../components/Document';

function Main({ nodes, meta }) {
  return (
    <Document meta={{
      // TODO:
      ...meta,
      lang: 'ru',
      image: '#',
    }}
    >
      <h1>Blog</h1>
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>
            <Link to={node.frontmatter.path}>
              {node.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </Document>
  );
}

Main.propTypes = {
  nodes: T.arrayOf(T.object).isRequired,
  meta: T.shape().isRequired,
};

export default Main;
