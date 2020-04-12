import React from 'react';
import { Link } from 'gatsby';
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
      <Link to="/">
        Homepage
      </Link>
    </div>
  );
}

export default NotFound;
