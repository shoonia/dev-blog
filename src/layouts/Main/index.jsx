import T from 'prop-types';

import * as s from './main.module.css';
import Document from '../../components/Document';
import { MenuItem } from './MenuItem';
import { Page } from '../../components/Page';

function Main({ nodes, meta }) {
  const list = nodes.map((node) => (
    <li
      key={node.id}
      className={s.item}
    >
      <MenuItem data={node.frontmatter} />
    </li>
  ));

  return (
    <Document meta={{
      // TODO:
      ...meta,
      title: meta.author,
      lang: 'en',
      // image: '',
    }}
    >
      <Page>
        <h1 className={s.title}>
          All Posts
        </h1>
        <ul className={s.list}>
          {list}
        </ul>
      </Page>
    </Document>
  );
}

Main.propTypes = {
  nodes: T.arrayOf(T.object).isRequired,
  meta: T.shape().isRequired,
};

export default Main;
