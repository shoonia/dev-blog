import React from 'react';
import PropTypes from 'prop-types';

import Meta from '../Meta';
import Header from '../Header';
import Footer from '../Footer';
import './global.css';

function Document({ meta, children }) {
  return (
    <>
      <Meta data={meta} />
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}

Document.propTypes = {
  meta: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};

export default Document;
