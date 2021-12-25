import React from 'react';
import { Link } from 'gatsby';

import * as s from './Header.module.css';

export const Header = () => (
  <header className={s.header}>
    <nav className={s.nav}>
      <Link to="/" className={s.link}>
          Home
      </Link>
    </nav>
  </header>
);
