import React from 'react';
import { Link } from 'gatsby';
import Helmet from 'react-helmet';

const metaData = [{
  name: 'robots',
  content: 'noindex',
}];

const NotFound = () => (
  <div>
    <Helmet
      title="404 | Cтраница не найдена"
      meta={metaData}
    />
    <p>
      Ошибка 404: страница не найдена
    </p>
    <Link to="/">
      Вернуться на главную страницу
    </Link>
  </div>
);

export default NotFound;
