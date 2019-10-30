import React from 'react';
import { Link } from 'gatsby';
import T from 'prop-types';

import Document from '../../components/Document';
import st from './main.module.css';

function Main({ nodes, meta }) {
  const list = nodes.map((node) => (
    <li key={node.id}>
      <Link to={node.frontmatter.path}>
        {node.frontmatter.title}
      </Link>
    </li>
  ));

  return (
    <Document meta={{
      // TODO:
      ...meta,
      lang: 'en',
      // image: '',
    }}
    >
      <main className={st.content}>
        <h1>Posts</h1>
        <ul>
          {list}
        </ul>
      </main>
    </Document>
  );
}

Main.propTypes = {
  nodes: T.arrayOf(T.object).isRequired,
  meta: T.shape().isRequired,
};

export default Main;
