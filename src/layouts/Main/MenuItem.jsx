import React from 'react';
import { Link } from 'gatsby';
import T from 'prop-types';

import st from './main.module.css';
import Time from '../../components/Time';

function MenuItem({
  data: {
    path,
    title,
    description,
    date,
    lang,
  },
}) {
  return (
    <article lang={lang}>
      <Link to={path}>
        <h2 className={st.itemTitle}>
          {title}
        </h2>
      </Link>
      <p>{description}</p>
      <Time
        date={date}
        lang={lang}
      />
    </article>
  );
}

MenuItem.propTypes = {
  data: T.shape({
    path: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    date: T.string.isRequired,
    lang: T.string.isRequired,
  }).isRequired,
};

export default MenuItem;
