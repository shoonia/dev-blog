import React from 'react';
import T from 'prop-types';

import Document from '../../components/Document';
import MenuItem from './MenuItem';
import s from './main.module.css';

function Main({ nodes, meta }) {
  const list = nodes.map((node) => (
    <li key={node.id}>
      <MenuItem data={node.frontmatter} />
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
      <main className={s.content}>
        <h1 className={s.title}>
          Posts
        </h1>
        <ul className={s.list}>
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
