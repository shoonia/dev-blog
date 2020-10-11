import React from 'react';
import { Helmet } from 'react-helmet';

const metaData = [{
  name: 'robots',
  content: 'noindex',
}];

function NotFound() {
  return (
    <div>
      <Helmet
        title="404 | Page not found"
        meta={metaData}
      />
      <p>
        404: Page not found
      </p>
      <a href="/">
        Homepage
      </a>
    </div>
  );
}

export default NotFound;
