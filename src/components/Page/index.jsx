import T from 'prop-types';

import * as s from './Page.module.css';

export const Page = ({ children }) => (
  <main className={s.content}>
    {children}
  </main>
);

Page.propTypes = {
  children: T.node.isRequired,
};
