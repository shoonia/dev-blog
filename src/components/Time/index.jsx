import React from 'react';
import T from 'prop-types';

import * as s from './Time.module.css';
import { useDate } from './useDate';

const Time = ({ date, lang }) => {
  const { label, a11y, iso } = useDate(date, lang);

  return (
    <time
      className={s.time}
      dateTime={iso}
      title={a11y}
    >
      {label}
    </time>
  );
};

Time.propTypes = {
  date: T.string.isRequired,
  lang: T.string.isRequired,
};

export default Time;
