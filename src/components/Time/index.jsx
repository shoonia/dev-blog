import React from 'react';
import T from 'prop-types';

import s from './Time.module.css';

function toLocaleString(date, lang) {
  const time = new Date(date).toLocaleString(lang, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return (time === 'Invalid Date') ? '' : time;
}

function Time({ date, lang }) {
  return (
    <time
      className={s.time}
      dateTime={date}
    >
      {toLocaleString(date, lang)}
    </time>
  );
}

Time.propTypes = {
  date: T.string.isRequired,
  lang: T.string.isRequired,
};

export default Time;
