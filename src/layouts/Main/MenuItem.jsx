import React from 'react';
import T from 'prop-types';

import s from './main.module.css';
import Time from '../../components/Time';

function MenuItem({
  data: {
    path,
    title,
    description,
    date,
    author,
    lang,
  },
}) {
  return (
    <article
      lang={lang}
      className={s.post}
    >
      <h2 className={s.itemTitle}>
        <a href={path}>
          {title}
        </a>
      </h2>
      <p>{description}</p>
      <Time
        date={date}
        lang={lang}
      />
      <span className={s.author}>
        {` - ${author}`}
      </span>
    </article>
  );
}

MenuItem.propTypes = {
  data: T.shape({
    path: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    date: T.string.isRequired,
    author: T.string.isRequired,
    lang: T.string.isRequired,
  }).isRequired,
};

export default MenuItem;
