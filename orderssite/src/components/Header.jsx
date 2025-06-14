import React from 'react';
import Navigation from './Navigation';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo} tabIndex="0">
        ReactNavApp
      </div>
      <Navigation />
    </header>
  );
}

export default Header;
