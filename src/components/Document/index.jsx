import React from 'react';
import T from 'prop-types';

import Meta from '../Meta';
import Header from '../Header';
import Footer from '../Footer';
import './global.css';

function Document({ meta, children }) {
  return (
    <>
      <Meta data={meta} />
      <Header />
      {children}
      <Footer />
    </>
  );
}

Document.propTypes = {
  meta: T.shape().isRequired,
  children: T.node.isRequired,
};

export default Document;
