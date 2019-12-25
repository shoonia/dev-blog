import React from 'react';
import { Link } from 'gatsby';

import s from './Header.module.css';

function Header() {
  return (
    <header className={s.header}>
      <nav className={s.nav}>
        <Link to="/">
          Home
        </Link>
      </nav>
    </header>
  );
}

export default Header;
